import { useLayoutEffect } from 'react';
import { gsap, reduced } from './motion.js';

const REVEAL = '.sectionTitle, .resultItem, .caseRow, .featureCase, .catCard, .svcBlock_text, .capCard, .rosterItem, .missionTitle, .projectText';
const PARALLAX = '.parallaxImg img, .svcBlock_img img, .missionImg img';

/**
 * Scroll reveals, image parallax, the inner-page hero entrance and number
 * count-ups for everything inside `scope`. Everything is reverted on unmount.
 */
export default function useReveals( scope, deps = [] ) {
	useLayoutEffect( () => {
		if ( reduced || ! scope.current ) {
			return undefined;
		}
		const ctx = gsap.context( () => {
			gsap.utils.toArray( REVEAL ).forEach( ( node ) => {
				gsap.from( node, {
					y: 40,
					opacity: 0,
					duration: 1,
					ease: 'power3.out',
					scrollTrigger: { trigger: node, start: 'top 92%', once: true }
				} );
			} );

			gsap.utils.toArray( PARALLAX ).forEach( ( img ) => {
				gsap.fromTo( img, { yPercent: -6, scale: 1.12 }, {
					yPercent: 6,
					ease: 'none',
					scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
				} );
			} );

			const hero = scope.current.querySelector( '.pageHero' );
			if ( hero ) {
				gsap.from( hero.querySelectorAll( '.eyebrow, .pageTitle_line, .pageTitle--project, .pageLede, .pageJump, .projectMeta, .projectNav, .pageActions' ), {
					y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.45
				} );
			}

			gsap.utils.toArray( '.resultNum[data-count]' ).forEach( ( node ) => {
				const raw = node.getAttribute( 'data-count' );
				const m = raw.match( /^([^\d]*)([\d.]+)(.*)$/ );
				if ( ! m ) {
					return;
				}
				const end = parseFloat( m[ 2 ] );
				const decimals = ( m[ 2 ].split( '.' )[ 1 ] || '' ).length;
				const obj = { v: 0 };
				node.textContent = m[ 1 ] + ( 0 ).toFixed( decimals ) + m[ 3 ];
				gsap.to( obj, {
					v: end,
					duration: 1.6,
					ease: 'power2.out',
					scrollTrigger: { trigger: node, start: 'top 90%', once: true },
					onUpdate: () => {
						node.textContent = m[ 1 ] + obj.v.toFixed( decimals ) + m[ 3 ];
					},
					onComplete: () => {
						node.textContent = raw;
					}
				} );
			} );
		}, scope );
		return () => ctx.revert();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps );
}
