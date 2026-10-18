import { useEffect, useRef } from 'react';
import { canHover } from '../lib/motion.js';

/* A dot that glides to whichever list item is hovered. Render it as the list's first child. */
export default function HoverDot( { list, center } ) {
	const dot = useRef( null );

	useEffect( () => {
		const ul = list.current;
		if ( ! ul || ! canHover ) {
			return undefined;
		}
		const items = Array.from( ul.querySelectorAll( ':scope > li' ) );
		const enter = ( e ) => {
			dot.current.style.top = center( e.currentTarget ) + 'px';
			dot.current.style.opacity = '1';
		};
		const leave = () => {
			dot.current.style.opacity = '0';
		};
		items.forEach( ( li ) => li.addEventListener( 'mouseenter', enter ) );
		ul.addEventListener( 'mouseleave', leave );
		return () => {
			items.forEach( ( li ) => li.removeEventListener( 'mouseenter', enter ) );
			ul.removeEventListener( 'mouseleave', leave );
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	return <span className="hover-dot" ref={ dot } style={ { opacity: 0 } } aria-hidden="true" />;
}
