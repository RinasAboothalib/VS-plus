import { useRef, useState } from 'react';
import data from '../../data/site.js';
import { pad, ScrollTrigger } from '../../lib/motion.js';
import TLink from '../TLink.jsx';
import HoverDot from '../HoverDot.jsx';
import Megaphone from '../illustrations/Megaphone.jsx';
import FloatPreview, { SERVICE_MEDIA } from '../FloatPreview.jsx';

/* Hover preview for each of the eleven services, reusing the studio's reels and stills. */
const LIST_MEDIA = {
	'social-media-marketing': SERVICE_MEDIA[ 'social-media' ],
	'digital-retainers': SERVICE_MEDIA[ 'digital-campaigns' ],
	'branding-strategy': SERVICE_MEDIA.branding,
	'performance-marketing': SERVICE_MEDIA.strategy,
	'web-app-development': { img: '/assets/social/ai-ready-websites.jpg' },
	'tv-commercials': SERVICE_MEDIA[ 'tvc-commercials' ],
	'reels-tiktok': SERVICE_MEDIA[ 'content-creation' ],
	'influencer-marketing': { img: '/assets/social/product-stories.jpg' },
	'corporate-brand-films': SERVICE_MEDIA.videography,
	'ai-video-campaigns': SERVICE_MEDIA[ 'cgi-ai-creative' ],
	'commercial-photography': SERVICE_MEDIA.photography
};

/* "Our Services": the eleven services as an accordion, each opening to its description and a link. */
export default function ServicesAccordion( { eyebrow = '(01) Our services' } ) {
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
					<p className="eyebrow">{ eyebrow }</p>
					<h2 className="sectionTitle">Our services.</h2>
					<p className="servicesLede">Eleven disciplines under one roof in Colombo 04 — from social and performance marketing to TV commercials, web builds and photography. Project by project, or as a full-year retainer.</p>
					<TLink className="btnLink" to="/contact/">Start a project</TLink>
					<Megaphone className="illus--svc" />
				</div>
				<ul className="accordion" ref={ list } onMouseLeave={ () => setHover( null ) }>
					<HoverDot list={ list } center={ ( li ) => li.offsetTop + li.querySelector( 'button' ).offsetHeight / 2 } />
					{ data.serviceList.map( ( [ slug, name, description, link ], i ) => (
						<li key={ slug } className={ open === i ? 'is-open' : undefined } onMouseEnter={ () => setHover( slug ) }>
							<button type="button" aria-expanded={ open === i } aria-controls={ `svc-${ i }` } onClick={ () => toggle( i ) }>
								<span className="accNum">{ pad( i + 1 ) }</span>
								<span className="accName">{ name }</span>
								<span className="accIcon" aria-hidden="true"></span>
							</button>
							<div className="accPanel" id={ `svc-${ i }` } role="region">
								<div><p>{ description } <TLink to={ link }>Explore { name } →</TLink></p></div>
							</div>
						</li>
					) ) }
				</ul>
			</div>
			<FloatPreview container={ section } active={ hover } media={ LIST_MEDIA } />
		</section>
	);
}
