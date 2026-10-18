import { useEffect, useState } from 'react';
import data from '../../data/site.js';
import { imgSrc } from '../../lib/motion.js';
import WorkCard from '../work/WorkCard.jsx';
import JellyCanvas from '../work/JellyCanvas.jsx';

const cols = () => ( window.innerWidth <= 700 ? 2 : 3 );

/* Index-order deal into columns (card i goes to column i % n), like react-masonry-css. */
export default function WorksMasonry() {
	const [ n, setN ] = useState( cols );

	useEffect( () => {
		const onResize = () => setN( cols() );
		window.addEventListener( 'resize', onResize );
		return () => window.removeEventListener( 'resize', onResize );
	}, [] );

	const columns = Array.from( { length: n }, ( _, c ) => data.works.filter( ( _w, i ) => i % n === c ) );

	return (
		<section className="ProjectsList">
			<div className="ProjectsList_head">
				<p className="eyebrow">(01) Selected works</p>
				<h2 className="sectionTitle">Crafted for screen,<br />built for cultural impact.</h2>
			</div>
			<JellyCanvas />
			<div className="my-masonry-grid">
				{ columns.map( ( col, c ) => (
					<div className="my-masonry-grid_column" key={ c } style={ { width: `${ 100 / n }%` } }>
						{ col.map( ( w ) => (
							<WorkCard key={ w.title } title={ w.title } href={ w.href } img={ imgSrc( w.img ) } o={ w.o } yt={ w.yt } tags={ w.tags } />
						) ) }
					</div>
				) ) }
			</div>
		</section>
	);
}
