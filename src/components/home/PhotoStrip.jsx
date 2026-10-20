import { useCallback, useEffect, useRef, useState } from 'react';
import data from '../../data/site.js';
import photos from '../../data/photos.json';
import { gsap, pad, reduced } from '../../lib/motion.js';
import TLink from '../TLink.jsx';

const PICKS = [ 'D85_3829-HDR.webp', 'KeelesFoodPhotography0403.webp', '7.webp', 'Palliyaguruge-Jewellers2.webp', 'DJI_0078-HDR.webp', 'CurryLeaf.webp', 'DSC_1657-2.webp', 'Tiesh-7077-1.webp', 'D85_2304.webp', 'KeelesFoodPhotography0314.webp', 'Tiesh-7224-1-2.webp', 'D85_3503.webp' ];
const ITEMS = PICKS.map( ( f ) => photos.find( ( p ) => p.f === f ) ).filter( Boolean );
const DELAY = 3000;

/*
 * Portfolio slideshow: advances one frame every 3s and loops forever (the set
 * is rendered twice and the track quietly rewinds by one set). Pauses while
 * hovered or focused and when off screen; arrows step it by hand.
 */
export default function PhotoStrip() {
	const section = useRef( null );
	const track = useRef( null );
	const [ index, setIndex ] = useState( 0 );
	const pos = useRef( 0 );
	const paused = useRef( false );
	const visible = useRef( false );

	const offsetOf = ( i ) => {
		const el = track.current.children[ i ];
		return el ? el.offsetLeft - track.current.children[ 0 ].offsetLeft : 0;
	};

	const go = useCallback( ( dir ) => {
		const n = ITEMS.length;
		let next = pos.current + dir;
		// Stepping back from the first frame: jump to the copy first, then slide.
		if ( next < 0 ) {
			gsap.set( track.current, { x: -offsetOf( n ) } );
			next = n - 1;
		}
		pos.current = next;
		setIndex( next % n );
		gsap.to( track.current, {
			x: -offsetOf( next ),
			duration: reduced ? 0 : 1.1,
			ease: 'expo.inOut',
			overwrite: true,
			onComplete: () => {
				// Past the end of the first set: rewind invisibly onto the matching frame.
				if ( pos.current >= n ) {
					pos.current -= n;
					gsap.set( track.current, { x: -offsetOf( pos.current ) } );
				}
			}
		} );
	}, [] );

	useEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const t = setInterval( () => {
			if ( ! paused.current && visible.current && document.visibilityState === 'visible' ) {
				go( 1 );
			}
		}, DELAY );
		const io = new IntersectionObserver( ( [ e ] ) => {
			visible.current = e.isIntersecting;
		} );
		io.observe( section.current );
		const onResize = () => gsap.set( track.current, { x: -offsetOf( pos.current ) } );
		window.addEventListener( 'resize', onResize );
		return () => {
			clearInterval( t );
			io.disconnect();
			window.removeEventListener( 'resize', onResize );
		};
	}, [ go ] );

	const hold = ( v ) => () => {
		paused.current = v;
	};

	const slide = ( p, i, copy ) => {
		const cat = data.photoCategories.find( ( c ) => c[ 0 ] === p.c );
		return (
			<TLink key={ ( copy ? 'b' : 'a' ) + p.f } className={ `stripItem${ ! copy && i === index ? ' is-current' : '' }` }
				to={ `/photography/?category=${ p.c }#gallery` } style={ { '--ar': `${ p.w } / ${ p.h }` } }
				aria-hidden={ copy || undefined } tabIndex={ copy ? -1 : undefined }>
				<span className="stripItem_img"><img src={ `/assets/photos/thumb/${ p.t }` } alt={ copy ? '' : `${ cat[ 2 ] } photography by Visual Studios Plus` } loading={ copy ? 'lazy' : 'eager' } decoding="async" /></span>
				<span className="stripItem_meta"><span>{ cat[ 2 ] }</span><span>{ pad( i + 1 ) }</span></span>
			</TLink>
		);
	};

	return (
		<section className="photoStrip" aria-labelledby="stripTitle" ref={ section }
			onMouseEnter={ hold( true ) } onMouseLeave={ hold( false ) } onFocus={ hold( true ) } onBlur={ hold( false ) }>
			<div className="photoStrip_head">
				<div>
					<p className="eyebrow">(04) Our photography</p>
					<h2 className="sectionTitle" id="stripTitle">Portfolio</h2>
					<p className="lede">Tactile luxury across Gastronomy, Architecture, and High Fashion.</p>
				</div>
				<div className="photoStrip_ctrl">
					<span className="photoStrip_count" aria-live="polite">{ pad( index + 1 ) } / { pad( ITEMS.length ) }</span>
					<button type="button" className="stripBtn" onClick={ () => go( -1 ) } aria-label="Previous photograph">←</button>
					<button type="button" className="stripBtn" onClick={ () => go( 1 ) } aria-label="Next photograph">→</button>
					<TLink className="btnLink" to="/photography/">Explore the archive</TLink>
				</div>
			</div>
			<div className="photoStrip_track">
				<div className="photoStrip_row" ref={ track }>
					{ ITEMS.map( ( p, i ) => slide( p, i, false ) ) }
					{ ITEMS.map( ( p, i ) => slide( p, i, true ) ) }
				</div>
			</div>
			<div className="photoStrip_progress" aria-hidden="true">
				<span key={ index } className="photoStrip_bar"></span>
			</div>
		</section>
	);
}
