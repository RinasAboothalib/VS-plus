import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import data from '../data/site.js';
import photos from '../data/photos.json';
import { usePage } from '../context/PageContext.jsx';
import { useSheet } from '../context/SheetContext.jsx';
import useReveals from '../lib/useReveals.js';
import { gsap, reduced, ScrollTrigger } from '../lib/motion.js';
import PageHero from '../components/PageHero.jsx';
import Lightbox from '../components/work/Lightbox.jsx';
import JellyCanvas from '../components/work/JellyCanvas.jsx';

const PAGE_SIZE = 24;
const CATS = Object.fromEntries( data.photoCategories.map( ( c ) => [ c[ 0 ], c ] ) );
const colCount = () => ( window.innerWidth < 600 ? 2 : window.innerWidth < 1000 ? 3 : 4 );

/* Masonry by shortest column (tracked by aspect ratio), so "load more" only appends. */
function distribute( list, n ) {
	const cols = Array.from( { length: n }, () => [] );
	const heights = new Array( n ).fill( 0 );
	list.forEach( ( p, i ) => {
		const at = heights.indexOf( Math.min( ...heights ) );
		cols[ at ].push( { p, i } );
		heights[ at ] += p.h / p.w + 0.12;
	} );
	return cols;
}

export default function Photography() {
	const root = useRef( null );
	const grid = useRef( null );
	const [ params, setParams ] = useSearchParams();
	const current = CATS[ params.get( 'category' ) ] ? params.get( 'category' ) : 'all';
	const [ shown, setShown ] = useState( PAGE_SIZE );
	const [ n, setN ] = useState( colCount );
	const [ open, setOpen ] = useState( -1 );
	const { has, toggle } = useSheet();
	const prevShown = useRef( 0 );

	usePage( {
		page: 'photography',
		title: 'Photography Portfolio — Visual Studios Plus',
		description: 'The Visual Studios Plus photography portfolio — food, fashion, jewellery and hospitality, interior & architecture photography from Colombo, Sri Lanka.',
		cta: { title: 'Have a product, a place or a plate to shoot?' }
	} );
	useReveals( root );

	const list = useMemo( () => ( current === 'all' ? photos : photos.filter( ( p ) => p.c === current ) ), [ current ] );
	const cols = useMemo( () => distribute( list.slice( 0, shown ), n ), [ list, shown, n ] );

	useEffect( () => {
		const onResize = () => setN( colCount() );
		window.addEventListener( 'resize', onResize );
		return () => window.removeEventListener( 'resize', onResize );
	}, [] );

	// New category: start over from the first page.
	useEffect( () => {
		setShown( PAGE_SIZE );
		prevShown.current = 0;
	}, [ current ] );

	// Fade in only the tiles that were just added.
	useLayoutEffect( () => {
		const fresh = Array.from( grid.current.querySelectorAll( '.galleryItem' ) )
			.filter( ( el ) => Number( el.dataset.i ) >= prevShown.current );
		prevShown.current = Math.min( shown, list.length );
		if ( ! reduced && fresh.length ) {
			gsap.from( fresh, { opacity: 0, y: 30, duration: 0.7, stagger: 0.03, ease: 'power3.out' } );
		}
		ScrollTrigger.refresh();
	}, [ shown, current ] );

	const setCat = ( id ) => {
		const next = new URLSearchParams( params );
		if ( id === 'all' ) {
			next.delete( 'category' );
		} else {
			next.set( 'category', id );
		}
		setParams( next, { replace: true, preventScrollReset: true } );
	};

	const left = list.length - shown;

	return (
		<div ref={ root }>
			<PageHero eyebrow={ `Photography — ${ photos.length } images` } lines={ [ 'Photography', 'portfolio' ] }
				lede="Food, fashion, jewellery, hospitality, interiors and architecture. Select a frame to view it full screen — or add it to your contact sheet as a reference for your brief." />

			<div className="bg-white">
				<section className="gallerySection" id="gallery" aria-labelledby="galleryTitle">
					<div className="galleryHead">
						<h2 className="eyebrow" id="galleryTitle">Browse the archive</h2>
						<div className="chipRow galleryFilters" role="group" aria-label="Filter by category">
							<button type="button" className={ `chip${ current === 'all' ? ' is-active' : '' }` } aria-pressed={ current === 'all' } onClick={ () => setCat( 'all' ) }>
								All <sup>{ photos.length }</sup>
							</button>
							{ data.photoCategories.map( ( [ id, name ] ) => (
								<button key={ id } type="button" className={ `chip${ current === id ? ' is-active' : '' }` } aria-pressed={ current === id } onClick={ () => setCat( id ) }>
									{ name } <sup>{ photos.filter( ( p ) => p.c === id ).length }</sup>
								</button>
							) ) }
						</div>
					</div>

					{ /* Jelly edge (as on the Work page films): frames dent toward the cursor and spring back. */ }
					<JellyCanvas selector=".galleryOpen" />
					<div className="galleryGrid" ref={ grid } aria-live="polite">
						{ cols.map( ( col, c ) => (
							<div className="galleryCol" key={ c }>
								{ col.map( ( { p, i } ) => {
									const inSheet = has( p.f );
									const cat = CATS[ p.c ];
									return (
										<figure className="galleryItem" key={ p.f } data-i={ i } style={ { '--ar': `${ p.w } / ${ p.h }` } }>
											<button type="button" className="galleryOpen" onClick={ () => setOpen( i ) } aria-label={ `Open ${ cat[ 2 ] } photograph ${ i + 1 }` }>
												<img src={ `/assets/photos/thumb/${ p.t }` } alt={ `${ cat[ 2 ] } photography by Visual Studios Plus — image ${ i + 1 }` }
													loading="lazy" decoding="async" width={ p.w } height={ p.h } />
											</button>
											<figcaption><span>{ cat[ 2 ] }</span><span>{ String( i + 1 ).padStart( 3, '0' ) }</span></figcaption>
											<button type="button" className={ `sheetAdd${ inSheet ? ' is-in' : '' }` } aria-pressed={ inSheet }
												aria-label="Add this photo to your contact sheet" onClick={ () => toggle( p.f ) }>
												{ inSheet ? '✓' : '+' }
											</button>
										</figure>
									);
								} ) }
							</div>
						) ) }
					</div>

					<div className="galleryMore">
						{ left > 0 && (
							<button type="button" className="pillBtn pillBtn--dark" onClick={ () => setShown( ( s ) => s + PAGE_SIZE ) }>
								Load more ({ left } remaining)
							</button>
						) }
					</div>
				</section>
			</div>

			{ open >= 0 && <Lightbox items={ list } index={ open } onIndex={ setOpen } onClose={ () => setOpen( -1 ) } /> }
		</div>
	);
}
