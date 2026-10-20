import { useEffect, useRef, useState } from 'react';
import { canHover, gsap, reduced } from '../../lib/motion.js';

/*
 * Text effects ported from the visual-studio-wine.vercel.app hero:
 *   LiftText    — every letter is its own span; letters within 190px of the
 *                 cursor rise and grow (smoothstep falloff), easing back out.
 *   WordRotator — the accent line rolls to the next phrase every 2.6s
 *                 (new phrase rises from below while the old one exits above).
 */

export function LiftText( { text } ) {
	const ref = useRef( null );

	useEffect( () => {
		const el = ref.current;
		const section = el && el.closest( 'section' );
		if ( ! el || ! section || ! canHover || reduced ) {
			return undefined;
		}
		const letters = Array.from( el.querySelectorAll( '[data-l]' ) );
		let raf = 0;
		let x = -9999;
		let y = -9999;
		const paint = () => {
			raf = 0;
			letters.forEach( ( l ) => {
				const r = l.getBoundingClientRect();
				const d = Math.max( 0, 1 - Math.hypot( r.left + r.width / 2 - x, r.top + r.height / 2 - y ) / 190 );
				const s = d * d * ( 3 - 2 * d );
				l.style.transform = s > 0.001 ? `translate3d(0, ${ ( -0.07 * s ).toFixed( 3 ) }em, 0) scale(${ ( 1 + 0.09 * s ).toFixed( 3 ) })` : '';
			} );
		};
		const move = ( e ) => {
			if ( e.pointerType !== 'mouse' ) {
				return;
			}
			x = e.clientX;
			y = e.clientY;
			raf = raf || requestAnimationFrame( paint );
		};
		const leave = () => {
			x = y = -9999;
			raf = raf || requestAnimationFrame( paint );
		};
		section.addEventListener( 'pointermove', move );
		section.addEventListener( 'pointerleave', leave );
		return () => {
			cancelAnimationFrame( raf );
			section.removeEventListener( 'pointermove', move );
			section.removeEventListener( 'pointerleave', leave );
		};
	}, [] );

	const words = text.split( ' ' );
	return (
		<span ref={ ref }>
			{ words.map( ( w, i ) => (
				<span key={ i }>
					<span className="liftWord">
						{ Array.from( w ).map( ( ch, j ) => <span key={ j } data-l="" className="liftLetter">{ ch }</span> ) }
					</span>
					{ i < words.length - 1 && ' ' }
				</span>
			) ) }
		</span>
	);
}

export function WordRotator( { words, interval = 2600, className = '' } ) {
	const [ i, setI ] = useState( 0 );
	const box = useRef( null );
	const longest = words.reduce( ( a, b ) => ( a.length >= b.length ? a : b ) );

	useEffect( () => {
		if ( reduced || words.length < 2 ) {
			return undefined;
		}
		const t = setInterval( () => setI( ( n ) => ( n + 1 ) % words.length ), interval );
		return () => clearInterval( t );
	}, [ words.length, interval ] );

	// Roll: the incoming phrase rises from 100% while the outgoing one leaves to -100%.
	useEffect( () => {
		if ( reduced ) {
			return;
		}
		box.current.querySelectorAll( '.rotWord' ).forEach( ( el, n ) => {
			if ( n === i ) {
				gsap.fromTo( el, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, ease: 'expo.out' } );
			} else if ( el.dataset.shown === '1' ) {
				gsap.to( el, { yPercent: -100, opacity: 0, duration: 0.9, ease: 'expo.out' } );
			} else {
				gsap.set( el, { yPercent: 100, opacity: 0 } );
			}
			el.dataset.shown = n === i ? '1' : '0';
		} );
	}, [ i ] );

	return (
		<span className={ `rotator ${ className }` } ref={ box }>
			<span className="rotSizer" aria-hidden="true">{ longest }</span>
			{ words.map( ( w, n ) => (
				<span key={ w } className="rotWord" data-shown={ n === 0 ? '1' : '0' } style={ n === 0 ? undefined : { opacity: 0 } }>
					<LiftText text={ w } />
				</span>
			) ) }
		</span>
	);
}
