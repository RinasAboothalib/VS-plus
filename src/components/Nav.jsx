import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import data from '../data/site.js';
import { gsap, reduced, startScroll, stopScroll } from '../lib/motion.js';
import { useTransition } from '../context/TransitionContext.jsx';
import { SocialIcons } from './SocialIcon.jsx';

const LINKS = [
	[ '/work/', 'Work', 'work' ],
	[ '/photography/', 'Photography', 'photography' ],
	[ '/services/', 'Services', 'services' ],
	[ '/about/', 'About', 'about' ],
	[ '/contact/', 'Contact', 'contact' ]
];

/* Paths are computed once from the viewport, as the bulge and backdrop are drawn in px. */
function buildPaths() {
	const H = window.innerHeight > 600 ? 600 : window.innerHeight;
	const W = window.innerWidth;
	const VH = window.innerHeight;
	return {
		H, W, VH,
		bulgeIn: `M200 0 C120 ${ H / 2 } 120 ${ H / 2 } 200 ${ H } Z`,
		bulgeOut: `M200 0 C${ H / 2 } ${ H / 2 } ${ H / 2 } ${ H / 2 } 200 ${ H } Z`,
		gone: `M${ W } 0 L ${ W } ${ VH } L ${ W } ${ VH } C ${ W } ${ VH * 0.85 } ${ W } ${ VH * 0.7 } ${ W } ${ VH * 0.6 } C ${ W } ${ VH * 0.4 } ${ W } ${ VH * 0.3 } ${ W } ${ VH * 0.15 } Q ${ W } ${ VH * 0.05 } ${ W } 0 Z`,
		wave: `M${ W } 0 L ${ W } ${ VH } L ${ W * 0.5 } ${ VH } C ${ W * 0.45 } ${ VH * 0.85 } ${ W * 0.75 } ${ VH * 0.7 } ${ W * 0.4 } ${ VH * 0.6 } C -${ W * 0.15 } ${ VH * 0.4 } ${ W * 0.65 } ${ VH * 0.3 } ${ W * 0.45 } ${ VH * 0.15 } Q ${ W * 0.35 } ${ VH * 0.05 } ${ W * 0.5 } 0 Z`,
		full: `M${ W } 0 L ${ W } ${ VH } L 0 ${ VH } C 0 ${ VH * 0.85 } 0 ${ VH * 0.7 } 0 ${ VH * 0.6 } C 0 ${ VH * 0.4 } 0 ${ VH * 0.3 } 0 ${ VH * 0.15 } Q 0 ${ VH * 0.05 } 0 0 Z`
	};
}

function morph( from, to ) {
	return {
		duration: 0.5,
		keyframes: {
			'0%': { attr: { d: from }, ease: 'none' },
			'100%': { attr: { d: to }, ease: 'none' },
			ease: 'circ.inOut'
		}
	};
}

export default function Nav() {
	const location = useLocation();
	const navigate = useNavigate();
	const { register } = useTransition();
	const [ open, setOpen ] = useState( false );
	const api = useRef( {} );
	const refs = {
		bulge: useRef( null ), ham: useRef( null ), close: useRef( null ),
		openSvg: useRef( null ), openPath: useRef( null ),
		closeSvg: useRef( null ), closePath: useRef( null ),
		backdrop: useRef( null ), backdropPath: useRef( null ),
		menu: useRef( null ), items: useRef( null )
	};

	const page = location.pathname.split( '/' )[ 1 ] || 'home';

	useEffect( () => {
		const P = buildPaths();
		const r = Object.fromEntries( Object.entries( refs ).map( ( [ k, v ] ) => [ k, v.current ] ) );
		let menuOpen = false;
		let lockBulge = true;
		let covered = false;
		const bulgeAnchor = window.innerHeight / 2;
		const isMobile = () => window.innerWidth < 1240;

		[ r.openSvg, r.closeSvg ].forEach( ( svg ) => {
			svg.setAttribute( 'viewBox', `0 0 200 ${ P.H }` );
			svg.setAttribute( 'height', P.H );
		} );
		r.openPath.setAttribute( 'd', P.bulgeOut );
		r.closePath.setAttribute( 'd', P.bulgeIn );
		r.backdrop.setAttribute( 'viewBox', `0 0 ${ P.W } ${ P.VH }` );
		r.backdropPath.setAttribute( 'd', P.full );

		const ctx = gsap.context( () => {} );
		let closeSequence;
		let showMenu;

		ctx.add( () => {
			const bulgeOpen = gsap.timeline( { paused: true } ).to( r.openPath, morph( P.bulgeOut, P.bulgeIn ) );
			const bulgeClose = gsap.to( r.closePath, { paused: true, ...morph( P.bulgeIn, P.bulgeOut ) } );
			const showHam = gsap.to( r.ham, { duration: 0.5, paused: true, x: 0, ease: 'circ.inOut' } );
			const showClose = gsap.to( r.close, { duration: 0.5, paused: true, x: 0, ease: 'circ.inOut' } );

			const backdropTl = gsap.timeline( { paused: true } );
			backdropTl.to( r.backdropPath, {
				duration: 1,
				keyframes: {
					'0%': { attr: { d: P.full }, ease: 'none' },
					'75%': { attr: { d: P.wave }, ease: 'none' },
					'100%': { attr: { d: P.gone }, ease: 'none' },
					ease: 'circ.inOut'
				}
			} ).to( r.backdrop, {
				duration: 1,
				transformOrigin: '100% 50%',
				keyframes: {
					'15%': { scale: 1, ease: 'none' },
					'40%': { scale: 1.15, ease: 'none' },
					'100%': { scale: 1, ease: 'none' },
					ease: 'linear'
				}
			}, '<0.15' );

			showMenu = gsap.timeline( { paused: true } );
			showMenu.to( r.menu, { x: 0, duration: 1, opacity: 1, delay: 0.5, ease: 'circ.inOut' } )
				.from( r.items.children, { x: 100, duration: 0.3, opacity: 0, ease: 'circ.inOut', stagger: 0.05 }, '<0.65' );

			closeSequence = gsap.timeline( { paused: true } );
			closeSequence.add( bulgeClose.play() )
				.add( showClose.reverse(), '<' )
				.add( backdropTl.play(), '<' )
				.add( showHam.play(), '-=0.5' )
				.add( bulgeOpen.play(), '<' );
		} );

		function showBulge( show ) {
			gsap.timeline()
				.to( r.openPath, { attr: { d: show ? P.bulgeIn : P.bulgeOut }, ease: 'none', duration: 0.3 } )
				.to( r.ham, { x: isMobile() || show ? 0 : 150, ease: 'none', duration: 0.3 }, '<' );
		}

		function onMove( e ) {
			if ( lockBulge || isMobile() ) {
				return;
			}
			if ( e.clientX > window.innerWidth - 200 ) {
				gsap.to( r.bulge, { y: e.clientY - bulgeAnchor, ease: 'power3.out', duration: 0.75 } );
				showBulge( true );
			} else {
				showBulge( false );
			}
		}

		function onScroll() {
			if ( menuOpen ) {
				return;
			}
			const y = window.scrollY;
			if ( isMobile() ) {
				lockBulge = y < 10;
				gsap.set( r.ham, { x: 0 } );
				return;
			}
			if ( y >= 10 ) {
				if ( lockBulge ) {
					lockBulge = false;
					showBulge( false );
				}
			} else if ( ! lockBulge ) {
				lockBulge = true;
				gsap.set( r.bulge, { y: 0 } );
				showBulge( true );
			}
		}

		function setMenu( next ) {
			menuOpen = next;
			setOpen( next );
			document.body.classList.toggle( 'menu-open', next );
			if ( next ) {
				lockBulge = true;
				closeSequence.reverse();
				showMenu.play();
				stopScroll();
			} else {
				lockBulge = window.scrollY < 10;
				closeSequence.play();
				showMenu.reverse();
				startScroll();
				if ( ! lockBulge && ! isMobile() ) {
					gsap.delayedCall( 1, () => showBulge( false ) );
				}
			}
			if ( reduced ) {
				closeSequence.progress( next ? 0 : 1 );
				showMenu.progress( next ? 1 : 0 );
			}
			const target = next ? r.menu.querySelector( '.menuItems a' ) : r.ham;
			if ( target ) {
				target.focus( { preventScroll: true } );
			}
		}

		api.current = { toggle: () => setMenu( ! menuOpen ), close: () => menuOpen && setMenu( false ) };

		const onKey = ( e ) => {
			if ( menuOpen && e.key === 'Escape' ) {
				setMenu( false );
			}
		};

		// Transitions between routes reuse the backdrop.
		register( {
			cover( done ) {
				covered = true;
				gsap.to( r.backdropPath, {
					duration: 0.6,
					overwrite: 'auto',
					ease: 'circ.inOut',
					keyframes: [ { attr: { d: P.wave } }, { attr: { d: P.full } } ],
					onComplete: done
				} );
			},
			reveal() {
				if ( ! covered ) {
					return;
				}
				covered = false;
				gsap.to( r.backdropPath, {
					duration: 0.9,
					overwrite: 'auto',
					ease: 'circ.inOut',
					keyframes: [ { attr: { d: P.wave } }, { attr: { d: P.gone } } ]
				} );
			}
		} );

		document.addEventListener( 'mousemove', onMove );
		document.addEventListener( 'keydown', onKey );
		window.addEventListener( 'scroll', onScroll, { passive: true } );

		// First paint: the backdrop starts full-screen and sweeps off to the right.
		closeSequence.play();
		if ( reduced ) {
			closeSequence.progress( 1 );
		}
		const t = setTimeout( () => gsap.set( [ r.closeSvg, r.close ], { opacity: 1 } ), 2000 );

		return () => {
			clearTimeout( t );
			document.removeEventListener( 'mousemove', onMove );
			document.removeEventListener( 'keydown', onKey );
			window.removeEventListener( 'scroll', onScroll );
			ctx.revert();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	const onKeyToggle = ( e ) => {
		if ( e.key === 'Enter' || e.key === ' ' ) {
			e.preventDefault();
			api.current.toggle();
		}
	};

	const onLink = ( e, to ) => {
		e.preventDefault();
		const samePage = new URL( to, window.location.href ).pathname === location.pathname;
		api.current.close();
		if ( ! samePage ) {
			// The backdrop already covers the screen; it sweeps away over the new page.
			navigate( to );
		}
	};

	return (
		<nav className="vsNav" aria-label="Main">
			<div className="MenuBulge_wrap" ref={ refs.bulge }>
				<div className="hamburgerMenu" ref={ refs.ham } role="button" tabIndex={ 0 } aria-label="Open menu"
					aria-expanded={ open } aria-controls="vsMenuPanel"
					onClick={ () => api.current.toggle() } onKeyDown={ onKeyToggle }><span></span></div>
				<div className="CloseMenu" ref={ refs.close } role="button" tabIndex={ 0 } aria-label="Close menu"
					aria-controls="vsMenuPanel" onClick={ () => api.current.toggle() } onKeyDown={ onKeyToggle }><span></span></div>
				<svg className="MenuBulge_open" ref={ refs.openSvg } viewBox="0 0 200 600" width="200" height="600" aria-hidden="true"><path ref={ refs.openPath } d="" /></svg>
				<svg className="MenuBulge_close" ref={ refs.closeSvg } viewBox="0 0 200 600" width="200" height="600" aria-hidden="true"><path ref={ refs.closePath } d="" /></svg>
			</div>
			<div className="MenuBackdrop" aria-hidden="true">
				<svg ref={ refs.backdrop } viewBox="0 0 0 0" preserveAspectRatio="none"><path ref={ refs.backdropPath } d="" /></svg>
			</div>
			<div className="menuWrap" id="vsMenuPanel" ref={ refs.menu } inert={ ! open }>
				<div className="menuWrap_row">
					<div className="menuWrap_brand">
						<a href="/" onClick={ ( e ) => onLink( e, '/' ) }>
							<img src="/assets/img/VSP-Square-logo.png" className="MenuWrap_logo" alt="Visual Studios Plus — home" />
						</a>
						<p className="menuWrap_note">We create. We strategize. We execute.<br />We amplify. We measure. We grow.</p>
						<p className="menuWrap_contact">
							<a href={ `mailto:${ data.site.email }` }>{ data.site.email }</a><br />
							<a href="tel:+94740436639">{ data.site.phones[ 0 ] }</a>
						</p>
					</div>
					<div className="menuWrap_links">
						<ul className="menuItems" ref={ refs.items }>
							{ LINKS.map( ( [ to, label, key ] ) => (
								<li key={ key }>
									<a href={ to } onClick={ ( e ) => onLink( e, to ) }
										className={ page === key ? 'is-current' : undefined }
										aria-current={ page === key ? 'page' : undefined }>{ label }</a>
								</li>
							) ) }
						</ul>
						<SocialIcons items={ data.site.socials } className="socialLinks" size={ 22 } />
					</div>
				</div>
			</div>
		</nav>
	);
}
