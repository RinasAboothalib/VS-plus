import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import data from '../data/site.js';
import { gsap, reduced, startScroll, stopScroll } from '../lib/motion.js';
import TLink from './TLink.jsx';
import { SocialIcons } from './SocialIcon.jsx';

/* Top bar from the Figma home frame: the wordmark on the left, the site's pages on the right. */
const LINKS = [
	[ '/work/', 'Work', 'work' ],
	[ 'services' ],
	[ '/photography/', 'Photography', 'photography' ],
	[ '/about/', 'About', 'about' ],
	[ '/contact/', 'Contact', 'contact' ]
];

/*
 * The Services menu: the two services with pages of their own, then every service on the
 * Services page (by its anchor there), then the page itself. Social media is left out of
 * the anchors because its own page comes first.
 */
const SERVICE_PAGES = [
	[ '/social-media-marketing/', 'Social Media Marketing' ],
	[ '/web-development/', 'Web Development' ]
];
const SERVICE_ANCHORS = data.services
	.filter( ( [ slug ] ) => slug !== 'social-media' )
	.map( ( [ slug, name ] ) => [ `/services/#${ slug }`, name ] );
const SERVICE_PAGE_KEYS = [ 'services', 'social-media-marketing', 'web-development' ];

export default function TopNav() {
	const location = useLocation();
	const page = location.pathname.split( '/' )[ 1 ] || 'home';
	const [ open, setOpen ] = useState( false );
	const [ svcOpen, setSvcOpen ] = useState( false );
	const [ svcMobile, setSvcMobile ] = useState( false );
	const panel = useRef( null );
	const toggle = useRef( null );
	const svc = useRef( null );
	const svcPanel = useRef( null );
	const hoverTimer = useRef( 0 );
	const { email, phones, socials } = data.site;
	const onServices = SERVICE_PAGE_KEYS.includes( page );

	// The bar reads the section under it: black over white sections, yellow over black ones.
	// Sections that declare data-theme say so; on other pages the background's brightness decides.
	useEffect( () => {
		let raf = 0;
		const lightBehind = ( el ) => {
			for ( let n = el; n && n !== document.documentElement; n = n.parentElement ) {
				if ( n.dataset.theme ) {
					return n.dataset.theme === 'light';
				}
				const m = getComputedStyle( n ).backgroundColor.match( /[\d.]+/g );
				if ( m && ( m[ 3 ] === undefined || Number( m[ 3 ] ) > 0.5 ) ) {
					return 0.2126 * m[ 0 ] + 0.7152 * m[ 1 ] + 0.0722 * m[ 2 ] > 150;
				}
			}
			return false;
		};
		const check = () => {
			raf = 0;
			const under = document.elementsFromPoint( window.innerWidth / 2, 32 ).find( ( el ) => ! el.closest( '.topNav' ) );
			document.body.classList.toggle( 'nav-light', !! under && lightBehind( under ) );
		};
		const queue = () => {
			if ( ! raf ) {
				raf = requestAnimationFrame( check );
			}
		};
		check();
		const settle = setTimeout( check, 400 );
		window.addEventListener( 'scroll', queue, { passive: true } );
		window.addEventListener( 'resize', queue );
		return () => {
			clearTimeout( settle );
			cancelAnimationFrame( raf );
			window.removeEventListener( 'scroll', queue );
			window.removeEventListener( 'resize', queue );
			document.body.classList.remove( 'nav-light' );
		};
	}, [ location.pathname ] );

	// A new page (or a jump within one) closes both menus.
	useEffect( () => {
		setOpen( false );
		setSvcOpen( false );
	}, [ location.pathname, location.hash ] );

	// Services dropdown: drops in with its links rising in turn; Escape or a click outside closes it.
	useLayoutEffect( () => {
		if ( ! svcOpen ) {
			return undefined;
		}
		const onKey = ( e ) => {
			if ( e.key === 'Escape' ) {
				setSvcOpen( false );
				svc.current.querySelector( 'button' ).focus();
			}
		};
		const onDown = ( e ) => {
			if ( ! svc.current.contains( e.target ) ) {
				setSvcOpen( false );
			}
		};
		document.addEventListener( 'keydown', onKey );
		document.addEventListener( 'pointerdown', onDown );
		const ctx = reduced ? null : gsap.context( () => {
			gsap.timeline()
				.from( svcPanel.current, { y: -12, opacity: 0, duration: 0.35, ease: 'power3.out' } )
				.from( '.topSvc_panel li', { y: 14, opacity: 0, duration: 0.4, ease: 'power3.out', stagger: 0.025 }, 0.08 );
		}, svc );
		return () => {
			document.removeEventListener( 'keydown', onKey );
			document.removeEventListener( 'pointerdown', onDown );
			ctx?.revert();
		};
	}, [ svcOpen ] );

	// Hover opens it with a short grace period on the way out, so the pointer can reach the panel.
	const hover = ( on ) => {
		clearTimeout( hoverTimer.current );
		if ( on ) {
			setSvcOpen( true );
		} else {
			hoverTimer.current = setTimeout( () => setSvcOpen( false ), 180 );
		}
	};

	// Phone menu: the page stops scrolling, the panel drops in and its links rise one by one.
	useLayoutEffect( () => {
		document.body.classList.toggle( 'menu-open', open );
		if ( ! open ) {
			setSvcMobile( false );
			startScroll();
			return undefined;
		}
		stopScroll();
		const onKey = ( e ) => {
			if ( e.key === 'Escape' ) {
				setOpen( false );
				toggle.current.focus();
			}
		};
		document.addEventListener( 'keydown', onKey );
		panel.current.querySelector( 'a' ).focus( { preventScroll: true } );
		const ctx = reduced ? null : gsap.context( () => {
			gsap.timeline()
				.from( panel.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.6, ease: 'expo.inOut' } )
				.from( '.topMenu_links > li', { y: 40, opacity: 0, duration: 0.6, ease: 'expo.out', stagger: 0.05 }, 0.3 )
				.from( '.topMenu_foot > *', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06 }, 0.55 );
		}, panel );
		return () => {
			document.removeEventListener( 'keydown', onKey );
			ctx?.revert();
		};
	}, [ open ] );

	const serviceList = ( className ) => (
		<ul className={ className }>
			{ SERVICE_PAGES.map( ( [ to, label ] ) => (
				<li key={ to } className="is-page">
					<TLink to={ to } aria-current={ location.pathname === to ? 'page' : undefined }>{ label }</TLink>
				</li>
			) ) }
			{ SERVICE_ANCHORS.map( ( [ to, label ] ) => (
				<li key={ to }><TLink to={ to }>{ label }</TLink></li>
			) ) }
			<li className="is-all"><TLink to="/services/">All services →</TLink></li>
		</ul>
	);

	return (
		<header className="topNav">
			<TLink to="/" className="topNav_brand" aria-label="Visual Studios Plus — home">
				<img className="topNav_mark" src="/assets/img/vsplus-logo.svg" width="211" height="34" alt="" />
			</TLink>
			<nav className="topNav_links" aria-label="Main">
				{ LINKS.map( ( [ to, label, key ] ) => ( to === 'services' ? (
					<div className={ `topSvc${ svcOpen ? ' is-open' : '' }` } key="services" ref={ svc }
						onPointerEnter={ ( e ) => e.pointerType === 'mouse' && hover( true ) }
						onPointerLeave={ ( e ) => e.pointerType === 'mouse' && hover( false ) }>
						<button type="button" className="topSvc_toggle" aria-expanded={ svcOpen } aria-controls="topSvcPanel"
							aria-current={ onServices ? 'page' : undefined } onClick={ () => setSvcOpen( ( o ) => ! o ) }>
							Services<span className="topSvc_caret" aria-hidden="true"></span>
						</button>
						<div className="topSvc_panel" id="topSvcPanel" data-theme="dark" ref={ svcPanel } hidden={ ! svcOpen }>
							{ serviceList( 'topSvc_list' ) }
						</div>
					</div>
				) : (
					<TLink key={ key } to={ to } aria-current={ page === key ? 'page' : undefined }>{ label }</TLink>
				) ) ) }
			</nav>
			<button type="button" className={ `topNav_burger${ open ? ' is-open' : '' }` } ref={ toggle }
				aria-label={ open ? 'Close menu' : 'Open menu' } aria-expanded={ open } aria-controls="topMenu"
				onClick={ () => setOpen( ( o ) => ! o ) }>
				<span></span><span></span>
			</button>
			<div className="topMenu" id="topMenu" ref={ panel } hidden={ ! open }>
				<nav aria-label="Menu">
					<ul className="topMenu_links">
						{ LINKS.map( ( [ to, label, key ] ) => ( to === 'services' ? (
							<li key="services" className="topMenu_svc">
								<button type="button" aria-expanded={ svcMobile } aria-controls="topMenuSvc"
									className={ onServices ? 'is-current' : undefined } onClick={ () => setSvcMobile( ( o ) => ! o ) }>
									Services<span className="topSvc_caret" aria-hidden="true"></span>
								</button>
								<div id="topMenuSvc" hidden={ ! svcMobile }>{ serviceList( 'topMenu_sub' ) }</div>
							</li>
						) : (
							<li key={ key }>
								<TLink to={ to } aria-current={ page === key ? 'page' : undefined }>{ label }</TLink>
							</li>
						) ) ) }
					</ul>
				</nav>
				<div className="topMenu_foot">
					<a href={ `mailto:${ email }` }>{ email }</a>
					<a href={ `tel:${ phones[ 0 ].replace( /\s+/g, '' ) }` }>{ phones[ 0 ] }</a>
					<SocialIcons items={ socials } className="fgFooter_social" size={ 18 } />
				</div>
			</div>
		</header>
	);
}
