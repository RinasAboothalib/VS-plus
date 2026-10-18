import { useEffect, useRef, useState } from 'react';
import { WorksWheel } from '@/components/ui/works-wheel';
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

/* The wheel needs a pointer and room to turn; phones and narrow screens keep the swipeable row. */
const WIDE = '(min-width: 900px) and (hover: hover) and (pointer: fine)';

function useWide() {
	const [ wide, setWide ] = useState( () => window.matchMedia( WIDE ).matches );
	useEffect( () => {
		const q = window.matchMedia( WIDE );
		const read = () => setWide( q.matches );
		q.addEventListener( 'change', read );
		return () => q.removeEventListener( 'change', read );
	}, [] );
	return wide;
}

/*
 * The studio feed. On desktop it is the WorksWheel: the Instagram covers sit in
 * a ring around "Fresh off the edit.", and scrolling (or dragging) over it opens
 * the ring into a drum you turn post by post; each card opens the original post.
 * On touch screens it falls back to the swipeable row of playable reels.
 */
export default function ReelsRail( { eyebrow = 'From the studio feed', only } ) {
	const items = only ? social.filter( ( s ) => only.includes( s.slug ) ) : social;
	const wide = useWide();
	const wheelItems = items.map( ( r ) => ( { title: r.title, image: r.cover, href: r.url } ) );

	return (
		<section className={ `reelsRail${ wide ? ' reelsRail--wheel' : '' }` } id="studio-feed" aria-labelledby="reelsTitle">
			<div className="reelsRail_head">
				<div>
					<p className="eyebrow">{ eyebrow }</p>
					<h2 className={ wide ? 'sr-only' : 'sectionTitle' } id="reelsTitle">Fresh off the edit.</h2>
					<p className="lede lede--light">
						{ wide
							? 'Reels and campaign creative straight from our Instagram. Scroll or drag over the wheel to turn it, or pick a post from the index.'
							: 'Reels and campaign creative straight from our Instagram — tap a reel to watch it.' }
					</p>
				</div>
				<a className="pillBtn" href={ INSTAGRAM } target="_blank" rel="noopener noreferrer">Follow @visualstudiosplus ↗</a>
			</div>
			{ wide ? (
				<div className="reelsRail_wheel">
					<WorksWheel items={ wheelItems } label="Fresh off the edit." action="Open on Instagram" ratio={ 1.1 } external />
				</div>
			) : (
				<div className="reelsRail_track">
					{ items.map( ( r ) => <ReelCard key={ r.slug } r={ r } /> ) }
				</div>
			) }
		</section>
	);
}
