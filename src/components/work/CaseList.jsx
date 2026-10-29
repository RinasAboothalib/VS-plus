import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import projects from '../../data/projects.js';
import { gsap, reduced, ScrollTrigger } from '../../lib/motion.js';
import { ProjectCard } from './CaseItems.jsx';
import ReelViewer from '../social/ReelViewer.jsx';
import JellyCanvas from './JellyCanvas.jsx';

/* Filters (each project's `category`) and the two layout rows (its `group`). */
const CATEGORIES = [ [ 'social', 'Influencer / Social media campaigns' ], [ 'case', 'Digital Case Studies' ], [ 'tvc', 'TVC Campaigns' ] ];
const ROWS = [ [ 'reel', 'Reels' ], [ 'film', 'Films' ] ];

/* What the full-screen viewer shows for each project. */
const VIEW = projects.map( ( p ) => ( {
	title: p.title, kind: p.client, date: `${ p.format } · ${ p.date }`, summary: p.line,
	video: p.video, yt: p.yt, image: p.poster, shape: p.shape,
	url: p.url, linkLabel: `Open on ${ p.yt ? 'YouTube' : 'Instagram' } ↗`
} ) );

/*
 * The flagship portfolio: the studio's campaign videos. Vertical reels sit in
 * one row of equal 9:16 cards; landscape and square films in staggered pairs,
 * each at its own shape so nothing is cropped. Cards glide in from their own
 * side as you scroll and the logo pops onto the corner. Chips filter by
 * category; a card opens the video full screen with sound.
 */
export default function CaseList( { eyebrow = '(B) Flagship portfolio', id = 'case-studies' } ) {
	const section = useRef( null );
	const [ filter, setFilter ] = useState( 'all' );
	const [ open, setOpen ] = useState( null );
	const shown = useMemo( () => projects.map( ( p, i ) => i ).filter( ( i ) => filter === 'all' || projects[ i ].category === filter ), [ filter ] );

	// Each card glides in from its own side as it scrolls into view, then its logo pops
	// onto the picture's corner and the result rises in.
	const enter = ( card, extra = {} ) => {
		const fromRight = card.dataset.side === 'right';
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
			gsap.utils.toArray( '.projCard' ).forEach( ( card ) => {
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
			section.current.querySelectorAll( '.projCard:not([hidden])' ).forEach( ( card, n ) => enter( card, { delay: Math.min( n, 6 ) * 0.06 } ) );
		}
		ScrollTrigger.refresh();
	}, [ filter ] );

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
				{ /* Jelly edge (as on the photography archive): video frames dent toward the cursor and spring back. */ }
				<JellyCanvas selector=".projCard_media" />
				<div className="chipRow caseFilters" role="group" aria-label="Filter projects">
					{ chip( 'all', 'All', projects.length ) }
					{ CATEGORIES.map( ( [ key, label ] ) => chip( key, label, projects.filter( ( p ) => p.category === key ).length ) ) }
				</div>
				{ ROWS.map( ( [ key, label ] ) => {
					const members = projects.map( ( p, i ) => i ).filter( ( i ) => projects[ i ].group === key );
					const visible = members.filter( ( i ) => shown.includes( i ) );
					return (
						<div className="projGroup" key={ key } hidden={ ! visible.length }>
							<ol className={ `projGrid projGrid--${ key }` } aria-label={ label }>
								{ members.map( ( i ) => {
									// Position among the cards showing: reels' left half comes from the left,
									// films' right column from the right (and sits lower).
									const n = visible.indexOf( i );
									const right = key === 'reel' ? n % 4 >= 2 : n % 2 === 1;
									return (
										<ProjectCard key={ projects[ i ].id } p={ projects[ i ] } index={ i } hidden={ n < 0 } side={ right ? 'right' : 'left' }
											low={ key === 'film' && n % 2 === 1 } onOpen={ () => setOpen( i ) } />
									);
								} ) }
							</ol>
						</div>
					);
				} ) }
			</div>
			{ /* The viewer steps through the projects the current filter shows. */ }
			{ open !== null && (
				<ReelViewer items={ shown.map( ( i ) => VIEW[ i ] ) } index={ shown.indexOf( open ) }
					onIndex={ ( k ) => setOpen( shown[ k ] ) } onClose={ close } />
			) }
		</section>
	);
}
