import { useEffect, useMemo, useRef, useState } from 'react';
import data from '../data/site.js';
import photos from '../data/photos.json';
import { usePage } from '../context/PageContext.jsx';
import useReveals from '../lib/useReveals.js';
import { gsap, pad, reduced, ScrollTrigger, slugify, ytThumb } from '../lib/motion.js';
import PageHero from '../components/PageHero.jsx';
import TLink from '../components/TLink.jsx';
import WorkCard from '../components/work/WorkCard.jsx';
import JellyCanvas from '../components/work/JellyCanvas.jsx';
import { CaseRow } from '../components/work/CaseItems.jsx';
import ReelsRail from '../components/social/ReelsRail.jsx';
import CatSlides from '../components/work/CatSlides.jsx';

const COVERS = { food: 'CurryLeaf.webp', fashion: '7.webp', jewellery: 'DSC_1657-2.webp', hospitality: 'D85_3829-HDR.webp' };

export default function Work() {
	const root = useRef( null );
	const list = useRef( null );
	const [ filter, setFilter ] = useState( 'all' );
	const first = useRef( true );

	usePage( {
		page: 'work',
		title: 'Work — Visual Studios Plus',
		description: 'High-impact commercial films, viral social campaigns, FMCG storytelling, and brand imagery created by Visual Studios Plus for market-leading brands.',
		cta: {
			text: 'Looking for custom creative direction, an integrated campaign, or an ongoing social retainer?',
			button: 'Start a project with Visual Studios+'
		}
	} );
	useReveals( root );

	const types = useMemo( () => [ ...new Set( data.caseStudies.map( ( c ) => c[ 0 ] ) ) ], [] );

	useEffect( () => {
		if ( first.current ) {
			first.current = false;
			return;
		}
		const shown = list.current.querySelectorAll( '.caseRow:not([hidden])' );
		if ( ! reduced ) {
			gsap.fromTo( shown, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.03, ease: 'power2.out' } );
		}
		ScrollTrigger.refresh();
	}, [ filter ] );

	const chip = ( key, label, count ) => (
		<button key={ key } type="button" className={ `chip${ filter === key ? ' is-active' : '' }` } aria-pressed={ filter === key } onClick={ () => setFilter( key ) }>
			{ label } <sup>{ count }</sup>
		</button>
	);

	return (
		<div ref={ root }>
			<PageHero eyebrow="Commercial work & campaign archive" lines={ [ 'Our work', '& projects' ] }
				lede="High-impact commercial films, viral social campaigns, FMCG storytelling, and brand imagery created by Visual Studios Plus for market-leading brands.">
				<ul className="pageJump">
					<li><TLink to="#films">(A) TVC &amp; Films</TLink></li>
					<li><TLink to="#case-studies">(B) Flagship portfolio</TLink></li>
					<li><TLink to="#studio-feed">(C) Latest from the studio</TLink></li>
					<li><TLink to="#archive">(D) Photography archive</TLink></li>
				</ul>
			</PageHero>

			<div className="bg-white">
				<section className="ProjectsList ProjectsList--films" id="films" aria-labelledby="filmsTitle">
					<div className="ProjectsList_head ProjectsList_head--row">
						<div>
							<p className="eyebrow">(A)</p>
							<h2 className="sectionTitle" id="filmsTitle">TVC &amp; films.</h2>
						</div>
						<a className="btnLink" href="https://www.youtube.com/@visualstudiosplus" target="_blank" rel="noopener noreferrer">YouTube channel ↗</a>
					</div>
					<JellyCanvas />
					<div className="filmGrid">
						{ data.films.map( ( f, i ) => (
							<WorkCard key={ f.slug } className="filmCard" title={ f.title } href={ `/work/${ f.slug }/` }
								img={ ytThumb( f.yt ) } alt={ f.alt } yt={ f.yt } tags={ [ 'Film', f.format, pad( i + 1 ) ] } />
						) ) }
					</div>
				</section>
			</div>

			<section className="caseSection" id="case-studies" aria-labelledby="casesTitle">
				<div className="caseInner">
					<div className="caseHead">
						<div>
							<p className="eyebrow">(B) Flagship portfolio</p>
							<h2 className="sectionTitle" id="casesTitle">Projects engineered for verifiable business impact.</h2>
						</div>
						<p className="lede">Every client brief is treated as a growth partnership. We blend high-fashion visual standards with aggressive social media reach, high-velocity turnaround, and conversion-driven storytelling.</p>
					</div>
					<div className="chipRow caseFilters" role="group" aria-label="Filter projects">
						{ chip( 'all', 'All', data.caseStudies.length ) }
						{ types.map( ( t ) => chip( slugify( t ), t, data.caseStudies.filter( ( c ) => c[ 0 ] === t ).length ) ) }
					</div>
					<ol className="caseList" ref={ list }>
						{ data.caseStudies.map( ( c, i ) => (
							<CaseRow key={ c[ 3 ] } c={ c } index={ i } hidden={ filter !== 'all' && slugify( c[ 0 ] ) !== filter } />
						) ) }
					</ol>
				</div>
			</section>

			<ReelsRail eyebrow="(C) Latest from the studio" />

			<section className="archiveSection" id="archive" aria-labelledby="archiveTitle">
				<div className="archiveInner">
					<div className="caseHead">
						<div>
							<p className="eyebrow">(D) Commercial photography</p>
							<h2 className="sectionTitle" id="archiveTitle">The photography archive.</h2>
						</div>
						<div>
							<p className="lede">Browse by discipline, or open the full archive.</p>
							<TLink className="btnLink" to="/photography/">View all { photos.length } photographs →</TLink>
						</div>
					</div>
					<JellyCanvas selector=".catCard_img" />
					<div className="catGrid">
						{ data.photoCategories.map( ( [ id, name ], i ) => {
							const cover = photos.find( ( p ) => p.f === COVERS[ id ] );
							return (
								<TLink className="catCard" key={ id } to={ `/photography/?category=${ id }#gallery` }>
									<span className="catCard_img">
										<CatSlides delay={ i * 700 } images={ [ cover, ...photos.filter( ( p ) => p.c === id && p !== cover ).slice( 0, 5 ) ].map( ( p ) => `/assets/photos/thumb/${ p.t }` ) } />
									</span>
									<span className="catCard_meta">
										<span className="catCard_name">{ name }</span>
										<span className="catCard_count">{ photos.filter( ( p ) => p.c === id ).length } photographs</span>
									</span>
									<span className="catCard_num">{ pad( i + 1 ) }</span>
								</TLink>
							);
						} ) }
					</div>
				</div>
			</section>
		</div>
	);
}
