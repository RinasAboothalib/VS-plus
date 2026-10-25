import { useRef } from 'react';
import data from '../../data/site.js';
import photos from '../../data/photos.json';
import useFlowRows from '../../lib/useFlowRows.js';
import TLink from '../TLink.jsx';

const PICKS = [ 'D85_3829-HDR.webp', 'KeelesFoodPhotography0403.webp', '7.webp', 'Palliyaguruge-Jewellers2.webp', 'DJI_0078-HDR.webp', 'CurryLeaf.webp', 'DSC_1657-2.webp', 'Tiesh-7077-1.webp', 'D85_2304.webp', 'KeelesFoodPhotography0314.webp', 'Tiesh-7224-1-2.webp', 'D85_3503.webp' ];
const ROW_A = PICKS.map( ( f ) => photos.find( ( p ) => p.f === f ) ).filter( Boolean );

/* Second row: twelve more from the archive, taken in turn from each category so it stays mixed. */
const ROW_B = ( () => {
	const rest = photos.filter( ( p ) => ! PICKS.includes( p.f ) );
	const byCat = data.photoCategories.map( ( [ id ] ) => rest.filter( ( p ) => p.c === id ) );
	const out = [];
	for ( let i = 0; out.length < 12 && i < 40; i++ ) {
		byCat.forEach( ( list ) => {
			const p = list[ i * 3 ];
			if ( p && out.length < 12 ) {
				out.push( p );
			}
		} );
	}
	return out;
} )();

/*
 * Portfolio as a motion flow: two endless rows of photographs gliding in
 * opposite directions (see useFlowRows). Scrolling speeds them up and turns
 * them; hovering a row slows it so a frame can be picked. Each photo opens
 * its category in the archive.
 */
export default function PhotoStrip() {
	const section = useRef( null );
	useFlowRows( section, '.photoStrip_row' );

	const slide = ( p, copy ) => {
		const cat = data.photoCategories.find( ( c ) => c[ 0 ] === p.c );
		return (
			<TLink key={ ( copy ? 'b' : 'a' ) + p.f } className="stripItem"
				to={ `/photography/?category=${ p.c }#gallery` } style={ { '--ar': `${ p.w } / ${ p.h }` } }
				aria-hidden={ copy || undefined } tabIndex={ copy ? -1 : undefined }>
				<span className="stripItem_img"><img src={ `/assets/photos/thumb/${ p.t }` } alt={ copy ? '' : `${ cat[ 2 ] } photography by Visual Studios Plus` } loading="lazy" decoding="async" /></span>
				<span className="stripItem_meta"><span>{ cat[ 2 ] }</span></span>
			</TLink>
		);
	};

	return (
		<section className="photoStrip" aria-labelledby="stripTitle" ref={ section }>
			<div className="photoStrip_head">
				<div>
					<p className="eyebrow">(03) Our photography</p>
					<h2 className="sectionTitle" id="stripTitle">Portfolio</h2>
					<p className="lede">Tactile luxury across Gastronomy, Architecture, and High Fashion.</p>
				</div>
				<div className="photoStrip_ctrl">
					<TLink className="btnLink" to="/photography/">Explore the archive</TLink>
				</div>
			</div>
			{ [ ROW_A, ROW_B ].map( ( row, r ) => (
				<div className="photoStrip_track" key={ r }>
					<div className="photoStrip_row">
						{ row.map( ( p ) => slide( p, false ) ) }
						{ row.map( ( p ) => slide( p, true ) ) }
					</div>
				</div>
			) ) }
		</section>
	);
}
