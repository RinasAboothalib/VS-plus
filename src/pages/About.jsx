import { useRef } from 'react';
import { usePage } from '../context/PageContext.jsx';
import useReveals from '../lib/useReveals.js';
import PageHero from '../components/PageHero.jsx';
import TLink from '../components/TLink.jsx';
import Roster from '../components/home/Roster.jsx';
import JellyCanvas from '../components/work/JellyCanvas.jsx';

const STATS = [
	[ '50+', 'Premier brands partnered' ],
	[ '10M+', 'Organic digital views' ],
	[ '5+ Yrs', 'Average client retainer' ],
	[ '100%', 'In-house production team' ]
];

const CAPS = [
	[ '/work/#films', '/assets/img/yt-rg63iEBbCVU.jpg', 'Close-up portrait from the Regal Reseau Hotel film', 'Videography & TVC', '100% In-House Production', true ],
	[ '/photography/?category=food#gallery', '/assets/img/Site-Card-Food-1536x1025.webp', 'Collage of food photography', 'Food', 'Commercial Photo' ],
	[ '/photography/', '/assets/img/Site-Card-Products-1536x1025.webp', 'Collage of product photography', 'Product', 'Commercial Photo' ],
	[ '/photography/?category=fashion#gallery', '/assets/img/Site-Card-Fashion-1536x1025.webp', 'Collage of fashion photography', 'Fashion', 'Commercial Photo' ],
	[ '/photography/?category=jewellery#gallery', '/assets/img/Site-Card-Jewellry-1536x1025.webp', 'Collage of jewellery photography', 'Jewellery', 'Commercial Photo' ],
	[ '/photography/?category=hospitality#gallery', '/assets/img/Site-Card-Hospitality-1536x1025.webp', 'Collage of hospitality and interior photography', 'Hospitality / Interior / Architecture', 'Commercial Photo' ]
];

export default function About() {
	const root = useRef( null );
	usePage( {
		page: 'about',
		title: 'About — Visual Studios Plus',
		description: 'Premier content creation and curation agency based in Colombo, specialising in commercial videography, advertising photography, and social viral content for FMCG, Food & Beverage, Fashion, and Luxury Hospitality.',
		cta: {
			title: 'Want to partner with Visual Studios Plus?',
			text: 'Commission a dedicated production or discuss a multi-channel retainer.',
			button: 'Inquire project'
		}
	} );
	useReveals( root );

	return (
		<div ref={ root }>
			<PageHero eyebrow="Studio profile & core manifesto" lines={ [ 'About Visual', 'Studios Plus' ] }
				lede="Engineered in Colombo, built for global attention. Discover our founding story, studio culture, in-house capabilities, and trusted client partnerships." />

			<div className="bg-white">
				<section className="aboutProfile" aria-labelledby="profileTitle">
					<div className="aboutGrid">
						<div className="aboutGrid_text">
							<p className="eyebrow">(01) Agency profile &amp; heritage · Colombo 04, Sri Lanka</p>
							<h2 className="sectionTitle" id="profileTitle">Premier content creation and curation agency based in Colombo.</h2>
							<p>Visual Studios Plus has earned an industry-leading reputation for exceptional work in commercial videography, advertising photography, and social viral content creation, specializing in competitive consumer sectors such as FMCG, Food &amp; Beverage, Fashion, and Luxury Hospitality.</p>
							<p>We stepped into the digital agency ecosystem to replace slow, outdated advertising models with real-time digital strategy, fast-turnaround production war rooms, and cinema-grade storytelling.</p>
							<p>Today, we partner with Sri Lanka’s favorite household brands and multinational conglomerates to engineer social campaigns that stop the feed and drive verified commercial recall.</p>
							<ul className="pillList pillList--lg">
								{ [ 'Videography & TVC', 'Commercial Photo', 'Digital Retainers', 'CGI & Generative AI', 'Brand Packaging', 'Paid Performance' ].map( ( t ) => <li key={ t }>{ t }</li> ) }
							</ul>
						</div>
						<figure className="aboutGrid_img parallaxImg">
							<img src="/assets/photos/full/DJI_0078-HDR.webp" alt="Aerial photograph of a hillside resort among tea country greenery" loading="lazy" />
						</figure>
					</div>
				</section>
			</div>

			<section className="aboutMission" aria-labelledby="missionTitle">
				<div className="aboutMission_inner">
					<p className="eyebrow">(02) Our core mission</p>
					<h2 className="missionTitle" id="missionTitle">To help brands smash commercial targets and bring their visions to life using savvy digital solutions.</h2>
					<div className="missionCols">
						<p>We believe content shouldn’t simply sit in feeds. It needs to ignite emotion, elevate sensory appeal, and make brands unforgettable in the new digital and retail landscape.</p>
						<div>
							<p className="fLabel">Headquarters</p>
							<p>Level 1, 36 Haig Road, Colombo 04</p>
							<p className="fLabel fLabel--gap">Studio standards</p>
							<p>4K Cinema Cameras (Sony FX &amp; RED), DaVinci Resolve color suites, professional food styling kitchens, and live event on-ground edit war rooms.</p>
						</div>
						<figure className="missionImg">
							<img src="/assets/img/yt-d-_dQ9-LmxE.jpg" alt="Chef Peter Kuruvita on set for ITC Rathnadeepa" loading="lazy" />
						</figure>
					</div>
					<div className="resultsGrid resultsGrid--four">
						{ STATS.map( ( [ num, label ] ) => (
							<div className="resultItem" key={ label }>
								<p className="resultNum" data-count={ num }>{ num }</p>
								<p className="resultLabel">{ label }</p>
							</div>
						) ) }
					</div>
				</div>
			</section>

			<div className="bg-white">
				<section className="capSection" aria-labelledby="capTitle">
					<div className="capInner">
						<div className="caseHead">
							<div>
								<p className="eyebrow">(03) In-house capabilities</p>
								<h2 className="sectionTitle" id="capTitle">One full-service studio. Zero creative fragmentation.</h2>
							</div>
							<TLink className="btnLink" to="/services/">Capabilities &amp; services</TLink>
						</div>
						<JellyCanvas selector=".capCard_img" />
						<div className="capGrid">
							{ CAPS.map( ( [ to, img, alt, name, sub, wide ] ) => (
								<TLink key={ name } className={ `capCard${ wide ? ' capCard--wide' : '' }` } to={ to }>
									<span className="capCard_img"><img src={ img } alt={ alt } loading="lazy" /></span>
									<span className="capCard_name">{ name }</span>
									<span className="capCard_sub">{ sub }</span>
								</TLink>
							) ) }
						</div>
					</div>
				</section>
			</div>

			<Roster eyebrow="(04) Commercial client roster" title="Brands that trust our lens and strategy." />
		</div>
	);
}
