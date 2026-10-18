import { useEffect, useRef, useState } from 'react';
import { WorksWheel } from '@/components/ui/works-wheel';
import ReelViewer from './ReelViewer.jsx';
import social from '../../data/social.json';
import data from '../../data/site.js';
import { canHover, reduced } from '../../lib/motion.js';

const INSTAGRAM = data.site.socials.find( ( s ) => s[ 0 ] === 'Instagram' )[ 1 ];

/*
 * Vertical reel cards from the VS+ Instagram. On desktop a reel plays while
 * hovered; on touch screens the one most in view plays. Posters are the
 * original covers, so browsers that can't play VP9 still show the frame.
 */
function ReelCard( { r, onOpen } ) {
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
			<a className="reelCard_media" href={ r.url } target="_blank" rel="noopener noreferrer" aria-label={ `${ r.title } — ${ r.video ? 'play reel' : 'view post' }` }
				onClick={ ( e ) => {
					if ( onOpen ) {
						e.preventDefault();
						onOpen();
					}
				} }>
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
	const [ open, setOpen ] = useState( -1 );
	// Everything the wheel and the viewer need: reels play, image posts zoom.
	const viewItems = items.map( ( r ) => ( {
		title: r.title, image: r.cover, href: r.url, url: r.url, video: r.video,
		kind: r.kind, date: r.date, summary: r.summary,
		cursorLabel: r.video ? 'Play' : 'Zoom'
	} ) );

	return (
		<section className={ `reelsRail${ wide ? ' reelsRail--wheel' : '' }` } id="studio-feed" aria-labelledby="reelsTitle">
			<div className="reelsRail_head">
				<div>
					<p className="eyebrow">{ eyebrow }</p>
					<h2 className={ wide ? 'sr-only' : 'sectionTitle' } id="reelsTitle">Fresh off the edit.</h2>
					<p className="lede lede--light">
						{ wide
							? 'Reels and campaign creative straight from our Instagram. Scroll or drag over the wheel to turn it; click a reel to play it, or a post to zoom in.'
							: 'Reels and campaign creative straight from our Instagram — tap a reel to play it.' }
					</p>
				</div>
				<a className="pillBtn" href={ INSTAGRAM } target="_blank" rel="noopener noreferrer">Follow @visualstudiosplus ↗</a>
			</div>
			{ wide ? (
				<div className="reelsRail_wheel">
					<WorksWheel items={ viewItems } label="Fresh off the edit." action="View" ratio={ 1.1 } cardHeight={ 0.5 } cardMaxWidth={ 0.44 } ringRadius={ 0.74 } showIndex={ false } cursor
						onSelect={ ( item, i ) => setOpen( i ) } />
				</div>
			) : (
				<div className="reelsRail_track">
					{ items.map( ( r, i ) => <ReelCard key={ r.slug } r={ r } onOpen={ () => setOpen( i ) } /> ) }
				</div>
			) }
			{ open >= 0 && <ReelViewer items={ viewItems } index={ open } onIndex={ setOpen } onClose={ () => setOpen( -1 ) } /> }
		</section>
	);
}
