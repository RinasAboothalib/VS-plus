import { useEffect, useLayoutEffect, useRef } from 'react';
import data from '../../data/site.js';
import { gsap, reduced } from '../../lib/motion.js';
import { LiftText, Spotlight, WordRotator } from './HeroText.jsx';

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

/*
 * Home hero.
 *
 * Design — the visual-studio-wine.vercel.app opening (no buttons): the
 * showreel behind dark gradients and film grain, a cursor spotlight, and
 * "We create content / that moves / brands." whose lines slide up one after
 * another, whose letters lift toward the cursor, and whose middle line rolls.
 *
 * Flow — a cinematic letterbox. On arrival a lime light-line draws across
 * the centre of a black screen, then splits into two edges that ride apart
 * and open the showreel to full frame. Scrolling pins the hero for three
 * viewports (scrub 0.4) and plays it in reverse: the frame closes back to
 * the line while the media pushes in, the line collapses to a point, the
 * manifesto fades in on black span by span, and the header bar slides down.
 */
export default function Hero() {
	const root = useRef( null );
	const video = useRef( null );
	const media = useRef( null );
	const edgeTop = useRef( null );
	const edgeBottom = useRef( null );

	useLayoutEffect( () => {
		const body = document.body;
		/*
		 * Frame state. `line` draws the light-line in (and `collapse` takes it
		 * back out); `load` opens the frame on arrival and `close` shuts it on
		 * scroll. One draw() turns them into the clip and the two edge lines,
		 * so the opening and the scrubbed closing can never fight.
		 */
		const frame = { line: 0, load: 0, close: 0, collapse: 0 };
		const draw = () => {
			const open = frame.load * ( 1 - frame.close );
			const t = 50 * ( 1 - open );
			media.current.style.clipPath = `inset(${ t }% 0% ${ t }% 0%)`;
			const width = frame.line * ( 1 - frame.collapse );
			// The edges fade as they near the top and bottom of the screen.
			const alpha = Math.min( 1, ( 1 - open ) * 5 ) * ( width > 0 ? 1 : 0 );
			[ [ edgeTop.current, t ], [ edgeBottom.current, 100 - t ] ].forEach( ( [ el, y ] ) => {
				el.style.top = `${ y }%`;
				el.style.transform = `scaleX(${ width })`;
				el.style.opacity = alpha;
			} );
		};
		const ctx = gsap.context( () => {
			if ( reduced ) {
				gsap.set( '.introWrap, .vsHero_edge', { display: 'none' } );
				return;
			}
			draw();
			// Opening, timed to land as the nav's liquid wipe clears: line, split, then the copy rises.
			gsap.timeline( { delay: 0.5, onUpdate: draw } )
				.to( frame, { line: 1, duration: 0.8, ease: 'expo.inOut' }, 0 )
				.to( frame, { load: 1, duration: 1.4, ease: 'expo.inOut' }, 0.65 )
				.fromTo( '.vsHero_mediaIn', { scale: 1.3 }, { scale: 1, duration: 2.6, ease: 'expo.out' }, 0.65 )
				.from( '.vsHero_line > span', { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 1.15 )
				.from( '.vsHero_intro', { y: 20, opacity: 0, duration: 0.7, ease: 'expo.out' }, 1.3 )
				.from( '.vsHero_scroll', { opacity: 0, duration: 0.8 }, 1.9 )
				// Let lifted letters spill over their line masks once the lines are in.
				.add( () => root.current.classList.add( 'is-in' ) );

			// Pinned sequence (~2 long): frame closes 0–1, line collapses 1–1.2, manifesto from 1.05, header bar over the last 30%.
			const tl = gsap.timeline( {
				scrollTrigger: {
					trigger: root.current, scrub: 0.4, pin: true, pinSpacing: true, start: 'top top', end: '+=300%',
					onUpdate: ( self ) => body.classList.toggle( 'bar-on', self.progress > 0.7 )
				}
			} );
			tl.to( frame, { ease: 'power2.in', close: 1, duration: 1, onUpdate: draw }, 0 )
				.to( frame, { ease: 'power2.inOut', collapse: 1, duration: 0.2, onUpdate: draw }, 1 )
				.to( '.introText span', { ease: 'none', opacity: 1, stagger: 0.04, duration: 0.6 }, 1.05 )
				.to( {}, { duration: 0.25 } );
			tl.to( '.vsHero_mediaIn', { ease: 'none', scale: 1.3, duration: 1 }, 0 );
			tl.to( '.vsHero_content, .vsHero_scroll', { ease: 'none', yPercent: -25, opacity: 0, duration: 0.5 }, 0 );
			tl.to( document.querySelector( '.page_content_wrap' ), { ease: 'none', '--scrim-opacity': 0, duration: 1.2 }, 0 );
		}, root );
		return () => {
			ctx.revert();
			body.classList.remove( 'bar-on' );
		};
	}, [] );

	// Off screen (past the pinned hero) there is no reason to keep decoding the reel.
	useEffect( () => {
		const v = video.current;
		if ( reduced || ! v ) {
			return undefined;
		}
		const io = new IntersectionObserver( ( [ e ] ) => ( e.isIntersecting ? v.play().catch( () => {} ) : v.pause() ) );
		io.observe( root.current );
		return () => io.disconnect();
	}, [] );

	return (
		<section className="homeVideo vsHero" aria-labelledby="hero-title" ref={ root }>
			<div className="videowrapper vsHero_media" aria-hidden="true" ref={ media }>
				<div className="vsHero_mediaIn">
					<img className="vsHero_poster" src="/assets/img/Cover.jpeg" alt="" />
					{ ! reduced && (
						<video ref={ video } className="vsHero_video" src={ data.site.showreel }
							muted loop playsInline autoPlay preload="auto" disablePictureInPicture tabIndex={ -1 } />
					) }
				</div>
				<div className="vsHero_shade vsHero_shade--v"></div>
				<div className="vsHero_shade vsHero_shade--top"></div>
				<div className="vsHero_shade vsHero_shade--corner"></div>
				<div className="vsHero_shade vsHero_shade--dim"></div>
			</div>
			<div className="vsHero_grain" aria-hidden="true"></div>
			<Spotlight />

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

			<i className="vsHero_edge" ref={ edgeTop } aria-hidden="true"></i>
			<i className="vsHero_edge" ref={ edgeBottom } aria-hidden="true"></i>

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
		</section>
	);
}
