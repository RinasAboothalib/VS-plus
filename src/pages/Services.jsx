import { useLayoutEffect, useRef, useState } from 'react';
import data from '../data/site.js';
import { usePage } from '../context/PageContext.jsx';
import useReveals from '../lib/useReveals.js';
import { imgSrc, pad, ScrollTrigger } from '../lib/motion.js';
import PageHero from '../components/PageHero.jsx';
import TLink from '../components/TLink.jsx';
import HoverDot from '../components/HoverDot.jsx';

export default function Services() {
	const root = useRef( null );
	const index = useRef( null );
	const [ active, setActive ] = useState( 0 );

	usePage( {
		page: 'services',
		title: 'Services — Visual Studios Plus',
		description: 'Strategy, social media, digital campaigns, content creation, photography, videography, branding, TVC and CGI / AI creative from Visual Studios Plus, Colombo.',
		cta: {
			title: 'Capabilities built for end-to-end commercial momentum.',
			text: 'Need a custom agency retainer or dedicated production team? We work on project-by-project commissions and full-year creative retainers.',
			button: 'Inquire capabilities'
		}
	} );
	useReveals( root );

	// The sticky index follows whichever discipline is crossing the middle of the screen.
	useLayoutEffect( () => {
		const triggers = Array.from( root.current.querySelectorAll( '.svcBlock' ) ).map( ( block, i ) => ScrollTrigger.create( {
			trigger: block,
			start: 'top 50%',
			end: 'bottom 50%',
			onToggle: ( self ) => self.isActive && setActive( i )
		} ) );
		return () => triggers.forEach( ( t ) => t.kill() );
	}, [] );

	return (
		<div ref={ root }>
			<PageHero eyebrow="End-to-end capabilities & production disciplines" lines={ [ 'Studio', 'services' ] }
				lede="Nine studio disciplines engineered under one roof in Colombo 04. Fast turnarounds, broadcast colour grading, and organic social dominance." />

			<div className="servicesPage">
				<aside className="svcIndex" aria-label="Services index">
					<ol className="svcIndex_list" ref={ index }>
						<HoverDot list={ index } center={ ( li ) => li.offsetTop + li.offsetHeight / 2 } />
						{ data.services.map( ( [ slug, name ], i ) => (
							<li key={ slug }>
								<TLink to={ `#${ slug }` } className={ i === active ? 'is-active' : undefined }>
									<span>{ pad( i + 1 ) }</span>{ name }
								</TLink>
							</li>
						) ) }
					</ol>
				</aside>
				<div className="svcBlocks">
					{ data.services.map( ( [ slug, name, statement, bullets, [ img, alt ], see ], i ) => (
						<section className="svcBlock" id={ slug } aria-labelledby={ `${ slug }-title` } key={ slug }>
							<div className="svcBlock_text">
								<p className="eyebrow">{ pad( i + 1 ) } / { pad( data.services.length ) }</p>
								<h2 className="svcBlock_title" id={ `${ slug }-title` }>{ name }</h2>
								<p className="svcBlock_statement">{ statement }</p>
								<ul className="svcBlock_list">{ bullets.map( ( b ) => <li key={ b }>{ b }</li> ) }</ul>
								{ see && <TLink className="btnLink" to={ see }>See the work</TLink> }
							</div>
							<figure className="svcBlock_img"><img src={ imgSrc( img ) } alt={ alt } loading="lazy" decoding="async" /></figure>
						</section>
					) ) }
				</div>
			</div>
		</div>
	);
}
