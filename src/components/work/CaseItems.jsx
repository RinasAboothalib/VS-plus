import { pad, slugify } from '../../lib/motion.js';

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

export function CaseRow( { c, index, hidden = false } ) {
	const [ type, year, client, title, line, tags, metric, label, text ] = c;
	return (
		<li className="caseRow" hidden={ hidden } data-type={ slugify( type ) } id={ `case-${ slugify( title ) }` }>
			<div className="caseRow_left">
				<p className="eyebrow">{ type } · { year }</p>
				<p className="caseClient">{ client }</p>
			</div>
			<div className="caseRow_mid">
				<h3>{ title }</h3>
				<p className="caseLine">{ line }</p>
				{ text && <p className="caseText">{ text }</p> }
				<ul className="pillList">{ tags.map( ( t ) => <li key={ t }>{ t }</li> ) }</ul>
			</div>
			<div className="caseRow_right">
				{ metric
					? <><p className="caseMetric">{ metric }</p><p className="caseMetric_label">{ label }</p></>
					: <p className="caseIndex">{ pad( index + 1 ) }</p> }
			</div>
		</li>
	);
}
