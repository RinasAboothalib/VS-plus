import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap, reduced, startScroll, stopScroll } from '../../lib/motion.js';

/*
 * Full-screen viewer for a studio-feed post. Reels play (with sound and
 * controls); image posts open zoomed in and can be clicked to zoom further,
 * the zoomed image panning with the cursor. Arrows / Esc / backdrop work.
 */
export default function ReelViewer( { items, index, onIndex, onClose } ) {
	const root = useRef( null );
	const media = useRef( null );
	const img = useRef( null );
	const closeBtn = useRef( null );
	const [ zoomed, setZoomed ] = useState( false );
	const item = items[ index ];
	const go = ( d ) => onIndex( ( index + d + items.length ) % items.length );

	// Open: backdrop fades in, the media rises and settles.
	useLayoutEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const ctx = gsap.context( () => {
			gsap.from( '.rv_backdrop', { opacity: 0, duration: 0.4, ease: 'power2.out' } );
			gsap.from( '.rv_info > *', { y: 24, opacity: 0, duration: 0.7, ease: 'expo.out', stagger: 0.05, delay: 0.1 } );
		}, root );
		return () => ctx.revert();
	}, [] );

	// Each new item: zoom the media in from slightly larger, like a camera settling.
	useLayoutEffect( () => {
		setZoomed( false );
		if ( ! reduced && media.current ) {
			gsap.fromTo( media.current, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'expo.out' } );
		}
	}, [ index ] );

	useEffect( () => {
		const last = document.activeElement;
		stopScroll();
		document.body.classList.add( 'lb-open' );
		closeBtn.current.focus();
		return () => {
			startScroll();
			document.body.classList.remove( 'lb-open' );
			if ( last && last.focus ) {
				last.focus();
			}
		};
	}, [] );

	useEffect( () => {
		const onKey = ( e ) => {
			if ( e.key === 'Escape' ) {
				onClose();
			} else if ( e.key === 'ArrowRight' ) {
				go( 1 );
			} else if ( e.key === 'ArrowLeft' ) {
				go( -1 );
			}
		};
		document.addEventListener( 'keydown', onKey );
		return () => document.removeEventListener( 'keydown', onKey );
	} );

	// Zoomed image follows the cursor: the point under the pointer stays put.
	const pan = ( e, force = false ) => {
		if ( ( ! zoomed && ! force ) || ! img.current ) {
			return;
		}
		const r = e.currentTarget.getBoundingClientRect();
		img.current.style.transformOrigin = `${ ( ( e.clientX - r.left ) / r.width ) * 100 }% ${ ( ( e.clientY - r.top ) / r.height ) * 100 }%`;
	};

	return createPortal(
		<div className="rv" role="dialog" aria-modal="true" aria-label={ item.title } ref={ root }>
			<div className="rv_backdrop" onClick={ onClose } />
			<div className="rv_body">
				<div className={ `rv_media rv_media--${ item.video ? ( item.wide ? 'film' : 'reel' ) : 'image' }` } ref={ media }>
					{ item.video ? (
						<video key={ item.video } src={ item.video } poster={ item.image } controls autoPlay playsInline loop />
					) : (
						<button type="button" className={ `rv_zoom${ zoomed ? ' is-zoomed' : '' }` }
							aria-label={ zoomed ? 'Zoom out' : 'Zoom in' }
							onClick={ ( e ) => {
								// Zoom into the point that was clicked.
								pan( e, true );
								setZoomed( ( z ) => ! z );
							} }
							onMouseMove={ pan }>
							<img ref={ img } src={ item.image } alt={ item.title } />
						</button>
					) }
				</div>
				<div className="rv_info">
					<p className="rv_meta"><span>{ item.kind }</span><span>{ item.date }</span></p>
					<h3 className="rv_title">{ item.title }</h3>
					{ item.summary && <p className="rv_text">{ item.summary }</p> }
					<p className="rv_hint">{ item.video ? `${ item.wide ? 'Film' : 'Reel' } playing with sound — use the player controls.` : 'Click the image to zoom; move to look around.' }</p>
					{ item.url && <a className="pillBtn rv_link" href={ item.url } target="_blank" rel="noopener noreferrer">Open on Instagram ↗</a> }
					<div className="rv_nav">
						<button type="button" className="stripBtn" onClick={ () => go( -1 ) } aria-label="Previous post">←</button>
						<span>{ String( index + 1 ).padStart( 2, '0' ) } / { String( items.length ).padStart( 2, '0' ) }</span>
						<button type="button" className="stripBtn" onClick={ () => go( 1 ) } aria-label="Next post">→</button>
					</div>
				</div>
				<button type="button" className="rv_close" ref={ closeBtn } onClick={ onClose } aria-label="Close">✕</button>
			</div>
		</div>,
		document.body
	);
}
