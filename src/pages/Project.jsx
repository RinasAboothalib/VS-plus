import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '../data/site.js';
import { usePage } from '../context/PageContext.jsx';
import useReveals from '../lib/useReveals.js';
import { pad, ytEmbed, ytThumb } from '../lib/motion.js';
import TLink from '../components/TLink.jsx';
import NotFound from './NotFound.jsx';

export default function Project() {
	const { slug } = useParams();
	const index = data.films.findIndex( ( f ) => f.slug === slug );
	if ( index === -1 ) {
		return <NotFound />;
	}
	// Keyed by slug so moving to the next project remounts cleanly.
	return <ProjectView key={ slug } index={ index } />;
}

function ProjectView( { index } ) {
	const root = useRef( null );
	const [ playing, setPlaying ] = useState( false );
	const f = data.films[ index ];
	const next = data.films[ ( index + 1 ) % data.films.length ];

	usePage( { page: 'project', title: `${ f.title } — ${ f.format } — Visual Studios Plus`, description: f.text } );
	useReveals( root );

	return (
		<div ref={ root }>
			<header className="pageHero pageHero--project">
				<div className="pageHero_inner">
					<p className="projectNav">
						<TLink to="/work/#films" className="btnLink">← All work</TLink>
						<span>Project { pad( index + 1 ) } / { pad( data.films.length ) }</span>
					</p>
					<h1 className="pageTitle pageTitle--project">{ f.title }<i className="heroDot"></i></h1>
					<dl className="projectMeta">
						<div><dt>Client</dt><dd>{ f.client }</dd></div>
						<div><dt>Discipline</dt><dd>Videography</dd></div>
						<div><dt>Format</dt><dd>{ f.format }</dd></div>
						<div><dt>Watch</dt><dd><a href={ `https://www.youtube.com/watch?v=${ f.yt }` } target="_blank" rel="noopener noreferrer">YouTube ↗</a></dd></div>
					</dl>
				</div>
			</header>

			<div className="bg-white">
				<section className="projectFilm">
					<div className={ `projectFilm_frame${ playing ? ' is-playing' : '' }` }>
						<img src={ ytThumb( f.yt ) } alt={ f.alt } />
						{ playing
							? <iframe src={ ytEmbed( f.yt, 'autoplay=1' ) } title={ `${ f.title } — Visual Studios Plus` }
								allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowFullScreen />
							: (
								<button type="button" className="projectPlay" onClick={ () => setPlaying( true ) }
									aria-label={ `Play film: ${ f.title } — Visual Studios Plus` }>
									<span className="projectPlay_icon" aria-hidden="true"></span>
									<span>Play film</span>
								</button>
							) }
					</div>
				</section>

				<section className="projectBody">
					<div className="projectBody_inner">
						<p className="eyebrow">The project</p>
						<p className="projectText">{ f.text }</p>
					</div>
				</section>

				<section className="nextProject">
					<TLink className="nextProject_link" to={ `/work/${ next.slug }/` }>
						<span className="eyebrow">Next project</span>
						<span className="nextProject_title">{ next.title }</span>
						<span className="nextProject_format">{ next.format }</span>
						<span className="nextProject_img"><img src={ ytThumb( next.yt ) } alt={ next.alt } loading="lazy" /></span>
					</TLink>
				</section>
			</div>
		</div>
	);
}
