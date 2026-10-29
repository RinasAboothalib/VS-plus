import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { gsap, reduced, canHover } from '../../lib/motion.js';
import { LiftText, WordRotator } from './HeroText.jsx';
import ProjectField from './ProjectField.jsx';

/* Hero copy: two lines; the second ends in the yellow word rolling through the three. */
const LEAD = 'Brands built';
const STEM = 'to be';
const ROTATING = [ 'found', 'felt', 'followed' ];
const HEADLINE = 'Brands built to be found, felt and followed.';
const INTRO = 'Visual Studios Plus shape how your brand looks, how it lives online, and how it grows. We partner with ambitious brands to command attention and deliver verified commercial growth.';

/*
 * The manifesto, as [text, key] pieces: read word by word as you scroll, key
 * phrases light up yellow.
 */
const MANIFESTO = [
	[ 'Visual Studios Plus', true ], [ ' is a Colombo-based digital agency for brands that want to be ' ],
	[ 'found, felt, and followed.', true ], [ ' We bring ' ], [ 'branding', true ], [ ', ' ], [ 'website development', true ],
	[ ', and ' ], [ 'digital marketing', true ], [ ' together ' ], [ 'under one roof', true ], [ ' for ' ], [ 'FMCG', true ],
	[ ', ' ], [ 'food & beverage', true ], [ ', ' ], [ 'fashion', true ], [ ', and ' ], [ 'luxury hospitality', true ],
	[ ' brands. From brand strategy to website launch to the last campaign optimisation, everything is ' ],
	[ 'built in-house', true ], [ ' and measured against ' ], [ 'real commercial results.', true ]
];
const MANIFESTO_TEXT = MANIFESTO.map( ( [ t ] ) => t ).join( '' );

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
 * Design — "Brands built / to be found | felt | followed" (layout from
 * visual-studio-wine.vercel.app) over a 3D field of VS+ project tiles with
 * the showreel playing in one of them, under a heavy dim and grain. The headline lines slide up, letters lift toward the cursor and
 * the yellow last line rolls.
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
			// Touch scrolling is already smooth natively; a scrub lag on top of it feels sluggish.
			const touch = ! canHover;
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

			// Once the manifesto is in view it reads itself on a clock (~4.5s), not with the scroll:
			// word by word, key phrases turning yellow, then the facts land. The block itself is
			// shown and hidden only by the scroll timeline below, and the read is reset (not
			// rewound) once that block is hidden again, so the two can never overlap the headline.
			const words = gsap.utils.toArray( '.mWord', root.current );
			const step = 3.4 / Math.max( words.length, 1 );
			const read = gsap.timeline( { paused: true } )
				.to( words, { ease: 'none', opacity: 1, stagger: step, duration: 0.35 }, 0 )
				.to( '.mWord--key', { ease: 'power1.out', color: 'var(--hi)', stagger: step * 1.6, duration: 0.4 }, 0.1 )
				.to( '.introFacts li', { ease: 'expo.out', opacity: 1, y: 0, stagger: 0.12, duration: 0.7 }, '>-0.2' );

			// Pinned sequence: tiles rush past 0–1 while the headline lifts away, the manifesto block
			// fades in once the headline is gone, then a hold while it reads.
			const tl = gsap.timeline( {
				// Driven by the timeline's own (scrubbed) progress, so a lagging scrub can't start the read early.
				onUpdate: () => {
					const p = tl.progress();
					if ( p > 0.58 && read.progress() === 0 && ! read.isActive() ) {
						read.play( 0 );
					} else if ( p < 0.5 && read.progress() > 0 ) {
						read.pause( 0 );
					}
				},
				scrollTrigger: {
					trigger: root.current, scrub: touch ? true : 1.2, pin: true, pinSpacing: true, start: 'top top',
					anticipatePin: 1,
					// Phones get a shorter hold: three screens of pinned scroll feels like dead space there.
					end: () => ( window.innerWidth < 768 ? '+=200%' : '+=300%' ), invalidateOnRefresh: true
				}
			} );
			tl.to( f, { ease: 'power2.in', rush: 3200, duration: 1 }, 0 )
				.fromTo( '.introText', { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: 0.15, immediateRender: false }, 0.9 )
				.to( {}, { duration: 0.6 } );
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
					<span className="sr-only">{ HEADLINE }</span>
					<span aria-hidden="true">
						<span className="vsHero_line"><span><LiftText text={ LEAD } /></span></span>
						<span className="vsHero_line"><span><LiftText text={ STEM } /> <WordRotator words={ ROTATING } className="vsHero_accent" /></span></span>
					</span>
				</h1>
				<p className="vsHero_intro">{ INTRO }</p>
			</div>

			<div className="vsHero_scroll" aria-hidden="true"><span>Scroll</span><i></i></div>


			<div id="homeBanner_intro" className="introWrap">
				<div className="introText">
					<h2 className="introLead">
						<span className="sr-only">{ MANIFESTO_TEXT }</span>
						<span aria-hidden="true">
							{ MANIFESTO.flatMap( ( [ text, key ], i ) => text.split( /(\s+)/ ).map( ( w, j ) => (
								/^\s+$/.test( w ) || ! w ? w : <span key={ `${ i }-${ j }` } className={ `mWord${ key ? ' mWord--key' : '' }` }>{ w }</span>
							) ) ) }
						</span>
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
