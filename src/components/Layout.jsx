import { useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Nav from './Nav.jsx';
import BackToTop from './BackToTop.jsx';
import Footer from './Footer.jsx';
import SheetDock from './SheetDock.jsx';
import TLink from './TLink.jsx';
import { usePageMeta } from '../context/PageContext.jsx';
import { useTransition } from '../context/TransitionContext.jsx';
import { gsap, ScrollTrigger, scrollToTarget, startLenis } from '../lib/motion.js';

export default function Layout() {
	const location = useLocation();
	const { page, inner } = usePageMeta();
	const { reveal } = useTransition();
	const bar = useRef( null );
	const first = useRef( true );

	useEffect( () => {
		startLenis();
		if ( 'scrollRestoration' in history ) {
			history.scrollRestoration = 'manual';
		}
	}, [] );

	// Body chrome: home keeps the scrim and hero-driven top bar; inner pages blend the logo.
	useLayoutEffect( () => {
		document.body.className = inner ? 'inner' : 'is-home';
		document.body.setAttribute( 'data-page', page );
	}, [ inner, page ] );

	// Route change: land at the top (or the #hash), uncover, and re-measure triggers.
	useLayoutEffect( () => {
		const hash = location.hash ? decodeURIComponent( location.hash.slice( 1 ) ) : '';
		scrollToTarget( 0, { immediate: true } );
		if ( ! first.current ) {
			reveal();
		}
		first.current = false;
		const t = setTimeout( () => {
			ScrollTrigger.refresh();
			const el = hash && document.getElementById( hash );
			if ( el ) {
				scrollToTarget( el, { offset: -70, immediate: true } );
			}
		}, 120 );
		return () => clearTimeout( t );
		// Only a new path resets the scroll; query changes (e.g. gallery filters) keep your place.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ location.pathname, reveal ] );

	// Inner pages: a dark bar slides in behind the logo once you scroll.
	useEffect( () => {
		if ( ! inner ) {
			return undefined;
		}
		let shown = false;
		const check = () => {
			const want = window.scrollY > 60;
			if ( want !== shown ) {
				shown = want;
				document.body.classList.toggle( 'bar-on', want );
				gsap.to( bar.current, { yPercent: want ? 100 : 0, duration: 0.5, ease: 'power3.out' } );
			}
		};
		window.addEventListener( 'scroll', check, { passive: true } );
		check();
		return () => {
			window.removeEventListener( 'scroll', check );
			gsap.set( bar.current, { yPercent: 0 } );
		};
	}, [ inner, location.pathname ] );

	return (
		<>
			<a className="skipLink" href="#main">Skip to content</a>
			<Nav />
			<BackToTop />
			<main id="main" className="page_content_wrap">
				<div className="siteLogo_bg" ref={ bar }></div>
				<div className="siteLogo">
					<TLink to="/"><img src="/assets/img/VSP-Square-logo.png" alt="Visual Studios Plus — home" /></TLink>
				</div>
				<div className="siteText"><p>Creative Content Agency, Colombo</p></div>
				<Outlet />
				<Footer />
			</main>
			<SheetDock />
		</>
	);
}
