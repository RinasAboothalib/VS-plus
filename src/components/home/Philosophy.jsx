import { useLayoutEffect, useRef, useState } from 'react';
import data from '../../data/site.js';
import { pad, ScrollTrigger } from '../../lib/motion.js';
import TeamCards from '../illustrations/TeamCards.jsx';

/* Six operating phases; the one crossing 60% of the viewport lights up and drives the big counter. */
export default function Philosophy() {
	const list = useRef( null );
	const [ active, setActive ] = useState( 0 );

	useLayoutEffect( () => {
		const triggers = Array.from( list.current.children ).map( ( li, i ) => ScrollTrigger.create( {
			trigger: li,
			start: 'top 60%',
			end: 'bottom 60%',
			onToggle: ( self ) => self.isActive && setActive( i )
		} ) );
		return () => triggers.forEach( ( t ) => t.kill() );
	}, [] );

	return (
		<section className="philosophy" aria-labelledby="philTitle">
			<div className="philosophy_inner">
				<div className="philosophy_head">
					<p className="eyebrow">(03) Agency operating philosophy</p>
					<h2 className="sectionTitle" id="philTitle">We create. We strategize. We execute. We amplify. We measure. We grow.</h2>
					<TeamCards className="illus--phil" />
					<p className="philosophy_counter" aria-hidden="true"><span>{ pad( active + 1 ) }</span> / 06</p>
				</div>
				<ol className="phaseList" ref={ list }>
					{ data.philosophy.map( ( [ phase, title, text, proof ], i ) => (
						<li className={ `phase${ i === active ? ' is-active' : '' }` } key={ title }>
							<p className="phase_meta"><span>{ pad( i + 1 ) } / 06</span><span>Phase { pad( i + 1 ) } · { phase }</span></p>
							<h3 className="phase_title">{ title }</h3>
							<p className="phase_text">{ text }</p>
							<p className="phase_proof">{ proof }</p>
						</li>
					) ) }
				</ol>
			</div>
		</section>
	);
}
