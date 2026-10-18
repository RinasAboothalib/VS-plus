import { useLayoutEffect, useRef } from 'react';
import data from '../../data/site.js';
import photos from '../../data/photos.json';
import { gsap, pad } from '../../lib/motion.js';
import TLink from '../TLink.jsx';

const PICKS = [ 'D85_3829-HDR.webp', 'KeelesFoodPhotography0403.webp', '7.webp', 'Palliyaguruge-Jewellers2.webp', 'DJI_0078-HDR.webp', 'CurryLeaf.webp', 'DSC_1657-2.webp', 'Tiesh-7077-1.webp', 'D85_2304.webp' ];

/* Dark strip of portfolio frames; on desktop it pins and scrolls sideways with the page. */
export default function PhotoStrip() {
	const section = useRef( null );
	const row = useRef( null );

	useLayoutEffect( () => {
		const mm = gsap.matchMedia();
		mm.add( '(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
			const distance = () => Math.max( 0, row.current.scrollWidth - window.innerWidth );
			gsap.to( row.current, {
				x: () => -distance(),
				ease: 'none',
				scrollTrigger: {
					trigger: section.current,
					start: 'top top',
					end: () => '+=' + distance(),
					pin: true,
					scrub: 0.6,
					invalidateOnRefresh: true
				}
			} );
		} );
		return () => mm.revert();
	}, [] );

	const items = PICKS.map( ( f ) => photos.find( ( p ) => p.f === f ) ).filter( Boolean );

	return (
		<section className="photoStrip" aria-labelledby="stripTitle" ref={ section }>
			<div className="photoStrip_head">
				<div>
					<p className="eyebrow">(05) Our photography</p>
					<h2 className="sectionTitle" id="stripTitle">Portfolio</h2>
					<p className="lede">Tactile luxury across Gastronomy, Architecture, and High Fashion.</p>
				</div>
				<TLink className="btnLink" to="/photography/">Explore the archive</TLink>
			</div>
			<div className="photoStrip_track">
				<div className="photoStrip_row" ref={ row }>
					{ items.map( ( p, i ) => {
						const cat = data.photoCategories.find( ( c ) => c[ 0 ] === p.c );
						return (
							<TLink key={ p.f } className="stripItem" to={ `/photography/?category=${ p.c }#gallery` } style={ { '--ar': `${ p.w } / ${ p.h }` } }>
								<img src={ `/assets/photos/thumb/${ p.t }` } alt={ `${ cat[ 2 ] } photography by Visual Studios Plus` } loading="lazy" decoding="async" />
								<span className="stripItem_meta"><span>{ cat[ 2 ] }</span><span>{ pad( i + 1 ) }</span></span>
							</TLink>
						);
					} ) }
				</div>
			</div>
		</section>
	);
}
