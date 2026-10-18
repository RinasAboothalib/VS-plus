import data from '../../data/site.js';

export default function Roster( { eyebrow, title } ) {
	return (
		<section className="rosterSection" aria-labelledby="rosterTitle">
			<div className="rosterInner">
				<p className="eyebrow">{ eyebrow }</p>
				<h2 className="sectionTitle" id="rosterTitle">{ title }</h2>
				<p className="lede">From global FMCG giants to boutique luxury houses across Sri Lanka &amp; international markets.</p>
				<ul className="rosterGrid">
					{ data.clients.map( ( [ file, name, sector ] ) => (
						<li className="rosterItem" key={ file }>
							<img src={ `/assets/logos/${ file }` } alt={ name } loading="lazy" />
							<span>{ sector }</span>
						</li>
					) ) }
				</ul>
			</div>
		</section>
	);
}
