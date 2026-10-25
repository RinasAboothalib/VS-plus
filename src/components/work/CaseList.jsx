import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import data from '../../data/site.js';
import { gsap, reduced, ScrollTrigger, slugify } from '../../lib/motion.js';
import { CaseDialog, CaseSlide } from './CaseItems.jsx';

/*
 * The flagship portfolio in pairs, laid out like the Work page's "TVC & films":
 * two columns of whole pictures, the second of each pair set lower, title and
 * tags beneath, each project's headline result pinned on its picture. Cards
 * glide in from their own side as you scroll and the logo pops onto the corner. Type
 * chips filter it; a card opens the full case study.
 */
export default function CaseList( { eyebrow = '(B) Flagship portfolio', id = 'case-studies' } ) {
	const section = useRef( null );
	const grid = useRef( null );
	const [ filter, setFilter ] = useState( 'all' );
	const [ open, setOpen ] = useState( null );
	const types = useMemo( () => [ ...new Set( data.caseStudies.map( ( c ) => c[ 0 ] ) ) ], [] );
	const matching = useMemo( () => data.caseStudies.map( ( c, i ) => i ).filter( ( i ) => filter === 'all' || slugify( data.caseStudies[ i ][ 0 ] ) === filter ), [ filter ] );

	// Each card glides in from its own side as it scrolls into view (left column from the left,
	// right column from the right), then its logo pops onto the picture's corner.
	const enter = ( card, extra = {} ) => {
		const fromRight = card.classList.contains( 'caseSlide--low' );
		return gsap.timeline( extra )
			.fromTo( card, { x: fromRight ? 140 : -140, rotate: fromRight ? 2.5 : -2.5, opacity: 0 }, { x: 0, rotate: 0, opacity: 1, duration: 1.3, ease: 'expo.out' } )
			.fromTo( card.querySelector( '.caseLogo' ), { scale: 0, rotate: -18 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(2.2)' }, 0.45 )
			.fromTo( card.querySelector( '.caseSlide_result' ), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, 0.6 );
	};

	useLayoutEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const ctx = gsap.context( () => {
			gsap.utils.toArray( '.caseSlide' ).forEach( ( card ) => {
				enter( card, { scrollTrigger: { trigger: card, start: 'top 88%', once: true } } );
			} );
		}, section );
		return () => ctx.revert();
	}, [] );

	// A new filter: the cards now shown glide in again, and every trigger below is re-measured.
	const firstRun = useRef( true );
	useEffect( () => {
		if ( firstRun.current ) {
			firstRun.current = false;
			return;
		}
		if ( ! reduced ) {
			grid.current.querySelectorAll( '.caseSlide:not([hidden])' ).forEach( ( card, n ) => enter( card, { delay: Math.min( n, 6 ) * 0.06 } ) );
		}
		ScrollTrigger.refresh();
	}, [ filter ] );

	// Previous / next inside the open case study follow the current filter.
	const step = useCallback( ( d ) => setOpen( ( cur ) => {
		const at = matching.indexOf( cur );
		return matching[ ( at + d + matching.length ) % matching.length ];
	} ), [ matching ] );
	const close = useCallback( () => setOpen( null ), [] );

	const chip = ( key, label, count ) => (
		<button key={ key } type="button" className={ `chip${ filter === key ? ' is-active' : '' }` } aria-pressed={ filter === key } onClick={ () => setFilter( key ) }>
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
						<CaseSlide key={ c[ 3 ] } c={ c } index={ i } hidden={ ! matching.includes( i ) } low={ matching.indexOf( i ) % 2 === 1 } onOpen={ () => setOpen( i ) } />
					) ) }
				</ol>
			</div>
			{ open !== null && <CaseDialog c={ data.caseStudies[ open ] } onClose={ close } onStep={ step } /> }
		</section>
	);
}
