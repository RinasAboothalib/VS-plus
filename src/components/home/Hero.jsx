import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap, reduced } from '../../lib/motion.js';
import { LiftText, WordRotator } from './HeroText.jsx';
import ProjectField from './ProjectField.jsx';

/* Hero copy from visual-studio-wine.vercel.app. */
const LEAD = 'We create content';
const ROTATING = [ 'that moves', 'that sells', 'that connects', 'that grows' ];
const TAIL = 'brands.';
const INTRO = 'Colombo’s premier digital marketing, social media campaigns, and content creation agency. We partner with ambitious brands to command attention and deliver verified commercial growth.';

/* Company facts that land on the closed frame after the manifesto (from the About page). */
const INTRO_FACTS = [
	[ 'Colombo 04', 'Studio, Sri Lanka' ],
	[ '50+', 'Premier brands partnered' ],
	[ '10M+', 'Organic digital views' ],
	[ '100%', 'In-house production' ]
];

/* The grey preloader plays once per visit; coming back to home goes straight to the burst. */
let booted = false;

/*
 * Home hero.
 *
 * Design — "We create content / that moves / brands." (from
 * visual-studio-wine.vercel.app) over a 3D field of VS+ project tiles with
 * the showreel playing in one of them, under a heavy dim and grain. The headline lines slide up, letters lift toward the cursor and
 * the middle line rolls.
 *
 * Entrance — after uncommondesign.group: a grey preloader counts to 100 and
 * wipes away to black, where the tiles sit in a tight, deep stack at the
 * centre; the stack bursts outward toward the camera into a field that keeps
 * drifting forward and leans with the cursor. Scrolling pins the hero for
 * three viewports (scrub 1.2, so it eases after the wheel): the tiles rush past the camera into black,
 * and the manifesto fades in span by span.
 */
export default function Hero() {
	const root = useRef( null );
	const field = useRef( null );
	// Decided once per mount, so React's double-run of effects in dev can't skip it.
	const withLoader = useRef( ! booted && ! reduced ).current;
	const [ loading, setLoading ] = useState( withLoader );

	useLayoutEffect( () => {
		const f = field.current.state;
		const ctx = gsap.context( () => {
			if ( reduced ) {
				Object.assign( f, { spread: 1, intro: 0 } );
				gsap.set( '.introWrap', { display: 'none' } );
				return;
			}
			const first = withLoader;
			const intro = gsap.timeline( { delay: first ? 0 : 0.45 } );
			if ( first ) {
				// Preloader: count to 100, then wipe up off the screen.
				const count = { n: 0 };
				intro.to( count, { n: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: () => {
					const el = document.querySelector( '.vsLoader_count' );
					if ( el ) {
						el.textContent = String( Math.round( count.n ) ).padStart( 3, '0' );
					}
				} } )
					.to( document.querySelector( '.vsLoader' ), { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut' }, '+=0.1' )
					.add( () => {
						booted = true;
						setLoading( false );
					} );
			}
			// The stack holds a beat, then bursts outward toward the camera.
			intro.to( f, { spread: 1, duration: 2.6, ease: 'power3.out' }, first ? '-=0.35' : 0 )
				.to( f, { intro: 0, duration: 2.8, ease: 'expo.out' }, '<' )
				.from( '.vsHero_line > span', { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, '<0.55' )
				.from( '.vsHero_intro', { y: 20, opacity: 0, duration: 0.7, ease: 'expo.out' }, '<0.15' )
				.from( '.vsHero_scroll', { opacity: 0, duration: 0.8 }, '<0.6' )
				// Let lifted letters spill over their line masks once the lines are in.
				.add( () => root.current.classList.add( 'is-in' ) );

			// Pinned sequence (~2 long): tiles rush past 0–1, manifesto from 0.95, the rest holds.
			const tl = gsap.timeline( {
				scrollTrigger: {
					trigger: root.current, scrub: 1.2, pin: true, pinSpacing: true, start: 'top top',
					// Phones get a shorter hold: three screens of pinned scroll feels like dead space there.
					end: () => ( window.innerWidth < 768 ? '+=160%' : '+=300%' ), invalidateOnRefresh: true
				}
			} );
			tl.to( f, { ease: 'power2.in', rush: 3200, duration: 1 }, 0 )
				.to( '.introText span', { ease: 'none', opacity: 1, stagger: 0.04, duration: 0.6 }, 0.95 )
				.to( {}, { duration: 0.25 } );
			tl.to( '.vsHero_content, .vsHero_scroll', { ease: 'none', yPercent: -25, opacity: 0, duration: 0.5 }, 0 );
			tl.to( document.querySelector( '.page_content_wrap' ), { ease: 'none', '--scrim-opacity': 0, duration: 1.2 }, 0 );
		}, root );
		return () => {
			ctx.revert();
		};
	}, [] );

	return (
		<section className="homeVideo vsHero" aria-labelledby="hero-title" ref={ root }>
			<div className="videowrapper vsHero_media" aria-hidden="true">
				<ProjectField ref={ field } count={ typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 30 } />
				<div className="vsHero_shade vsHero_shade--v"></div>
				<div className="vsHero_shade vsHero_shade--top"></div>
				<div className="vsHero_shade vsHero_shade--corner"></div>
				<div className="vsHero_shade vsHero_shade--dim"></div>
			</div>
			<div className="vsHero_grain" aria-hidden="true"></div>

			<div className="vsHero_content">
				<h1 id="hero-title" className="vsHero_title">
					<span className="sr-only">{ LEAD } { ROTATING[ 0 ] } { TAIL }</span>
					<span aria-hidden="true">
						<span className="vsHero_line"><span><LiftText text={ LEAD } /></span></span>
						<span className="vsHero_line"><span><WordRotator words={ ROTATING } className="vsHero_accent" /></span></span>
						<span className="vsHero_line"><span><LiftText text={ TAIL } /></span></span>
					</span>
				</h1>
				<p className="vsHero_intro">{ INTRO }</p>
			</div>

			<div className="vsHero_scroll" aria-hidden="true"><span>Scroll</span><i></i></div>


			<div id="homeBanner_intro" className="introWrap">
				<div className="introText">
					<h2 className="introLead">
						<span>Every frame is made to move something.</span>{ ' ' }
						<span>Visual Studios Plus is Colombo’s content creation and curation agency —</span>{ ' ' }
						<span>commercial videography, advertising photography and social-first campaigns</span>{ ' ' }
						<span>for FMCG, food &amp; beverage, fashion and luxury hospitality brands.</span>{ ' ' }
						<span>From strategy to shoot to the final colour grade, it’s all made in-house,</span>{ ' ' }
						<span>and all measured against real commercial results.</span>
					</h2>
					<ul className="introFacts">
						{ INTRO_FACTS.map( ( [ num, label ] ) => (
							<li key={ label }><span><b>{ num }</b>{ label }</span></li>
						) ) }
					</ul>
				</div>
			</div>

			{ /* On <body>: the pinned hero is its own stacking context, so the loader must live outside it to cover the header. */ }
			{ loading && createPortal(
				<div className="vsLoader" aria-hidden="true">
					<img className="vsLoader_mark" src="/assets/img/VSP-Square-logo.png" alt="" />
					<p className="vsLoader_label">Visual Studios+ · Creative Agency</p>
					<p className="vsLoader_count">000</p>
				</div>,
				document.body
			) }
		</section>
	);
}
