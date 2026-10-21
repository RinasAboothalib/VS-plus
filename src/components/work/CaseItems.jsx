import { pad, slugify } from '../../lib/motion.js';
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

/* Cover for a case row: the client's image, a still from the campaign reel, or a monogram. */
function CaseThumb( { title, client } ) {
	const m = media[ title ];
	const initials = client.replace( /\(.*?\)/g, '' ).split( /[\s/&×—-]+/ ).filter( Boolean ).slice( 0, 2 ).map( ( w ) => w[ 0 ] ).join( '' );
	return (
		<div className={ `caseThumb${ m ? '' : ' caseThumb--mono' }${ m?.fit === 'contain' ? ' caseThumb--product' : '' }` } aria-hidden="true">
			{ m?.img && <img src={ m.img } alt="" loading="lazy" decoding="async" /> }
			{ m?.video && <video src={ m.video } muted playsInline preload="metadata" tabIndex={ -1 } /> }
			{ ! m && <span>{ initials }</span> }
		</div>
	);
}

/* Dimmed copy of the cover that fills an active card behind its content. */
function CaseBackdrop( { title } ) {
	const m = media[ title ];
	if ( ! m?.img || m.fit === 'contain' ) {
		return <div className="caseCard_bg caseCard_bg--plain" aria-hidden="true" />;
	}
	return (
		<div className="caseCard_bg" aria-hidden="true">
			<img src={ m.img } alt="" loading="lazy" decoding="async" />
		</div>
	);
}

/*
 * One case study as a card (after cuberto.com's "What we do"): collapsed it is a
 * light bar with the title, type and number; once active (CaseList decides, as
 * it scrolls into view) it turns dark over its dimmed cover and opens to show
 * the story, tags, cover and result.
 */
export function CaseRow( { c, index, hidden = false, active = false } ) {
	const [ type, year, client, title, line, tags, metric, label, text ] = c;
	return (
		<li className={ `caseCard${ active ? ' is-active' : '' }` } hidden={ hidden } data-index={ index }
			data-type={ slugify( type ) } id={ `case-${ slugify( title ) }` }>
			<CaseBackdrop title={ title } />
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
						<CaseThumb title={ title } client={ client } />
						{ metric && <p className="caseCard_metric"><span>{ metric }</span>{ label }</p> }
					</div>
				</div>
			</div>
		</li>
	);
}
