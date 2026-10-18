import data from '../../data/site.js';

/* Trusted-partner logos in their original colours, auto-scrolling; the list is rendered twice so the -50% loop is seamless. */
export default function ClientStrip() {
	const list = ( hidden ) => (
		<ul className="clientele_list" aria-hidden={ hidden || undefined }>
			{ data.clients.map( ( [ file, name ] ) => (
				<li key={ file }><img src={ `/assets/logos/${ file }` } alt={ hidden ? '' : name } title={ hidden ? undefined : name } loading="lazy" /></li>
			) ) }
		</ul>
	);
	return (
		<section className="clientele_wrap" aria-label="Trusted partners">
			<p className="clientele_label"><span className="clientele_dot" aria-hidden="true"></span>Trusted by {data.clients.length}+ market leaders</p>
			<div className="clientele_viewport">
				<div className="clientele_track">
					{ list( false ) }
					{ list( true ) }
				</div>
			</div>
		</section>
	);
}
