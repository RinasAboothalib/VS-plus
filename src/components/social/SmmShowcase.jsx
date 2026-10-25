import { useEffect, useRef, useState } from 'react';
import { gsap, reduced, ScrollTrigger } from '../../lib/motion.js';
import ReelViewer from './ReelViewer.jsx';

const V = ( file, title, wide = false ) => ( { video: `/assets/smm/${ file }.mp4`, image: `/assets/smm/${ file }.jpg`, title, wide } );

/* The studio's own social work, by client: vertical reels and landscape films. */
const CLIENTS = [
	[ 'Green Cabin', 'Food reels', [
		V( 'green-cabin-chicken-cone', 'Chicken cone' ),
		V( 'green-cabin-lamprice', 'Lamprais' ),
		V( 'green-cabin-milo-swissroll', 'Milo Swiss roll' ),
		V( 'green-cabin-pork-bun', 'Pork bun' ),
		V( 'green-cabin-prawn-pocket', 'Prawn pocket' ),
		V( 'green-cabin-reel-05', 'Reel 05' )
	] ],
	[ 'Ritzbury', 'Product reels', [ 1, 2, 3, 4, 5 ].map( ( n ) => V( `ritzbury-reel-${ n }`, `Reel ${ n }` ) ) ],
	[ 'Turbomed', 'Brand reel', [ V( 'turbomed-reel-01', 'Reel 01' ) ] ],
	[ 'Hayleys', 'Brand film', [ V( 'hayleys-film', 'Hayleys film', true ) ] ],
	[ 'Waga', 'Web films', [ V( 'waga-web-01', 'Web film 01', true ), V( 'waga-web-02', 'Web film 02', true ), V( 'waga-web-03', 'Web film 03', true ) ] ],
	[ 'Medium', 'Video concept', [ V( 'medium-concept-02', 'Video concept 02', true ) ] ]
];

/* A muted loop that only plays while it is on screen. */
function Clip( { item, client, onOpen } ) {
	const ref = useRef( null );
	useEffect( () => {
		const v = ref.current;
		if ( reduced || ! v ) {
			return undefined;
		}
		const io = new IntersectionObserver( ( [ e ] ) => {
			if ( e.isIntersecting ) {
				v.play().catch( () => {} );
			} else {
				v.pause();
			}
		}, { threshold: 0.4 } );
		io.observe( v );
		return () => io.disconnect();
	}, [] );

	return (
		<li className={ `smmClip${ item.wide ? ' smmClip--wide' : '' }` }>
			<button type="button" className="smmClip_btn" onClick={ onOpen } aria-label={ `Play ${ client } — ${ item.title } with sound` }>
				<video ref={ ref } src={ item.video } poster={ item.image } muted loop playsInline preload="none" aria-hidden="true" />
				<span className="smmClip_play" aria-hidden="true">▶</span>
			</button>
			<p className="smmClip_cap"><span>{ client }</span>{ item.title }</p>
		</li>
	);
}

/* "Work in motion": client tabs over a row of the studio's reels and films; any clip opens full screen with sound. */
export default function SmmShowcase( { eyebrow = '(04) Work in motion' } ) {
	const [ tab, setTab ] = useState( 0 );
	const [ open, setOpen ] = useState( null );
	const row = useRef( null );
	const [ client, kind, items ] = CLIENTS[ tab ];

	// Switching client: the new clips rise in, and the row scrolls back to its start.
	useEffect( () => {
		const el = row.current;
		el.scrollLeft = 0;
		if ( ! reduced ) {
			gsap.fromTo( el.children, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06 } );
		}
		ScrollTrigger.refresh();
	}, [ tab ] );

	return (
		<section className="svcPage svcPage--dark smmShow" aria-labelledby="smmShowTitle">
			<div className="svcPage_inner">
				<div className="smmShow_head">
					<div>
						<p className="eyebrow">{ eyebrow }</p>
						<h2 className="sectionTitle" id="smmShowTitle">Made for the feed.</h2>
					</div>
					<p className="lede">Reels and films shot and edited in-house for our clients. Tap any clip to watch it with sound.</p>
				</div>
				<div className="smmShow_tabs" role="tablist" aria-label="Clients">
					{ CLIENTS.map( ( [ name, , list ], i ) => (
						<button key={ name } type="button" role="tab" aria-selected={ tab === i } aria-controls="smmShowRow"
							className={ tab === i ? 'is-active' : undefined } onClick={ () => setTab( i ) }>
							{ name }<sup>{ list.length }</sup>
						</button>
					) ) }
				</div>
				<p className="smmShow_kind">{ client } · { kind }</p>
				<ul className="smmShow_row" id="smmShowRow" role="tabpanel" ref={ row }>
					{ items.map( ( item, i ) => <Clip key={ item.video } item={ item } client={ client } onOpen={ () => setOpen( i ) } /> ) }
				</ul>
			</div>
			{ open !== null && (
				<ReelViewer items={ items.map( ( it ) => ( { ...it, kind: client, date: kind } ) ) } index={ open } onIndex={ setOpen } onClose={ () => setOpen( null ) } />
			) }
		</section>
	);
}
