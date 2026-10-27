import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTransition } from '../context/TransitionContext.jsx';
import { scrollToTarget } from '../lib/motion.js';

/**
 * Internal link with the liquid page transition. A link within the page you
 * are already on skips the transition and just scrolls (to its #hash, or the top).
 */
export default function TLink( { to, children, onClick, ...rest } ) {
	const { go } = useTransition();
	const navigate = useNavigate();
	const location = useLocation();

	function handle( e ) {
		if ( onClick ) {
			onClick( e );
		}
		if ( e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ) {
			return;
		}
		const url = new URL( to, window.location.origin + location.pathname + location.search );
		e.preventDefault();
		if ( url.pathname !== location.pathname ) {
			go( url.pathname + url.search + url.hash );
			return;
		}
		if ( url.search !== location.search ) {
			navigate( url.pathname + url.search + url.hash, { preventScrollReset: true } );
		}
		setTimeout( () => {
			const el = url.hash && document.getElementById( decodeURIComponent( url.hash.slice( 1 ) ) );
			scrollToTarget( el || 0, { offset: el ? -70 : 0 } );
		}, 0 );
	}

	// Links to other sites (e.g. an Instagram post) open in a new tab, without the transition.
	if ( /^https?:\/\//.test( to ) ) {
		return <a href={ to } target="_blank" rel="noopener noreferrer" onClick={ onClick } { ...rest }>{ children }</a>;
	}

	return <Link to={ to } onClick={ handle } { ...rest }>{ children }</Link>;
}
