import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import data from '../../data/site.js';
import { gsap, reduced, ScrollTrigger, slugify } from '../../lib/motion.js';
import { CaseDialog, CaseSlide } from './CaseItems.jsx';

/* Pairs shown before "Show all". */
const FIRST = 6;

/*
 * The flagship portfolio in pairs, laid out like the Work page's "TVC & films":
 * two columns of big rounded pictures, the second of each pair set lower, title
 * and tags beneath, each project's headline result pinned on its picture. Type
 * chips filter it; a card opens the full case study.
 */
export default function CaseList( { eyebrow = '(B) Flagship portfolio', id = 'case-studies' } ) {
	const section = useRef( null );
	const grid = useRef( null );
	const [ filter, setFilter ] = useState( 'all' );
	const [ all, setAll ] = useState( false );
	const [ open, setOpen ] = useState( null );
	const types = useMemo( () => [ ...new Set( data.caseStudies.map( ( c ) => c[ 0 ] ) ) ], [] );
	const matching = useMemo( () => data.caseStudies.map( ( c, i ) => i ).filter( ( i ) => filter === 'all' || slugify( data.caseStudies[ i ][ 0 ] ) === filter ), [ filter ] );
	const shown = all ? matching : matching.slice( 0, FIRST );

	// Cards rise in as each one scrolls into view.
	useLayoutEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const ctx = gsap.context( () => {
			gsap.utils.toArray( '.caseSlide' ).forEach( ( card ) => {
				gsap.from( card, { y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 92%', once: true } } );
			} );
		}, section );
		return () => ctx.revert();
	}, [] );

	// A new filter, or "Show all": the newly shown cards fade up, and every trigger below is re-measured.
	const firstRun = useRef( true );
	useEffect( () => {
		if ( firstRun.current ) {
			firstRun.current = false;
			return;
		}
		if ( ! reduced ) {
			gsap.fromTo( grid.current.querySelectorAll( '.caseSlide:not([hidden])' ), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.05 } );
		}
		ScrollTrigger.refresh();
	}, [ filter, all ] );

	// Previous / next inside the open case study follow the current filter.
	const step = useCallback( ( d ) => setOpen( ( cur ) => {
		const at = matching.indexOf( cur );
		return matching[ ( at + d + matching.length ) % matching.length ];
	} ), [ matching ] );
	const close = useCallback( () => setOpen( null ), [] );

	const pick = ( key ) => {
		setFilter( key );
		setAll( false );
	};
	const chip = ( key, label, count ) => (
		<button key={ key } type="button" className={ `chip${ filter === key ? ' is-active' : '' }` } aria-pressed={ filter === key } onClick={ () => pick( key ) }>
			{ label } <sup>{ count }</sup>
		</button>
	);

	return (
		<section className="caseSection caseSection--pairs" id={ id } aria-labelledby={ `${ id }-title` } ref={ section }>
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
				<ol className="casePairs" ref={ grid } aria-label="Flagship projects">
					{ data.caseStudies.map( ( c, i ) => (
						<CaseSlide key={ c[ 3 ] } c={ c } index={ i } hidden={ ! shown.includes( i ) } low={ shown.indexOf( i ) % 2 === 1 } onOpen={ () => setOpen( i ) } />
					) ) }
				</ol>
				{ matching.length > FIRST && (
					<div className="casePairs_more">
						<button type="button" className="pillBtn" onClick={ () => setAll( ( a ) => ! a ) } aria-expanded={ all }>
							{ all ? 'Show fewer projects' : `Show all ${ matching.length } projects` }
						</button>
					</div>
				) }
			</div>
			{ open !== null && <CaseDialog c={ data.caseStudies[ open ] } onClose={ close } onStep={ step } /> }
		</section>
	);
}
