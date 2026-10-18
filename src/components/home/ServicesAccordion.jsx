import { useRef, useState } from 'react';
import data from '../../data/site.js';
import { pad, ScrollTrigger } from '../../lib/motion.js';
import TLink from '../TLink.jsx';
import HoverDot from '../HoverDot.jsx';
import Megaphone from '../illustrations/Megaphone.jsx';
import FloatPreview from '../FloatPreview.jsx';

export default function ServicesAccordion() {
	const [ open, setOpen ] = useState( 0 );
	const [ hover, setHover ] = useState( null );
	const list = useRef( null );
	const section = useRef( null );

	const toggle = ( i ) => {
		setOpen( ( cur ) => ( cur === i ? -1 : i ) );
		setTimeout( () => ScrollTrigger.refresh(), 550 );
	};

	return (
		<section className="servicesSection" id="services" ref={ section } onMouseLeave={ () => setHover( null ) }>
			<div className="servicesInner">
				<div className="servicesHead">
					<p className="eyebrow">(04) Capabilities overview</p>
					<h2 className="sectionTitle">One full-service studio.<br />Zero creative fragmentation.</h2>
					<p className="servicesLede">Need a custom agency retainer or dedicated production team? We work on project-by-project commissions and full-year creative retainers.</p>
					<TLink className="btnLink" to="/services/">All capabilities</TLink>
					<Megaphone className="illus--svc" />
				</div>
				<ul className="accordion" ref={ list } onMouseLeave={ () => setHover( null ) }>
					<HoverDot list={ list } center={ ( li ) => li.offsetTop + li.querySelector( 'button' ).offsetHeight / 2 } />
					{ data.services.map( ( [ slug, name, statement ], i ) => (
						<li key={ slug } className={ open === i ? 'is-open' : undefined } onMouseEnter={ () => setHover( slug ) }>
							<button type="button" aria-expanded={ open === i } aria-controls={ `svc-${ i }` } onClick={ () => toggle( i ) }>
								<span className="accNum">{ pad( i + 1 ) }</span>
								<span className="accName">{ name }</span>
								<span className="accIcon" aria-hidden="true"></span>
							</button>
							<div className="accPanel" id={ `svc-${ i }` } role="region">
								<div><p>{ statement } <TLink to={ `/services/#${ slug }` }>Explore { name } →</TLink></p></div>
							</div>
						</li>
					) ) }
				</ul>
			</div>
			<FloatPreview container={ section } active={ hover } />
		</section>
	);
}
