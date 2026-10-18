/* Cream inner-page header: eyebrow, oversized two-line title ending in a dot, lede. */
export default function PageHero( { eyebrow, lines, lede, children, className = '' } ) {
	return (
		<header className={ `pageHero ${ className }` }>
			<div className="pageHero_inner">
				<p className="eyebrow">{ eyebrow }</p>
				<h1 className="pageTitle">
					{ lines.map( ( l, i ) => (
						<span className="pageTitle_line" key={ l }>
							{ l }{ i === lines.length - 1 ? <i className="heroDot"></i> : ' ' }
						</span>
					) ) }
				</h1>
				{ lede && <p className="pageLede">{ lede }</p> }
				{ children }
			</div>
		</header>
	);
}
