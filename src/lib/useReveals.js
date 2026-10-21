import { useLayoutEffect } from 'react';
import { gsap, reduced, ScrollTrigger } from './motion.js';

const REVEAL = '.sectionTitle, .resultItem, .featureCase, .catCard, .svcBlock_text, .capCard, .rosterItem, .missionTitle, .projectText';
const PARALLAX = '.parallaxImg img, .svcBlock_img img, .missionImg img';
/* Image frames that get the home page's unveil as they scroll in. */
const settle = gsap.parseEase( 'power2.out' );
const FRAMES = '.workPlaceholder, .flagMedia, .catCard_img, .capCard_img, .svcBlock_img, .aboutGrid_img, .missionImg, .projectFilm_frame, .nextProject_img, .reelCard_media';

/**
 * Scroll reveals, section zoom, image parallax, the inner-page hero entrance and number
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

			// Unveil: the frame opens from the bottom edge while it settles upward.
			gsap.utils.toArray( FRAMES ).forEach( ( frame ) => {
				if ( frame.closest( '.vsHero' ) ) {
					return;
				}
				gsap.fromTo( frame,
					{ clipPath: 'inset(100% 0% 0% 0%)', y: 60 },
					{
						clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.4, ease: 'expo.out',
						clearProps: 'clipPath',
						scrollTrigger: { trigger: frame, start: 'top 92%', once: true }
					} );
			} );

			gsap.utils.toArray( PARALLAX ).forEach( ( img ) => {
				gsap.fromTo( img, { yPercent: -6, scale: 1.12 }, {
					yPercent: 6,
					ease: 'none',
					scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
				} );
			} );

			// Section zoom: each card settles from 94% to full size as its top
			// rises into view. Scaled from the top edge so trigger positions stay
			// true, and the transform is dropped once it is at full size.
			const blocks = gsap.utils.toArray( 'section, .featuredSection, .servicesPage' )
				.filter( ( el ) => ! el.matches( '.vsHero' ) && ! el.parentElement.closest( 'section, .featuredSection, .servicesPage' ) )
				// Very tall sections barely show the zoom, and scaling them costs a full repaint each frame.
				.filter( ( el ) => el.offsetHeight < window.innerHeight * 1.6 );
			blocks.forEach( ( el ) => {
				el.style.transformOrigin = '50% 0';
				ScrollTrigger.create( {
					trigger: el,
					start: 'top bottom',
					end: 'top 45%',
					onUpdate: ( { progress } ) => {
						el.style.transform = progress >= 1 ? '' : `scale(${ 0.94 + 0.06 * settle( progress ) })`;
					},
					onRefresh: ( { progress } ) => {
						el.style.transform = progress >= 1 ? '' : `scale(${ 0.94 + 0.06 * progress })`;
					}
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
