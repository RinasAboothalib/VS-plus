import { useLayoutEffect } from 'react';
import { gsap, reduced } from '../../lib/motion.js';

/**
 * Runs an illustration's looping timeline only while it is on screen, after a
 * one-time entrance. `build(q)` receives a scoped selector and returns the loop.
 */
export default function useIllustration( ref, build ) {
	useLayoutEffect( () => {
		if ( reduced || ! ref.current ) {
			return undefined;
		}
		let loop = null;
		const ctx = gsap.context( () => {
			const q = gsap.utils.selector( ref.current );
			gsap.from( ref.current, { opacity: 0, y: 30, scale: 0.94, duration: 1, ease: 'power3.out',
				scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true } } );
			loop = build( q );
			loop.pause();
		}, ref );

		const io = new IntersectionObserver( ( [ e ] ) => ( e.isIntersecting ? loop.play() : loop.pause() ) );
		io.observe( ref.current );
		return () => {
			io.disconnect();
			ctx.revert();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );
}
