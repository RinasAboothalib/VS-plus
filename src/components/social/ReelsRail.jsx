import { useEffect, useRef } from 'react';
import social from '../../data/social.json';
import data from '../../data/site.js';
import { canHover, reduced } from '../../lib/motion.js';

const INSTAGRAM = data.site.socials.find( ( s ) => s[ 0 ] === 'Instagram' )[ 1 ];

/*
 * Vertical reel cards from the VS+ Instagram. On desktop a reel plays while
 * hovered; on touch screens the one most in view plays. Posters are the
 * original covers, so browsers that can't play VP9 still show the frame.
 */
function ReelCard( { r } ) {
	const card = useRef( null );
	const video = useRef( null );

	useEffect( () => {
		const v = video.current;
		if ( ! v || reduced ) {
			return undefined;
		}
		if ( canHover ) {
			const el = card.current;
			const enter = () => v.play().catch( () => {} );
			const leave = () => v.pause();
			el.addEventListener( 'mouseenter', enter );
			el.addEventListener( 'mouseleave', leave );
			return () => {
				el.removeEventListener( 'mouseenter', enter );
				el.removeEventListener( 'mouseleave', leave );
			};
		}
		const io = new IntersectionObserver( ( [ e ] ) => ( e.intersectionRatio > 0.7 ? v.play().catch( () => {} ) : v.pause() ), { threshold: [ 0, 0.7, 1 ] } );
		io.observe( card.current );
		return () => io.disconnect();
	}, [] );

	return (
		<article className="reelCard" ref={ card }>
			<a className="reelCard_media" href={ r.url } target="_blank" rel="noopener noreferrer" aria-label={ `${ r.title } — watch on Instagram` }>
				{ r.video
					? <video ref={ video } src={ r.video } poster={ r.cover } muted loop playsInline preload="none" aria-hidden="true" />
					: <img src={ r.cover } alt="" loading="lazy" decoding="async" /> }
				<span className="reelCard_badge">{ r.video ? 'Reel' : 'Post' }</span>
				{ r.video && <span className="reelCard_play" aria-hidden="true"></span> }
			</a>
			<p className="reelCard_meta"><span>{ r.kind }</span><span>{ r.date }</span></p>
			<h3 className="reelCard_title">{ r.title }</h3>
			<p className="reelCard_text">{ r.summary }</p>
		</article>
	);
}

export default function ReelsRail( { eyebrow = 'From the studio feed', only } ) {
	const items = only ? social.filter( ( s ) => only.includes( s.slug ) ) : social;
	return (
		<section className="reelsRail" id="studio-feed" aria-labelledby="reelsTitle">
			<div className="reelsRail_head">
				<div>
					<p className="eyebrow">{ eyebrow }</p>
					<h2 className="sectionTitle" id="reelsTitle">Fresh off the edit.</h2>
					<p className="lede lede--light">Reels and campaign creative straight from our Instagram — hover a reel to play it.</p>
				</div>
				<a className="pillBtn" href={ INSTAGRAM } target="_blank" rel="noopener noreferrer">Follow @visualstudiosplus ↗</a>
			</div>
			<div className="reelsRail_track">
				{ items.map( ( r ) => <ReelCard key={ r.slug } r={ r } /> ) }
			</div>
		</section>
	);
}
