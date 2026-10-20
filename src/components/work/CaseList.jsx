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

	useEffect( () => {
		if ( first.current ) {
			first.current = false;
			return;
		}
		const shown = list.current.querySelectorAll( '.caseRow:not([hidden])' );
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
						<CaseRow key={ c[ 3 ] } c={ c } index={ i } hidden={ filter !== 'all' && slugify( c[ 0 ] ) !== filter } />
					) ) }
				</ol>
			</div>
		</section>
	);
}
