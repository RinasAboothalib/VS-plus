import { useRef } from 'react';
import { usePage } from '../context/PageContext.jsx';
import useReveals from '../lib/useReveals.js';
import PageHero from '../components/PageHero.jsx';
import TLink from '../components/TLink.jsx';

export default function NotFound() {
	const root = useRef( null );
	usePage( { page: '404', title: 'Page not found — Visual Studios Plus', description: 'This frame didn’t make the final cut.' } );
	useReveals( root );

	return (
		<div ref={ root }>
			<PageHero className="pageHero--404" eyebrow="Error 404 · Frame not found" lines={ [ 'Cut from', 'the edit' ] }
				lede="This frame didn’t make the final cut. Head back to the studio, or browse the work.">
				<p className="pageActions">
					<TLink className="pillBtn pillBtn--dark" to="/">Back to home</TLink>
					<TLink className="btnLink" to="/work/">See the work</TLink>
				</p>
			</PageHero>
		</div>
	);
}
