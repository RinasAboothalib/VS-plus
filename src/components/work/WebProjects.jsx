import { Fragment, useLayoutEffect, useRef } from 'react';
import { gsap, reduced, canHover } from '../../lib/motion.js';

/*
 * Sites the studio has designed and built. Screenshots are the live sites at
 * 2x (desktop) and at the iPhone 18's 402 x 874 pt viewport (phone), lightly sharpened. Text in **double stars**
 * is picked out in highlight yellow; figures come from each live site.
 */
const PROJECTS = [
	{
		id: 'bigman', name: 'Big Man & Co', kind: 'Restaurant website', place: 'Malé, Maldives',
		url: 'https://bigman-demo.vercel.app/', logo: { bg: '#0b0b0b', fit: 'mark' },
		metric: [ '16', 'Menu sections online' ],
		text: 'An appetite-first site for a grilled-burger house on Chaandhanee Magu, with **online ordering**, **two full menus** for dine-in and Hulhumalé delivery, and a gallery of the restaurant’s own food photography.',
		stats: [ [ '16', 'menu sections with prices' ], [ '6', 'burger styles to build' ], [ '2', 'menus: dine-in & delivery' ], [ '2017', 'serving Malé since' ] ],
		tags: [ 'Online ordering', 'Menu & pricing', 'PDF menus', 'Food gallery' ]
	},
	{
		id: 'highrise', name: 'Highrise International', kind: 'Events & MICE website', place: 'Malé & Colombo',
		url: 'https://highrise-international.vercel.app/', logo: { bg: '#ffffff', fit: 'wide' },
		metric: [ '250+', 'Major productions showcased' ],
		text: 'A corporate home for one of South Asia’s event houses: **seven flagship properties** from the South Asian Travel Awards to the Maldives Living Expo, a **landmark-productions portfolio** and an inquiry flow for new events.',
		stats: [ [ '18+', 'years of industry leadership' ], [ '250+', 'major productions' ], [ '45+', 'exhibition editions' ], [ '8', 'international capitals' ] ],
		tags: [ 'Portfolio', 'Flagship profiles', 'Event inquiries', 'Leadership' ]
	},
	{
		id: 'neomed', name: 'Neomed International', kind: 'Product catalogue website', place: 'Sri Lanka',
		url: 'https://neomed-international.vercel.app/', logo: { bg: '#ffffff', fit: 'wide' },
		metric: [ '25+', 'Years of excellence' ],
		text: 'A trustworthy catalogue for a health, personal, home and pet care company: **five core categories**, quality credentials up front (**GMP, ISO & SLS**) and real customer testimonials.',
		stats: [ [ '25+', 'years of excellence' ], [ '5', 'core product categories' ], [ 'GMP · ISO', 'certified products' ], [ 'Islandwide', 'distribution' ] ],
		tags: [ 'Product ranges', 'Exports', 'Testimonials', 'Careers' ]
	},
	{
		id: 'chibs', name: 'Chibs & Co.', kind: 'E-commerce website', place: 'Handmade gifts',
		url: 'https://chibsandco.vercel.app/', logo: { bg: '#2a1f6b', fit: 'fill' },
		metric: [ '6', 'Gift collections' ],
		text: 'A warm storefront for hand-painted wooden dolls: **six collections** from weddings to pets, a **custom-order flow** and **WhatsApp enquiries** for every bespoke Chibi.',
		stats: [ [ '6', 'collections' ], [ '100%', 'hand-painted' ], [ '1 : 1', 'custom orders' ], [ 'WhatsApp', 'instant enquiries' ] ],
		tags: [ 'Collections', 'Customisation', 'Gallery', 'How it works' ]
	},
	{
		id: 'medium', name: 'MEDIUM Events', kind: 'Events & agency website', place: 'Malé, Maldives',
		url: 'https://medium-event-web.vercel.app/', logo: { bg: '#13229f', fit: 'wide' },
		metric: [ '200', 'Facebook responses · CIF 2025' ],
		text: 'Built to sell sponsorship: **four industry forums** across construction, marine, aviation and Build Expo, event histories, **sponsors like Ooredoo and SITA**, and a direct **Become a sponsor** route.',
		stats: [ [ '9', 'events hosted' ], [ '4', 'event series' ], [ '200', 'Facebook responses, CIF 2025' ], [ '60+', 'years combined experience' ] ],
		tags: [ 'Event series', 'Sponsorship', 'News', 'Partners' ]
	}
];

/* "a **b** c" → text with <mark> around b. */
function Marked( { text } ) {
	return text.split( /\*\*(.+?)\*\*/ ).map( ( part, i ) => ( i % 2 ? <mark key={ i } className="webProj_hi">{ part }</mark> : <Fragment key={ i }>{ part }</Fragment> ) );
}

/* Counts the leading number of a figure ("250+", "2017") up from zero; other figures are left as written. */
function countUp( el ) {
	const m = el.textContent.match( /^(\d+)(.*)$/ );
	if ( ! m ) {
		return null;
	}
	const end = +m[ 1 ];
	const o = { v: end > 1900 ? end - 30 : 0 };
	return gsap.to( o, { v: end, duration: 1.6, ease: 'expo.out', onUpdate: () => ( el.textContent = Math.round( o.v ) + m[ 2 ] ), onComplete: () => ( el.textContent = m[ 0 ] ) } );
}

export default function WebProjects( { eyebrow = '(03) Selected web projects' } ) {
	const root = useRef( null );

	useLayoutEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const ctx = gsap.context( () => {
			gsap.utils.toArray( '.webProj' ).forEach( ( row ) => {
				// The same entrance as the home project cards (CaseList): each column glides in from its
				// own side with a slight tilt, the brand logo pops onto its tile, the headline figure rises in.
				const fromRight = row.classList.contains( 'webProj--flip' );
				const side = ( d ) => ( fromRight ? d : -d );
				gsap.timeline( { scrollTrigger: { trigger: row, start: 'top 88%', once: true } } )
					.fromTo( row.querySelector( '.webProj_media' ), { x: side( 140 ), rotate: side( 2.5 ), opacity: 0 }, { x: 0, rotate: 0, opacity: 1, duration: 1.3, ease: 'expo.out' }, 0 )
					.fromTo( row.querySelector( '.webProj_body' ), { x: side( -140 ), rotate: side( -2.5 ), opacity: 0 }, { x: 0, rotate: 0, opacity: 1, duration: 1.3, ease: 'expo.out' }, 0 )
					.fromTo( row.querySelector( '.webProj_phone' ), { scale: 0.6, rotate: side( 12 ), opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.8)' }, 0.45 )
					.fromTo( row.querySelector( '.webProj_logo img' ), { scale: 0, rotate: -18 }, { scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(2.2)' }, 0.45 )
					.fromTo( row.querySelector( '.webProj_metric' ), { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out' }, 0.6 )
					.add( () => row.querySelectorAll( '[data-count]' ).forEach( countUp ), 0.6 );
				// Then the phone drifts against the scroll (pointer devices only; on phones it would scrub every frame).
				canHover && gsap.to( row.querySelector( '.webProj_phoneWrap' ), { yPercent: -14, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1 } } );
			} );
		}, root );
		return () => ctx.revert();
	}, [] );

	// Desktop: the browser window leans toward the cursor.
	const tilt = ( e ) => {
		if ( ! canHover || reduced ) {
			return;
		}
		const r = e.currentTarget.getBoundingClientRect();
		gsap.to( e.currentTarget.querySelector( '.webProj_browser' ), {
			rotateY: ( ( e.clientX - r.left ) / r.width - 0.5 ) * 8,
			rotateX: -( ( e.clientY - r.top ) / r.height - 0.5 ) * 6,
			duration: 0.8, ease: 'power3.out'
		} );
	};
	const untilt = ( e ) => gsap.to( e.currentTarget.querySelector( '.webProj_browser' ), { rotateX: 0, rotateY: 0, duration: 1, ease: 'expo.out' } );

	return (
		<section className="webProjSection" aria-labelledby="webProjTitle" ref={ root }>
			<div className="svcPage_inner">
				<div className="webProj_head">
					<div>
						<p className="eyebrow">{ eyebrow }</p>
						<h2 className="sectionTitle" id="webProjTitle">Sites we have built.</h2>
					</div>
					<p className="lede">Five live websites, designed and developed in-house. Every figure below comes from the client’s own site.</p>
				</div>
				<ol className="webProj_list">
					{ PROJECTS.map( ( p, i ) => (
						<li className={ `webProj${ i % 2 ? ' webProj--flip' : '' }` } key={ p.id }>
							<div className="webProj_media" onMouseMove={ tilt } onMouseLeave={ untilt }>
								<a className="webProj_browser" href={ p.url } target="_blank" rel="noopener noreferrer" aria-label={ `Open the ${ p.name } website` }>
									<span className="webProj_shot"><img src={ `/assets/web/${ p.id }-desk.webp` } alt={ `${ p.name } website, home page on desktop` } loading="lazy" decoding="async" width="2400" height="1500" /></span>
								</a>
								<div className="webProj_phoneWrap" aria-hidden="true">
									<span className="webProj_phone"><span className="webProj_phone_screen"><img src={ `/assets/web/${ p.id }-mob.webp` } alt="" loading="lazy" decoding="async" width="804" height="1748" /></span></span>
								</div>
							</div>
							<div className="webProj_body">
								<div className="webProj_brand">
									<span className={ `webProj_logo webProj_logo--${ p.logo.fit }` } style={ { background: p.logo.bg } }>
										<img src={ `/assets/web/logo-${ p.id }.webp` } alt={ `${ p.name } logo` } loading="lazy" />
									</span>
									<p className="webProj_metric"><strong data-count>{ p.metric[ 0 ] }</strong><span>{ p.metric[ 1 ] }</span></p>
								</div>
								<p className="webProj_kind"><span>{ String( i + 1 ).padStart( 2, '0' ) }</span>{ p.kind } · { p.place }</p>
								<h3 className="webProj_name">{ p.name }</h3>
								<p className="webProj_text"><Marked text={ p.text } /></p>
								<ul className="webProj_stats">
									{ p.stats.map( ( [ n, label ] ) => <li key={ label }><strong data-count>{ n }</strong><span>{ label }</span></li> ) }
								</ul>
								<ul className="webProj_tags">
									{ p.tags.map( ( t ) => <li key={ t }>{ t }</li> ) }
								</ul>
								<a className="btnLink webProj_link" href={ p.url } target="_blank" rel="noopener noreferrer">Visit the live site ↗</a>
							</div>
						</li>
					) ) }
				</ol>
			</div>
		</section>
	);
}
