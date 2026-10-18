// A portfolio index built as a wheel you turn.
//
// At rest the work sits in a ring around a title, each card tangent to the
// circle. The first notch of scroll blows the ring open into a vertical drum:
// the card at the front lies flat and full size, the ones above and below
// rotate away into hard perspective and run off the top and bottom of the
// frame. Keep turning and the drum carries the next piece round to the front.
//
// The whole thing is one number - `turn` - read by a single rAF pass that writes
// transforms straight to the DOM. 0 is the ring, 1 is the drum with item 0 at
// the front, and every whole number after that is one more item turned past.
//
// Ported from the crafterui WorksWheel (TSX + Tailwind) to this project's
// stack: plain JSX, with the Tailwind utilities expressed in works-wheel.css.
// Additions: `ratio` (card width / height), `cardHeight` / `cardMaxWidth`
// (front-card size), `ringRadius` (ring size, in card heights), `showIndex` (the title list on the right) and `external`
// (cards open in a new tab), `onSelect` (a click opens the item instead of
// navigating; a drag never counts as a click) and `cursor` (a custom cursor that
// follows the pointer and reads Drag / the item's `cursorLabel`, while the
// hovered card's image zooms toward it) - all default to the original - plus a wheel hand-off that stops
// Lenis from scrolling the page while the wheel still has turning to do.
import * as React from 'react';

import { gsap } from 'gsap';

import { cn } from '@/lib/utils';
import './works-wheel.css';

/* Geometry. The card is measured against the stage; everything else is measured
   against the card, so a narrow stage - where the card is capped by width, not
   height - scales the whole wheel down with it instead of leaving a small card
   swinging on a huge drum. The three that matter are tuned together: STEP
   against DRUM sets how hard the neighbours rotate away, and DRUM against LENS
   decides whether they land inside the frame or run off it. */
const CARD_H = 0.38; // front card height, of the stage
const CARD_MAX_W = 0.34; // ... but never wider than this much of the stage
const CARD_RATIO = 1.45; // card width / height
const STEP = 40; // degrees between cards on the drum
const DRUM = 2.22; // drum radius, in card heights - and everything below likewise
const LENS = 2.7; // perspective distance
const RING_R = 1.14; // ring radius
/* The drum alone hangs the work on a plumb line. It isn't one: the strip curves
   away round an arc whose centre sits off to the LEFT, so the piece at the front
   is at the arc's near point - dead centre - and its neighbours have already
   swung back left as well as up and down. BOW is that arc's radius. */
const BOW = 1.82;
const TITLE = 0.124; // ring label and front-card title
const INDEX = 0.04; // the index down the right-hand side
/** Items either side of the front still worth drawing. */
const CULL = 1.6;

/** How much of a wheel-notch or a dragged pixel counts as one item. */
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
/** Quiet time after the last wheel event before the wheel settles on an item. */
const SETTLE = 140;
/** Fraction of the remaining distance closed each frame. 1 = no smoothing. */
const EASE = 0.12;

const clamp = ( v, lo, hi ) => Math.min( hi, Math.max( lo, v ) );
const lerp = ( a, b, t ) => a + ( b - a ) * t;
const rad = ( deg ) => ( deg * Math.PI ) / 180;

/** How far left the arc has carried something that has turned `drumDeg` off the front. */
const bowAt = ( drumDeg, bow ) => -bow * ( 1 - Math.cos( rad( drumDeg ) ) );

/** Both states in one chain: the ring terms fall away as `m` reaches the drum. */
function place( ringDeg, drumDeg, ringR, drumR, bow, m ) {
	return (
		`translateX(${ m * bowAt( drumDeg, bow ) }px)` +
		` rotateZ(${ ( 1 - m ) * ringDeg }deg) translateY(${ -( 1 - m ) * ringR }px)` +
		` rotateX(${ m * drumDeg }deg) translateZ(${ m * drumR }px)`
	);
}

/**
 * @typedef {{ title: string, image: string, href?: string, cursorLabel?: string }} WorksWheelItem
 * @param {{ items: WorksWheelItem[], label?: string, action?: string, ratio?: number, cardHeight?: number, cardMaxWidth?: number, ringRadius?: number, showIndex?: boolean, external?: boolean, onSelect?: (item: WorksWheelItem, index: number) => void, cursor?: boolean, className?: string }} props
 */
export function WorksWheel( {
	items,
	label = 'Works \'26',
	action = 'View',
	ratio = CARD_RATIO,
	cardHeight = CARD_H,
	cardMaxWidth = CARD_MAX_W,
	ringRadius = RING_R,
	showIndex = true,
	external = false,
	onSelect,
	cursor = false,
	className,
	...props
} ) {
	const stageRef = React.useRef( null );
	const wheelRef = React.useRef( null );
	const cardRefs = React.useRef( [] );
	const labelRef = React.useRef( null );
	const titleRef = React.useRef( null );
	const sectionRef = React.useRef( null );
	const cursorRef = React.useRef( null );
	const hoverIdx = React.useRef( -1 );
	const press = React.useRef( null );
	const moveCursor = React.useRef( null );
	const [ cursorLabel, setCursorLabel ] = React.useState( null );

	// The wheel's position, and where it is heading. Only `active` is state.
	const turn = React.useRef( 0 );
	const target = React.useRef( 0 );
	const [ active, setActive ] = React.useState( 0 );
	const [ stage, setStage ] = React.useState( { w: 0, h: 0 } );

	const count = items.length;
	const last = Math.max( count - 1, 0 );

	const [ reduced, setReduced ] = React.useState( false );
	React.useEffect( () => {
		const query = window.matchMedia( '(prefers-reduced-motion: reduce)' );
		const read = () => setReduced( query.matches );
		read();
		query.addEventListener( 'change', read );
		return () => query.removeEventListener( 'change', read );
	}, [] );

	React.useEffect( () => {
		const el = stageRef.current;
		if ( ! el ) {
			return undefined;
		}
		const read = () => setStage( { w: el.clientWidth, h: el.clientHeight } );
		read();
		const ro = new ResizeObserver( read );
		ro.observe( el );
		return () => ro.disconnect();
	}, [] );

	const metrics = React.useMemo( () => {
		const { w, h } = stage;
		const cardW = Math.min( h * cardHeight * ratio, w * cardMaxWidth );
		const cardH = cardW / ratio;
		const drumR = cardH * DRUM;
		const ringR = cardH * ringRadius;
		// Shrink the ring's cards until the circle reads as a closed loop.
		const ringScale = count
			? clamp( ( ( ( 2 * Math.PI * ringR ) / count ) * 0.82 ) / ( cardW || 1 ), 0.16, 1 )
			: 1;
		return {
			cardW,
			cardH,
			ringR,
			ringScale,
			drumR,
			bow: cardH * BOW,
			depth: cardH * LENS,
			title: cardH * TITLE,
			index: cardH * INDEX
		};
	}, [ stage, count, ratio, cardHeight, cardMaxWidth, ringRadius ] );

	// One pass per frame: ease toward the target, then write every transform.
	React.useEffect( () => {
		if ( ! stage.h ) {
			return undefined;
		}
		let frame = 0;
		const { ringR, ringScale, drumR, bow } = metrics;

		const draw = () => {
			frame = requestAnimationFrame( draw );
			const gap = target.current - turn.current;
			if ( Math.abs( gap ) < 0.0005 ) {
				turn.current = target.current;
			} else {
				turn.current += gap * ( reduced ? 1 : EASE );
			}

			const t = turn.current;
			const m = clamp( t, 0, 1 );
			const pos = Math.max( 0, t - 1 );

			// The drum is pulled back so its front face lands on the picture plane.
			if ( wheelRef.current ) {
				wheelRef.current.style.transform = `translateZ(${ -m * drumR }px)`;
			}

			for ( let i = 0; i < count; i++ ) {
				const d = i - pos;
				const drumDeg = d * STEP;
				const card = cardRefs.current[ i ];
				if ( card ) {
					card.style.transform = place( d * ( 360 / count ), drumDeg, ringR, drumR, bow, m );
					// Culled by distance, not by angle.
					card.style.opacity = m > 0.5 && Math.abs( d ) > CULL ? '0' : '1';
					card.style.zIndex = String( Math.round( 100 - Math.abs( d ) * 2 ) );
				}
				const face = card && card.firstElementChild;
				if ( face ) {
					face.style.transform = `scale(${ lerp( ringScale, 1, m ) })`;
				}
			}

			if ( labelRef.current ) {
				labelRef.current.style.opacity = String( 1 - m );
			}
			if ( titleRef.current ) {
				titleRef.current.style.opacity = String( m );
			}
			const near = clamp( Math.round( pos ), 0, last );
			setActive( ( prev ) => ( prev === near ? prev : near ) );
		};

		// Only run the frame loop while the wheel is on screen.
		const io = new IntersectionObserver( ( [ entry ] ) => {
			cancelAnimationFrame( frame );
			if ( entry.isIntersecting ) {
				frame = requestAnimationFrame( draw );
			}
		} );
		io.observe( stageRef.current );
		frame = requestAnimationFrame( draw );
		return () => {
			io.disconnect();
			cancelAnimationFrame( frame );
		};
	}, [ metrics, stage.h, count, last, reduced ] );

	const to = React.useCallback( ( next ) => {
		target.current = clamp( next, 0, last + 1 );
	}, [ last ] );

	const drag = React.useRef( null );
	const settling = React.useRef( 0 );

	/** Which card (if any) is under a viewport point. Works under pointer capture. */
	const cardAt = ( x, y ) => {
		const hit = document.elementFromPoint( x, y );
		const card = hit && hit.closest( '.ww_card' );
		return card ? cardRefs.current.indexOf( card ) : -1;
	};

	// Custom cursor: follows the pointer with a little lag.
	React.useEffect( () => {
		if ( ! cursor || ! cursorRef.current ) {
			return undefined;
		}
		const xTo = gsap.quickTo( cursorRef.current, 'x', { duration: 0.45, ease: 'power3.out' } );
		const yTo = gsap.quickTo( cursorRef.current, 'y', { duration: 0.45, ease: 'power3.out' } );
		moveCursor.current = ( x, y ) => {
			const r = sectionRef.current.getBoundingClientRect();
			xTo( x - r.left );
			yTo( y - r.top );
		};
		return () => {
			moveCursor.current = null;
		};
	}, [ cursor ] );

	/** Hover: zoom the card's image toward the pointer and set the cursor label. */
	const hover = ( x, y ) => {
		const i = cardAt( x, y );
		if ( i !== hoverIdx.current ) {
			const prev = cardRefs.current[ hoverIdx.current ];
			if ( prev ) {
				prev.classList.remove( 'is-hover' );
				const img = prev.querySelector( 'img' );
				if ( img ) {
					img.style.transform = '';
				}
			}
			hoverIdx.current = i;
			if ( i >= 0 ) {
				cardRefs.current[ i ].classList.add( 'is-hover' );
			}
			if ( cursor ) {
				setCursorLabel( i >= 0 ? ( items[ i ].cursorLabel || action || 'View' ) : 'Drag' );
			}
		}
		const card = cardRefs.current[ i ];
		const img = card && card.querySelector( 'img' );
		if ( img ) {
			const r = card.getBoundingClientRect();
			const nx = ( x - r.left ) / r.width - 0.5;
			const ny = ( y - r.top ) / r.height - 0.5;
			img.style.transform = `scale(1.12) translate(${ ( -nx * 5 ).toFixed( 2 ) }%, ${ ( -ny * 5 ).toFixed( 2 ) }%)`;
		}
	};

	const select = ( i ) => {
		if ( onSelect && items[ i ] ) {
			onSelect( items[ i ], i );
		}
	};

	// Native listener, because the wheel has to be cancellable - and it only
	// cancels while it still has somewhere to go, so the page scrolls on at
	// either end instead of trapping the reader. stopPropagation keeps the
	// page's smooth-scroll (Lenis, listening on window) out of it meanwhile.
	React.useEffect( () => {
		const el = stageRef.current;
		if ( ! el ) {
			return undefined;
		}
		const onWheel = ( event ) => {
			const next = target.current + event.deltaY / WHEEL_UNITS;
			if ( next > 0 && next < last + 1 ) {
				event.preventDefault();
				event.stopPropagation();
			}
			to( next );
			// Settle onto an item once the gesture goes quiet.
			window.clearTimeout( settling.current );
			settling.current = window.setTimeout( () => to( Math.round( target.current ) ), SETTLE );
		};
		el.addEventListener( 'wheel', onWheel, { passive: false } );
		return () => {
			el.removeEventListener( 'wheel', onWheel );
			window.clearTimeout( settling.current );
		};
	}, [ to, last ] );

	return (
		<section ref={ sectionRef } aria-label={ label } className={ cn( 'ww', cursor && 'ww--cursor', className ) } { ...props }>
			<div
				ref={ stageRef }
				tabIndex={ 0 }
				role="listbox"
				aria-label={ label }
				aria-activedescendant={ `works-wheel-${ active }` }
				className="ww_stage"
				style={ { perspective: `${ metrics.depth }px` } }
				onPointerDown={ ( event ) => {
					drag.current = event.clientY;
					press.current = { x: event.clientX, y: event.clientY, moved: false };
					event.currentTarget.setPointerCapture( event.pointerId );
					if ( cursorRef.current ) {
						cursorRef.current.classList.add( 'is-down' );
					}
				} }
				onPointerMove={ ( event ) => {
					if ( event.pointerType === 'mouse' ) {
						if ( moveCursor.current ) {
							cursorRef.current.classList.add( 'is-on' );
							moveCursor.current( event.clientX, event.clientY );
						}
						if ( drag.current === null ) {
							hover( event.clientX, event.clientY );
						}
					}
					if ( drag.current === null ) {
						return;
					}
					if ( press.current && Math.hypot( event.clientX - press.current.x, event.clientY - press.current.y ) > 6 ) {
						press.current.moved = true;
					}
					to( target.current + ( drag.current - event.clientY ) / DRAG_UNITS );
					drag.current = event.clientY;
				} }
				onPointerUp={ ( event ) => {
					// A press that never moved is a click: open the card under it.
					const wasClick = press.current && ! press.current.moved;
					press.current = null;
					drag.current = null;
					if ( cursorRef.current ) {
						cursorRef.current.classList.remove( 'is-down' );
					}
					if ( wasClick && onSelect ) {
						select( cardAt( event.clientX, event.clientY ) );
						return;
					}
					// Land on an item rather than between two.
					if ( target.current > 1 ) {
						to( Math.round( target.current ) );
					}
				} }
				onPointerEnter={ ( event ) => {
					if ( cursorRef.current && event.pointerType === 'mouse' ) {
						cursorRef.current.classList.add( 'is-on' );
						const r = sectionRef.current.getBoundingClientRect();
						gsap.set( cursorRef.current, { x: event.clientX - r.left, y: event.clientY - r.top } );
					}
				} }
				onPointerLeave={ () => {
					if ( cursorRef.current ) {
						cursorRef.current.classList.remove( 'is-on' );
					}
					hover( -9999, -9999 );
				} }
				onKeyDown={ ( event ) => {
					if ( ( event.key === 'Enter' || event.key === ' ' ) && onSelect && target.current >= 1 ) {
						select( active );
						event.preventDefault();
						return;
					}
					if ( event.key === 'ArrowDown' ) {
						to( Math.round( target.current ) + 1 );
					} else if ( event.key === 'ArrowUp' ) {
						to( Math.round( target.current ) - 1 );
					} else {
						return;
					}
					event.preventDefault();
				} }
			>
				<div ref={ wheelRef } className="ww_wheel">
					{ items.map( ( item, i ) => {
						const Tag = item.href && ! onSelect ? 'a' : 'div';
						return (
							<Tag
								key={ item.title }
								id={ `works-wheel-${ i }` }
								role="option"
								aria-selected={ i === active }
								href={ onSelect ? undefined : item.href }
								target={ item.href && external ? '_blank' : undefined }
								rel={ item.href && external ? 'noopener noreferrer' : undefined }
								draggable={ false }
								ref={ ( node ) => {
									cardRefs.current[ i ] = node;
								} }
								className="ww_card"
								style={ {
									width: metrics.cardW,
									height: metrics.cardH,
									marginLeft: -metrics.cardW / 2,
									marginTop: -metrics.cardH / 2
								} }
							>
								<span className="ww_face">
									<img src={ item.image } alt={ item.title } draggable={ false } />
									{ action && ( item.href || onSelect ) ? (
										<span className="ww_action">
											<svg viewBox="0 0 12 12" aria-hidden="true">
												<path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
											{ item.cursorLabel || action }
										</span>
									) : null }
								</span>
							</Tag>
						);
					} ) }
				</div>
			</div>

			{ cursor && (
				<div ref={ cursorRef } className={ cn( 'ww_cursor', cursorLabel && cursorLabel !== 'Drag' && 'is-card' ) } aria-hidden="true">
					<span>{ cursorLabel || 'Drag' }</span>
				</div>
			) }

			{ /* Ring title and front-card title trade places across the transition. */ }
			<div ref={ labelRef } className="ww_label" style={ { fontSize: metrics.title } }>
				{ label }
			</div>
			<div ref={ titleRef } className="ww_title" style={ { fontSize: metrics.title } }>
				{ items[ active ] && items[ active ].title }
			</div>

			{ showIndex && <ol className="ww_index" style={ { fontSize: metrics.index } }>
				{ items.map( ( item, i ) => (
					<li key={ item.title }>
						<button type="button" onClick={ () => to( i + 1 ) } className={ cn( 'ww_indexBtn', i === active && 'is-active' ) }>
							{ item.title }
						</button>
					</li>
				) ) }
			</ol> }
		</section>
	);
}

export default WorksWheel;
