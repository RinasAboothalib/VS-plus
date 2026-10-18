/**
 * Static site build.
 *
 *   node build.js
 *
 * Wraps every page in src/pages with src/layout.html and writes clean-URL
 * folders at the project root (/work/index.html, /work/<slug>/index.html, ...),
 * so the root folder can be deployed to any static host as it is.
 *
 * {{key}} is replaced from the page config, {{> name}} with a renderer below
 * that turns assets/js/data.js (the same data the browser uses) into HTML.
 */
'use strict';

const fs = require( 'fs' );
const path = require( 'path' );

const ROOT = __dirname;
const D = require( './assets/js/data.js' );
const PHOTOS = JSON.parse( fs.readFileSync( path.join( ROOT, 'assets/photos/photos.json' ), 'utf8' ) );

const esc = ( s ) => String( s )
	.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' ).replace( />/g, '&gt;' ).replace( /"/g, '&quot;' );
const pad = ( n ) => String( n ).padStart( 2, '0' );
const slugify = ( s ) => s.toLowerCase().normalize( 'NFKD' ).replace( /[^\w]+/g, '-' ).replace( /^-|-$/g, '' );
const ytImg = ( id ) => `/assets/img/yt-${ id }.jpg`;
const svcImg = ( f ) => ( f.startsWith( 'yt-' ) ? '/assets/img/' + f : '/assets/photos/thumb/' + f.replace( /\.\w+$/, '.webp' ) );

/* ------------------------------------------------------------------ *
 * renderers
 * ------------------------------------------------------------------ */

const R = {
	socialLinks: () => D.site.socials.map( ( [ l, h ] ) =>
		`<li><a href="${ h }" target="_blank" rel="noopener noreferrer">${ l }</a></li>` ).join( '' ),

	footerSocials: () => D.site.socials.map( ( [ l, h ] ) =>
		`<a class="fAction" href="${ h }" target="_blank" rel="noopener noreferrer">${ l }</a>` ).join( '\n\t\t\t\t\t' ),

	footerServices: () => D.services.map( ( s ) =>
		`<li><a href="/services/#${ s[ 0 ] }">${ esc( s[ 1 ] ) }</a></li>` ).join( '' ),

	philosophy: () => D.philosophy.map( ( p, i ) => `
				<li class="phase" data-phase="${ i }">
					<p class="phase_meta"><span>${ pad( i + 1 ) } / 06</span><span>Phase ${ pad( i + 1 ) } · ${ p[ 0 ] }</span></p>
					<h3 class="phase_title">${ esc( p[ 1 ] ) }</h3>
					<p class="phase_text">${ esc( p[ 2 ] ) }</p>
					<p class="phase_proof">${ esc( p[ 3 ] ) }</p>
				</li>` ).join( '' ),

	gradeFrames: () => D.grade.frames.map( ( f, i ) =>
		`<button type="button" class="chip${ i === 0 ? ' is-active' : '' }" data-frame="${ i }" aria-pressed="${ i === 0 }">${ f[ 0 ] }</button>` ).join( '' ),

	gradeLooks: () => D.grade.looks.map( ( l, i ) =>
		`<button type="button" class="chip${ i === 0 ? ' is-active' : '' }" data-look="${ i }" aria-pressed="${ i === 0 }">${ l[ 0 ] }</button>` ).join( '' ),

	homePortfolio: () => {
		const picks = [ 'D85_3829-HDR.webp', 'KeelesFoodPhotography0403.webp', '7.webp', 'Palliyaguruge-Jewellers2.webp', 'DJI_0078-HDR.webp', 'CurryLeaf.webp', 'DSC_1657-2.webp', 'Tiesh-7077-1.webp', 'D85_2304.webp' ];
		return picks.map( ( f, i ) => {
			const p = PHOTOS.find( ( x ) => x.f === f );
			const cat = D.photoCategories.find( ( c ) => c[ 0 ] === p.c );
			return `<a class="stripItem" href="/photography/?category=${ p.c }#gallery" style="--ar:${ p.w } / ${ p.h }">
					<img src="/assets/photos/thumb/${ p.t }" alt="${ esc( cat[ 2 ] ) } photography by Visual Studios Plus" loading="lazy" decoding="async">
					<span class="stripItem_meta"><span>${ cat[ 2 ] }</span><span>${ pad( i + 1 ) }</span></span>
				</a>`;
		} ).join( '\n\t\t\t\t' );
	},

	filmCards: () => D.films.map( ( f, i ) => `
				<div class="workWrap singleWork filmCard">
					<a href="/work/${ f.slug }/" aria-label="${ esc( f.title ) }">
						<div class="workPlaceholder h" data-yt="${ f.yt }">
							<img src="${ ytImg( f.yt ) }" alt="${ esc( f.alt ) }" loading="lazy" decoding="async">
							<span class="playBadge">Hover to play</span>
						</div>
					</a>
					<div class="workData">
						<h4><a href="/work/${ f.slug }/"><span>${ esc( f.title ) }</span></a></h4>
						<ul class="taglist"><li>Film</li><li>${ esc( f.format ) }</li><li>${ pad( i + 1 ) }</li></ul>
					</div>
				</div>` ).join( '' ),

	caseFilters: () => {
		const types = [ ...new Set( D.caseStudies.map( ( c ) => c[ 0 ] ) ) ];
		return [ `<button type="button" class="chip is-active" data-filter="all" aria-pressed="true">All <sup>${ D.caseStudies.length }</sup></button>` ]
			.concat( types.map( ( t ) => `<button type="button" class="chip" data-filter="${ slugify( t ) }" aria-pressed="false">${ t } <sup>${ D.caseStudies.filter( ( c ) => c[ 0 ] === t ).length }</sup></button>` ) )
			.join( '' );
	},

	caseStudies: () => D.caseStudies.map( ( c, i ) => {
		const [ type, year, client, title, line, tags, metric, label, text ] = c;
		const right = metric
			? `<p class="caseMetric">${ esc( metric ) }</p><p class="caseMetric_label">${ esc( label ) }</p>`
			: `<p class="caseIndex">${ pad( i + 1 ) }</p>`;
		return `
				<li class="caseRow" data-type="${ slugify( type ) }" id="case-${ slugify( title ) }">
					<div class="caseRow_left">
						<p class="eyebrow">${ type } · ${ year }</p>
						<p class="caseClient">${ esc( client ) }</p>
					</div>
					<div class="caseRow_mid">
						<h3>${ esc( title ) }</h3>
						<p class="caseLine">${ esc( line ) }</p>
						${ text ? `<p class="caseText">${ esc( text ) }</p>` : '' }
						<ul class="pillList">${ tags.map( ( t ) => `<li>${ esc( t ) }</li>` ).join( '' ) }</ul>
					</div>
					<div class="caseRow_right">${ right }</div>
				</li>`;
	} ).join( '' ),

	featuredCases: () => D.caseStudies.slice( 0, 3 ).map( ( c ) => `
				<article class="featureCase">
					<p class="eyebrow">${ c[ 0 ] } · ${ c[ 1 ] }</p>
					<p class="caseClient">${ esc( c[ 2 ] ) }</p>
					<h3>${ esc( c[ 3 ] ) }</h3>
					<p class="caseLine">${ esc( c[ 4 ] ) }</p>
					<p class="caseText">${ esc( c[ 8 ] ) }</p>
					<ul class="pillList">${ c[ 5 ].map( ( t ) => `<li>${ esc( t ) }</li>` ).join( '' ) }</ul>
					<p class="featureCase_metric"><span>${ esc( c[ 6 ] ) }</span>${ esc( c[ 7 ] ) }</p>
				</article>` ).join( '' ),

	photoCategoryCards: () => {
		const covers = { food: 'CurryLeaf.webp', fashion: '7.webp', jewellery: 'DSC_1657-2.webp', hospitality: 'D85_3829-HDR.webp' };
		return D.photoCategories.map( ( c, i ) => {
			const n = PHOTOS.filter( ( p ) => p.c === c[ 0 ] ).length;
			const cover = PHOTOS.find( ( p ) => p.f === covers[ c[ 0 ] ] );
			return `
				<a class="catCard" href="/photography/?category=${ c[ 0 ] }#gallery">
					<span class="catCard_img"><img src="/assets/photos/thumb/${ cover.t }" alt="" loading="lazy" decoding="async"></span>
					<span class="catCard_meta">
						<span class="catCard_name">${ esc( c[ 1 ] ) }</span>
						<span class="catCard_count">${ n } photographs</span>
					</span>
					<span class="catCard_num">${ pad( i + 1 ) }</span>
				</a>`;
		} ).join( '' );
	},

	photoCount: () => String( PHOTOS.length ),

	photoFilters: () => [ `<button type="button" class="chip is-active" data-cat="all" aria-pressed="true">All <sup>${ PHOTOS.length }</sup></button>` ]
		.concat( D.photoCategories.map( ( c ) => `<button type="button" class="chip" data-cat="${ c[ 0 ] }" aria-pressed="false">${ esc( c[ 1 ] ) } <sup>${ PHOTOS.filter( ( p ) => p.c === c[ 0 ] ).length }</sup></button>` ) )
		.join( '' ),

	servicesIndex: () => D.services.map( ( s, i ) =>
		`<li><a href="#${ s[ 0 ] }"><span>${ pad( i + 1 ) }</span>${ esc( s[ 1 ] ) }</a></li>` ).join( '' ),

	servicesDetail: () => D.services.map( ( s, i ) => {
		const [ slug, name, statement, bullets, img, see ] = s;
		return `
			<section class="svcBlock" id="${ slug }" aria-labelledby="${ slug }-title">
				<div class="svcBlock_text">
					<p class="eyebrow">${ pad( i + 1 ) } / ${ pad( D.services.length ) }</p>
					<h2 class="svcBlock_title" id="${ slug }-title">${ esc( name ) }</h2>
					<p class="svcBlock_statement">${ esc( statement ) }</p>
					<ul class="svcBlock_list">${ bullets.map( ( b ) => `<li>${ esc( b ) }</li>` ).join( '' ) }</ul>
					${ see ? `<a class="btnLink" href="${ see }">See the work</a>` : '' }
				</div>
				<figure class="svcBlock_img"><img src="${ svcImg( img[ 0 ] ) }" alt="${ esc( img[ 1 ] ) }" loading="lazy" decoding="async"></figure>
			</section>` ;
	} ).join( '' ),

	servicesAccordion: () => D.services.map( ( s, i ) => `
				<li>
					<button type="button" aria-expanded="false" aria-controls="svc-${ i }">
						<span class="accNum">${ pad( i + 1 ) }</span>
						<span class="accName">${ esc( s[ 1 ] ) }</span>
						<span class="accIcon" aria-hidden="true"></span>
					</button>
					<div class="accPanel" id="svc-${ i }" role="region"><div><p>${ esc( s[ 2 ] ) } <a href="/services/#${ s[ 0 ] }">Explore ${ esc( s[ 1 ] ) } →</a></p></div></div>
				</li>` ).join( '' ),

	roster: () => D.clients.map( ( c ) => `
				<li class="rosterItem">
					<img src="/assets/logos/${ c[ 0 ] }" alt="${ esc( c[ 1 ] ) }" loading="lazy">
					<span>${ esc( c[ 2 ] ) }</span>
				</li>` ).join( '' ),

	interestChips: () => D.services.map( ( s ) =>
		`<button type="button" class="chip" data-interest="${ esc( s[ 1 ] ) }" aria-pressed="false">${ esc( s[ 1 ] ) }</button>` ).join( '' ),

	contactSocials: () => D.site.socials.map( ( [ l, h ] ) =>
		`<li><a href="${ h }" target="_blank" rel="noopener noreferrer">${ l } <span aria-hidden="true">↗</span></a></li>` ).join( '' )
};

/* ------------------------------------------------------------------ *
 * pages
 * ------------------------------------------------------------------ */

const DEFAULT_CTA = {
	ctaTitle: 'Ready to turn audience attention into measurable commercial growth?',
	ctaText: 'From full-scale television commercials to viral social campaigns and retainer channel growth, let’s engineer something iconic together.',
	ctaButton: 'Start a project brief'
};

const pages = [
	{ src: 'home.html', out: 'index.html', page: 'home', bodyClass: 'is-home',
		title: 'Visual Studios Plus — The Digital Creative Marketing Agency',
		description: 'Colombo’s premier digital marketing, social media campaigns, and content creation agency. We partner with ambitious brands to command attention and deliver verified commercial growth.' },
	{ src: 'work.html', out: 'work/index.html', page: 'work', bodyClass: 'inner',
		title: 'Work — Visual Studios Plus',
		description: 'High-impact commercial films, viral social campaigns, FMCG storytelling, and brand imagery created by Visual Studios Plus for market-leading brands.',
		ctaText: 'Looking for custom creative direction, an integrated campaign, or an ongoing social retainer?',
		ctaButton: 'Start a project with Visual Studios+' },
	{ src: 'photography.html', out: 'photography/index.html', page: 'photography', bodyClass: 'inner',
		title: 'Photography Portfolio — Visual Studios Plus',
		description: 'The Visual Studios Plus photography portfolio — food, fashion, jewellery and hospitality, interior & architecture photography from Colombo, Sri Lanka.',
		ctaTitle: 'Have a product, a place or a plate to shoot?' },
	{ src: 'services.html', out: 'services/index.html', page: 'services', bodyClass: 'inner',
		title: 'Services — Visual Studios Plus',
		description: 'Strategy, social media, digital campaigns, content creation, photography, videography, branding, TVC and CGI / AI creative from Visual Studios Plus, Colombo.',
		ctaTitle: 'Capabilities built for end-to-end commercial momentum.',
		ctaText: 'Need a custom agency retainer or dedicated production team? We work on project-by-project commissions and full-year creative retainers.',
		ctaButton: 'Inquire capabilities' },
	{ src: 'about.html', out: 'about/index.html', page: 'about', bodyClass: 'inner',
		title: 'About — Visual Studios Plus',
		description: 'Premier content creation and curation agency based in Colombo, specialising in commercial videography, advertising photography, and social viral content for FMCG, Food & Beverage, Fashion, and Luxury Hospitality.',
		ctaTitle: 'Want to partner with Visual Studios Plus?',
		ctaText: 'Commission a dedicated production or discuss a multi-channel retainer.',
		ctaButton: 'Inquire project' },
	{ src: 'contact.html', out: 'contact/index.html', page: 'contact', bodyClass: 'inner',
		title: 'Contact — Visual Studios Plus',
		description: 'Contact Visual Studios Plus — info@visualstudiosplus.com, +94 74 043 6639 / +94 74 043 5332. Level 1, 36 Haig Road, Colombo 04, Sri Lanka.',
		ctaTitle: 'Let’s make something matter.',
		ctaButton: 'Back to the form' },
	{ src: '404.html', out: '404.html', page: '404', bodyClass: 'inner',
		title: 'Page not found — Visual Studios Plus',
		description: 'This frame didn’t make the final cut.' }
];

D.films.forEach( ( f, i ) => {
	const next = D.films[ ( i + 1 ) % D.films.length ];
	pages.push( {
		src: 'project.html', out: `work/${ f.slug }/index.html`, page: 'project', bodyClass: 'inner',
		title: `${ f.title } — ${ f.format } — Visual Studios Plus`,
		description: f.text,
		vars: {
			pTitle: esc( f.title ), pFormat: esc( f.format ), pClient: esc( f.client ), pText: esc( f.text ),
			pYt: f.yt, pImg: ytImg( f.yt ), pAlt: esc( f.alt ), pIndex: pad( i + 1 ), pTotal: pad( D.films.length ),
			nSlug: next.slug, nTitle: esc( next.title ), nFormat: esc( next.format ), nImg: ytImg( next.yt ), nAlt: esc( next.alt )
		}
	} );
} );

/* ------------------------------------------------------------------ *
 * render
 * ------------------------------------------------------------------ */

const BUILD = Date.now().toString( 36 );
const layout = fs.readFileSync( path.join( ROOT, 'src/layout.html' ), 'utf8' );

function fill( tpl, vars ) {
	return tpl
		.replace( /\{\{>\s*(\w+)\s*\}\}/g, ( m, name ) => {
			if ( ! R[ name ] ) {
				throw new Error( 'Unknown renderer: ' + name );
			}
			return R[ name ]();
		} )
		.replace( /\{\{(\w+)\}\}/g, ( m, key ) => ( key in vars ? vars[ key ] : m ) );
}

pages.forEach( ( p ) => {
	const vars = Object.assign( { v: BUILD }, DEFAULT_CTA, p, p.vars || {} );
	const body = fill( fs.readFileSync( path.join( ROOT, 'src/pages', p.src ), 'utf8' ), vars );
	vars.content = body;
	vars.title = esc( p.title );
	vars.description = esc( p.description );
	const html = fill( layout, vars );
	const leftover = html.match( /\{\{[^}]+\}\}/ );
	if ( leftover ) {
		throw new Error( `${ p.out }: unfilled placeholder ${ leftover[ 0 ] }` );
	}
	const out = path.join( ROOT, p.out );
	fs.mkdirSync( path.dirname( out ), { recursive: true } );
	fs.writeFileSync( out, html );
	console.log( 'built', p.out );
} );
