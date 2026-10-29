import { useRef } from 'react';
import data from '../data/site.js';
import { usePage } from '../context/PageContext.jsx';
import useReveals from '../lib/useReveals.js';
import TLink from '../components/TLink.jsx';
import Hero from '../components/home/Hero.jsx';
import Showreel from '../components/home/Showreel.jsx';
import ServicesAccordion from '../components/home/ServicesAccordion.jsx';
import PhotoStrip from '../components/home/PhotoStrip.jsx';
import Roster from '../components/home/Roster.jsx';
import CaseList from '../components/work/CaseList.jsx';

export default function Home() {
	const root = useRef( null );
	usePage( {
		page: 'home',
		inner: false,
		title: 'Visual Studios Plus — The Digital Creative Marketing Agency',
		description: 'Visual Studios Plus shape how your brand looks, how it lives online, and how it grows. We partner with ambitious brands to command attention and deliver verified commercial growth.'
	} );
	useReveals( root );

	return (
		<div ref={ root }>
			<Hero />
			<ServicesAccordion eyebrow="(01) Our services" />

			<div id="work">
				<CaseList eyebrow="(02) Flagship portfolio" id="flagship" />
			</div>

			<Showreel />
			<PhotoStrip />

			<section className="resultsSection" aria-labelledby="resultsTitle">
				<div className="resultsInner">
					<p className="eyebrow">(04) Commercial attributions</p>
					<h2 className="sectionTitle" id="resultsTitle">Verified business impact.</h2>
					<p className="lede lede--light">Every reel, campaign asset, and ad spend is audited against real commercial benchmarks and engagement lifts.</p>
					<div className="resultsGrid">
						{ data.results.map( ( [ num, label, client ] ) => (
							<div className="resultItem" key={ label }>
								<p className="resultNum" data-count={ num }>{ num }</p>
								<p className="resultLabel">{ label }</p>
								<p className="resultClient">{ client }</p>
							</div>
						) ) }
					</div>
				</div>
			</section>

			<Roster eyebrow="(05) Commercial client roster" title="Trusted by market leaders & global brands." />
		</div>
	);
}
