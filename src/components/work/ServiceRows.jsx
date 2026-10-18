import { useRef, useState } from 'react';
import data from '../../data/site.js';
import { pad } from '../../lib/motion.js';
import TLink from '../TLink.jsx';
import FloatPreview from '../FloatPreview.jsx';

/*
 * Big service rows. Hovering a row lifts it, turns its arrow lime and floats
 * that discipline's reel (or still) beside the cursor.
 */
export default function ServiceRows() {
	const wrap = useRef( null );
	const [ active, setActive ] = useState( null );

	return (
		<section className="svcRows" aria-labelledby="svcRowsTitle" ref={ wrap } onMouseLeave={ () => setActive( null ) }>
			<div className="svcRows_head">
				<p className="eyebrow">Disciplines</p>
				<h2 className="sectionTitle" id="svcRowsTitle">Nine disciplines, one studio.</h2>
			</div>
			<ul className="svcRows_list">
				{ data.services.map( ( [ slug, name, , bullets ], i ) => (
					<li key={ slug } className={ active === slug ? 'is-active' : undefined } onMouseEnter={ () => setActive( slug ) }>
						<TLink to={ `#${ slug }` } className="svcRow">
							<span className="svcRow_num">{ pad( i + 1 ) }</span>
							<span className="svcRow_name">{ name }</span>
							<span className="svcRow_points">{ bullets.join( ' · ' ) }</span>
							<span className="svcRow_arrow" aria-hidden="true">→</span>
						</TLink>
					</li>
				) ) }
			</ul>
			<FloatPreview container={ wrap } active={ active } />
		</section>
	);
}
