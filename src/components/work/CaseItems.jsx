import { useEffect, useRef, useState } from 'react';
import { canHover, pad, reduced, slugify, ytEmbed } from '../../lib/motion.js';
import media from '../../data/caseMedia.js';

/* Case study tuple: [type, year, client, title, line, tags, metric, metricLabel, text] */

export function FeatureCase( { c } ) {
	const [ type, year, client, title, line, tags, metric, label, text ] = c;
	return (
		<article className="featureCase">
			<p className="eyebrow">{ type } · { year }</p>
			<p className="caseClient">{ client }</p>
			<h3>{ title }</h3>
			<p className="caseLine">{ line }</p>
			{ text && <p className="caseText">{ text }</p> }
			<ul className="pillList">{ tags.map( ( t ) => <li key={ t }>{ t }</li> ) }</ul>
			{ metric && <p className="featureCase_metric"><span>{ metric }</span>{ label }</p> }
		</article>
	);
}

/* The client's logo: a square brand tile, a transparent mark on white, or a monogram. */
function CaseLogo( { title, client, logo } ) {
	const m = logo || media[ title ];
	const initials = client.replace( /\(.*?\)/g, '' ).split( /[\s/&×—-]+/ ).filter( Boolean ).slice( 0, 2 ).map( ( w ) => w[ 0 ] ).join( '' );
	if ( m?.tile ) {
		return <div className="caseLogo caseLogo--tile"><img src={ m.tile } alt={ `${ client } logo` } loading="lazy" decoding="async" /></div>;
	}
	if ( m?.mark ) {
		return <div className={ `caseLogo caseLogo--mark${ m.dark ? ' caseLogo--dark' : '' }` }><img src={ m.mark } alt={ `${ client } logo` } loading="lazy" decoding="async" /></div>;
	}
	return <div className="caseLogo caseLogo--mono" aria-hidden="true"><span>{ initials }</span></div>;
}

/*
 * One case study as a card (after cuberto.com's "What we do"): collapsed it is a
 * light bar with the title, type and number; once active (CaseList decides, as
 * it scrolls into view) it turns dark and opens to show the story, tags, the
 * client's logo and the result.
 */
export function CaseRow( { c, index, hidden = false, active = false } ) {
	const [ type, year, client, title, line, tags, metric, label, text ] = c;
	return (
		<li className={ `caseCard${ active ? ' is-active' : '' }` } hidden={ hidden } data-index={ index }
			data-type={ slugify( type ) } id={ `case-${ slugify( title ) }` }>
			<div className="caseCard_bg" aria-hidden="true" />
			<div className="caseCard_head">
				<h3>{ title }</h3>
				<p className="caseCard_meta">{ type } · { year }</p>
				<span className="caseCard_num">{ pad( index + 1 ) }</span>
			</div>
			<div className="caseCard_body">
				<div className="caseCard_bodyIn">
					<div className="caseCard_text">
						<p className="caseClient">{ client }</p>
						<p className="caseLine">{ line }</p>
						{ text && <p className="caseText">{ text }</p> }
						<ul className="pillList">{ tags.map( ( t ) => <li key={ t }>{ t }</li> ) }</ul>
					</div>
					<div className="caseCard_side">
						<CaseLogo title={ title } client={ client } />
						{ metric && <p className="caseCard_metric"><span>{ metric }</span>{ label }</p> }
					</div>
				</div>
			</div>
		</li>
	);
}

/*
 * One flagship project as a video card: the poster with the client's logo
 * popped onto its corner and the headline result on it, then the title and
 * its details. Our own clips play muted while the card is on screen; YouTube
 * films preview muted on hover. Opening the card plays it with sound.
 */
export function ProjectCard( { p, index, hidden = false, side = 'left', low = false, onOpen } ) {
	const video = useRef( null );
	const [ preview, setPreview ] = useState( false );

	useEffect( () => {
		const v = video.current;
		if ( reduced || ! v ) {
			return undefined;
		}
		const io = new IntersectionObserver( ( [ e ] ) => ( e.isIntersecting ? v.play().catch( () => {} ) : v.pause() ), { threshold: 0.5 } );
		io.observe( v );
		return () => io.disconnect();
	}, [] );

	const hover = p.yt && canHover && ! reduced
		? { onMouseEnter: () => setPreview( true ), onMouseLeave: () => setPreview( false ) }
		: {};
	const where = p.yt ? 'YouTube' : 'Instagram';

	return (
		<li className={ `caseSlide projCard projCard--${ p.shape }${ low ? ' caseSlide--low' : '' }` } hidden={ hidden }
			data-side={ side } id={ `project-${ p.id }` }>
			<button type="button" className="caseSlide_media projCard_media" onClick={ onOpen } aria-label={ `Play ${ p.title } with sound` } { ...hover }>
				<img className="caseSlide_img" src={ p.poster } alt="" loading="lazy" decoding="async" />
				{ p.video && <video ref={ video } className="projCard_video" src={ p.video } poster={ p.poster } muted loop playsInline preload="none" aria-hidden="true" /> }
				{ preview && (
					<iframe className="projCard_video" src={ ytEmbed( p.yt, `autoplay=1&mute=1&controls=0&loop=1&playlist=${ p.yt }&disablekb=1` ) }
						title="" tabIndex={ -1 } aria-hidden="true" allow="autoplay; encrypted-media" />
				) }
				<span className="caseSlide_logo"><CaseLogo client={ p.client } logo={ p.logo } /></span>
				{ p.result && <span className="caseSlide_result"><b>{ p.result[ 0 ] }</b>{ p.result[ 1 ] }</span> }
				<span className="projCard_play" aria-hidden="true">▶</span>
			</button>
			<div className="caseSlide_data">
				<h3><button type="button" onClick={ onOpen }>{ p.title }</button></h3>
				<ul className="taglist"><li>{ p.client }</li><li>{ p.format }</li><li>{ pad( index + 1 ) }</li></ul>
				<p className="projCard_line">{ p.line }</p>
				<a className="btnLink projCard_link" href={ p.url } target="_blank" rel="noopener noreferrer">Watch on { where } ↗</a>
			</div>
		</li>
	);
}
