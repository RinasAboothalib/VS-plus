import { useLayoutEffect } from 'react';
import { ScrollTrigger, reduced } from './motion.js';

/*
 * Stacking sections.
 *
 * Every top-level block of a page is made sticky, so it freezes in place while
 * the next block scrolls up and covers it, like a stack of cards.
 *
 * The sticky offset is per-section, because the pages mix short and very tall
 * blocks:
 *   shorter than the viewport -> top: 0, so it parks at the top at once;
 *   taller than the viewport  -> top: viewportHeight - sectionHeight (negative),
 *   so the section scrolls past normally and only sticks once its bottom edge
 *   reaches the bottom of the screen. Without that, the lower half of a tall
 *   section could never be read.
 *
 * The home hero pins itself with ScrollTrigger, so it is left out of the stack
 * (matched through its pin-spacer as well) and sits underneath everything.
 */
export default function useSectionStack( ref, deps = [] ) {
	useLayoutEffect( () => {
		const root = ref.current;
		if ( ! root || reduced ) {
			return undefined;
		}

		const isHero = ( el ) => el.classList.contains( 'vsHero' ) || !! el.querySelector( '.vsHero' );

		/*
		 * Pages usually return their sections inside a plain wrapper div, so step
		 * through those to reach the list of sections. Only bare divs are stepped
		 * into, so a page that is a single <section> is never opened up.
		 */
		const container = () => {
			let el = root;
			while ( el.children.length === 1 && el.children[ 0 ].tagName === 'DIV' && el.children[ 0 ].children.length > 1 ) {
				el = el.children[ 0 ];
			}
			return el;
		};

		const apply = () => {
			const vh = window.innerHeight;
			let z = 1;
			Array.from( container().children ).forEach( ( el ) => {
				if ( isHero( el ) ) {
					el.classList.remove( 'stackCard' );
					el.style.top = '';
					el.style.zIndex = '0';
					return;
				}
				el.classList.add( 'stackCard' );
				el.style.zIndex = String( z++ );
				el.style.top = `${ Math.min( 0, vh - el.offsetHeight ) }px`;
			} );
		};

		apply();
		// GSAP inserts the hero's pin-spacer after its own layout pass, and images
		// settle later still, so measure again once things have landed.
		const again = setTimeout( () => {
			apply();
			ScrollTrigger.refresh();
		}, 600 );

		const ro = new ResizeObserver( apply );
		ro.observe( root );
		Array.from( container().children ).forEach( ( el ) => ro.observe( el ) );
		window.addEventListener( 'resize', apply );

		return () => {
			clearTimeout( again );
			ro.disconnect();
			window.removeEventListener( 'resize', apply );
			root.querySelectorAll( '.stackCard' ).forEach( ( el ) => {
				el.classList.remove( 'stackCard' );
				el.style.top = '';
				el.style.zIndex = '';
			} );
		};
	}, deps ); // eslint-disable-line react-hooks/exhaustive-deps
}
