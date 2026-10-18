import { useEffect, useRef, useState } from 'react';
import { gsap, reduced } from '../../lib/motion.js';

/*
 * The "clip" rotating headline from the original visualstudiosplus.com hero:
 * a thin cursor line sits at the word's right edge, wipes the word away
 * right-to-left, then draws the next word back in. Holds each word for 2.5s.
 */
export default function ClipRotator( { words, hold = 2500, className = '' } ) {
	const [ i, setI ] = useState( 0 );
	const clip = useRef( null );
	const word = useRef( null );

	useEffect( () => {
		if ( reduced || words.length < 2 ) {
			return undefined;
		}
		let timer = 0;
		let alive = true;
		const cycle = () => {
			timer = setTimeout( () => {
				gsap.to( clip.current, {
					width: 2, duration: 0.6, ease: 'power2.inOut',
					onComplete: () => {
						if ( ! alive ) {
							return;
						}
						setI( ( n ) => ( n + 1 ) % words.length );
						requestAnimationFrame( () => {
							if ( ! alive ) {
								return;
							}
							gsap.to( clip.current, {
								width: word.current.offsetWidth + 2, duration: 0.6, ease: 'power2.inOut',
								onComplete: () => alive && cycle()
							} );
						} );
					}
				} );
			}, hold );
		};
		gsap.set( clip.current, { width: word.current.offsetWidth + 2 } );
		cycle();
		return () => {
			alive = false;
			clearTimeout( timer );
			gsap.killTweensOf( clip.current );
		};
	}, [ words.length, hold ] );

	return (
		<span className={ `clipRot ${ className }` } ref={ clip }>
			<span className="clipRot_word" ref={ word }>{ words[ i ] }</span>
		</span>
	);
}
