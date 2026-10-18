import { useLayoutEffect, useRef } from 'react';
import { gsap, reduced } from '../../lib/motion.js';
import ClipRotator from './ClipRotator.jsx';

const BLOB = 'M40.4,-70C49.7,-64.6,52.8,-48.4,61,-34.9C69.3,-21.5,82.7,-10.7,87.7,2.9C92.6,16.4,89,32.9,80,45C70.9,57,56.4,64.7,42.1,68C27.9,71.3,13.9,70.2,-0.8,71.5C-15.5,72.8,-30.9,76.6,-40.1,70.4C-49.3,64.1,-52.1,48,-60.3,34.6C-68.4,21.2,-81.8,10.6,-81.9,0C-82,-10.7,-68.7,-21.4,-60.7,-35C-52.7,-48.6,-50,-65.2,-40.7,-70.6C-31.4,-76.1,-15.7,-70.4,-0.1,-70.3C15.5,-70.1,31.1,-75.4,40.4,-70Z';

/* Company facts that land on the blob after the manifesto (from the About page). */
const INTRO_FACTS = [
	[ 'Colombo 04', 'Studio, Sri Lanka' ],
	[ '50+', 'Premier brands partnered' ],
	[ '10M+', 'Organic digital views' ],
	[ '100%', 'In-house production' ]
];

/* Rotating word of the original visualstudiosplus.com headline: "The ___ Agency". */
const ROTATING = [ 'Digital', 'Creative', 'Marketing' ];

/*
 * Home hero, with the content of the original visualstudiosplus.com opening:
 * "The / Digital·Creative·Marketing / Agency" over the dark brand collage,
 * the middle word rotating with a clip-and-cursor wipe, and the line
 * "We create content meant to be experienced. Not simply consumed."
 * Then, after ambercomm.ae, it pins for three viewports of scroll: the content
 * drifts away, a dark blob grows and turns 270° out of the centre, and the
 * company manifesto fades in on it.
 */
export default function Hero() {
	const root = useRef( null );

	useLayoutEffect( () => {
		const ctx = gsap.context( () => {
			if ( reduced ) {
				gsap.set( '.introWrap', { display: 'none' } );
				return;
			}
			// Opening: fade-up words, as on the original site, timed to the nav's liquid wipe.
			const intro = gsap.timeline( { delay: 0.6 } );
			intro.fromTo( '.vsHero_mediaIn', { scale: 1.15 }, { scale: 1, duration: 2.6, ease: 'expo.out' }, 0 )
				.from( '.vsHero_word', { yPercent: 60, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.15 }, 0.1 )
				.from( '.vsHero_tag', { y: 30, opacity: 0, duration: 1, ease: 'expo.out' }, 0.6 )
				.from( '.vsHero_rule', { scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'expo.inOut' }, 0.6 );

			const tl = gsap.timeline( {
				scrollTrigger: { trigger: root.current, scrub: 0.4, pin: true, pinSpacing: true, start: 'top top', end: '+=300%' }
			} );
			tl.to( '.homeBanner_shape', { ease: 'none', scale: 1.5, rotation: 270, duration: 1.2 } )
				.to( '.introText span', { ease: 'none', opacity: 1, stagger: 0.05, duration: 0.75 }, '<25%' );
			tl.to( '.vsHero_content', { ease: 'none', yPercent: -20, opacity: 0, duration: 0.6 }, 0 );
			tl.to( '.vsHero_media', { ease: 'none', yPercent: 12, duration: 1.2 }, 0 );
			tl.to( document.querySelector( '.page_content_wrap' ), { ease: 'none', '--scrim-opacity': 0, duration: 1.2 }, 0 );
		}, root );
		return () => ctx.revert();
	}, [] );

	return (
		<section className="homeVideo vsHero" aria-labelledby="hero-title" ref={ root }>
			<div className="videowrapper vsHero_media" aria-hidden="true">
				<div className="vsHero_mediaIn">
					<img className="vsHero_collage" src="/assets/img/Cover.jpeg" alt="" />
				</div>
				<div className="vsHero_dim"></div>
			</div>

			<div className="vsHero_content">
				<h1 id="hero-title" className="vsHero_title">
					<span className="sr-only">The Digital Agency</span>
					<span className="vsHero_stack" aria-hidden="true">
						<span className="vsHero_word vsHero_word--the">The</span>
						<span className="vsHero_word vsHero_word--rot"><ClipRotator words={ ROTATING } /></span>
						<span className="vsHero_word vsHero_word--agency">Agency</span>
					</span>
				</h1>
				<div className="vsHero_tag">
					<span className="vsHero_rule" aria-hidden="true"></span>
					<p>We create content meant to be experienced. Not simply consumed.</p>
				</div>
			</div>

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
