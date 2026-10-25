import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import data from '../../data/site.js';
import { gsap, reduced, ScrollTrigger, slugify } from '../../lib/motion.js';
import { CaseDialog, CaseSlide } from './CaseItems.jsx';

/*
 * The flagship portfolio as a carousel, laid out like the Work page's "TVC &
 * films": big rounded pictures on a staggered line, title and tags beneath,
 * each project's headline result pinned on its picture. Arrows, swipe or
 * trackpad move it; type chips filter it; a card opens the full case study.
 */
export default function CaseList( { eyebrow = '(B) Flagship portfolio', id = 'case-studies' } ) {
	const section = useRef( null );
	const track = useRef( null );
	const [ filter, setFilter ] = useState( 'all' );
	const [ open, setOpen ] = useState( null );
	const [ ends, setEnds ] = useState( [ true, false ] );
	const types = useMemo( () => [ ...new Set( data.caseStudies.map( ( c ) => c[ 0 ] ) ) ], [] );
	const shown = useMemo( () => data.caseStudies.map( ( c, i ) => i ).filter( ( i ) => filter === 'all' || slugify( data.caseStudies[ i ][ 0 ] ) === filter ), [ filter ] );

	// Arrow buttons switch off at either end of the track.
	const measure = useCallback( () => {
		const el = track.current;
		setEnds( [ el.scrollLeft < 8, el.scrollLeft + el.clientWidth > el.scrollWidth - 8 ] );
	}, [] );

	useEffect( () => {
		const el = track.current;
		measure();
		el.addEventListener( 'scroll', measure, { passive: true } );
		window.addEventListener( 'resize', measure );
		return () => {
			el.removeEventListener( 'scroll', measure );
			window.removeEventListener( 'resize', measure );
		};
	}, [ measure ] );

	// Slides rise in, one after another, the first time the section comes into view.
	useLayoutEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const ctx = gsap.context( () => {
			gsap.from( '.caseSlide', {
				y: 80, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08,
				scrollTrigger: { trigger: track.current, start: 'top 85%', once: true }
			} );
		}, section );
		return () => ctx.revert();
	}, [] );

	// A new filter: back to the start, with the remaining cards sliding in from the right.
	const firstFilter = useRef( true );
	useEffect( () => {
		if ( firstFilter.current ) {
			firstFilter.current = false;
			return;
		}
		track.current.scrollTo( { left: 0 } );
		if ( ! reduced ) {
			gsap.fromTo( track.current.querySelectorAll( '.caseSlide:not([hidden])' ), { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.05 } );
		}
		measure();
		ScrollTrigger.refresh();
	}, [ filter, measure ] );

	const go = ( dir ) => {
		const el = track.current;
		const card = el.querySelector( '.caseSlide:not([hidden])' );
		const step = card ? card.offsetWidth + parseFloat( getComputedStyle( el ).columnGap || 0 ) : el.clientWidth * 0.8;
		el.scrollBy( { left: dir * step, behavior: reduced ? 'auto' : 'smooth' } );
	};

	// Previous / next inside the open case study follow the current filter.
	const step = useCallback( ( d ) => setOpen( ( cur ) => {
		const at = shown.indexOf( cur );
		return shown[ ( at + d + shown.length ) % shown.length ];
	} ), [ shown ] );
	const close = useCallback( () => setOpen( null ), [] );

	const chip = ( key, label, count ) => (
		<button key={ key } type="button" className={ `chip${ filter === key ? ' is-active' : '' }` } aria-pressed={ filter === key } onClick={ () => setFilter( key ) }>
			{ label } <sup>{ count }</sup>
		</button>
	);

	return (
		<section className="caseSection caseSection--rail" id={ id } aria-labelledby={ `${ id }-title` } ref={ section }>
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
			</div>
			<div className="caseRail_wrap">
				<button type="button" className="caseRail_arrow caseRail_arrow--prev" onClick={ () => go( -1 ) } disabled={ ends[ 0 ] } aria-label="Previous projects">←</button>
				<button type="button" className="caseRail_arrow caseRail_arrow--next" onClick={ () => go( 1 ) } disabled={ ends[ 1 ] } aria-label="Next projects">→</button>
				<ol className="caseRail" ref={ track } aria-label="Flagship projects">
					{ data.caseStudies.map( ( c, i ) => (
						<CaseSlide key={ c[ 3 ] } c={ c } index={ i } hidden={ ! shown.includes( i ) } low={ shown.indexOf( i ) % 2 === 1 } onOpen={ () => setOpen( i ) } />
					) ) }
				</ol>
			</div>
			{ open !== null && <CaseDialog c={ data.caseStudies[ open ] } onClose={ close } onStep={ step } /> }
		</section>
	);
}
