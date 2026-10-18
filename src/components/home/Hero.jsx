import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import data from '../../data/site.js';
import { gsap, reduced } from '../../lib/motion.js';

const BLOB = 'M40.4,-70C49.7,-64.6,52.8,-48.4,61,-34.9C69.3,-21.5,82.7,-10.7,87.7,2.9C92.6,16.4,89,32.9,80,45C70.9,57,56.4,64.7,42.1,68C27.9,71.3,13.9,70.2,-0.8,71.5C-15.5,72.8,-30.9,76.6,-40.1,70.4C-49.3,64.1,-52.1,48,-60.3,34.6C-68.4,21.2,-81.8,10.6,-81.9,0C-82,-10.7,-68.7,-21.4,-60.7,-35C-52.7,-48.6,-50,-65.2,-40.7,-70.6C-31.4,-76.1,-15.7,-70.4,-0.1,-70.3C15.5,-70.1,31.1,-75.4,40.4,-70Z';

/* Company facts that land on the blob after the manifesto (from the About page). */
const INTRO_FACTS = [
	[ 'Colombo 04', 'Studio, Sri Lanka' ],
	[ '50+', 'Premier brands partnered' ],
	[ '10M+', 'Organic digital views' ],
	[ '100%', 'In-house production' ]
];

/* How long the title card holds before the reel fades in over it. */
const CARD_HOLD = 2600;

/*
 * Home hero, after ambercomm.ae: a full-screen showreel over a black title
 * card. Pinned for three viewports of scroll: a dark blob grows and turns
 * 270° out of the centre, the intro fades in on it span by span, the top
 * scrim fades away and the logo bar slides down.
 */
export default function Hero() {
	const root = useRef( null );
	const video = useRef( null );
	const [ videoOn, setVideoOn ] = useState( false );

	useLayoutEffect( () => {
		const ctx = gsap.context( () => {
			if ( reduced ) {
				gsap.set( '.introWrap', { display: 'none' } );
				return;
			}
			gsap.from( '.heroMark_in', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.12, delay: 0.75 } );

			const tl = gsap.timeline( {
				scrollTrigger: { trigger: root.current, scrub: 0.4, pin: true, pinSpacing: true, start: 'top top', end: '+=300%' }
			} );
			tl.to( '.homeBanner_shape', { ease: 'none', scale: 1.5, rotation: 270, duration: 1.2 } )
				.to( '.introText span', { ease: 'none', opacity: 1, stagger: 0.05, duration: 0.75 }, '<25%' )
				.to( document.querySelector( '.siteLogo_bg' ), { yPercent: 100, duration: 0.5 } );
			// The scrim is gone at 1.2, exactly when the bar starts, so the two never overlap.
			tl.to( document.querySelector( '.page_content_wrap' ), { ease: 'none', '--scrim-opacity': 0, duration: 1.2 }, 0 );
		}, root );
		return () => ctx.revert();
	}, [] );

	// The reel: start it behind the card, fade it in once it is actually playing.
	// It loops natively (no seeking), served locally with its index up front, so it never stalls.
	useEffect( () => {
		const v = video.current;
		if ( reduced || ! v ) {
			return undefined;
		}
		const started = performance.now();
		let timer = 0;
		const onPlaying = () => {
			if ( timer ) {
				return;
			}
			timer = setTimeout( () => setVideoOn( true ), Math.max( 0, CARD_HOLD - ( performance.now() - started ) ) );
		};
		// Off screen (scrolled past the pinned hero) there is no reason to keep decoding.
		const io = new IntersectionObserver( ( [ entry ] ) => {
			if ( entry.isIntersecting ) {
				v.play().catch( () => {} );
			} else {
				v.pause();
			}
		} );
		v.addEventListener( 'playing', onPlaying );
		io.observe( root.current );
		return () => {
			clearTimeout( timer );
			io.disconnect();
			v.removeEventListener( 'playing', onPlaying );
		};
	}, [] );

	return (
		<section className="homeVideo" aria-label="Introduction" ref={ root }>
			<div className="videowrapper">
				<div className="heroPoster">
					<h2 className="heroMark" aria-label="We’re VS+.">
						<span className="heroMark_line heroMark_line--1"><span className="heroMark_in">we’re</span></span>
						<span className="heroMark_line heroMark_line--2"><span className="heroMark_in">vs+<i className="heroMark_dot"></i></span></span>
					</h2>
				</div>
				{ ! reduced && (
					<video ref={ video } className={ `heroVideo${ videoOn ? ' is-on' : '' }` } src={ data.site.showreel }
						muted loop playsInline autoPlay preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={ -1 } />
				) }
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
