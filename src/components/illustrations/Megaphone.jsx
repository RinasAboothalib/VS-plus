import { useRef } from 'react';
import { gsap } from '../../lib/motion.js';
import useIllustration from './useIllustration.js';

/*
 * A campaign lead with a megaphone beside a teammate at a laptop. Flat
 * illustration, animated: sound waves pulse out, the megaphone kicks, the
 * laptop glows and the chat bubble "types".
 */

const C = {
	dress: '#F6C531', dress2: '#E3AE18', skin: '#E9A47F', skin2: '#C9875F', ink: '#1E1A1D',
	purple: '#6E4AA0', mega: '#F6C531', hair2: '#F2A33A', sweater: '#1F1C24',
	laptop: '#CDBDF6', laptop2: '#B7A3EF', bubble: '#E99BE0', white: '#FFFFFF', desk: '#A7ACB2', halo: '#FFF4D6'
};

export default function Megaphone( { className = '' } ) {
	const ref = useRef( null );

	useIllustration( ref, ( q ) => {
		const tl = gsap.timeline( { repeat: -1 } );
		tl.add( gsap.fromTo( q( '.il-wave' ), { scale: 0.55, opacity: 0, x: 0 }, {
			keyframes: [ { opacity: 1, scale: 0.9, x: -6, duration: 0.5 }, { opacity: 0, scale: 1.35, x: -18, duration: 0.9 } ],
			transformOrigin: '100% 50%', ease: 'sine.out', stagger: 0.35, repeat: -1
		} ), 0 )
			.add( gsap.to( q( '.il-megaArm' ), { rotation: -5, transformOrigin: '95% 40%', duration: 0.35, ease: 'power1.inOut', yoyo: true, repeat: -1, repeatDelay: 0.25 } ), 0 )
			.add( gsap.to( q( '.il-woman' ), { y: -2, duration: 0.7, ease: 'sine.inOut', yoyo: true, repeat: -1 } ), 0 )
			.add( gsap.to( q( '.il-head2' ), { rotation: 4, transformOrigin: '50% 90%', duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1 } ), 0 )
			.add( gsap.to( q( '.il-screen' ), { opacity: 0.55, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 } ), 0 )
			.add( gsap.fromTo( q( '.il-dot' ), { y: 0 }, { y: -3, duration: 0.3, stagger: 0.15, yoyo: true, repeat: -1, repeatDelay: 0.5, ease: 'sine.inOut' } ), 0 )
			.add( gsap.to( q( '.il-bubble' ), { y: -4, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1 } ), 0 );
		return tl;
	} );

	return (
		<svg ref={ ref } className={ `illus ${ className }` } viewBox="0 0 420 320" role="img" aria-label="Illustration: amplifying a campaign with a megaphone">
			<circle cx="230" cy="150" r="96" fill={ C.halo } />
			<path d="M118 288H362" stroke={ C.desk } strokeWidth="3" strokeLinecap="round" />

			{ /* sound waves */ }
			<g fill="none" stroke={ C.mega } strokeWidth="4" strokeLinecap="round">
				<path className="il-wave" d="M66 132q-12 18 0 36" />
				<path className="il-wave" d="M54 124q-17 26 0 52" />
				<path className="il-wave" d="M42 116q-22 34 0 68" />
			</g>

			{ /* woman with megaphone */ }
			<g className="il-woman">
				<path d="M196 128c14-8 34-8 46 0l14 156H176z" fill={ C.dress } />
				<path d="M188 218h62" stroke={ C.dress2 } strokeWidth="4" />
				<path d="M220 218v40" stroke={ C.dress2 } strokeWidth="3" />
				<path d="M240 140 L262 196 L246 214" stroke={ C.dress } strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
				<circle cx="244" cy="216" r="6.5" fill={ C.skin } />
				<rect x="213" y="110" width="12" height="16" rx="4" fill={ C.skin } />
				<circle cx="219" cy="94" r="18" fill={ C.skin } />
				<path d="M201 92c-2-14 8-24 20-24s20 9 18 21c-7-7-21-9-38 3z" fill={ C.ink } />
				<circle cx="222" cy="64" r="9" fill={ C.ink } />
				<circle cx="211" cy="98" r="2" fill={ C.ink } />
				<path d="M207 106q4 3 8 0" stroke={ C.ink } strokeWidth="2" fill="none" strokeLinecap="round" />
				<g className="il-megaArm">
					<path d="M200 138 L162 150 L140 150" stroke={ C.dress } strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
					<circle cx="136" cy="152" r="7" fill={ C.skin } />
					<g>
						<path d="M132 138 L82 116 V184 L132 162z" fill={ C.mega } />
						<ellipse cx="82" cy="150" rx="9" ry="34" fill={ C.purple } />
						<ellipse cx="82" cy="150" rx="5" ry="26" fill={ C.mega } />
						<rect x="128" y="139" width="16" height="22" rx="4" fill={ C.purple } />
						<path d="M130 160 l6 18" stroke={ C.purple } strokeWidth="7" strokeLinecap="round" />
					</g>
				</g>
			</g>

			{ /* teammate at laptop */ }
			<g>
				<path d="M268 288c0-46 14-74 44-74s46 28 46 74z" fill={ C.sweater } />
				<g className="il-head2">
					<rect x="304" y="196" width="12" height="16" rx="4" fill={ C.skin2 } />
					<circle cx="310" cy="184" r="17" fill={ C.skin2 } />
					<path d="M293 182c-2-13 7-21 18-21 10 0 18 7 17 17-9-5-21-6-35 4z" fill={ C.hair2 } />
					<circle cx="300" cy="188" r="2" fill={ C.ink } />
				</g>
				<path d="M286 246 L330 268" stroke={ C.sweater } strokeWidth="14" strokeLinecap="round" />
				<path d="M322 284 L346 232 H400 L376 284z" fill={ C.laptop2 } />
				<path className="il-screen" d="M331 278 L349 238 H392 L374 278z" fill={ C.white } opacity="0.25" />
				<path d="M300 284H380" stroke={ C.laptop } strokeWidth="6" strokeLinecap="round" />
			</g>

			{ /* chat bubble */ }
			<g className="il-bubble">
				<path d="M296 128h40a8 8 0 0 1 8 8v12a8 8 0 0 1-8 8h-24l-9 8v-8h-7a8 8 0 0 1-8-8v-12a8 8 0 0 1 8-8z" fill={ C.bubble } />
				<circle className="il-dot" cx="306" cy="142" r="3" fill={ C.white } />
				<circle className="il-dot" cx="316" cy="142" r="3" fill={ C.white } />
				<circle className="il-dot" cx="326" cy="142" r="3" fill={ C.white } />
			</g>
		</svg>
	);
}
