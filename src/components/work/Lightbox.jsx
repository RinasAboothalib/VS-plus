import { useEffect, useRef, useState } from 'react';
import data from '../../data/site.js';
import { gsap, pad, reduced, startScroll, stopScroll } from '../../lib/motion.js';
import { useSheet } from '../../context/SheetContext.jsx';

const CATS = Object.fromEntries( data.photoCategories.map( ( c ) => [ c[ 0 ], c ] ) );

/* Full-screen viewer: thumb first, swaps to the full file once loaded. Keys, swipe and focus trap. */
export default function Lightbox( { items, index, onIndex, onClose } ) {
	const box = useRef( null );
	const img = useRef( null );
	const closeBtn = useRef( null );
	const { has, toggle } = useSheet();
	const p = items[ index ];
	const [ src, setSrc ] = useState( `/assets/photos/thumb/${ p.t }` );

	const go = ( d ) => onIndex( ( index + d + items.length ) % items.length );

	useEffect( () => {
		setSrc( `/assets/photos/thumb/${ p.t }` );
		const full = new Image();
		full.onload = () => setSrc( full.src );
		full.src = `/assets/photos/full/${ p.f }`;
		if ( ! reduced ) {
			gsap.fromTo( img.current, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' } );
		}
		return () => {
			full.onload = null;
		};
	}, [ p ] );

	useEffect( () => {
		const last = document.activeElement;
		document.body.classList.add( 'lb-open' );
		stopScroll();
		closeBtn.current.focus();
		return () => {
			document.body.classList.remove( 'lb-open' );
			startScroll();
			if ( last && last.focus ) {
				last.focus();
			}
		};
	}, [] );

	useEffect( () => {
		const onKey = ( e ) => {
			if ( e.key === 'Escape' ) {
				onClose();
			} else if ( e.key === 'ArrowRight' ) {
				go( 1 );
			} else if ( e.key === 'ArrowLeft' ) {
				go( -1 );
			} else if ( e.key === 'Tab' ) {
				const f = Array.from( box.current.querySelectorAll( 'button' ) );
				const at = f.indexOf( document.activeElement );
				if ( e.shiftKey && at <= 0 ) {
					e.preventDefault();
					f[ f.length - 1 ].focus();
				} else if ( ! e.shiftKey && at === f.length - 1 ) {
					e.preventDefault();
					f[ 0 ].focus();
				}
			}
		};
		document.addEventListener( 'keydown', onKey );
		return () => document.removeEventListener( 'keydown', onKey );
	} );

	const touchX = useRef( null );
	const inSheet = has( p.f );

	return (
		<div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" ref={ box }
			onClick={ ( e ) => ( e.target === box.current || e.target.classList.contains( 'lightbox_stage' ) ) && onClose() }
			onTouchStart={ ( e ) => {
				touchX.current = e.touches[ 0 ].clientX;
			} }
			onTouchEnd={ ( e ) => {
				if ( touchX.current === null ) {
					return;
				}
				const dx = e.changedTouches[ 0 ].clientX - touchX.current;
				if ( Math.abs( dx ) > 50 ) {
					go( dx < 0 ? 1 : -1 );
				}
				touchX.current = null;
			} }>
			<div className="lightbox_top">
				<p className="lightbox_meta"><span>{ CATS[ p.c ][ 1 ] }</span><span>{ pad( index + 1 ) } / { pad( items.length ) }</span></p>
				<div className="lightbox_actions">
					<button type="button" className="lbBtn" aria-pressed={ inSheet } onClick={ () => toggle( p.f ) }>
						{ inSheet ? '✓ On your contact sheet' : '+ Contact sheet' }
					</button>
					<button type="button" className="lbBtn lbBtn--icon" ref={ closeBtn } onClick={ onClose } aria-label="Close viewer">✕</button>
				</div>
			</div>
			<figure className="lightbox_stage">
				<img ref={ img } src={ src } alt={ `${ CATS[ p.c ][ 2 ] } photography by Visual Studios Plus` } />
			</figure>
			<button type="button" className="lbNav lbNav--prev" onClick={ () => go( -1 ) } aria-label="Previous photo">←</button>
			<button type="button" className="lbNav lbNav--next" onClick={ () => go( 1 ) } aria-label="Next photo">→</button>
		</div>
	);
}
