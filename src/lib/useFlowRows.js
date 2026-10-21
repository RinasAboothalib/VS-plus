import { useLayoutEffect } from 'react';
import { gsap, reduced, ScrollTrigger } from './motion.js';

/**
 * Motion flow for endless rows (each track renders its items twice): the rows
 * glide in alternating directions, scrolling speeds them up and turns them
 * with the scroll direction, they ease back to a drift afterwards, and a row
 * slows right down while the pointer rests on it. Runs only while `scope` is
 * on screen.
 *
 * @param {{ current: HTMLElement }} scope   section that holds the rows
 * @param {string} selector                  the tracks inside it
 * @param {{ speed?: number, maxBoost?: number }} opts  drift in px/ms, scroll boost cap
 */
export default function useFlowRows( scope, selector, { speed = 0.045, maxBoost = 0.9 } = {} ) {
	useLayoutEffect( () => {
		if ( reduced || ! scope.current ) {
			return undefined;
		}
		const tracks = Array.from( scope.current.querySelectorAll( selector ) );
		const state = tracks.map( ( el, i ) => ( { el, x: 0, dir: i % 2 ? 1 : -1, slow: 1, loop: 1 } ) );
		let boost = 0;
		let sign = 1;

		// Loop length = where the second copy starts (includes the gap). Measured on resize, not per frame.
		const measure = () => state.forEach( ( s ) => {
			const half = s.el.children.length / 2;
			s.loop = s.el.children[ half ].offsetLeft - s.el.children[ 0 ].offsetLeft || 1;
			// Rows that run rightwards start one loop in, so they never show their empty left edge.
			if ( s.dir > 0 && s.x === 0 ) {
				s.x = -s.loop;
			}
		} );
		measure();
		const ro = new ResizeObserver( measure );
		tracks.forEach( ( el ) => ro.observe( el ) );

		const tick = ( time, dt ) => {
			boost += ( 0 - boost ) * Math.min( 1, dt / 400 );
			state.forEach( ( s ) => {
				const v = ( speed + boost ) * s.slow * sign * s.dir;
				s.x = gsap.utils.wrap( -s.loop, 0, s.x + v * dt );
				s.el.style.transform = `translate3d(${ s.x }px, 0, 0)`;
			} );
		};

		const st = ScrollTrigger.create( {
			trigger: scope.current,
			start: 'top bottom',
			end: 'bottom top',
			onToggle: ( self ) => gsap.ticker[ self.isActive ? 'add' : 'remove' ]( tick ),
			onUpdate: ( self ) => {
				sign = self.direction;
				boost = Math.min( maxBoost, Math.max( boost, Math.abs( self.getVelocity() ) / 2500 ) );
			}
		} );

		const hovers = state.map( ( s ) => {
			const row = s.el.parentNode;
			const enter = () => gsap.to( s, { slow: 0.15, duration: 0.6, ease: 'power2.out' } );
			const leave = () => gsap.to( s, { slow: 1, duration: 0.8, ease: 'power2.out' } );
			row.addEventListener( 'pointerenter', enter );
			row.addEventListener( 'pointerleave', leave );
			return () => {
				row.removeEventListener( 'pointerenter', enter );
				row.removeEventListener( 'pointerleave', leave );
			};
		} );

		return () => {
			ro.disconnect();
			st.kill();
			gsap.ticker.remove( tick );
			hovers.forEach( ( off ) => off() );
		};
	}, [ scope, selector, speed, maxBoost ] );
}
