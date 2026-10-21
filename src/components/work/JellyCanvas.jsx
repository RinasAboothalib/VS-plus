import { useEffect, useRef } from 'react';
import { canHover, reduced } from '../../lib/motion.js';

/*
 * Jelly-edge mask over a grid section. Per card, paints white (the section
 * colour) between a rectangle 2px outside the image and a soft inner contour.
 * Contour points within 10vw of the cursor ease inward along their normal,
 * so the image edge dents toward the pointer and springs back when it leaves.
 * Mouse pointers only, at 900px wide and up (hidden otherwise by CSS).
 */

function contour( w, h ) {
	const pts = [];
	const nx = 6;
	const ny = Math.max( 2, Math.round( h / ( w / nx ) ) );
	const cx = w / 2;
	const cy = h / 2;
	const push = ( x, y ) => {
		const corner = ( x === 0 || x === w ) && ( y === 0 || y === h );
		let n;
		if ( corner ) {
			const dx = cx - x;
			const dy = cy - y;
			const len = Math.hypot( dx, dy );
			n = [ dx / len, dy / len ];
		} else if ( y === 0 ) {
			n = [ 0, 1 ];
		} else if ( y === h ) {
			n = [ 0, -1 ];
		} else if ( x === 0 ) {
			n = [ 1, 0 ];
		} else {
			n = [ -1, 0 ];
		}
		pts.push( { x, y, nx: n[ 0 ], ny: n[ 1 ], d: 0 } );
	};
	for ( let i = 0; i < nx; i++ ) { push( w * i / nx, 0 ); }
	for ( let i = 0; i < ny; i++ ) { push( w, h * i / ny ); }
	for ( let i = nx; i > 0; i-- ) { push( w * i / nx, h ); }
	for ( let i = ny; i > 0; i-- ) { push( 0, h * i / ny ); }
	return pts;
}

export default function JellyCanvas( { selector = '.workPlaceholder' } ) {
	const canvasRef = useRef( null );

	useEffect( () => {
		if ( reduced || ! canHover ) {
			return undefined;
		}
		const canvas = canvasRef.current;
		const section = canvas.parentNode;
		const ctx = canvas.getContext( '2d' );
		const dpr = Math.min( window.devicePixelRatio || 1, 2 );
		const mouse = { x: -9999, y: -9999 };
		const state = new WeakMap();
		let active = false;
		let running = false;
		let settle = 0;
		let rafId = 0;

		const size = () => {
			const w = section.offsetWidth;
			const h = section.offsetHeight;
			canvas.width = Math.round( w * dpr );
			canvas.height = Math.round( h * dpr );
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
		};

		const frame = () => {
			if ( ! active || window.innerWidth <= 900 ) {
				running = false;
				ctx.clearRect( 0, 0, canvas.width, canvas.height );
				return;
			}
			const sRect = section.getBoundingClientRect();
			const boundary = window.innerWidth * 0.1;
			const maxPull = Math.min( 34, window.innerWidth * 0.022 );
			let moving = false;

			ctx.setTransform( dpr, 0, 0, dpr, 0, 0 );
			ctx.clearRect( 0, 0, canvas.width, canvas.height );
			ctx.fillStyle = '#ffffff';

			section.querySelectorAll( selector ).forEach( ( ph ) => {
				const r = ph.getBoundingClientRect();
				if ( r.bottom < -50 || r.top > window.innerHeight + 50 ) {
					return;
				}
				const x0 = r.left - sRect.left;
				const y0 = r.top - sRect.top;
				let st = state.get( ph );
				if ( ! st || Math.abs( st.w - r.width ) > 0.5 || Math.abs( st.h - r.height ) > 0.5 ) {
					st = { w: r.width, h: r.height, pts: contour( r.width, r.height ) };
					state.set( ph, st );
				}
				const mx = mouse.x - r.left;
				const my = mouse.y - r.top;
				let any = false;

				st.pts.forEach( ( p ) => {
					const dist = Math.hypot( mx - p.x, my - p.y );
					let target = 0;
					if ( dist < boundary ) {
						const f = 1 - dist / boundary;
						target = maxPull * f * f;
					}
					p.d += ( target - p.d ) * 0.14;
					if ( Math.abs( target - p.d ) > 0.05 ) {
						moving = true;
					}
					if ( p.d > 0.15 ) {
						any = true;
					}
				} );

				if ( ! any ) {
					return;
				}

				const o = 2;
				ctx.beginPath();
				ctx.rect( x0 - o, y0 - o, r.width + o * 2, r.height + o * 2 );
				const pts = st.pts.map( ( p ) => [ x0 + p.x + p.nx * p.d, y0 + p.y + p.ny * p.d ] );
				const n = pts.length;
				const mid = ( a, b ) => [ ( a[ 0 ] + b[ 0 ] ) / 2, ( a[ 1 ] + b[ 1 ] ) / 2 ];
				const start = mid( pts[ n - 1 ], pts[ 0 ] );
				ctx.moveTo( start[ 0 ], start[ 1 ] );
				for ( let i = 0; i < n; i++ ) {
					const m = mid( pts[ i ], pts[ ( i + 1 ) % n ] );
					ctx.quadraticCurveTo( pts[ i ][ 0 ], pts[ i ][ 1 ], m[ 0 ], m[ 1 ] );
				}
				ctx.closePath();
				ctx.fill( 'evenodd' );
			} );

			settle = moving ? 20 : settle - 1;
			if ( settle > 0 ) {
				rafId = requestAnimationFrame( frame );
			} else {
				running = false;
			}
		};

		const kick = () => {
			if ( ! running ) {
				running = true;
				settle = 20;
				rafId = requestAnimationFrame( frame );
			}
		};

		const onMove = ( e ) => {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
			kick();
		};

		size();
		const ro = new ResizeObserver( size );
		ro.observe( section );
		const io = new IntersectionObserver( ( entries ) => {
			active = entries[ 0 ].isIntersecting;
			if ( active ) {
				kick();
			}
		} );
		io.observe( section );
		window.addEventListener( 'mousemove', onMove, { passive: true } );
		window.addEventListener( 'scroll', kick, { passive: true } );

		return () => {
			cancelAnimationFrame( rafId );
			// selector is fixed per instance
			ro.disconnect();
			io.disconnect();
			window.removeEventListener( 'mousemove', onMove );
			window.removeEventListener( 'scroll', kick );
		};
	}, [ selector ] );

	return <canvas className="worksCanvas" ref={ canvasRef } aria-hidden="true" />;
}
