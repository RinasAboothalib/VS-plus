import { useRef } from 'react';
import { gsap } from '../../lib/motion.js';
import useIllustration from './useIllustration.js';

/*
 * Two creatives back to back, juggling floating UI cards (profile, message,
 * feed), with a chat bubble and target rings underfoot. Flat illustration,
 * animated: cards drift, people bob, rings pulse, the bubble "types".
 */

const C = {
	halo: '#FFF4D6', card: '#FFE9AE', cardEdge: '#E7B43F', cardBar: '#F7C548', line: '#E9C873',
	skin: '#F2B48A', skin2: '#E6A07A', ginger: '#E5763A', ink: '#2B1D1A',
	green: '#2F7D5B', green2: '#2E8C63', coral: '#F27E6B', shoe: '#F5C14A',
	ring: '#F4A39A', teal: '#1F6F66', white: '#FFFFFF', glass: '#3A3A3A'
};

function Card( { className, w, h, children } ) {
	return (
		<g className={ className }>
			<rect width={ w } height={ h } rx="9" fill={ C.card } stroke={ C.cardEdge } strokeWidth="2" />
			<path d={ `M9 0h${ w - 18 }a9 9 0 0 1 9 9v5H0V9a9 9 0 0 1 9-9z` } fill={ C.cardBar } />
			<circle cx="9" cy="7" r="1.8" fill={ C.white } />
			<circle cx="15" cy="7" r="1.8" fill={ C.white } />
			<circle cx="21" cy="7" r="1.8" fill={ C.white } />
			{ children }
		</g>
	);
}

export default function TeamCards( { className = '' } ) {
	const ref = useRef( null );

	useIllustration( ref, ( q ) => {
		const tl = gsap.timeline( { repeat: -1 } );
		const float = ( sel, y, r, d, delay ) => gsap.to( q( sel ), {
			y, rotation: r, duration: d, ease: 'sine.inOut', yoyo: true, repeat: -1, delay, transformOrigin: '50% 50%'
		} );
		tl.add( float( '.il-card1', -10, -3, 2.2, 0 ), 0 )
			.add( float( '.il-card2', -7, 2, 1.8, 0.3 ), 0 )
			.add( float( '.il-card3', -12, 4, 2.6, 0.6 ), 0 )
			.add( gsap.to( q( '.il-personA' ), { y: -3, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1 } ), 0 )
			.add( gsap.to( q( '.il-personB' ), { y: -3, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.2 } ), 0 )
			.add( gsap.to( q( '.il-armA' ), { rotation: -6, transformOrigin: '90% 10%', duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 } ), 0 )
			.add( gsap.fromTo( q( '.il-ring' ), { scale: 0.85, opacity: 0.9 }, { scale: 1.12, opacity: 0, transformOrigin: '50% 50%', duration: 2.4, ease: 'sine.out', stagger: 0.8, repeat: -1 } ), 0 )
			.add( gsap.fromTo( q( '.il-dot' ), { opacity: 0.25 }, { opacity: 1, duration: 0.35, stagger: 0.25, yoyo: true, repeat: -1, repeatDelay: 0.4 } ), 0 )
			.add( gsap.to( q( '.il-bubble' ), { y: -4, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 } ), 0 );
		return tl;
	} );

	return (
		<svg ref={ ref } className={ `illus ${ className }` } viewBox="0 0 420 320" role="img" aria-label="Illustration: two creatives working with floating content cards">
			<circle cx="228" cy="128" r="98" fill={ C.halo } />
			<g fill="none" stroke={ C.ring } strokeWidth="2">
				<ellipse className="il-ring" cx="226" cy="284" rx="118" ry="13" />
				<ellipse className="il-ring" cx="226" cy="284" rx="118" ry="13" />
				<ellipse className="il-ring" cx="226" cy="284" rx="118" ry="13" />
				<ellipse cx="226" cy="284" rx="62" ry="6.5" />
			</g>

			{ /* left card (behind person A) */ }
			<g transform="translate(40 112)">
				<Card className="il-card1" w={ 92 } h={ 64 }>
					<circle cx="22" cy="38" r="12" fill={ C.cardBar } />
					<circle cx="22" cy="34" r="4.5" fill={ C.white } />
					<path d="M14 46a8 7 0 0 1 16 0z" fill={ C.white } />
					<rect x="42" y="28" width="38" height="5" rx="2.5" fill={ C.line } />
					<rect x="42" y="38" width="28" height="5" rx="2.5" fill={ C.line } />
					<rect x="42" y="48" width="33" height="5" rx="2.5" fill={ C.line } />
				</Card>
			</g>

			{ /* person A: ginger hair, glasses, green sweater, stepping left */ }
			<g className="il-personA">
				<path d="M150 178 L128 262" stroke={ C.ink } strokeWidth="18" strokeLinecap="round" />
				<path d="M168 178 L182 258" stroke={ C.ink } strokeWidth="18" strokeLinecap="round" />
				<ellipse cx="121" cy="268" rx="16" ry="7" fill={ C.shoe } />
				<ellipse cx="190" cy="263" rx="16" ry="7" fill={ C.shoe } />
				<rect x="132" y="94" width="52" height="92" rx="16" fill={ C.green } />
				<rect x="152" y="84" width="12" height="14" rx="4" fill={ C.skin } />
				<g className="il-armA">
					<path d="M142 110 L114 140 L100 146" stroke={ C.green } strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none" />
					<circle cx="96" cy="148" r="7" fill={ C.skin } />
				</g>
				<circle cx="160" cy="70" r="18" fill={ C.skin } />
				<path d="M142 66c0-14 10-22 22-21 12 1 18 9 17 18-6-6-14-8-22-6-7 2-12 5-17 9z" fill={ C.ginger } />
				<circle cx="164" cy="72" r="5" fill="none" stroke={ C.glass } strokeWidth="2" />
				<circle cx="176" cy="72" r="5" fill="none" stroke={ C.glass } strokeWidth="2" />
				<path d="M169 72h2" stroke={ C.glass } strokeWidth="2" />
			</g>

			{ /* person B: black bun, headset, coral top, green trousers */ }
			<g className="il-personB">
				<path d="M256 172 L244 254" stroke={ C.green2 } strokeWidth="18" strokeLinecap="round" />
				<path d="M274 172 L298 248" stroke={ C.green2 } strokeWidth="18" strokeLinecap="round" />
				<ellipse cx="238" cy="260" rx="15" ry="7" fill={ C.shoe } />
				<ellipse cx="306" cy="254" rx="15" ry="7" fill={ C.shoe } />
				<rect x="238" y="86" width="50" height="92" rx="16" fill={ C.coral } />
				<rect x="256" y="76" width="12" height="14" rx="4" fill={ C.skin2 } />
				<path d="M282 102 L318 92 L330 92" stroke={ C.coral } strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none" />
				<circle cx="333" cy="92" r="7" fill={ C.skin2 } />
				<circle cx="262" cy="60" r="17" fill={ C.skin2 } />
				<path d="M245 60c-1-13 8-21 19-21 10 0 17 7 16 15-9-4-21-3-35 6z" fill={ C.ink } />
				<circle cx="247" cy="44" r="8" fill={ C.ink } />
				<path d="M246 62a17 17 0 0 1 32-4" stroke={ C.ink } strokeWidth="3" fill="none" />
				<rect x="240" y="58" width="7" height="11" rx="3" fill={ C.ink } />
				<path d="M244 69q4 9 14 9" stroke={ C.ink } strokeWidth="2" fill="none" />
			</g>

			{ /* front card (message) */ }
			<g transform="translate(196 138)">
				<Card className="il-card2" w={ 100 } h={ 66 }>
					<rect x="12" y="26" width="28" height="20" rx="3" fill={ C.cardBar } />
					<path d="M12 28l14 10 14-10" stroke={ C.white } strokeWidth="2.5" fill="none" strokeLinejoin="round" />
					<rect x="50" y="26" width="38" height="5" rx="2.5" fill={ C.line } />
					<rect x="50" y="36" width="30" height="5" rx="2.5" fill={ C.line } />
					<rect x="12" y="52" width="76" height="5" rx="2.5" fill={ C.line } />
				</Card>
			</g>

			{ /* right card (feed), tilted */ }
			<g transform="translate(336 34) rotate(10)">
				<Card className="il-card3" w={ 62 } h={ 102 }>
					<rect x="10" y="24" width="42" height="26" rx="4" fill={ C.cardBar } />
					<rect x="10" y="58" width="42" height="5" rx="2.5" fill={ C.line } />
					<rect x="10" y="68" width="30" height="5" rx="2.5" fill={ C.line } />
					<rect x="10" y="80" width="42" height="5" rx="2.5" fill={ C.line } />
				</Card>
			</g>

			{ /* chat bubble */ }
			<g className="il-bubble">
				<path d="M276 6h38a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8h-26l-8 7v-7h-4a8 8 0 0 1-8-8V14a8 8 0 0 1 8-8z" fill={ C.teal } />
				<circle className="il-dot" cx="285" cy="20" r="3" fill={ C.white } />
				<circle className="il-dot" cx="295" cy="20" r="3" fill={ C.white } />
				<circle className="il-dot" cx="305" cy="20" r="3" fill={ C.white } />
			</g>
		</svg>
	);
}
