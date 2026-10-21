import { useRef } from 'react';
import data from '../../data/site.js';
import useFlowRows from '../../lib/useFlowRows.js';

/*
 * Client roster as a motion flow: the logos run in two endless rows that
 * glide in opposite directions. Scrolling speeds the flow up and turns it
 * with the scroll direction; it eases back to a drift afterwards, and slows
 * right down while the pointer rests on a row.
 */
export default function Roster( { eyebrow, title } ) {
	const root = useRef( null );
	const half = Math.ceil( data.clients.length / 2 );
	const rows = [ data.clients.slice( 0, half ), data.clients.slice( half ) ];

	useFlowRows( root, '.rosterFlow_track' );

	return (
		<section className="rosterSection" aria-labelledby="rosterTitle" ref={ root }>
			<div className="rosterInner">
				<p className="eyebrow">{ eyebrow }</p>
				<h2 className="sectionTitle" id="rosterTitle">{ title }</h2>
				<p className="lede">From global FMCG giants to boutique luxury houses across Sri Lanka &amp; international markets.</p>
			</div>
			<div className="rosterFlow">
				{ rows.map( ( row, r ) => (
					<div className="rosterFlow_row" key={ r }>
						<ul className="rosterFlow_track">
							{ /* Rendered twice so the loop is seamless; the copy is hidden from assistive tech. */ }
							{ [ 0, 1 ].map( ( copy ) => row.map( ( [ file, name, sector ] ) => (
								<li className="rosterItem" key={ `${ copy }-${ file }` } aria-hidden={ copy === 1 || undefined }>
									<img src={ `/assets/logos/${ file }` } alt={ copy === 1 ? '' : name } loading="lazy" />
									<span>{ sector }</span>
								</li>
							) ) ) }
						</ul>
					</div>
				) ) }
			</div>
		</section>
	);
}
