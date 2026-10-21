import { useEffect, useMemo, useRef, useState } from 'react';
import data from '../../data/site.js';
import { gsap, reduced, ScrollTrigger, slugify } from '../../lib/motion.js';
import { CaseRow } from './CaseItems.jsx';

/* The flagship portfolio: heading, type filter chips and every case study as a row with its cover. */
export default function CaseList( { eyebrow = '(B) Flagship portfolio', id = 'case-studies' } ) {
	const list = useRef( null );
	const [ filter, setFilter ] = useState( 'all' );
	const first = useRef( true );
	const types = useMemo( () => [ ...new Set( data.caseStudies.map( ( c ) => c[ 0 ] ) ) ], [] );
	const [ active, setActive ] = useState( () => new Set() );

	/*
	 * A card opens once its top rises past 75% of the viewport and stays open
	 * while you read on; it only closes again when it drops back below that line
	 * (scrolling up). Never closing at the top keeps the page from jumping.
	 */
	useEffect( () => {
		const io = new IntersectionObserver( ( entries ) => {
			setActive( ( prev ) => {
				const next = new Set( prev );
				entries.forEach( ( e ) => {
					const i = Number( e.target.dataset.index );
					if ( e.isIntersecting ) {
						next.add( i );
					} else if ( e.boundingClientRect.top > ( e.rootBounds?.bottom ?? window.innerHeight * 0.75 ) ) {
						next.delete( i );
					}
				} );
				return next;
			} );
		}, { rootMargin: '0px 0px -25% 0px' } );
		list.current.querySelectorAll( '.caseCard' ).forEach( ( el ) => io.observe( el ) );
		return () => io.disconnect();
	}, [] );

	// Opening or closing cards changes the page height; once their 0.75s transition
	// settles, re-measure every ScrollTrigger below (e.g. the philosophy phases).
	useEffect( () => {
		const t = setTimeout( () => ScrollTrigger.refresh(), 850 );
		return () => clearTimeout( t );
	}, [ active ] );

	useEffect( () => {
		if ( first.current ) {
			first.current = false;
			return;
		}
		const shown = list.current.querySelectorAll( '.caseCard:not([hidden])' );
		if ( ! reduced ) {
			gsap.fromTo( shown, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power2.out' } );
		}
		ScrollTrigger.refresh();
	}, [ filter ] );

	const chip = ( key, label, count ) => (
		<button key={ key } type="button" className={ `chip${ filter === key ? ' is-active' : '' }` } aria-pressed={ filter === key } onClick={ () => setFilter( key ) }>
			{ label } <sup>{ count }</sup>
		</button>
	);

	return (
		<section className="caseSection" id={ id } aria-labelledby={ `${ id }-title` }>
			<div className="caseInner">
				<div className="caseHead">
					<div>
						<p className="eyebrow">{ eyebrow }</p>
						<h2 className="sectionTitle" id={ `${ id }-title` }>Projects engineered for verifiable business impact.</h2>
					</div>
					<p className="lede">Every client brief is treated as a growth partnership. We blend high-fashion visual standards with aggressive social media reach, high-velocity turnaround, and conversion-driven storytelling.</p>
				</div>
				<div className="chipRow caseFilters" role="group" aria-label="Filter projects">
					{ chip( 'all', 'All', data.caseStudies.length ) }
					{ types.map( ( t ) => chip( slugify( t ), t, data.caseStudies.filter( ( c ) => c[ 0 ] === t ).length ) ) }
				</div>
				<ol className="caseList" ref={ list }>
					{ data.caseStudies.map( ( c, i ) => (
						<CaseRow key={ c[ 3 ] } c={ c } index={ i } active={ active.has( i ) || reduced }
							hidden={ filter !== 'all' && slugify( c[ 0 ] ) !== filter } />
					) ) }
				</ol>
			</div>
		</section>
	);
}
