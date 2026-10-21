import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react';
import data from '../../data/site.js';
import { gsap, reduced } from '../../lib/motion.js';

/* Work shown in the field: client covers, studio-feed covers and portfolio stills. */
const CLIENTS = [ 'ministry-of-crab', 'dankotuwa', 'ahmad-tea', 'imorich', 'munchee', 'te-dalu', 'cbw', 'viva', 'dsi', 'hilton', 'swisstek', 'khomba', 'amex', 'mintpay' ];
const SOCIAL = [ 'ritzbury-christmas', 'heritance-tea-factory', 'mak-lubricants', 'feather-sri-lanka', 'rathna-group', 'iihs', 'product-stories' ];
const PHOTOS = [ 'D85_3829-HDR.webp', 'DSC1313.webp', 'D85_3143.webp', 'AAB_5081.webp', 'VSP3675-Edit.webp', 'CL4.webp', 'D85_3324.webp' ];

const SOURCES = [
	...CLIENTS.map( ( n ) => `/assets/clients/${ n }.webp` ),
	...SOCIAL.map( ( n ) => `/assets/social/${ n }.jpg` ),
	...PHOTOS.map( ( n ) => `/assets/photos/thumb/${ n }` )
];

const DEPTH = 2800; // z range the tiles cycle through
const NEAR = 420; // closest a tile gets before it wraps to the back

/* Deterministic shuffle/jitter so the layout is the same on every visit. */
function rand( seed ) {
	let s = seed;
	return () => {
		s = ( s * 16807 ) % 2147483647;
		return ( s - 1 ) / 2147483646;
	};
}

const out = gsap.parseEase( 'expo.out' );

const smooth = ( a, b, v ) => {
	const t = Math.min( 1, Math.max( 0, ( v - a ) / ( b - a ) ) );
	return t * t * ( 3 - 2 * t );
};

/*
 * A 3D field of project tiles (after uncommondesign.group's hero), drawn with
 * CSS 3D transforms on one GSAP ticker.
 *
 * The parent drives it through `state` (from the ref):
 *   spread 0→1  tiles burst from a tight stack in the centre to their places
 *   intro       extra depth (negative = further away) that is not wrapped
 *   rush        scroll push toward the camera; tiles fly past and fade out
 * Between those, every tile drifts slowly toward the viewer and wraps to the
 * back, and the whole field leans with the cursor.
 */
const ProjectField = forwardRef( function ProjectField( { count = 30 }, ref ) {
	const box = useRef( null );
	const state = useRef( { spread: 0, intro: -500, rush: 0 } ).current;

	const tiles = useMemo( () => {
		const r = rand( 7 );
		const list = Array.from( { length: count }, ( _, i ) => {
			// Rings of tiles round the centre, so the headline area is never one solid block.
			const angle = r() * Math.PI * 2;
			const dist = 0.18 + r() * 0.72;
			return {
				src: SOURCES[ i % SOURCES.length ],
				x: Math.cos( angle ) * dist,
				y: Math.sin( angle ) * dist * 0.9,
				z: -( i / count ) * DEPTH + NEAR - 120,
				w: 0.15 + r() * 0.11,
				ratio: [ 0.8, 1.25, 1, 0.75 ][ Math.floor( r() * 4 ) ],
				lag: r() * 0.35
			};
		} );
		// The showreel plays in one large tile a little right of centre.
		list.splice( 3, 0, { video: data.site.showreel, poster: '/assets/img/Cover.jpeg', x: 0.34, y: -0.08, z: -260, w: 0.27, ratio: 1.6, lag: 0 } );
		return list;
	}, [ count ] );

	useImperativeHandle( ref, () => ( { state } ), [ state ] );

	useLayoutEffect( () => {
		const el = box.current;
		const nodes = Array.from( el.children );
		const lean = { x: 0, y: 0, tx: 0, ty: 0 };
		let drift = 0;
		let W = 1;
		let H = 1;

		// Measured on resize only: reading layout every frame (after writing styles) forces reflows.
		const measure = () => {
			W = el.clientWidth;
			H = el.clientHeight;
			const size = Math.max( W, 900 );
			tiles.forEach( ( t, i ) => {
				nodes[ i ].style.width = `${ t.w * size }px`;
			} );
		};
		measure();
		const ro = new ResizeObserver( measure );
		ro.observe( el );

		const render = () => {
			lean.x += ( lean.tx - lean.x ) * 0.06;
			lean.y += ( lean.ty - lean.y ) * 0.06;
			el.style.transform = `rotateX(${ lean.y * -4 }deg) rotateY(${ lean.x * 6 }deg)`;
			tiles.forEach( ( t, i ) => {
				// Each tile leaves the stack a little after the last.
				const s = out( Math.min( 1, Math.max( 0, ( state.spread - t.lag ) / ( 1 - t.lag ) ) ) );
				let z = t.z + drift;
				z = NEAR - ( ( ( ( NEAR - z ) % DEPTH ) + DEPTH ) % DEPTH ); // wrap into (NEAR - DEPTH, NEAR]
				// Stacked, the whole depth is squeezed into a shallow pile in front of the camera.
				const pile = -380 + ( z - NEAR ) * 0.14;
				z = pile + ( z - pile ) * s + state.intro * ( 1 - s ) + state.rush;
				const jitter = 0.1 + s * 0.9; // the stack keeps a little spread so it reads as a pile
				const x = t.x * W * 0.62 * jitter;
				const y = t.y * H * 0.62 * jitter;
				const alpha = smooth( NEAR - DEPTH, NEAR - DEPTH + 700, z ) * ( 1 - smooth( NEAR - 260, NEAR + 120, z ) );
				const n = nodes[ i ];
				// Invisible tiles skip the transform write and drop out of compositing.
				if ( alpha < 0.002 ) {
					n.style.visibility = 'hidden';
					return;
				}
				n.style.visibility = '';
				n.style.transform = `translate3d(${ x.toFixed( 1 ) }px, ${ y.toFixed( 1 ) }px, ${ z.toFixed( 1 ) }px) translate(-50%, -50%)`;
				n.style.opacity = alpha.toFixed( 3 );
			} );
		};

		render();
		if ( reduced ) {
			return () => ro.disconnect();
		}
		const tick = ( time, dt ) => {
			drift += dt * 0.055;
			render();
		};
		const move = ( e ) => {
			lean.tx = e.clientX / window.innerWidth - 0.5;
			lean.ty = e.clientY / window.innerHeight - 0.5;
		};
		window.addEventListener( 'pointermove', move );
		// Past the pinned hero there is no reason to keep animating or decoding the reel.
		const reel = el.querySelector( 'video' );
		const io = new IntersectionObserver( ( [ e ] ) => {
			if ( e.isIntersecting ) {
				gsap.ticker.add( tick );
				reel?.play().catch( () => {} );
			} else {
				gsap.ticker.remove( tick );
				reel?.pause();
			}
		} );
		io.observe( el.parentNode );
		return () => {
			ro.disconnect();
			io.disconnect();
			gsap.ticker.remove( tick );
			window.removeEventListener( 'pointermove', move );
		};
	}, [ tiles, state ] );

	return (
		<div className="vsField" aria-hidden="true">
			<div className="vsField_space" ref={ box }>
				{ tiles.map( ( t, i ) => (
					<div className={ `vsField_tile${ t.video ? ' vsField_tile--reel' : '' }` } key={ i } style={ { aspectRatio: t.ratio } }>
						{ t.video
							? <video src={ t.video } poster={ t.poster } muted loop playsInline autoPlay={ ! reduced } preload="metadata" tabIndex={ -1 } />
							: <img src={ t.src } alt="" loading={ i < 10 ? 'eager' : 'lazy' } decoding="async" /> }
					</div>
				) ) }
			</div>
		</div>
	);
} );

export default ProjectField;
