import { useRef } from 'react';
import data from '../data/site.js';
import { usePage } from '../context/PageContext.jsx';
import useReveals from '../lib/useReveals.js';
import { pad } from '../lib/motion.js';
import PageHero from '../components/PageHero.jsx';
import TLink from '../components/TLink.jsx';
import { CaseRow } from '../components/work/CaseItems.jsx';
import SmmShowcase from '../components/social/SmmShowcase.jsx';
import WebProjects from '../components/work/WebProjects.jsx';

/* Verified social results from the home page's results list. */
const SOCIAL_RESULTS = data.results.filter( ( [ , label ] ) => /social|engagement|reach|interactions/i.test( label ) );

const PAGES = {
	social: {
		page: 'social-media-marketing',
		title: 'Social Media Marketing — Visual Studios Plus',
		description: 'Planning, creating, and managing content across social media platforms — reels, TikTok, influencer campaigns and paid social, from Colombo.',
		eyebrow: 'Service · Social media marketing',
		lines: [ 'Social media', 'marketing' ],
		lede: 'Planning, creating, and managing content across social media platforms — built in-house in Colombo 04 and measured against real engagement and sales.',
		included: [
			[ 'Strategy & content calendars', 'Channel audits, audience insight and a monthly plan of what to post, where and why.' ],
			[ 'Content creation', 'Photography, video and design shot and edited in-house for every platform.' ],
			[ 'Reels & TikTok campaigns', 'Short-form video made for Instagram Reels, TikTok and other platforms.' ],
			[ 'Influencer marketing', 'Influencer selection, campaign coordination, content creation, and execution.' ],
			[ 'Community management', 'Day-to-day posting, replies and moderation in your brand’s voice.' ],
			[ 'Paid social & reporting', 'Targeted campaigns, A/B creative testing and monthly performance reports.' ]
		],
		steps: [
			[ 'Discover', 'We learn the brand, audience and goals, and audit the channels you already run.' ],
			[ 'Plan', 'A content calendar, campaign ideas and the metrics we will be judged on.' ],
			[ 'Create', 'Shoots, edits and design produced in-house, approved before anything goes live.' ],
			[ 'Publish & optimise', 'We post, manage and boost, then report and refine every month.' ]
		],
		cases: ( c ) => [ 'Digital Case Study', 'Digital Retainer' ].includes( c[ 0 ] ),
		showreel: true
	},
	web: {
		page: 'web-development',
		title: 'Web & App Development — Visual Studios Plus',
		description: 'Website design, web application development, and custom digital solutions from Visual Studios Plus, Colombo.',
		eyebrow: 'Service · Web & app development',
		lines: [ 'Web & app', 'development' ],
		lede: 'Website design, web application development, and custom digital solutions — designed and built by the same studio that shoots your content.',
		included: [
			[ 'Website design', 'UX, interface design and motion, crafted around your brand and your customers.' ],
			[ 'Website development', 'Fast, responsive builds that your team can update without a developer.' ],
			[ 'E-commerce', 'Online stores with product catalogues, carts and payment gateway integration.' ],
			[ 'Web applications', 'Custom portals, booking flows and dashboards for how your business works.' ],
			[ 'SEO & AI-ready content', 'Clean structure, speed and metadata so search engines and AI assistants find you.' ],
			[ 'Care & maintenance', 'Hosting, updates, backups and support after launch.' ]
		],
		steps: [
			[ 'Discovery', 'Goals, audience, sitemap and the features the site needs.' ],
			[ 'Design', 'Wireframes and full visual design, with in-house photography and video.' ],
			[ 'Build', 'Development, content entry and testing on every screen size.' ],
			[ 'Launch & care', 'Go live, measure, and keep improving with ongoing support.' ]
		],
		projects: true,
		showcase: { img: '/assets/social/ai-ready-websites.jpg', caption: 'AI-ready websites — from the studio’s own feed.' }
	}
};

/* A service landing page: header, what's included, how we work, then proof (results, projects, the studio's reels and films). */
function ServicePage( { kind } ) {
	const root = useRef( null );
	const p = PAGES[ kind ];
	usePage( { page: p.page, title: p.title, description: p.description } );
	useReveals( root, [ kind ] );
	const cases = p.cases ? data.caseStudies.filter( p.cases ) : [];

	return (
		<div ref={ root }>
			<PageHero eyebrow={ p.eyebrow } lines={ p.lines } lede={ p.lede }>
				<div className="pageActions">
					<TLink className="pillBtn" to="/contact/">Start a project</TLink>
				</div>
			</PageHero>

			<section className="svcPage" aria-labelledby="svcIncluded">
				<div className="svcPage_inner">
					<p className="eyebrow">(01) What’s included</p>
					<h2 className="sectionTitle" id="svcIncluded">Everything under one roof.</h2>
					<ul className="svcPage_grid">
						{ p.included.map( ( [ name, text ], i ) => (
							<li className="svcPage_card capCard" key={ name }>
								<span className="svcPage_num">{ pad( i + 1 ) }</span>
								<h3>{ name }</h3>
								<p>{ text }</p>
							</li>
						) ) }
					</ul>
				</div>
			</section>

			<section className="svcPage svcPage--dark" aria-labelledby="svcSteps">
				<div className="svcPage_inner">
					<p className="eyebrow">(02) How we work</p>
					<h2 className="sectionTitle" id="svcSteps">From brief to results.</h2>
					<ol className="svcPage_steps">
						{ p.steps.map( ( [ name, text ], i ) => (
							<li key={ name }>
								<span className="svcPage_num">{ pad( i + 1 ) }</span>
								<h3>{ name }</h3>
								<p>{ text }</p>
							</li>
						) ) }
					</ol>
					{ kind === 'social' && (
						<ul className="caseSocial svcPage_results" aria-label="Verified social results">
							{ SOCIAL_RESULTS.map( ( [ num, label, client ] ) => (
								<li key={ label }>
									<span className="caseSocial_dot" aria-hidden="true" />
									<strong>{ num }</strong>
									<span>{ label } · { client }</span>
								</li>
							) ) }
						</ul>
					) }
					{ p.showcase && (
						<figure className="svcPage_show">
							<img src={ p.showcase.img } alt="" loading="lazy" />
							<figcaption>{ p.showcase.caption }</figcaption>
						</figure>
					) }
				</div>
			</section>

			{ p.projects && <WebProjects /> }

			{ cases.length > 0 && (
				<section className="caseSection" aria-labelledby="svcCases">
					<div className="caseInner">
						<div className="caseHead">
							<div>
								<p className="eyebrow">(03) Selected projects</p>
								<h2 className="sectionTitle" id="svcCases">Campaigns we have run.</h2>
							</div>
							<p className="lede">Each one built around a measurable result.</p>
						</div>
						<ol className="caseList">
							{ cases.map( ( c, i ) => <CaseRow key={ c[ 3 ] } c={ c } index={ i } active /> ) }
						</ol>
					</div>
				</section>
			) }

			{ p.showreel && <SmmShowcase /> }
		</div>
	);
}

export function SocialMediaMarketing() {
	return <ServicePage kind="social" />;
}

export function WebDevelopment() {
	return <ServicePage kind="web" />;
}
