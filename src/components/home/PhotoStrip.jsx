import { useRef } from 'react';
import posts from '../../data/instagram.js';
import useFlowRows from '../../lib/useFlowRows.js';
import TLink from '../TLink.jsx';

/* Both rows carry all the latest Instagram posts (too few to split and still fill a wide screen); the second starts halfway through, reversed. */
const ROW_A = posts;
const ROW_B = [ ...posts.slice( 6 ), ...posts.slice( 0, 6 ) ].reverse();

/*
 * Portfolio as a motion flow: two endless rows of photographs gliding in
 * opposite directions (see useFlowRows). Scrolling speeds them up and turns
 * them; hovering a row slows it so a frame can be picked. The covers are
 * the studio's latest Instagram posts; each opens its post.
 */
export default function PhotoStrip() {
	const section = useRef( null );
	useFlowRows( section, '.photoStrip_row' );

	const slide = ( p, copy ) => (
		<TLink key={ ( copy ? 'b' : 'a' ) + p.id } className="stripItem"
			to={ p.url } style={ { '--ar': `${ p.w } / ${ p.h }` } }
			aria-hidden={ copy || undefined } tabIndex={ copy ? -1 : undefined }>
			<span className="stripItem_img"><img src={ p.src } alt={ copy ? '' : `Visual Studios Plus Instagram ${ p.kind.toLowerCase() }, ${ p.date }` } decoding="async" /></span>
			<span className="stripItem_meta"><span>{ p.kind } · { p.date }</span></span>
		</TLink>
	);

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
