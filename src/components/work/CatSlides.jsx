import { useEffect, useRef, useState } from 'react';
import { reduced } from '../../lib/motion.js';

/*
 * Crossfading stills for a portfolio category card. Each card starts at its
 * own offset so a row of cards never changes all at once; runs only on screen.
 */
export default function CatSlides( { images, delay = 0, interval = 3200 } ) {
	const [ i, setI ] = useState( 0 );
	const box = useRef( null );

	useEffect( () => {
		if ( reduced || images.length < 2 ) {
			return undefined;
		}
		let timer = 0;
		let start = 0;
		const io = new IntersectionObserver( ( [ e ] ) => {
			clearTimeout( start );
			clearInterval( timer );
			if ( e.isIntersecting ) {
				start = setTimeout( () => {
					setI( ( n ) => ( n + 1 ) % images.length );
					timer = setInterval( () => setI( ( n ) => ( n + 1 ) % images.length ), interval );
				}, delay );
			}
		} );
		io.observe( box.current );
		return () => {
			clearTimeout( start );
			clearInterval( timer );
			io.disconnect();
		};
	}, [ images.length, delay, interval ] );

	return (
		<span className="catSlides" ref={ box }>
			{ images.map( ( src, n ) => (
				<img key={ src } className={ n === i ? 'is-on' : undefined } src={ src } alt="" loading={ n < 2 ? 'eager' : 'lazy' } decoding="async" />
			) ) }
			<span className="catSlides_dots" aria-hidden="true">
				{ images.map( ( src, n ) => <i key={ src } className={ n === i ? 'is-on' : undefined } /> ) }
			</span>
		</span>
	);
}
