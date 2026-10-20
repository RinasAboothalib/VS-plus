import { useEffect, useRef, useState } from 'react';
import data from '../../data/site.js';
import social from '../../data/social.json';
import { reduced, slugify } from '../../lib/motion.js';
import TLink from '../TLink.jsx';
import JellyCanvas from '../work/JellyCanvas.jsx';

/* Plays its video only while at least a third of it is on screen. */
function CaseVideo( { src, label, poster } ) {
	const video = useRef( null );
	useEffect( () => {
		const v = video.current;
		if ( reduced ) {
			return undefined;
		}
		const io = new IntersectionObserver( ( [ e ] ) => ( e.isIntersecting ? v.play().catch( () => {} ) : v.pause() ), { threshold: 0.33 } );
		io.observe( v );
		return () => io.disconnect();
	}, [] );
	return (
		<video ref={ video } className="flagMedia_el" src={ src } muted loop playsInline preload="metadata"
			poster={ poster } controls={ reduced } aria-label={ label } />
	);
}

/* Crossfading stills, one every 3s while visible. */
function CaseSlides( { images, label } ) {
	const [ i, setI ] = useState( 0 );
	const box = useRef( null );
	useEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		let timer = 0;
		const io = new IntersectionObserver( ( [ e ] ) => {
			clearInterval( timer );
			if ( e.isIntersecting ) {
				timer = setInterval( () => setI( ( n ) => ( n + 1 ) % images.length ), 3000 );
			}
		} );
		io.observe( box.current );
		return () => {
			clearInterval( timer );
			io.disconnect();
		};
	}, [ images.length ] );
	return (
		<div className="flagSlides" ref={ box }>
			{ images.map( ( src, n ) => (
				<img key={ src } className={ `flagMedia_el${ n === i ? ' is-on' : '' }` } src={ src }
					alt={ n === i ? `${ label } — image ${ n + 1 } of ${ images.length }` : '' }
					loading={ n === 0 ? 'eager' : 'lazy' } decoding="async" />
			) ) }
			<span className="flagSlides_count" aria-hidden="true">{ String( i + 1 ).padStart( 2, '0' ) } / { String( images.length ).padStart( 2, '0' ) }</span>
		</div>
	);
}

/* Campaigns from the VS+ Instagram, shown with their original reels and creative. */
const FROM_SOCIAL = [
	[ 'ritzbury-christmas', 'Content Creation', [ 'Food Videography', 'Festive Campaign', 'Detail-led Film' ] ],
	[ 'heritance-tea-factory', 'Hospitality Film', [ 'Hospitality', 'Heritage', 'Videography' ] ],
	[ 'mak-lubricants', 'CGI / AI Creative', [ 'AI Animation', 'Product Story', 'Technical' ] ],
	[ 'feather-sri-lanka', 'Performance Campaign', [ 'Paid Media', 'Creative Testing', 'E-commerce' ] ]
].map( ( [ slug, type, tags ] ) => {
	const p = social.find( ( x ) => x.slug === slug );
	return {
		type, year: p.date.slice( -4 ), client: p.client, title: p.title, text: p.summary, tags,
		metric: p.metric, metricLabel: p.metricLabel,
		video: p.video, poster: p.cover, image: p.video ? null : p.cover,
		instagram: p.url
	};
} );

const ITEMS = [ ...data.flagship, ...FROM_SOCIAL ];

function mediaTag( f ) {
	if ( f.images ) {
		return 'Photography';
	}
	if ( f.instagram ) {
		return f.video ? 'Instagram reel' : 'Campaign creative';
	}
	return 'Campaign reel';
}

export default function Flagship() {
	// Campaigns without published media yet are listed compactly under the cards.
	const others = data.caseStudies.filter( ( c ) => [ 'Nescafé × Colombo Fashion Week', 'UNDP Sri Lanka — HackaDev Social Innovation' ].includes( c[ 3 ] ) );

	return (
		<section className="featureCases" aria-labelledby="casesTitle">
			<div className="featureCases_head">
				<p className="eyebrow">(01) Flagship portfolio</p>
				<h2 className="sectionTitle" id="casesTitle">Every brief is a growth partnership.</h2>
				<p className="lede">We blend high-fashion visual standards with aggressive social media reach, high-velocity turnaround, and conversion-driven storytelling.</p>
			</div>

			<JellyCanvas selector=".flagMedia" />
			<div className="flagGrid">
				{ ITEMS.map( ( f ) => (
					<article className="flagCard featureCase" key={ f.title }>
						<div className="flagMedia">
							{ f.video && <CaseVideo src={ f.video } poster={ f.poster } label={ `${ f.title } — reel` } /> }
							{ f.images && <CaseSlides images={ f.images } label={ f.title } /> }
							{ f.image && <img className="flagMedia_el" src={ f.image } alt={ `${ f.title } — campaign creative` } loading="lazy" decoding="async" /> }
							<span className="flagMedia_tag">{ mediaTag( f ) }</span>
						</div>
						<p className="eyebrow">{ f.type }{ f.year ? ` · ${ f.year }` : '' }</p>
						<p className="caseClient">{ f.client }</p>
						<h3>{ f.title }</h3>
						<p className="caseLine">{ f.line }</p>
						{ f.text && <p className="caseText">{ f.text }</p> }
						<ul className="pillList">{ f.tags.map( ( t ) => <li key={ t }>{ t }</li> ) }</ul>
						{ f.metric && <p className="featureCase_metric"><span>{ f.metric }</span>{ f.metricLabel }</p> }
						{ f.source && <a className="btnLink flagSource" href={ f.source } target="_blank" rel="noopener noreferrer">Full set on Behance ↗</a> }
						{ f.instagram && <a className="btnLink flagSource" href={ f.instagram } target="_blank" rel="noopener noreferrer">See it on Instagram ↗</a> }
					</article>
				) ) }
			</div>

			<ul className="flagMore">
				{ others.map( ( c ) => (
					<li key={ c[ 3 ] }>
						<TLink to={ `/work/#case-${ slugify( c[ 3 ] ) }` }>
							<span className="flagMore_meta">{ c[ 0 ] } · { c[ 1 ] }</span>
							<span className="flagMore_title">{ c[ 3 ] }</span>
							<span className="flagMore_metric">{ c[ 6 ] } <small>{ c[ 7 ] }</small></span>
						</TLink>
					</li>
				) ) }
			</ul>

			<div className="ProjectsList_foot">
				<TLink to="/work/" className="btnLink">View all projects &amp; campaigns</TLink>
			</div>
		</section>
	);
}
