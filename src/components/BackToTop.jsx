import { useEffect, useRef } from 'react';
import { gsap, scrollToTarget } from '../lib/motion.js';

const FLAT = 'M0 55 C 100 55 162.5 55 250 55 C 337.5 55 400 55 500 55 Z';
const HUMP = 'M0 55 C 100 55 162.5 0 250 0 C 337.5 0 400 55 500 55 Z';

/* A hump rises from the bottom edge once you reach the end of the page. */
export default function BackToTop() {
	const path = useRef( null );
	const label = useRef( null );

	useEffect( () => {
		const ctx = gsap.context( () => {} );
		let anim;
		ctx.add( () => {
			gsap.set( label.current, { xPercent: -50, x: 0, y: 200 } );
			anim = gsap.timeline( { paused: true } );
			anim.to( path.current, {
				duration: 0.5,
				keyframes: {
					'0%': { attr: { d: FLAT }, ease: 'none' },
					'100%': { attr: { d: HUMP }, ease: 'none' },
					ease: 'circ.inOut'
				}
			} ).to( label.current, { duration: 0.5, y: 0 }, '<' );
		} );

		function check() {
			const doc = document.documentElement;
			if ( window.scrollY + doc.clientHeight >= doc.scrollHeight - 10 ) {
				anim.play();
			} else {
				anim.reverse();
			}
		}
		window.addEventListener( 'scroll', check, { passive: true } );
		return () => {
			window.removeEventListener( 'scroll', check );
			ctx.revert();
		};
	}, [] );

	return (
		<div className="BackToTop_Wrap">
			<svg className="BackToTop_Curve" viewBox="0 0 500 55" width="500" height="55" aria-hidden="true">
				<path ref={ path } d={ FLAT } onClick={ () => scrollToTarget( 0 ) } />
			</svg>
			<p ref={ label }>Back to top</p>
		</div>
	);
}
