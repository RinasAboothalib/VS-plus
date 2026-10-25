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

	// Late-loading images (or anything else) that change the page's height move every section
	// below them; re-measure the scroll triggers once the height settles, or their entrances
	// fire early, off screen.
	useEffect( () => {
		const main = document.getElementById( 'main' );
		let last = main.offsetHeight;
		let t = 0;
		const ro = new ResizeObserver( () => {
			const h = main.offsetHeight;
			if ( Math.abs( h - last ) < 2 ) {
				return;
			}
			last = h;
			clearTimeout( t );
			t = setTimeout( () => ScrollTrigger.refresh(), 200 );
		} );
		ro.observe( main );
		return () => {
			ro.disconnect();
			clearTimeout( t );
		};
	}, [] );

	// The header pill slides away while you scroll down and returns as soon as you scroll up.
	useEffect( () => {
		const body = document.body;
		let last = window.scrollY;
		let hidden = false;
		const check = () => {
			const y = window.scrollY;
			const dy = y - last;
			if ( Math.abs( dy ) < 6 ) {
				return;
			}
			const want = dy > 0 && y > 120;
			if ( want !== hidden ) {
				hidden = want;
				body.classList.toggle( 'nav-hidden', want );
			}
			last = y;
		};
		window.addEventListener( 'scroll', check, { passive: true } );
		return () => {
			window.removeEventListener( 'scroll', check );
			body.classList.remove( 'nav-hidden' );
		};
	}, [ location.pathname ] );

	return (
		<>
			<a className="skipLink" href="#main">Skip to content</a>
			<Nav />
			<BackToTop />
			<main id="main" className="page_content_wrap">
				<header className="siteHeader">
					<div className="siteHeader_glass" aria-hidden="true"></div>
					<div className="siteHeader_inner">
						<TLink to="/" className="siteBrand" aria-label="Visual Studios Plus — home">
							<span className="siteBrand_mark" aria-hidden="true"></span>
						</TLink>
						<p className="siteBrand_text">Visual Studios+ · Creative Agency</p>
					</div>
				</header>
				<Outlet />
				<Footer />
			</main>
			<SheetDock />
		</>
	);
}
