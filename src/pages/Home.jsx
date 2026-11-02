import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import data from '../data/site.js';
import posts from '../data/instagram.js';
import projects from '../data/projects.js';
import { usePage } from '../context/PageContext.jsx';
import { gsap, reduced, ScrollTrigger } from '../lib/motion.js';
import useFlowRows from '../lib/useFlowRows.js';
import TLink from '../components/TLink.jsx';
import FigmaCta from '../components/FigmaCta.jsx';
import { WordRotator } from '../components/home/HeroText.jsx';

/* Home, laid out after the Figma "home" frame (visual-studios, node 2:2). */

/* The hero's middle line rolls through these after "That", as the old hero's headline did. */
const HERO_VERBS = [ 'grows', 'builds', 'moves', 'sells' ];

const LOGOS = [
	[ 'AhmadTeaLogoTransparent-a.png', 'Ahmad Tea' ],
	[ 'keellslogo-a.png', 'Keells' ],
	[ 'Cosmopoliton-a.png', 'Cosmopolitan' ],
	[ 'Cinnamon-Logo-a.png', 'Cinnamon Hotels' ],
	[ 'Omega_Logo-a.png', 'Omega' ],
	[ 'Unilever-A.png', 'Unilever' ]
];

const STATS = [
	[ '50+', 'Premier brands partnered' ],
	[ '10M+', 'Organic digital views' ],
	[ '100%', 'In-house production' ]
];

/* The five lead services, in this order, from the site's service list. */
const SERVICE_ORDER = [ 'web-app-development', 'digital-retainers', 'branding-strategy', 'tv-commercials', 'reels-tiktok' ];
const SERVICES = SERVICE_ORDER.map( ( slug ) => data.serviceList.find( ( s ) => s[ 0 ] === slug ) );

/* Each service's film: the studio video that shows that kind of work, with its cover as the poster. */
const clip = ( path ) => ( { src: `/assets/${ path }.mp4`, poster: `/assets/${ path }.jpg` } );
const SERVICE_VIDEO = {
	'web-app-development': clip( 'smm/waga-web-01' ), // Waga web film
	'digital-retainers': clip( 'social/marketing-facts' ), // "10 Marketing Facts"
	'branding-strategy': clip( 'smm/hayleys-film' ), // Hayleys brand film
	'tv-commercials': clip( 'social/video-formats' ), // commercials, brand films and corporate videos
	'reels-tiktok': clip( 'smm/ritzbury-reel-1' ) // Ritzbury product reel
};

/*
 * A muted looping film that plays only while it is on screen, so the page never runs
 * more than the few that are in view. Falls back to its poster under reduced motion.
 */
function LoopVideo( { src, poster, label } ) {
	const ref = useRef( null );
	useEffect( () => {
		const v = ref.current;
		if ( reduced || ! v ) {
			return undefined;
		}
		const io = new IntersectionObserver( ( [ e ] ) => {
			if ( e.isIntersecting ) {
				v.play().catch( () => {} );
			} else {
				v.pause();
			}
		}, { threshold: 0.15 } );
		io.observe( v );
		return () => io.disconnect();
	}, [] );
	return <video ref={ ref } src={ src } poster={ poster } muted loop playsInline preload="metadata" aria-label={ label } />;
}

/* Five of the flagship projects; each card opens its post. */
const PROJECTS = projects.slice( 0, 5 );

const half = Math.ceil( posts.length / 2 );
const ROWS = [
	{ items: posts.slice( 0, half ), wide: ( i ) => i % 4 === 1 },
	{ items: posts.slice( half ), wide: ( i ) => i % 5 === 2 }
];

function Eyebrow( { n, children, id } ) {
	return <h2 className="fgEyebrow" id={ id }>[{ n }]<span aria-hidden="true">&nbsp;&nbsp;&nbsp;</span> { children }</h2>;
}

function Hero() {
	return (
		<section className="fgHero" data-theme="dark" aria-labelledby="fgHeroTitle">
			<img className="fgHero_bg" src="/assets/img/figma-hero.png" alt="" />
			<div className="fgHero_scrim" aria-hidden="true"></div>
			<div className="fgHero_inner">
				<h1 className="fgHero_title" id="fgHeroTitle">
					<span>We create content</span>
					<span className="fgHero_accent">That <WordRotator words={ HERO_VERBS } className="fgHero_rotator" /></span>
					<span>brands</span>
				</h1>
				<p className="fgHero_sub">Colombo’s premier digital marketing, social media campaigns, and content creation agency.</p>
				<TLink to="/contact/" className="fgBtn fgBtn--solid">Ready to grow</TLink>
			</div>
		</section>
	);
}

function LogoBand() {
	const row = ( copy ) => LOGOS.map( ( [ file, name ] ) => (
		<img key={ ( copy ? 'b' : 'a' ) + file } src={ `/assets/logos/${ file }` } alt={ copy ? '' : name }
			aria-hidden={ copy || undefined } loading="lazy" decoding="async" />
	) );
	return (
		<section className="fgLogos" data-theme="light" aria-label="Clients">
			<div className="fgLogos_track">{ row( false ) }{ row( true ) }</div>
		</section>
	);
}

const WHO = 'Visual Studios Plus is a Colombo based agency providing in-house branding, web development, and digital marketing for FMCG, food & beverage, fashion, and luxury hospitality brands driven by measurable commercial results.';

/* The statement lights up word by word as it scrolls through; the figures count up. */
function WhoWeAre() {
	return (
		<section className="fgWho" data-theme="light" aria-label="Who we are">
			<p className="fgWho_text" aria-label={ WHO }>
				{ WHO.split( ' ' ).map( ( w, i ) => <span className="fgWord" aria-hidden="true" key={ i }>{ w }</span> ) }
			</p>
			<dl className="fgStats">
				{ STATS.map( ( [ num, label ] ) => {
					const [ , value, unit ] = num.match( /^(\d+)(.*)$/ );
					return (
						<div className="fgStat" key={ label }>
							<dt aria-label={ num }><span className="fgCount" data-to={ value } aria-hidden="true">{ value }</span><span aria-hidden="true">{ unit }</span></dt>
							<dd>{ label }</dd>
						</div>
					);
				} ) }
			</dl>
		</section>
	);
}

/*
 * Our Services as one pinned stage: scrolling hands from one service to the next, the
 * outgoing one lifting away while the incoming one rises in and its picture unmasks.
 */
function Services() {
	const section = useRef( null );
	const [ active, setActive ] = useState( 0 );

	useLayoutEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const ctx = gsap.context( () => {
			const items = gsap.utils.toArray( '.fgSvc' );
			const parts = ( el ) => el.querySelectorAll( '.fgServices_name, .fgServices_text, .fgSvc_copy .fgBtn' );
			gsap.set( items.slice( 1 ), { autoAlpha: 0 } );
			// The first service rests in full before the first hand-off starts.
			const HOLD = 0.5;

			const tl = gsap.timeline( {
				scrollTrigger: {
					trigger: section.current,
					start: 'top top',
					end: () => `+=${ ( items.length - 1 + HOLD ) * window.innerHeight * 0.75 }`,
					pin: true,
					scrub: 0.6,
					invalidateOnRefresh: true
				},
				// Follows the eased playhead, not the scroll: hand-off i sits at time HOLD + i - 1 and swaps at about + 0.47.
				onUpdate: () => setActive( Math.max( 0, Math.min( items.length - 1, Math.floor( tl.time() - HOLD + 0.53 ) ) ) )
			} );
			tl.to( {}, { duration: HOLD }, 0 );
			for ( let i = 1; i < items.length; i++ ) {
				const out = items[ i - 1 ];
				const inn = items[ i ];
				const at = HOLD + i - 1;
				tl.to( parts( out ), { y: -40, opacity: 0, stagger: 0.05, duration: 0.4, ease: 'power2.in' }, at )
					.to( out.querySelector( '.fgServices_media' ), { scale: 0.9, opacity: 0, duration: 0.45, ease: 'power2.in' }, at )
					.set( out, { autoAlpha: 0 }, at + 0.5 )
					.set( inn, { autoAlpha: 1 }, at + 0.45 )
					.fromTo( parts( inn ), { y: 50, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power3.out' }, at + 0.45 )
					.fromTo( inn.querySelector( '.fgServices_media' ),
						{ clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.out' }, at + 0.45 )
					.fromTo( inn.querySelector( '.fgServices_media video' ), { scale: 1.2 }, { scale: 1, duration: 0.55, ease: 'power3.out' }, at + 0.45 );
			}
			// A beat at the end so the last service rests before the section moves on.
			tl.to( {}, { duration: 0.4 } );

			// Entrance, before the pin takes over: heading and counter, then the first service,
			// then its picture unmasking. It moves the stage around the panels and the first
			// picture's mask, never a property the pinned timeline above hands off.
			const first = items[ 0 ];
			gsap.timeline( { scrollTrigger: { trigger: section.current, start: 'top 75%', once: true } } )
				.from( '.fgServices_head > *', { y: 50, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1 } )
				.from( '.fgServices_stage', { y: 70, opacity: 0, duration: 1, ease: 'expo.out' }, 0.2 )
				.from( first.querySelector( '.fgServices_media' ), { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.3 )
				.from( first.querySelector( '.fgServices_media video' ), { scale: 1.25, duration: 1.5, ease: 'expo.out' }, 0.4 );
		}, section );
		return () => ctx.revert();
	}, [] );

	return (
		<section className="fgServices" data-theme="dark" id="services" aria-labelledby="fgServicesTitle" ref={ section }>
			<div className="fgServices_head">
				<Eyebrow n={ 1 } id="fgServicesTitle">Our Services</Eyebrow>
				<p className="fgServices_count" aria-hidden="true">
					<span>{ String( active + 1 ).padStart( 2, '0' ) }</span> / { String( SERVICES.length ).padStart( 2, '0' ) }
				</p>
			</div>
			<div className="fgServices_stage">
				{ SERVICES.map( ( [ slug, name, text, link ] ) => (
					<article className="fgSvc" key={ slug } aria-labelledby={ `fg-${ slug }` }>
						<div className="fgSvc_copy">
							<h3 className="fgServices_name" id={ `fg-${ slug }` }>{ name }</h3>
							<p className="fgServices_text">{ text }</p>
							<TLink to={ link } className="fgBtn fgBtn--line" aria-label={ `See more: ${ name }` }>See more</TLink>
						</div>
						<TLink to={ link } className="fgServices_media" tabIndex={ -1 } aria-hidden="true">
							<LoopVideo { ...SERVICE_VIDEO[ slug ] } />
						</TLink>
					</article>
				) ) }
			</div>
		</section>
	);
}

/*
 * The section pins while you scroll; each project rises from the bottom onto the front of
 * the stack and the ones before it step back into the frame's three-deep fan.
 */
function Projects() {
	const section = useRef( null );

	useLayoutEffect( () => {
		const cards = gsap.utils.toArray( '.fgCard', section.current );
		// Depth 0 is the front card; 1 and 2 match the frame's cards behind it, deeper ones hide.
		// Offsets are in design px, scaled to the front card's rendered width (1098 in the frame).
		const slot = ( d ) => {
			const k = cards[ 0 ].offsetWidth / 1098;
			const s = [ 1, 958 / 1098, 866 / 1098 ][ Math.min( d, 2 ) ];
			const y = [ 0, -65, -114 ][ Math.min( d, 2 ) ] * k;
			const x = d ? -18 * k : 0;
			return { scale: s, y, x, opacity: d > 2 ? 0 : 1 };
		};
		const ctx = gsap.context( () => {
			cards.forEach( ( c, i ) => gsap.set( c, slot( cards.length - 1 - i ) ) );
			if ( reduced ) {
				return;
			}
			cards.forEach( ( c, i ) => gsap.set( c, i ? { y: () => window.innerHeight, scale: 1, x: 0, opacity: 1 } : slot( 0 ) ) );
			const tl = gsap.timeline( {
				defaults: { ease: 'none' },
				scrollTrigger: {
					trigger: section.current,
					start: 'top top',
					end: () => `+=${ ( cards.length - 1 ) * window.innerHeight * 0.8 }`,
					pin: true,
					scrub: 0.6,
					invalidateOnRefresh: true
				}
			} );
			for ( let step = 1; step < cards.length; step++ ) {
				tl.to( cards[ step ], { ...slot( 0 ), duration: 1, ease: 'power2.out' }, step - 1 );
				for ( let j = 0; j < step; j++ ) {
					tl.to( cards[ j ], { ...slot( step - j ), duration: 1, ease: 'power2.out' }, step - 1 );
				}
			}
			// See more rises in only once the last card has landed.
			tl.fromTo( '.fgProjects_more', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, cards.length - 1.1 );
		}, section );
		return () => ctx.revert();
	}, [] );

	return (
		<section className="fgProjects" data-theme="light" aria-labelledby="fgProjectsTitle" ref={ section }>
			<Eyebrow n={ 2 } id="fgProjectsTitle">Projects</Eyebrow>
			<div className="fgStack">
				{ PROJECTS.map( ( p, i ) => (
					<TLink key={ p.id } to={ p.url } className="fgCard" style={ { zIndex: i + 1 } }>
						{ p.video
							? <LoopVideo src={ p.video } poster={ p.poster } label={ `${ p.title } — ${ p.format }` } />
							: <img src={ p.poster } alt={ `${ p.title } — ${ p.format }` } decoding="async" /> }
						<span className="fgCard_label">{ p.title }<small>{ p.format }</small></span>
					</TLink>
				) ) }
			</div>
			<TLink to="/work/" className="fgBtn fgBtn--line fgProjects_more">See more</TLink>
		</section>
	);
}

function Portfolio() {
	const section = useRef( null );
	useFlowRows( section, '.fgRow' );

	const card = ( p, i, wide, copy ) => (
		<TLink key={ ( copy ? 'b' : 'a' ) + p.id } to={ p.url } className={ `fgShot${ wide ? ' fgShot--wide' : '' }` }
			aria-hidden={ copy || undefined } tabIndex={ copy ? -1 : undefined }>
			<img src={ p.src } alt={ copy ? '' : `Visual Studios Plus Instagram ${ p.kind.toLowerCase() }` } loading="lazy" decoding="async" />
		</TLink>
	);

	return (
		<section className="fgPortfolio" data-theme="dark" aria-labelledby="fgPortfolioTitle" ref={ section }>
			<div className="fgPortfolio_head">
				<Eyebrow n={ 3 } id="fgPortfolioTitle">portfolio</Eyebrow>
				<TLink to="/photography/" className="fgBtn fgBtn--line">See more</TLink>
			</div>
			{ ROWS.map( ( { items, wide }, r ) => (
				<div className="fgRow_track" key={ r }>
					<div className="fgRow">
						{ items.map( ( p, i ) => card( p, i, wide( i ), false ) ) }
						{ items.map( ( p, i ) => card( p, i, wide( i ), true ) ) }
					</div>
				</div>
			) ) }
		</section>
	);
}

/*
 * Entrances for the whole page: the hero builds on load, the statement lights up word by
 * word, figures count up, and headings, logos and rows rise into place.
 */
function useHomeMotion( root ) {
	useLayoutEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const ctx = gsap.context( () => {
			gsap.timeline( { defaults: { ease: 'expo.out' } } )
				.from( '.fgHero_bg', { scale: 1.12, duration: 2.2 } )
				.from( '.fgHero_title > span', { yPercent: 70, opacity: 0, duration: 1.2, stagger: 0.12 }, 0.2 )
				.from( '.fgHero_sub', { y: 24, opacity: 0, duration: 1 }, 0.65 )
				.from( '.fgHero_inner .fgBtn', { y: 24, opacity: 0, scale: 0.9, duration: 1 }, 0.8 );

			gsap.from( '.fgLogos_track img', {
				y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.06,
				scrollTrigger: { trigger: '.fgLogos', start: 'top 95%', once: true }
			} );

			// What we do locks in place once the logos have left the screen: the words rise out of
			// a faint blur in a wave, the figures come up and count, then it all lifts away.
			// Pinned here, after the child sections' pins were made, so it refreshes first.
			const who = gsap.timeline( {
				defaults: { ease: 'power2.out' },
				scrollTrigger: { trigger: '.fgWho', start: 'top top', end: '+=180%', pin: true, scrub: 0.8, refreshPriority: 1 }
			} );
			who.fromTo( '.fgWord', { opacity: 0.08, y: 28, filter: 'blur(6px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.08 }, 0 );
			const statsAt = who.duration() - 0.2;
			who.from( '.fgStat', { y: 40, opacity: 0, duration: 0.6, stagger: 0.15 }, statsAt );
			gsap.utils.toArray( '.fgCount' ).forEach( ( count, i ) => {
				const obj = { v: 0 };
				who.to( obj, { v: Number( count.dataset.to ), duration: 0.8, onUpdate: () => { count.textContent = Math.round( obj.v ); } }, statsAt + i * 0.15 );
			} );
			who.to( {}, { duration: 0.6 } )
				.to( '.fgWho_text, .fgStats', { y: -90, opacity: 0, scale: 0.96, duration: 0.8, ease: 'power1.in', stagger: 0.15 } );
			ScrollTrigger.refresh();

			gsap.utils.toArray( '.fgProjects .fgEyebrow, .fgPortfolio_head' ).forEach( ( el ) => {
				gsap.from( el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } } );
			} );

			gsap.utils.toArray( '.fgRow_track' ).forEach( ( row, i ) => {
				gsap.from( row, {
					x: i % 2 ? -120 : 120, opacity: 0, duration: 1.4, ease: 'expo.out',
					scrollTrigger: { trigger: row, start: 'top 95%', once: true }
				} );
			} );

		}, root );
		return () => ctx.revert();
	}, [ root ] );
}

export default function Home() {
	const root = useRef( null );
	useHomeMotion( root );

	usePage( {
		page: 'home',
		inner: false,
		title: 'Visual Studios Plus — The Digital Creative Marketing Agency',
		description: 'Visual Studios Plus shape how your brand looks, how it lives online, and how it grows. We partner with ambitious brands to command attention and deliver verified commercial growth.'
	} );

	return (
		<div className="fgHome" ref={ root }>
			<Hero />
			<LogoBand />
			<WhoWeAre />
			<Services />
			<Projects />
			<Portfolio />
			<FigmaCta n={ 4 } />
		</div>
	);
}
