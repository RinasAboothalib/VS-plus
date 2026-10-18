import { useEffect, useLayoutEffect, useRef } from 'react';
import data from '../../data/site.js';
import { gsap, reduced } from '../../lib/motion.js';
import { LiftText, Spotlight, WordRotator } from './HeroText.jsx';

const BLOB = 'M40.4,-70C49.7,-64.6,52.8,-48.4,61,-34.9C69.3,-21.5,82.7,-10.7,87.7,2.9C92.6,16.4,89,32.9,80,45C70.9,57,56.4,64.7,42.1,68C27.9,71.3,13.9,70.2,-0.8,71.5C-15.5,72.8,-30.9,76.6,-40.1,70.4C-49.3,64.1,-52.1,48,-60.3,34.6C-68.4,21.2,-81.8,10.6,-81.9,0C-82,-10.7,-68.7,-21.4,-60.7,-35C-52.7,-48.6,-50,-65.2,-40.7,-70.6C-31.4,-76.1,-15.7,-70.4,-0.1,-70.3C15.5,-70.1,31.1,-75.4,40.4,-70Z';

/* Hero copy from visual-studio-wine.vercel.app. */
const EYEBROW = 'Visual Studios+ · Creative Agency';
const LEAD = 'We create content';
const ROTATING = [ 'that moves', 'that sells', 'that connects', 'that grows' ];
const TAIL = 'brands.';
const INTRO = 'Colombo’s premier digital marketing, social media campaigns, and content creation agency. We partner with ambitious brands to command attention and deliver verified commercial growth.';

/* Company facts that land on the blob after the manifesto (from the About page). */
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
 * Flow — ambercomm.ae: after the liquid page wipe, the hero pins for three
 * viewports of scroll (scrub 0.4). A dark blob grows to 1.5x and turns 270°
 * out of the centre while the media pushes in, the top scrim fades, the
 * manifesto fades in on the blob span by span, and finally the header bar
 * slides down.
 */
export default function Hero() {
	const root = useRef( null );
	const video = useRef( null );

	useLayoutEffect( () => {
		const body = document.body;
		const ctx = gsap.context( () => {
			if ( reduced ) {
				gsap.set( '.introWrap', { display: 'none' } );
				return;
			}
			// Opening, timed to land as the nav's liquid wipe clears.
			gsap.timeline( { delay: 0.6 } )
				.fromTo( '.vsHero_mediaIn', { scale: 1.18 }, { scale: 1, duration: 2.4, ease: 'expo.out' }, 0 )
				.from( '.vsHero_eyebrow', { opacity: 0, y: 20, duration: 0.7, ease: 'expo.out' }, 0.05 )
				.from( '.vsHero_line > span', { yPercent: 105, duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0.1 )
				.from( '.vsHero_intro', { y: 20, opacity: 0, duration: 0.7, ease: 'expo.out' }, 0.25 )
				.from( '.vsHero_scroll', { opacity: 0, duration: 0.8 }, 1.2 )
				// Let lifted letters spill over their line masks once the lines are in.
				.add( () => root.current.classList.add( 'is-in' ) );

			// Amber's pinned sequence. Total length 1.7: blob 0–1.2, header bar 1.2–1.7.
			const tl = gsap.timeline( {
				scrollTrigger: {
					trigger: root.current, scrub: 0.4, pin: true, pinSpacing: true, start: 'top top', end: '+=300%',
					onUpdate: ( self ) => body.classList.toggle( 'bar-on', self.progress > 1.2 / 1.7 )
				}
			} );
			tl.to( '.homeBanner_shape', { ease: 'none', scale: 1.5, rotation: 270, duration: 1.2 } )
				.to( '.introText span', { ease: 'none', opacity: 1, stagger: 0.05, duration: 0.75 }, '<25%' )
				.to( {}, { duration: 0.5 } );
			tl.to( '.vsHero_mediaIn', { ease: 'none', scale: 1.5, duration: 1.2 }, 0 );
			tl.to( '.vsHero_content, .vsHero_scroll', { ease: 'none', yPercent: -25, opacity: 0, duration: 0.55 }, 0 );
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
			<div className="videowrapper vsHero_media" aria-hidden="true">
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
			</div>
			<div className="vsHero_grain" aria-hidden="true"></div>
			<Spotlight />

			<div className="vsHero_content">
				<p className="vsHero_eyebrow"><span className="dot" aria-hidden="true"></span>{ EYEBROW }</p>
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
				<svg className="homeBanner_shape" viewBox="0 0 200 200" aria-hidden="true">
					<path d={ BLOB } transform="translate(100 100)" />
				</svg>
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
