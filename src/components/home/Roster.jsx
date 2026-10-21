import { useLayoutEffect, useRef } from 'react';
import data from '../../data/site.js';
import { gsap, reduced, ScrollTrigger } from '../../lib/motion.js';

/*
 * Client roster as a motion flow: the logos run in two endless rows that
 * glide in opposite directions. Scrolling speeds the flow up and turns it
 * with the scroll direction; it eases back to a drift afterwards, and slows
 * right down while the pointer rests on a row.
 */
export default function Roster( { eyebrow, title } ) {
	const root = useRef( null );
	const half = Math.ceil( data.clients.length / 2 );
	const rows = [ data.clients.slice( 0, half ), data.clients.slice( half ) ];

	useLayoutEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const tracks = Array.from( root.current.querySelectorAll( '.rosterFlow_track' ) );
		const state = tracks.map( ( el, i ) => ( { el, x: 0, dir: i % 2 ? 1 : -1, slow: 1, loop: 1 } ) );
		let boost = 0;
		let sign = 1;

		// Loop length = where the second copy starts (includes the gap). Measured on resize, not per frame.
		const measure = () => state.forEach( ( s ) => {
			const half = s.el.children.length / 2;
			s.loop = s.el.children[ half ].offsetLeft - s.el.children[ 0 ].offsetLeft || 1;
		} );
		measure();
		const ro = new ResizeObserver( measure );
		tracks.forEach( ( el ) => ro.observe( el ) );

		const tick = ( time, dt ) => {
			// Scroll speed feeds a boost that decays back to the base drift.
			boost += ( 0 - boost ) * Math.min( 1, dt / 400 );
			state.forEach( ( s ) => {
				const speed = ( 0.045 + boost ) * s.slow * sign * s.dir;
				s.x = gsap.utils.wrap( -s.loop, 0, s.x + speed * dt );
				s.el.style.transform = `translate3d(${ s.x }px, 0, 0)`;
			} );
		};

		const st = ScrollTrigger.create( {
			trigger: root.current,
			start: 'top bottom',
			end: 'bottom top',
			// Only animate while the section is on screen.
			onToggle: ( self ) => gsap.ticker[ self.isActive ? 'add' : 'remove' ]( tick ),
			onUpdate: ( self ) => {
				const v = self.getVelocity();
				sign = self.direction;
				boost = Math.min( 0.9, Math.max( boost, Math.abs( v ) / 2500 ) );
			}
		} );

		const hovers = state.map( ( s ) => {
			const enter = () => gsap.to( s, { slow: 0.15, duration: 0.6, ease: 'power2.out' } );
			const leave = () => gsap.to( s, { slow: 1, duration: 0.8, ease: 'power2.out' } );
			s.el.parentNode.addEventListener( 'pointerenter', enter );
			s.el.parentNode.addEventListener( 'pointerleave', leave );
			return () => {
				s.el.parentNode.removeEventListener( 'pointerenter', enter );
				s.el.parentNode.removeEventListener( 'pointerleave', leave );
			};
		} );

		return () => {
			ro.disconnect();
			st.kill();
			gsap.ticker.remove( tick );
			hovers.forEach( ( off ) => off() );
		};
	}, [] );

	return (
		<section className="rosterSection" aria-labelledby="rosterTitle" ref={ root }>
			<div className="rosterInner">
				<p className="eyebrow">{ eyebrow }</p>
				<h2 className="sectionTitle" id="rosterTitle">{ title }</h2>
				<p className="lede">From global FMCG giants to boutique luxury houses across Sri Lanka &amp; international markets.</p>
			</div>
			<div className="rosterFlow">
				{ rows.map( ( row, r ) => (
					<div className="rosterFlow_row" key={ r }>
						<ul className="rosterFlow_track">
							{ /* Rendered twice so the loop is seamless; the copy is hidden from assistive tech. */ }
							{ [ 0, 1 ].map( ( copy ) => row.map( ( [ file, name, sector ] ) => (
								<li className="rosterItem" key={ `${ copy }-${ file }` } aria-hidden={ copy === 1 || undefined }>
									<img src={ `/assets/logos/${ file }` } alt={ copy === 1 ? '' : name } loading="lazy" />
									<span>{ sector }</span>
								</li>
							) ) ) }
						</ul>
					</div>
				) ) }
			</div>
		</section>
	);
}
