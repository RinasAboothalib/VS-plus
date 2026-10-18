import { useEffect, useRef, useState } from 'react';
import data from '../../data/site.js';
import { reduced } from '../../lib/motion.js';

/* Dark feature block; the showreel plays while at least half of it is on screen. */
export default function Showreel() {
	const wrap = useRef( null );
	const video = useRef( null );
	const [ muted, setMuted ] = useState( true );

	useEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const io = new IntersectionObserver( ( [ entry ] ) => {
			const v = video.current;
			if ( entry.isIntersecting ) {
				v.preload = 'auto';
				v.play().catch( () => {} );
			} else {
				v.pause();
			}
		}, { threshold: 0.5 } );
		io.observe( wrap.current );
		return () => io.disconnect();
	}, [] );

	const toggleSound = () => {
		const v = video.current;
		v.muted = ! v.muted;
		setMuted( v.muted );
		if ( ! v.muted ) {
			v.play().catch( () => {} );
		}
	};

	return (
		<div className="featuredSection" id="showreel">
			<div className="featuredWrap">
				<h3>When showing<br />beats telling.</h3>
				<div className="featuredVideo" ref={ wrap }>
					<video ref={ video } src={ data.site.showreel } muted loop playsInline preload="none"
						poster="/assets/img/Cover.jpeg" controls={ reduced } />
					<button className="featuredSound" type="button" aria-pressed={ ! muted } onClick={ toggleSound }>
						{ muted ? 'Sound on' : 'Sound off' }
					</button>
				</div>
				<p className="featuredText">Our videography showreel. Cinema-grade visual storytelling engineered to stop the infinite scroll and command cultural attention — 100% in-house production, colour graded in DaVinci Resolve before it ever reaches your feed.</p>
				<p className="featuredMore"><a href="https://www.youtube.com/@visualstudiosplus" target="_blank" rel="noopener noreferrer">Watch more on YouTube</a></p>
			</div>
		</div>
	);
}
