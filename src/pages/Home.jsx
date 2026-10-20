import { useRef } from 'react';
import data from '../data/site.js';
import { usePage } from '../context/PageContext.jsx';
import useReveals from '../lib/useReveals.js';
import TLink from '../components/TLink.jsx';
import Hero from '../components/home/Hero.jsx';
import Showreel from '../components/home/Showreel.jsx';
import Philosophy from '../components/home/Philosophy.jsx';
import ServicesAccordion from '../components/home/ServicesAccordion.jsx';
import PhotoStrip from '../components/home/PhotoStrip.jsx';
import GradeCompare from '../components/home/GradeCompare.jsx';
import Roster from '../components/home/Roster.jsx';
import CaseList from '../components/work/CaseList.jsx';
import ReelsRail from '../components/social/ReelsRail.jsx';

export default function Home() {
	const root = useRef( null );
	usePage( {
		page: 'home',
		inner: false,
		title: 'Visual Studios Plus — The Digital Creative Marketing Agency',
		description: 'Colombo’s premier digital marketing, social media campaigns, and content creation agency. We partner with ambitious brands to command attention and deliver verified commercial growth.'
	} );
	useReveals( root );

	return (
		<div ref={ root }>
			<Hero />

			<div id="work">
				<CaseList eyebrow="(01) Flagship portfolio" id="flagship" />
			</div>

			<ReelsRail />
			<Showreel />
			<Philosophy />
			<ServicesAccordion />
			<PhotoStrip />
			<GradeCompare />

			<section className="resultsSection" aria-labelledby="resultsTitle">
				<div className="resultsInner">
					<p className="eyebrow">(06) Commercial attributions</p>
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

			<Roster eyebrow="(07) Commercial client roster" title="Trusted by market leaders & global brands." />
		</div>
	);
}
