import TLink from './TLink.jsx';

/* Arrow drawn like lucide's ArrowRight. */
function ArrowRight( { className } ) {
	return (
		<svg className={ className } viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
			<path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
		</svg>
	);
}

/*
 * The FlowButton: an outlined pill that squares off to a 12px radius while a
 * circle grows from the middle, the label slides right and the arrow hands off
 * from the right edge to the left. Colours come from the --flow-* custom
 * properties, so `flowBtn--signal` gives the Signal Yellow version.
 *
 * Pass `to` for an internal link with the page transition, or `href` with your
 * own `onClick` when the caller handles navigation (the menu closes itself).
 */
export default function FlowButton( { to, href, onClick, className = '', children, ...rest } ) {
	const cls = `flowBtn ${ className }`.trim();
	const inner = (
		<>
			<ArrowRight className="flowBtn_arrow flowBtn_arrow--in" />
			<span className="flowBtn_text">{ children }</span>
			<span className="flowBtn_circle" aria-hidden="true"></span>
			<ArrowRight className="flowBtn_arrow flowBtn_arrow--out" />
		</>
	);

	if ( href ) {
		return <a href={ href } className={ cls } onClick={ onClick } { ...rest }>{ inner }</a>;
	}
	return <TLink to={ to } className={ cls } onClick={ onClick } { ...rest }>{ inner }</TLink>;
}
