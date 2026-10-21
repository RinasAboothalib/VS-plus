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

/* The client's logo: a square brand tile, a transparent mark on white, or a monogram. */
function CaseLogo( { title, client } ) {
	const m = media[ title ];
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
