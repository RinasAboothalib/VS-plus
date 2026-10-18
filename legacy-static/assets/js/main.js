/**
 * Visual Studios Plus — site behaviour.
 *
 * Every module self-gates on the markup it needs, so one file serves all pages.
 *
 *   chrome       smooth scroll, anchors, nav (edge bulge + backdrop morph), back to top,
 *                inner-page top bar, clipboard e-mail, reveals, count-ups
 *   home         pinned blob hero, logo strip, masonry, jelly-edge canvas, showreel,
 *                philosophy steps, horizontal photo strip, colour-grade compare
 *   work         film hover previews, case-study filters
 *   project      click-to-play film
 *   photography  filtered gallery, load more, lightbox
 *   contactSheet saved reference frames (localStorage), floating panel
 *   contact      brief form that composes an e-mail
 *   services     sticky index with active section + hover dot
 */
( function () {
	'use strict';

	var DATA = window.VS_DATA;
	var gsap = window.gsap;
	var ScrollTrigger = window.ScrollTrigger;
	var reduced = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	var canHover = window.matchMedia( '(hover: hover)' ).matches;
	var lenis = null;
	var PAGE = document.body.getAttribute( 'data-page' ) || '';

	if ( ! gsap || ! ScrollTrigger || ! DATA ) {
		return;
	}
	gsap.registerPlugin( ScrollTrigger );

	if ( 'scrollRestoration' in history && PAGE === 'home' ) {
		// The pinned hero and intro wipe are built to be seen from the top.
		history.scrollRestoration = 'manual';
	}

	function $( sel, root ) {
		return ( root || document ).querySelector( sel );
	}

	function $$( sel, root ) {
		return Array.prototype.slice.call( ( root || document ).querySelectorAll( sel ) );
	}

	function el( tag, cls, html ) {
		var node = document.createElement( tag );
		if ( cls ) {
			node.className = cls;
		}
		if ( html !== undefined ) {
			node.innerHTML = html;
		}
		return node;
	}

	function esc( s ) {
		return String( s ).replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' );
	}

	function pad( n ) {
		return ( n < 10 ? '0' : '' ) + n;
	}

	var store = {
		get: function ( key, fallback ) {
			try {
				var v = window.localStorage.getItem( key );
				return v ? JSON.parse( v ) : fallback;
			} catch ( e ) {
				return fallback;
			}
		},
		set: function ( key, value ) {
			try {
				window.localStorage.setItem( key, JSON.stringify( value ) );
			} catch ( e ) {}
		}
	};

	var photosPromise = null;
	function loadPhotos() {
		if ( ! photosPromise ) {
			photosPromise = fetch( '/assets/photos/photos.json' ).then( function ( r ) {
				return r.json();
			} );
		}
		return photosPromise;
	}

	/* ================================================================== *
	 * chrome
	 * ================================================================== */

	function initSmooth() {
		if ( reduced || typeof window.Lenis === 'undefined' ) {
			return;
		}
		lenis = new window.Lenis( { lerp: 0.1, smoothWheel: true } );
		lenis.on( 'scroll', ScrollTrigger.update );
		gsap.ticker.add( function ( time ) {
			lenis.raf( time * 1000 );
		} );
		gsap.ticker.lagSmoothing( 0 );
	}

	function scrollToTarget( target, offset ) {
		if ( lenis ) {
			lenis.scrollTo( target, { duration: 1.4, offset: offset || 0 } );
			return;
		}
		var y = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + ( offset || 0 );
		window.scrollTo( { top: y, behavior: reduced ? 'auto' : 'smooth' } );
	}

	function initAnchors() {
		document.addEventListener( 'click', function ( e ) {
			var a = e.target.closest( 'a[href*="#"]' );
			if ( ! a || a.target === '_blank' ) {
				return;
			}
			var url = new URL( a.href, window.location.href );
			if ( url.pathname !== window.location.pathname || url.search !== window.location.search || ! url.hash ) {
				return;
			}
			var target = url.hash === '#top' ? 0 : document.getElementById( decodeURIComponent( url.hash.slice( 1 ) ) );
			if ( target === null ) {
				return;
			}
			e.preventDefault();
			var delay = a.closest( '.menuWrap' ) ? 700 : 0;
			setTimeout( function () {
				scrollToTarget( target, -70 );
			}, delay );
		} );

		// Arriving on a page with a hash: land there after layout settles.
		if ( window.location.hash && PAGE !== 'home' ) {
			var t = document.getElementById( decodeURIComponent( window.location.hash.slice( 1 ) ) );
			if ( t ) {
				window.addEventListener( 'load', function () {
					ScrollTrigger.refresh();
					window.scrollTo( 0, t.getBoundingClientRect().top + window.scrollY - 70 );
				} );
			}
		}
	}

	function initNav() {
		var MenuBulge = $( '.MenuBulge_wrap' );
		if ( ! MenuBulge ) {
			return;
		}
		var Hamburger = $( '.hamburgerMenu', MenuBulge );
		var CloseMenu = $( '.CloseMenu', MenuBulge );
		var OpenSvg = $( '.MenuBulge_open', MenuBulge );
		var OpenPath = $( 'path', OpenSvg );
		var CloseSvg = $( '.MenuBulge_close', MenuBulge );
		var ClosePath = $( 'path', CloseSvg );
		var Backdrop = $( '.MenuBackdrop svg' );
		var BackdropPath = $( 'path', Backdrop );
		var MenuWrap = $( '.menuWrap' );
		var MenuItems = $( '.menuItems' );

		var menuOpen = false;
		var lockBulge = true;
		var bulgeAnchor = window.innerHeight / 2;

		$$( '[data-nav]', MenuWrap ).forEach( function ( a ) {
			if ( a.getAttribute( 'data-nav' ) === PAGE || ( PAGE === 'project' && a.getAttribute( 'data-nav' ) === 'work' ) ) {
				a.classList.add( 'is-current' );
				a.setAttribute( 'aria-current', 'page' );
			}
		} );

		var H = window.innerHeight > 600 ? 600 : window.innerHeight;
		var path_initial = 'M200 0 C120 ' + ( H / 2 ) + ' 120 ' + ( H / 2 ) + ' 200 ' + H + ' Z';
		var path_final = 'M200 0 C' + ( H / 2 ) + ' ' + ( H / 2 ) + ' ' + ( H / 2 ) + ' ' + ( H / 2 ) + ' 200 ' + H + ' Z';

		var W = window.innerWidth;
		var VH = window.innerHeight;

		var navpath_initial = 'M' + W + ' 0 L ' + W + ' ' + VH + ' L ' + W + ' ' + VH +
			' C ' + W + ' ' + ( VH * 0.85 ) + ' ' + W + ' ' + ( VH * 0.7 ) + ' ' + W + ' ' + ( VH * 0.6 ) +
			' C ' + W + ' ' + ( VH * 0.4 ) + ' ' + W + ' ' + ( VH * 0.3 ) + ' ' + W + ' ' + ( VH * 0.15 ) +
			' Q ' + W + ' ' + ( VH * 0.05 ) + ' ' + W + ' 0 Z';

		var navpath_intermediate = 'M' + W + ' 0 L ' + W + ' ' + VH + ' L ' + ( W * 0.5 ) + ' ' + VH +
			' C ' + ( W * 0.45 ) + ' ' + ( VH * 0.85 ) + ' ' + ( W * 0.75 ) + ' ' + ( VH * 0.7 ) + ' ' + ( W * 0.4 ) + ' ' + ( VH * 0.6 ) +
			' C -' + ( W * 0.15 ) + ' ' + ( VH * 0.4 ) + ' ' + ( W * 0.65 ) + ' ' + ( VH * 0.3 ) + ' ' + ( W * 0.45 ) + ' ' + ( VH * 0.15 ) +
			' Q ' + ( W * 0.35 ) + ' ' + ( VH * 0.05 ) + ' ' + ( W * 0.5 ) + ' 0 Z';

		var navpath_final = 'M' + W + ' 0 L ' + W + ' ' + VH + ' L 0 ' + VH +
			' C 0 ' + ( VH * 0.85 ) + ' 0 ' + ( VH * 0.7 ) + ' 0 ' + ( VH * 0.6 ) +
			' C 0 ' + ( VH * 0.4 ) + ' 0 ' + ( VH * 0.3 ) + ' 0 ' + ( VH * 0.15 ) +
			' Q 0 ' + ( VH * 0.05 ) + ' 0 0 Z';

		[ OpenSvg, CloseSvg ].forEach( function ( svg ) {
			svg.setAttribute( 'viewBox', '0 0 200 ' + H );
			svg.setAttribute( 'height', H );
		} );
		OpenPath.setAttribute( 'd', path_final );
		ClosePath.setAttribute( 'd', path_initial );
		Backdrop.setAttribute( 'viewBox', '0 0 ' + W + ' ' + VH );
		Backdrop.setAttribute( 'preserveAspectRatio', 'none' );
		BackdropPath.setAttribute( 'd', navpath_final );

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

		var BulgeOpen_anim = gsap.timeline( { paused: true } ).to( OpenPath, morph( path_final, path_initial ) );
		var BulgeClose_anim = gsap.to( ClosePath, Object.assign( { paused: true }, morph( path_initial, path_final ) ) );
		var ShowHamburger_anim = gsap.to( Hamburger, { duration: 0.5, paused: true, x: 0, ease: 'circ.inOut' } );
		var ShowClose_anim = gsap.to( CloseMenu, { duration: 0.5, paused: true, x: 0, ease: 'circ.inOut' } );

		var Backdrop_tl = gsap.timeline( { paused: true } );
		Backdrop_tl.to( BackdropPath, {
			duration: 1,
			keyframes: {
				'0%': { attr: { d: navpath_final }, ease: 'none' },
				'75%': { attr: { d: navpath_intermediate }, ease: 'none' },
				'100%': { attr: { d: navpath_initial }, ease: 'none' },
				ease: 'circ.inOut'
			}
		} ).to( Backdrop, {
			duration: 1,
			transformOrigin: '100% 50%',
			keyframes: {
				'15%': { scale: 1, ease: 'none' },
				'40%': { scale: 1.15, ease: 'none' },
				'100%': { scale: 1, ease: 'none' },
				ease: 'linear'
			}
		}, '<0.15' );

		var ShowMenu = gsap.timeline( { paused: true } );
		ShowMenu.to( MenuWrap, { x: 0, duration: 1, opacity: 1, delay: 0.5, ease: 'circ.inOut' } )
			.from( MenuItems.children, { x: 100, duration: 0.3, opacity: 0, ease: 'circ.inOut', stagger: 0.05 }, '<0.65' );

		var closeSequence = gsap.timeline( { paused: true } );
		closeSequence.add( BulgeClose_anim.play() )
			.add( ShowClose_anim.reverse(), '<' )
			.add( Backdrop_tl.play(), '<' )
			.add( ShowHamburger_anim.play(), '-=0.5' )
			.add( BulgeOpen_anim.play(), '<' );

		function isMobile() {
			return window.innerWidth < 1240;
		}

		function showBulge( show ) {
			gsap.timeline().to( OpenPath, { attr: { d: show ? path_initial : path_final }, ease: 'none', duration: 0.3 } )
				.to( Hamburger, { x: isMobile() || show ? 0 : 150, ease: 'none', duration: 0.3 }, '<' );
		}

		document.addEventListener( 'mousemove', function ( e ) {
			if ( lockBulge || isMobile() ) {
				return;
			}
			if ( e.clientX > window.innerWidth - 200 ) {
				gsap.to( MenuBulge, { y: e.clientY - bulgeAnchor, ease: 'power3.out', duration: 0.75 } );
				showBulge( true );
			} else {
				showBulge( false );
			}
		} );

		window.addEventListener( 'scroll', function () {
			if ( menuOpen ) {
				return;
			}
			var y = window.scrollY;
			if ( isMobile() ) {
				lockBulge = y < 10;
				gsap.set( Hamburger, { x: 0 } );
				return;
			}
			if ( y >= 10 ) {
				if ( lockBulge ) {
					lockBulge = false;
					showBulge( false );
				}
			} else if ( ! lockBulge ) {
				lockBulge = true;
				gsap.to( MenuBulge, { y: 0, duration: 0 } );
				showBulge( true );
			}
		}, { passive: true } );

		function setPanelHidden( hidden ) {
			if ( 'inert' in HTMLElement.prototype ) {
				MenuWrap.inert = hidden;
			} else {
				MenuWrap.setAttribute( 'aria-hidden', hidden ? 'true' : 'false' );
			}
		}

		function toggle() {
			menuOpen = ! menuOpen;
			document.body.classList.toggle( 'menu-open', menuOpen );
			if ( menuOpen ) {
				lockBulge = true;
				closeSequence.reverse();
				ShowMenu.play();
				if ( lenis ) {
					lenis.stop();
				}
			} else {
				lockBulge = window.scrollY < 10;
				closeSequence.play();
				ShowMenu.reverse();
				if ( lenis ) {
					lenis.start();
				}
				if ( ! lockBulge && ! isMobile() ) {
					gsap.delayedCall( 1, function () {
						showBulge( false );
					} );
				}
			}
			if ( reduced ) {
				closeSequence.progress( menuOpen ? 0 : 1 );
				ShowMenu.progress( menuOpen ? 1 : 0 );
			}
			Hamburger.setAttribute( 'aria-expanded', menuOpen ? 'true' : 'false' );
			setPanelHidden( ! menuOpen );
			if ( menuOpen ) {
				var first = $( '.menuItems a', MenuWrap );
				if ( first ) {
					first.focus( { preventScroll: true } );
				}
			} else {
				Hamburger.focus( { preventScroll: true } );
			}
		}

		$$( '[data-nav-toggle]' ).forEach( function ( t ) {
			t.addEventListener( 'click', function ( e ) {
				if ( t.tagName === 'A' ) {
					e.preventDefault();
					// Another page: the backdrop already covers the screen, so just go.
					if ( t.pathname !== window.location.pathname ) {
						window.location.href = t.href;
						return;
					}
				}
				toggle();
			} );
			if ( t.getAttribute( 'role' ) === 'button' ) {
				t.addEventListener( 'keydown', function ( e ) {
					if ( e.key === 'Enter' || e.key === ' ' ) {
						e.preventDefault();
						toggle();
					}
				} );
			}
		} );

		document.addEventListener( 'keydown', function ( e ) {
			if ( menuOpen && e.key === 'Escape' ) {
				toggle();
			}
		} );

		setPanelHidden( true );

		// Page load: the backdrop starts full-screen and sweeps off to the right.
		closeSequence.play();
		if ( reduced ) {
			closeSequence.progress( 1 );
		}
		if ( window.scrollY >= 10 && ! isMobile() ) {
			lockBulge = false;
			gsap.delayedCall( 1, function () {
				showBulge( false );
			} );
		}

		setTimeout( function () {
			gsap.set( [ CloseSvg, CloseMenu ], { opacity: 1 } );
		}, 2000 );

		// Leaving via any internal link: sweep the backdrop back in before navigating.
		document.addEventListener( 'click', function ( e ) {
			var a = e.target.closest( 'a[href]' );
			if ( ! a || reduced || menuOpen || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' ) {
				return;
			}
			var url = new URL( a.href, window.location.href );
			if ( url.origin !== window.location.origin || url.pathname === window.location.pathname || /\.\w+$/.test( url.pathname ) ) {
				return;
			}
			e.preventDefault();
			gsap.to( BackdropPath, {
				duration: 0.6,
				ease: 'circ.inOut',
				keyframes: [ { attr: { d: navpath_intermediate } }, { attr: { d: navpath_final } } ],
				onComplete: function () {
					window.location.href = a.href;
				}
			} );
		} );

		window.addEventListener( 'pageshow', function ( e ) {
			// Back/forward cache restores the page with the backdrop still covering it.
			if ( e.persisted ) {
				BackdropPath.setAttribute( 'd', navpath_initial );
			}
		} );
	}

	function initInnerChrome() {
		if ( PAGE === 'home' ) {
			return;
		}
		var bar = $( '.siteLogo_bg' );
		var shown = false;
		function check() {
			var want = window.scrollY > 60;
			if ( want !== shown ) {
				shown = want;
				document.body.classList.toggle( 'bar-on', want );
				gsap.to( bar, { yPercent: want ? 100 : 0, duration: 0.5, ease: 'power3.out' } );
			}
		}
		window.addEventListener( 'scroll', check, { passive: true } );
		check();

		if ( ! reduced ) {
			gsap.from( '.pageHero .eyebrow, .pageTitle_line, .pageTitle--project, .pageLede, .pageJump, .projectMeta, .projectNav, .pageActions', {
				y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.7
			} );
		}
	}

	function initBackToTop() {
		var path = $( '[data-back-to-top]' );
		if ( ! path ) {
			return;
		}
		var text = $( '.BackToTop_Wrap p' );
		var finalD = 'M0 55 C 100 55 162.5 0 250 0 C 337.5 0 400 55 500 55 Z';
		var initialD = 'M0 55 C 100 55 162.5 55 250 55 C 337.5 55 400 55 500 55 Z';
		path.setAttribute( 'd', initialD );
		gsap.set( text, { xPercent: -50, x: 0, y: 200 } );

		var anim = gsap.timeline( { paused: true } );
		anim.to( path, {
			duration: 0.5,
			keyframes: {
				'0%': { attr: { d: initialD }, ease: 'none' },
				'100%': { attr: { d: finalD }, ease: 'none' },
				ease: 'circ.inOut'
			}
		} ).to( text, { duration: 0.5, y: 0 }, '<' );

		window.addEventListener( 'scroll', function () {
			var doc = document.documentElement;
			if ( window.scrollY + doc.clientHeight >= doc.scrollHeight - 10 ) {
				anim.play();
			} else {
				anim.reverse();
			}
		}, { passive: true } );
		path.addEventListener( 'click', function () {
			scrollToTarget( 0 );
		} );
	}

	function initClipboard() {
		var tip = null;
		var copied = false;

		function getTip() {
			if ( ! tip ) {
				tip = el( 'div', 'clipboard-tooltip' );
				document.body.appendChild( tip );
			}
			return tip;
		}

		function place( e ) {
			var t = getTip();
			t.style.left = ( e.pageX + 12 ) + 'px';
			t.style.top = ( e.pageY + 12 ) + 'px';
		}

		$$( '.save_to_clipboard' ).forEach( function ( node ) {
			var text = $( 'h4', node ).textContent.trim();
			node.setAttribute( 'role', 'button' );
			node.setAttribute( 'tabindex', '0' );
			node.setAttribute( 'aria-label', 'Copy ' + text + ' to clipboard' );

			node.addEventListener( 'mouseenter', function ( e ) {
				getTip().textContent = copied ? 'E-mail copied to clipboard' : 'Click here to copy e-mail';
				place( e );
				getTip().classList.add( 'visible' );
			} );
			node.addEventListener( 'mousemove', place );
			node.addEventListener( 'mouseleave', function () {
				getTip().classList.remove( 'visible' );
			} );

			function copy() {
				var done = function () {
					copied = true;
					getTip().textContent = 'E-mail copied to clipboard';
					if ( ! canHover ) {
						toast( 'E-mail copied to clipboard' );
					}
				};
				if ( navigator.clipboard && window.isSecureContext ) {
					navigator.clipboard.writeText( text ).then( done ).catch( function () {
						window.location.href = 'mailto:' + text;
					} );
				} else {
					window.location.href = 'mailto:' + text;
				}
			}

			node.addEventListener( 'click', copy );
			node.addEventListener( 'keydown', function ( e ) {
				if ( e.key === 'Enter' || e.key === ' ' ) {
					e.preventDefault();
					copy();
				}
			} );
		} );
	}

	var toastEl = null;
	var toastTimer = null;
	function toast( msg ) {
		if ( ! toastEl ) {
			toastEl = el( 'div', 'toast' );
			toastEl.setAttribute( 'role', 'status' );
			document.body.appendChild( toastEl );
		}
		toastEl.textContent = msg;
		toastEl.classList.add( 'is-on' );
		clearTimeout( toastTimer );
		toastTimer = setTimeout( function () {
			toastEl.classList.remove( 'is-on' );
		}, 2200 );
	}

	function initReveals() {
		if ( reduced ) {
			return;
		}
		$$( '.sectionTitle, .footerTitle, .resultItem, .footerCol, .caseRow, .featureCase, .catCard, .svcBlock_text, .capCard, .rosterItem, .missionTitle, .projectText, .phase' ).forEach( function ( node ) {
			if ( node.closest( '.pageHero' ) ) {
				return;
			}
			gsap.from( node, {
				y: 40,
				opacity: 0,
				duration: 1,
				ease: 'power3.out',
				scrollTrigger: { trigger: node, start: 'top 92%', once: true }
			} );
		} );

		$$( '.parallaxImg img, .svcBlock_img img, .missionImg img' ).forEach( function ( img ) {
			gsap.fromTo( img, { yPercent: -6, scale: 1.12 }, {
				yPercent: 6,
				ease: 'none',
				scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
			} );
		} );
	}

	function initCounts() {
		if ( reduced ) {
			return;
		}
		$$( '.resultNum[data-count]' ).forEach( function ( node ) {
			var raw = node.getAttribute( 'data-count' );
			var m = raw.match( /^([^\d]*)([\d.]+)(.*)$/ );
			if ( ! m ) {
				return;
			}
			var end = parseFloat( m[ 2 ] );
			var decimals = ( m[ 2 ].split( '.' )[ 1 ] || '' ).length;
			var obj = { v: 0 };
			node.textContent = m[ 1 ] + ( 0 ).toFixed( decimals ) + m[ 3 ];
			gsap.to( obj, {
				v: end,
				duration: 1.6,
				ease: 'power2.out',
				scrollTrigger: { trigger: node, start: 'top 90%', once: true },
				onUpdate: function () {
					node.textContent = m[ 1 ] + obj.v.toFixed( decimals ) + m[ 3 ];
				}
			} );
		} );
	}

	/* ================================================================== *
	 * home
	 * ================================================================== */

	function renderClients() {
		$$( '.clientele_track' ).forEach( function ( track ) {
			var list = $( '.clientele_list', track );
			DATA.clients.forEach( function ( c ) {
				var li = el( 'li' );
				var img = el( 'img' );
				img.src = '/assets/logos/' + c[ 0 ];
				img.alt = c[ 1 ];
				img.loading = 'lazy';
				li.appendChild( img );
				list.appendChild( li );
			} );
			// Second copy makes the -50% marquee loop seamless.
			var copy = list.cloneNode( true );
			copy.setAttribute( 'aria-hidden', 'true' );
			$$( 'img', copy ).forEach( function ( img ) {
				img.alt = '';
			} );
			track.appendChild( copy );
		} );
	}

	var cards = [];
	var currentCols = 0;

	function buildCard( w ) {
		var wrap = el( 'div', 'workWrap singleWork' );
		var yt = w.yt ? ' data-yt="' + w.yt + '"' : '';
		wrap.innerHTML =
			'<a href="' + w.href + '" aria-label="' + esc( w.title ) + '">' +
				'<div class="workPlaceholder ' + w.o + '"' + yt + '>' +
					'<img src="' + ( w.img.indexOf( 'yt-' ) === 0 || w.img === 'Cover.jpeg' ? '/assets/img/' + w.img : '/assets/photos/thumb/' + w.img.replace( /\.\w+$/, '.webp' ) ) + '" alt="' + esc( w.title ) + '" loading="lazy" decoding="async">' +
					( w.yt ? '<span class="playBadge">Hover to play</span>' : '' ) +
				'</div>' +
			'</a>' +
			'<div class="workData">' +
				'<h4><a href="' + w.href + '"><span>' + esc( w.title ) + '</span></a></h4>' +
				'<ul class="taglist">' + w.tags.map( function ( t ) {
					return '<li>' + esc( t ) + '</li>';
				} ).join( '' ) + '</ul>' +
			'</div>';
		return wrap;
	}

	function columnCount() {
		return window.innerWidth <= 700 ? 2 : 3;
	}

	// Index-order deal into n columns (card i goes to column i % n), like react-masonry-css.
	function deal( n ) {
		var grid = $( '[data-home-grid]' );
		if ( ! grid || n === currentCols ) {
			return;
		}
		currentCols = n;
		var cols = [];
		for ( var k = 0; k < n; k++ ) {
			var col = el( 'div', 'my-masonry-grid_column' );
			col.style.width = ( 100 / n ) + '%';
			cols.push( col );
		}
		cards.forEach( function ( card, i ) {
			cols[ i % n ].appendChild( card );
		} );
		grid.innerHTML = '';
		cols.forEach( function ( c ) {
			grid.appendChild( c );
		} );
	}

	function renderWorks() {
		if ( ! $( '[data-home-grid]' ) ) {
			return;
		}
		cards = DATA.works.map( buildCard );
		deal( columnCount() );
	}

	function renderResults() {
		var grid = $( '.resultsGrid' );
		if ( ! grid || grid.children.length ) {
			return;
		}
		DATA.results.forEach( function ( r ) {
			var item = el( 'div', 'resultItem' );
			item.innerHTML =
				'<p class="resultNum" data-count="' + esc( r[ 0 ] ) + '">' + esc( r[ 0 ] ) + '</p>' +
				'<p class="resultLabel">' + esc( r[ 1 ] ) + '</p>' +
				'<p class="resultClient">' + esc( r[ 2 ] ) + '</p>';
			grid.appendChild( item );
		} );
	}

	function initHero() {
		var hero = $( '.homeHero' );
		if ( ! hero ) {
			return;
		}
		if ( reduced ) {
			gsap.set( '#homeBanner_intro', { display: 'none' } );
			return;
		}

		gsap.from( '.heroLine_in', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.12, delay: 0.75 } );
		gsap.from( [ '.heroKicker', '.heroReel', '.heroScroll' ], { opacity: 0, y: 20, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 1.1 } );

		var tl = gsap.timeline( {
			scrollTrigger: {
				trigger: hero,
				scrub: 0.4,
				pin: true,
				pinSpacing: true,
				start: 'top top',
				end: '+=300%'
			}
		} );

		tl.to( '.homeBanner_shape', { ease: 'none', scale: 1.5, rotation: 270, duration: 1.2 } )
			.to( '#homeBanner_intro .introText span', { ease: 'none', opacity: 1, stagger: 0.05, duration: 0.75 }, '<25%' )
			.to( '.siteLogo_bg', { yPercent: 100, duration: 0.5 } );

		tl.to( '.heroStage', { ease: 'none', scale: 1.25, duration: 1.2 }, 0 );
		tl.to( '.page_content_wrap', { ease: 'none', '--scrim-opacity': 0, duration: 1.2 }, 0 );

		var reel = $( '.heroReel video' );
		if ( reel ) {
			reel.play().catch( function () {} );
		}
	}

	function ytCommand( iframe, func ) {
		if ( iframe && iframe.contentWindow ) {
			iframe.contentWindow.postMessage( JSON.stringify( { event: 'command', func: func, args: '' } ), '*' );
		}
	}

	function ytEmbed( id, opts ) {
		return 'https://www.youtube-nocookie.com/embed/' + id + '?' + opts + '&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1';
	}

	function initHoverFilms() {
		if ( reduced || ! canHover ) {
			return;
		}
		$$( '.workPlaceholder[data-yt]' ).forEach( function ( ph ) {
			var id = ph.getAttribute( 'data-yt' );
			var iframe = null;
			var ready = false;
			var hovering = false;
			var card = ph.closest( '.workWrap' );

			card.addEventListener( 'mouseenter', function () {
				hovering = true;
				if ( ! iframe ) {
					iframe = document.createElement( 'iframe' );
					iframe.src = ytEmbed( id, 'autoplay=1&mute=1&controls=0&loop=1&playlist=' + id + '&disablekb=1' );
					iframe.title = '';
					iframe.setAttribute( 'tabindex', '-1' );
					iframe.setAttribute( 'aria-hidden', 'true' );
					iframe.setAttribute( 'allow', 'autoplay; encrypted-media' );
					iframe.addEventListener( 'load', function () {
						// YouTube needs a moment after load before the first frame paints.
						setTimeout( function () {
							ready = true;
							if ( hovering ) {
								ph.classList.add( 'is-playing' );
							} else {
								ytCommand( iframe, 'pauseVideo' );
							}
						}, 900 );
					} );
					ph.appendChild( iframe );
					return;
				}
				if ( ready ) {
					ytCommand( iframe, 'playVideo' );
					ph.classList.add( 'is-playing' );
				}
			} );

			card.addEventListener( 'mouseleave', function () {
				hovering = false;
				ph.classList.remove( 'is-playing' );
				if ( ready ) {
					ytCommand( iframe, 'pauseVideo' );
				}
			} );
		} );
	}

	/*
	 * Jelly-edge mask. Per card, paints white (the section colour) between a
	 * rectangle 2px outside the image and a soft inner contour. Contour points
	 * within 10vw of the cursor ease inward along their normal, so the image
	 * edge dents toward the pointer and springs back when it leaves.
	 */
	function initCanvas( canvas ) {
		if ( reduced ) {
			return;
		}
		var section = canvas.parentNode;
		var ctx = canvas.getContext( '2d' );
		var dpr = Math.min( window.devicePixelRatio || 1, 2 );
		var mouse = { x: -9999, y: -9999 };
		var state = new WeakMap();
		var active = false;
		var running = false;
		var settleFrames = 0;

		function sizeCanvas() {
			var w = section.offsetWidth;
			var h = section.offsetHeight;
			canvas.width = Math.round( w * dpr );
			canvas.height = Math.round( h * dpr );
			canvas.style.width = w + 'px';
			canvas.style.height = h + 'px';
		}

		function contour( w, h ) {
			var pts = [];
			var nx = 6;
			var ny = Math.max( 2, Math.round( h / ( w / nx ) ) );
			var cx = w / 2;
			var cy = h / 2;
			var i;
			function push( x, y ) {
				var dx = cx - x;
				var dy = cy - y;
				var corner = ( x === 0 || x === w ) && ( y === 0 || y === h );
				var n;
				if ( corner ) {
					var len = Math.sqrt( dx * dx + dy * dy );
					n = [ dx / len, dy / len ];
				} else if ( y === 0 ) {
					n = [ 0, 1 ];
				} else if ( y === h ) {
					n = [ 0, -1 ];
				} else if ( x === 0 ) {
					n = [ 1, 0 ];
				} else {
					n = [ -1, 0 ];
				}
				pts.push( { x: x, y: y, nx: n[ 0 ], ny: n[ 1 ], d: 0 } );
			}
			for ( i = 0; i < nx; i++ ) { push( w * i / nx, 0 ); }
			for ( i = 0; i < ny; i++ ) { push( w, h * i / ny ); }
			for ( i = nx; i > 0; i-- ) { push( w * i / nx, h ); }
			for ( i = ny; i > 0; i-- ) { push( 0, h * i / ny ); }
			return pts;
		}

		function frame() {
			if ( ! active || window.innerWidth <= 1240 ) {
				running = false;
				ctx.clearRect( 0, 0, canvas.width, canvas.height );
				return;
			}
			var sRect = section.getBoundingClientRect();
			var boundary = window.innerWidth * 0.1;
			var maxPull = Math.min( 34, window.innerWidth * 0.022 );
			var moving = false;

			ctx.setTransform( dpr, 0, 0, dpr, 0, 0 );
			ctx.clearRect( 0, 0, canvas.width, canvas.height );
			ctx.fillStyle = '#ffffff';

			$$( '.workPlaceholder', section ).forEach( function ( ph ) {
				var r = ph.getBoundingClientRect();
				if ( r.bottom < -50 || r.top > window.innerHeight + 50 ) {
					return;
				}
				var x0 = r.left - sRect.left;
				var y0 = r.top - sRect.top;
				var w = r.width;
				var h = r.height;
				var st = state.get( ph );
				if ( ! st || Math.abs( st.w - w ) > 0.5 || Math.abs( st.h - h ) > 0.5 ) {
					st = { w: w, h: h, pts: contour( w, h ) };
					state.set( ph, st );
				}
				var mx = mouse.x - r.left;
				var my = mouse.y - r.top;
				var any = false;

				st.pts.forEach( function ( p ) {
					var dx = mx - p.x;
					var dy = my - p.y;
					var dist = Math.sqrt( dx * dx + dy * dy );
					var target = 0;
					if ( dist < boundary ) {
						var f = 1 - dist / boundary;
						target = maxPull * f * f;
					}
					p.d += ( target - p.d ) * 0.14;
					if ( Math.abs( target - p.d ) > 0.05 ) {
						moving = true;
					}
					if ( p.d > 0.15 ) {
						any = true;
					}
				} );

				if ( ! any ) {
					return;
				}

				var o = 2;
				ctx.beginPath();
				ctx.rect( x0 - o, y0 - o, w + o * 2, h + o * 2 );
				var pts = st.pts.map( function ( p ) {
					return [ x0 + p.x + p.nx * p.d, y0 + p.y + p.ny * p.d ];
				} );
				var n = pts.length;
				var mid = function ( a, b ) {
					return [ ( a[ 0 ] + b[ 0 ] ) / 2, ( a[ 1 ] + b[ 1 ] ) / 2 ];
				};
				var start = mid( pts[ n - 1 ], pts[ 0 ] );
				ctx.moveTo( start[ 0 ], start[ 1 ] );
				for ( var i = 0; i < n; i++ ) {
					var m = mid( pts[ i ], pts[ ( i + 1 ) % n ] );
					ctx.quadraticCurveTo( pts[ i ][ 0 ], pts[ i ][ 1 ], m[ 0 ], m[ 1 ] );
				}
				ctx.closePath();
				ctx.fill( 'evenodd' );
			} );

			settleFrames = moving ? 20 : settleFrames - 1;
			if ( settleFrames > 0 ) {
				requestAnimationFrame( frame );
			} else {
				running = false;
			}
		}

		function kick() {
			if ( ! running ) {
				running = true;
				settleFrames = 20;
				requestAnimationFrame( frame );
			}
		}

		sizeCanvas();
		new ResizeObserver( sizeCanvas ).observe( section );
		window.addEventListener( 'mousemove', function ( e ) {
			mouse.x = e.clientX;
			mouse.y = e.clientY;
			kick();
		}, { passive: true } );
		window.addEventListener( 'scroll', kick, { passive: true } );
		new IntersectionObserver( function ( entries ) {
			active = entries[ 0 ].isIntersecting;
			if ( active ) {
				kick();
			}
		} ).observe( section );
	}

	function initFeatured() {
		var wrap = $( '.featuredVideo' );
		if ( ! wrap ) {
			return;
		}
		var video = $( 'video', wrap );
		var btn = $( '.featuredSound', wrap );

		btn.addEventListener( 'click', function () {
			video.muted = ! video.muted;
			btn.textContent = video.muted ? 'Sound on' : 'Sound off';
			btn.setAttribute( 'aria-pressed', video.muted ? 'false' : 'true' );
			if ( ! video.muted ) {
				video.play().catch( function () {} );
			}
		} );

		if ( reduced ) {
			video.controls = true;
			return;
		}

		new IntersectionObserver( function ( entries ) {
			if ( entries[ 0 ].isIntersecting ) {
				video.preload = 'auto';
				video.play().catch( function () {} );
			} else {
				video.pause();
			}
		}, { threshold: 0.5 } ).observe( wrap );
	}

	function initPhilosophy() {
		var phases = $$( '.phase' );
		var num = $( '[data-phase-num]' );
		if ( ! phases.length ) {
			return;
		}
		function activate( i ) {
			phases.forEach( function ( p, k ) {
				p.classList.toggle( 'is-active', k === i );
			} );
			if ( num ) {
				num.textContent = pad( i + 1 );
			}
		}
		activate( 0 );
		phases.forEach( function ( p, i ) {
			ScrollTrigger.create( {
				trigger: p,
				start: 'top 60%',
				end: 'bottom 60%',
				onToggle: function ( self ) {
					if ( self.isActive ) {
						activate( i );
					}
				}
			} );
		} );
	}

	function initPhotoStrip() {
		var section = $( '.photoStrip' );
		if ( ! section ) {
			return;
		}
		var row = $( '.photoStrip_row', section );
		var mm = gsap.matchMedia();
		mm.add( '(min-width: 901px) and (prefers-reduced-motion: no-preference)', function () {
			function distance() {
				return Math.max( 0, row.scrollWidth - window.innerWidth );
			}
			gsap.to( row, {
				x: function () {
					return -distance();
				},
				ease: 'none',
				scrollTrigger: {
					trigger: section,
					start: 'top top',
					end: function () {
						return '+=' + distance();
					},
					pin: true,
					scrub: 0.6,
					invalidateOnRefresh: true
				}
			} );
		} );
	}

	function initGrade() {
		var box = $( '[data-grade]' );
		if ( ! box ) {
			return;
		}
		var G = DATA.grade;
		var stage = $( '.gradeStage', box );
		var before = $( '.gradeBefore', box );
		var after = $( '.gradeImg--after', box );
		var beforeImg = $( '.gradeImg--before', box );
		var overlay = $( '.gradeOverlay', box );
		var handle = $( '.gradeHandle', box );
		var range = $( '.gradeRange', box );
		var label = $( '[data-look-label]', box );

		beforeImg.style.filter = G.log;

		function setPos( v ) {
			v = Math.max( 0, Math.min( 100, v ) );
			before.style.clipPath = 'inset(0 ' + ( 100 - v ) + '% 0 0)';
			handle.style.left = v + '%';
			range.value = v;
		}

		function setLook( i ) {
			var look = G.looks[ i ];
			after.style.filter = look[ 1 ];
			overlay.style.background = look[ 2 ] || 'none';
			label.textContent = 'Graded · ' + look[ 0 ];
		}

		function setFrame( i ) {
			var f = G.frames[ i ];
			after.src = f[ 1 ];
			after.alt = f[ 2 ];
			beforeImg.src = f[ 1 ];
		}

		function chips( attr, fn ) {
			$$( '[' + attr + ']', box ).forEach( function ( b ) {
				b.addEventListener( 'click', function () {
					$$( '[' + attr + ']', box ).forEach( function ( o ) {
						o.classList.toggle( 'is-active', o === b );
						o.setAttribute( 'aria-pressed', o === b ? 'true' : 'false' );
					} );
					fn( parseInt( b.getAttribute( attr ), 10 ) );
				} );
			} );
		}

		chips( 'data-frame', setFrame );
		chips( 'data-look', setLook );
		range.addEventListener( 'input', function () {
			setPos( parseFloat( range.value ) );
		} );

		var dragging = false;
		function fromEvent( e ) {
			var r = stage.getBoundingClientRect();
			setPos( ( ( e.clientX - r.left ) / r.width ) * 100 );
		}
		stage.addEventListener( 'pointerdown', function ( e ) {
			dragging = true;
			stage.setPointerCapture( e.pointerId );
			fromEvent( e );
		} );
		stage.addEventListener( 'pointermove', function ( e ) {
			if ( dragging || e.pointerType === 'mouse' ) {
				fromEvent( e );
			}
		} );
		stage.addEventListener( 'pointerup', function () {
			dragging = false;
		} );

		setPos( 50 );
		setLook( 0 );

		if ( ! reduced ) {
			// A one-time sweep shows the comparison is draggable.
			var o = { v: 50 };
			gsap.timeline( { scrollTrigger: { trigger: stage, start: 'top 70%', once: true } } )
				.to( o, { v: 18, duration: 0.9, ease: 'power2.inOut', onUpdate: function () { setPos( o.v ); } } )
				.to( o, { v: 82, duration: 1.2, ease: 'power2.inOut', onUpdate: function () { setPos( o.v ); } } )
				.to( o, { v: 50, duration: 0.8, ease: 'power2.inOut', onUpdate: function () { setPos( o.v ); } } );
		}
	}

	function initAccordion() {
		var ul = $( '.accordion' );
		if ( ! ul ) {
			return;
		}
		var items = $$( ':scope > li', ul );

		items.forEach( function ( li, i ) {
			var btn = $( 'button', li );
			btn.addEventListener( 'click', function () {
				var open = li.classList.contains( 'is-open' );
				items.forEach( function ( other ) {
					other.classList.remove( 'is-open' );
					$( 'button', other ).setAttribute( 'aria-expanded', 'false' );
				} );
				if ( ! open ) {
					li.classList.add( 'is-open' );
					btn.setAttribute( 'aria-expanded', 'true' );
				}
				setTimeout( function () {
					ScrollTrigger.refresh();
				}, 550 );
			} );
			if ( i === 0 ) {
				li.classList.add( 'is-open' );
				btn.setAttribute( 'aria-expanded', 'true' );
			}
		} );

		hoverDot( ul, items, function ( li ) {
			return li.offsetTop + $( 'button', li ).offsetHeight / 2;
		} );
	}

	function hoverDot( list, items, centerOf ) {
		var dot = el( 'span', 'hover-dot' );
		dot.style.opacity = '0';
		list.insertBefore( dot, list.firstChild );
		items.forEach( function ( li ) {
			li.addEventListener( 'mouseenter', function () {
				dot.style.top = centerOf( li ) + 'px';
				dot.style.opacity = '1';
			} );
		} );
		list.addEventListener( 'mouseleave', function () {
			dot.style.opacity = '0';
		} );
	}

	/* ================================================================== *
	 * work + project
	 * ================================================================== */

	function initCaseFilters() {
		var group = $( '.caseFilters' );
		if ( ! group ) {
			return;
		}
		var rows = $$( '.caseRow' );
		$$( '[data-filter]', group ).forEach( function ( b ) {
			b.addEventListener( 'click', function () {
				var f = b.getAttribute( 'data-filter' );
				$$( '[data-filter]', group ).forEach( function ( o ) {
					o.classList.toggle( 'is-active', o === b );
					o.setAttribute( 'aria-pressed', o === b ? 'true' : 'false' );
				} );
				var shown = rows.filter( function ( r ) {
					var on = f === 'all' || r.getAttribute( 'data-type' ) === f;
					r.hidden = ! on;
					return on;
				} );
				if ( ! reduced ) {
					gsap.fromTo( shown, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power2.out' } );
				}
				ScrollTrigger.refresh();
			} );
		} );
	}

	function initProjectFilm() {
		var frame = $( '[data-film]' );
		if ( ! frame ) {
			return;
		}
		var btn = $( '.projectPlay', frame );
		btn.addEventListener( 'click', function () {
			var id = frame.getAttribute( 'data-film' );
			var iframe = document.createElement( 'iframe' );
			iframe.src = ytEmbed( id, 'autoplay=1' );
			iframe.title = frame.getAttribute( 'data-film-title' ) + ' — Visual Studios Plus';
			iframe.setAttribute( 'allow', 'autoplay; encrypted-media; fullscreen; picture-in-picture' );
			iframe.setAttribute( 'allowfullscreen', '' );
			frame.appendChild( iframe );
			frame.classList.add( 'is-playing' );
			iframe.focus();
		} );
	}

	/* ================================================================== *
	 * contact sheet (shared by gallery, lightbox and the brief form)
	 * ================================================================== */

	var SHEET_KEY = 'vs-contact-sheet';
	var SHEET_MAX = 36;
	var sheetListeners = [];

	var sheet = {
		list: function () {
			var v = store.get( SHEET_KEY, [] );
			return Array.isArray( v ) ? v : [];
		},
		has: function ( f ) {
			return sheet.list().indexOf( f ) !== -1;
		},
		toggle: function ( f ) {
			var l = sheet.list();
			var i = l.indexOf( f );
			if ( i === -1 ) {
				if ( l.length >= SHEET_MAX ) {
					toast( 'The roll is full — 36 frames max' );
					return false;
				}
				l.push( f );
			} else {
				l.splice( i, 1 );
			}
			store.set( SHEET_KEY, l );
			sheet.emit();
			return i === -1;
		},
		remove: function ( f ) {
			store.set( SHEET_KEY, sheet.list().filter( function ( x ) {
				return x !== f;
			} ) );
			sheet.emit();
		},
		clear: function () {
			store.set( SHEET_KEY, [] );
			sheet.emit();
		},
		on: function ( fn ) {
			sheetListeners.push( fn );
		},
		emit: function () {
			var l = sheet.list();
			sheetListeners.forEach( function ( fn ) {
				fn( l );
			} );
		}
	};

	function thumbOf( f ) {
		return '/assets/photos/thumb/' + f.replace( /\.\w+$/, '.webp' );
	}

	function initSheetPanel() {
		if ( PAGE === 'contact' ) {
			return;
		}
		var wrap = el( 'div', 'sheetDock' );
		wrap.innerHTML =
			'<div class="sheetPanel" id="contact-sheet" role="dialog" aria-label="Your contact sheet" hidden data-lenis-prevent>' +
				'<div class="sheetPanel_top"><span>Contact sheet · <b data-sheet-n>00</b> / 36 exp</span><button type="button" class="sheetClear">Clear roll</button></div>' +
				'<ul class="sheetPanel_list"></ul>' +
				'<p class="sheetPanel_note">Frames you like become references for your brief.</p>' +
				'<a class="pillBtn sheetSend" href="/contact/#brief">Send to the studio →</a>' +
			'</div>' +
			'<button type="button" class="sheetToggle" aria-expanded="false" aria-controls="contact-sheet">Contact sheet <span data-sheet-badge>0</span></button>';
		document.body.appendChild( wrap );

		var panel = $( '.sheetPanel', wrap );
		var toggleBtn = $( '.sheetToggle', wrap );
		var list = $( '.sheetPanel_list', wrap );

		toggleBtn.addEventListener( 'click', function () {
			var open = panel.hidden;
			panel.hidden = ! open;
			toggleBtn.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
		} );
		$( '.sheetClear', wrap ).addEventListener( 'click', function () {
			sheet.clear();
		} );
		list.addEventListener( 'click', function ( e ) {
			var b = e.target.closest( '[data-remove]' );
			if ( b ) {
				sheet.remove( b.getAttribute( 'data-remove' ) );
			}
		} );

		function render( l ) {
			wrap.classList.toggle( 'is-on', l.length > 0 );
			if ( ! l.length ) {
				panel.hidden = true;
				toggleBtn.setAttribute( 'aria-expanded', 'false' );
			}
			$( '[data-sheet-n]', wrap ).textContent = pad( l.length );
			$( '[data-sheet-badge]', wrap ).textContent = l.length;
			list.innerHTML = l.map( function ( f, i ) {
				return '<li><img src="' + thumbOf( f ) + '" alt=""><span>' + ( i + 1 ) + 'A</span>' +
					'<button type="button" data-remove="' + esc( f ) + '" aria-label="Remove frame ' + ( i + 1 ) + '">✕</button></li>';
			} ).join( '' );
		}

		sheet.on( render );
		render( sheet.list() );

		// Another tab changed the roll.
		window.addEventListener( 'storage', function ( e ) {
			if ( e.key === SHEET_KEY ) {
				sheet.emit();
			}
		} );
	}

	/* ================================================================== *
	 * photography
	 * ================================================================== */

	function initGallery() {
		var grid = $( '[data-gallery]' );
		if ( ! grid ) {
			return;
		}
		var PAGE_SIZE = 24;
		var moreBtn = $( '[data-load-more]' );
		var filters = $$( '[data-cat]' );
		var cats = {};
		DATA.photoCategories.forEach( function ( c ) {
			cats[ c[ 0 ] ] = c;
		} );

		var params = new URLSearchParams( window.location.search );
		var current = cats[ params.get( 'category' ) ] ? params.get( 'category' ) : 'all';
		var all = [];
		var list = [];
		var shown = 0;

		function setFilterUI() {
			filters.forEach( function ( b ) {
				var on = b.getAttribute( 'data-cat' ) === current;
				b.classList.toggle( 'is-active', on );
				b.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
			} );
		}

		function tile( p, i ) {
			var c = cats[ p.c ];
			var fig = el( 'figure', 'galleryItem' );
			var inSheet = sheet.has( p.f );
			fig.style.setProperty( '--ar', p.w + ' / ' + p.h );
			fig.innerHTML =
				'<button type="button" class="galleryOpen" data-open="' + i + '" aria-label="Open ' + esc( c[ 2 ] ) + ' photograph ' + ( i + 1 ) + '">' +
					'<img src="/assets/photos/thumb/' + p.t + '" alt="' + esc( c[ 2 ] ) + ' photography by Visual Studios Plus — image ' + ( i + 1 ) + '" loading="lazy" decoding="async" width="' + p.w + '" height="' + p.h + '">' +
				'</button>' +
				'<figcaption><span>' + esc( c[ 2 ] ) + '</span><span>' + String( i + 1 ).padStart( 3, '0' ) + '</span></figcaption>' +
				'<button type="button" class="sheetAdd' + ( inSheet ? ' is-in' : '' ) + '" data-sheet="' + esc( p.f ) + '" aria-pressed="' + inSheet + '" aria-label="Add this photo to your contact sheet">' + ( inSheet ? '✓' : '+' ) + '</button>';
			return fig;
		}

		// Masonry by shortest column (tracked by aspect ratio), so appending never reshuffles.
		var cols = [];
		var colHeights = [];

		function colCount() {
			return window.innerWidth < 600 ? 2 : ( window.innerWidth < 1000 ? 3 : 4 );
		}

		function buildCols() {
			grid.innerHTML = '';
			cols = [];
			colHeights = [];
			for ( var k = 0; k < colCount(); k++ ) {
				cols.push( grid.appendChild( el( 'div', 'galleryCol' ) ) );
				colHeights.push( 0 );
			}
		}

		function place( p, i ) {
			var n = tile( p, i );
			var at = colHeights.indexOf( Math.min.apply( Math, colHeights ) );
			cols[ at ].appendChild( n );
			colHeights[ at ] += p.h / p.w + 0.12;
			return n;
		}

		function renderMore() {
			var next = list.slice( shown, shown + PAGE_SIZE );
			var nodes = next.map( function ( p, k ) {
				return place( p, shown + k );
			} );
			shown += next.length;
			var left = list.length - shown;
			moreBtn.hidden = left <= 0;
			moreBtn.textContent = 'Load more (' + left + ' remaining)';
			if ( ! reduced ) {
				gsap.from( nodes, { opacity: 0, y: 30, duration: 0.7, stagger: 0.03, ease: 'power3.out' } );
			}
			ScrollTrigger.refresh();
		}

		function apply() {
			list = current === 'all' ? all : all.filter( function ( p ) {
				return p.c === current;
			} );
			buildCols();
			shown = 0;
			setFilterUI();
			renderMore();
		}

		var lastCount = colCount();
		window.addEventListener( 'resize', function () {
			if ( colCount() !== lastCount && all.length ) {
				lastCount = colCount();
				var keep = shown;
				buildCols();
				list.slice( 0, keep ).forEach( place );
			}
		} );

		filters.forEach( function ( b ) {
			b.addEventListener( 'click', function () {
				current = b.getAttribute( 'data-cat' );
				var url = new URL( window.location.href );
				if ( current === 'all' ) {
					url.searchParams.delete( 'category' );
				} else {
					url.searchParams.set( 'category', current );
				}
				history.replaceState( null, '', url );
				apply();
			} );
		} );

		moreBtn.addEventListener( 'click', renderMore );

		grid.addEventListener( 'click', function ( e ) {
			var add = e.target.closest( '[data-sheet]' );
			if ( add ) {
				sheet.toggle( add.getAttribute( 'data-sheet' ) );
				return;
			}
			var open = e.target.closest( '[data-open]' );
			if ( open ) {
				lightbox.open( list, parseInt( open.getAttribute( 'data-open' ), 10 ) );
			}
		} );

		sheet.on( function ( l ) {
			$$( '[data-sheet]', grid ).forEach( function ( b ) {
				var on = l.indexOf( b.getAttribute( 'data-sheet' ) ) !== -1;
				b.classList.toggle( 'is-in', on );
				b.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
				b.textContent = on ? '✓' : '+';
			} );
		} );

		setFilterUI();
		loadPhotos().then( function ( photos ) {
			all = photos;
			apply();
		} );

		var lightbox = createLightbox( cats );
	}

	function createLightbox( cats ) {
		var box = $( '.lightbox' );
		var img = $( '[data-lb-img]', box );
		var catEl = $( '[data-lb-cat]', box );
		var countEl = $( '[data-lb-count]', box );
		var sheetBtn = $( '[data-lb-sheet]', box );
		var items = [];
		var idx = 0;
		var lastFocus = null;

		function show( i ) {
			idx = ( i + items.length ) % items.length;
			var p = items[ idx ];
			img.src = '/assets/photos/thumb/' + p.t;
			var full = new Image();
			full.onload = function () {
				if ( items[ idx ] === p ) {
					img.src = full.src;
				}
			};
			full.src = '/assets/photos/full/' + p.f;
			img.alt = cats[ p.c ][ 2 ] + ' photography by Visual Studios Plus';
			catEl.textContent = cats[ p.c ][ 1 ];
			countEl.textContent = pad( idx + 1 ) + ' / ' + pad( items.length );
			syncSheet();
			if ( ! reduced ) {
				gsap.fromTo( img, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' } );
			}
		}

		function syncSheet() {
			var on = items[ idx ] && sheet.has( items[ idx ].f );
			sheetBtn.textContent = on ? '✓ On your contact sheet' : '+ Contact sheet';
			sheetBtn.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
		}

		function open( list, i ) {
			items = list;
			lastFocus = document.activeElement;
			box.hidden = false;
			document.body.classList.add( 'lb-open' );
			if ( lenis ) {
				lenis.stop();
			}
			show( i );
			$( '[data-lb-close]', box ).focus();
		}

		function close() {
			box.hidden = true;
			document.body.classList.remove( 'lb-open' );
			if ( lenis ) {
				lenis.start();
			}
			if ( lastFocus ) {
				lastFocus.focus();
			}
		}

		$( '[data-lb-close]', box ).addEventListener( 'click', close );
		$( '[data-lb-prev]', box ).addEventListener( 'click', function () {
			show( idx - 1 );
		} );
		$( '[data-lb-next]', box ).addEventListener( 'click', function () {
			show( idx + 1 );
		} );
		sheetBtn.addEventListener( 'click', function () {
			sheet.toggle( items[ idx ].f );
		} );
		sheet.on( function () {
			if ( ! box.hidden ) {
				syncSheet();
			}
		} );
		box.addEventListener( 'click', function ( e ) {
			if ( e.target === box || e.target.classList.contains( 'lightbox_stage' ) ) {
				close();
			}
		} );

		var touchX = null;
		box.addEventListener( 'touchstart', function ( e ) {
			touchX = e.touches[ 0 ].clientX;
		}, { passive: true } );
		box.addEventListener( 'touchend', function ( e ) {
			if ( touchX === null ) {
				return;
			}
			var dx = e.changedTouches[ 0 ].clientX - touchX;
			if ( Math.abs( dx ) > 50 ) {
				show( idx + ( dx < 0 ? 1 : -1 ) );
			}
			touchX = null;
		} );

		document.addEventListener( 'keydown', function ( e ) {
			if ( box.hidden ) {
				return;
			}
			if ( e.key === 'Escape' ) {
				close();
			} else if ( e.key === 'ArrowRight' ) {
				show( idx + 1 );
			} else if ( e.key === 'ArrowLeft' ) {
				show( idx - 1 );
			} else if ( e.key === 'Tab' ) {
				var f = $$( 'button', box );
				var at = f.indexOf( document.activeElement );
				if ( e.shiftKey && at <= 0 ) {
					e.preventDefault();
					f[ f.length - 1 ].focus();
				} else if ( ! e.shiftKey && at === f.length - 1 ) {
					e.preventDefault();
					f[ 0 ].focus();
				}
			}
		} );

		return { open: open };
	}

	/* ================================================================== *
	 * contact
	 * ================================================================== */

	function initBrief() {
		var form = $( '.briefForm' );
		if ( ! form ) {
			return;
		}
		var chips = $$( '[data-interest]', form );
		var refs = $( '[data-refs]', form );
		var refsList = $( '[data-refs-list]', form );
		var refsCount = $( '[data-refs-count]', form );
		var error = $( '.briefError', form );
		var DRAFT_KEY = 'vs-brief-draft';

		chips.forEach( function ( c ) {
			c.addEventListener( 'click', function () {
				var on = c.getAttribute( 'aria-pressed' ) !== 'true';
				c.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
				c.classList.toggle( 'is-active', on );
				saveDraft();
			} );
		} );

		function renderRefs( l ) {
			refs.hidden = ! l.length;
			refsCount.textContent = l.length;
			refsList.innerHTML = l.map( function ( f, i ) {
				return '<li><img src="' + thumbOf( f ) + '" alt="Reference frame ' + ( i + 1 ) + '">' +
					'<button type="button" data-remove="' + esc( f ) + '" aria-label="Remove reference frame">✕</button></li>';
			} ).join( '' );
		}
		refsList.addEventListener( 'click', function ( e ) {
			var b = e.target.closest( '[data-remove]' );
			if ( b ) {
				sheet.remove( b.getAttribute( 'data-remove' ) );
			}
		} );
		sheet.on( renderRefs );
		renderRefs( sheet.list() );

		// Keep an unsent draft per visitor.
		function saveDraft() {
			var d = { interests: chips.filter( function ( c ) {
				return c.getAttribute( 'aria-pressed' ) === 'true';
			} ).map( function ( c ) {
				return c.getAttribute( 'data-interest' );
			} ) };
			[ 'name', 'email', 'company', 'message' ].forEach( function ( n ) {
				d[ n ] = form.elements[ n ].value;
			} );
			store.set( DRAFT_KEY, d );
		}
		var draft = store.get( DRAFT_KEY, null );
		if ( draft ) {
			[ 'name', 'email', 'company', 'message' ].forEach( function ( n ) {
				if ( draft[ n ] ) {
					form.elements[ n ].value = draft[ n ];
				}
			} );
			chips.forEach( function ( c ) {
				if ( ( draft.interests || [] ).indexOf( c.getAttribute( 'data-interest' ) ) !== -1 ) {
					c.setAttribute( 'aria-pressed', 'true' );
					c.classList.add( 'is-active' );
				}
			} );
		}
		form.addEventListener( 'input', saveDraft );

		form.addEventListener( 'submit', function ( e ) {
			e.preventDefault();
			var name = form.elements.name.value.trim();
			var email = form.elements.email.value.trim();
			var company = form.elements.company.value.trim();
			var message = form.elements.message.value.trim();
			var problems = [];
			if ( ! name ) {
				problems.push( 'your name' );
			}
			if ( ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email ) ) {
				problems.push( 'a valid e-mail' );
			}
			if ( ! message ) {
				problems.push( 'a few words about the project' );
			}
			if ( problems.length ) {
				error.textContent = 'Please add ' + problems.join( ', ' ) + '.';
				error.hidden = false;
				var first = ! name ? 'name' : ( problems[ 0 ] === 'a valid e-mail' ? 'email' : 'message' );
				form.elements[ first ].focus();
				return;
			}
			error.hidden = true;

			var interests = chips.filter( function ( c ) {
				return c.getAttribute( 'aria-pressed' ) === 'true';
			} ).map( function ( c ) {
				return c.getAttribute( 'data-interest' );
			} );
			var refsNow = sheet.list();
			var lines = [
				'Name: ' + name,
				'Email: ' + email,
				company ? 'Company / brand: ' + company : '',
				interests.length ? 'Interested in: ' + interests.join( ', ' ) : '',
				'',
				message
			];
			if ( refsNow.length ) {
				lines.push( '', 'Reference frames from my contact sheet:' );
				refsNow.forEach( function ( f ) {
					lines.push( window.location.origin + '/assets/photos/full/' + f );
				} );
			}
			var subject = 'Project brief — ' + ( company || name );
			window.location.href = 'mailto:' + DATA.site.email +
				'?subject=' + encodeURIComponent( subject ) +
				'&body=' + encodeURIComponent( lines.filter( function ( l, i ) {
					return l !== '' || i >= 4;
				} ).join( '\n' ) );
		} );
	}

	/* ================================================================== *
	 * services
	 * ================================================================== */

	function initServicesIndex() {
		var list = $( '.svcIndex_list' );
		if ( ! list ) {
			return;
		}
		var items = $$( 'li', list );
		var links = $$( 'a', list );
		$$( '.svcBlock' ).forEach( function ( block, i ) {
			ScrollTrigger.create( {
				trigger: block,
				start: 'top 50%',
				end: 'bottom 50%',
				onToggle: function ( self ) {
					if ( self.isActive ) {
						links.forEach( function ( a, k ) {
							a.classList.toggle( 'is-active', k === i );
						} );
					}
				}
			} );
		} );
		if ( canHover ) {
			hoverDot( list, items, function ( li ) {
				return li.offsetTop + li.offsetHeight / 2;
			} );
		}
	}

	/* ================================================================== *
	 * boot
	 * ================================================================== */

	renderClients();
	renderWorks();
	renderResults();
	$$( '[data-year]' ).forEach( function ( n ) {
		n.textContent = new Date().getFullYear();
	} );

	initSmooth();
	initAnchors();
	initNav();
	initInnerChrome();
	initHero();
	initHoverFilms();
	$$( '.worksCanvas' ).forEach( initCanvas );
	initFeatured();
	initPhilosophy();
	initPhotoStrip();
	initGrade();
	initAccordion();
	initCaseFilters();
	initProjectFilm();
	initSheetPanel();
	initGallery();
	initBrief();
	initServicesIndex();
	initCounts();
	initReveals();
	initBackToTop();
	initClipboard();

	var resizeTimer = null;
	window.addEventListener( 'resize', function () {
		clearTimeout( resizeTimer );
		resizeTimer = setTimeout( function () {
			deal( columnCount() );
			ScrollTrigger.refresh();
		}, 150 );
	} );

	window.addEventListener( 'load', function () {
		ScrollTrigger.refresh();
	} );
}() );
