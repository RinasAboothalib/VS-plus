import { useEffect, useRef } from 'react';
import { canHover, gsap, reduced } from '../lib/motion.js';

/* Hover preview per service: original VS+ reels where we have them, archive stills otherwise. */
export const SERVICE_MEDIA = {
	strategy: { img: '/assets/social/feather-sri-lanka.jpg' },
	'social-media': { video: '/assets/social/marketing-facts.mp4', poster: '/assets/social/marketing-facts.jpg' },
	'digital-campaigns': { video: '/assets/social/reel-oct-2026.mp4', poster: '/assets/social/reel-oct-2026.jpg' },
	'content-creation': { video: '/assets/social/ritzbury-christmas.mp4', poster: '/assets/social/ritzbury-christmas.jpg' },
	photography: { img: '/assets/photos/thumb/KeelesFoodPhotography0314.webp' },
	videography: { video: '/assets/social/heritance-tea-factory.mp4', poster: '/assets/social/heritance-tea-factory.jpg' },
	branding: { img: '/assets/social/rathna-group.jpg' },
	'tvc-commercials': { video: '/assets/social/video-formats.mp4', poster: '/assets/social/video-formats.jpg' },
	'cgi-ai-creative': { video: '/assets/social/mak-lubricants.mp4', poster: '/assets/social/mak-lubricants.jpg' }
};

export const canPreview = canHover && ! reduced;

/*
 * A card that trails the cursor inside `container` and shows the media for
 * `active` (a key of `media`), playing it if it is a reel. Render it inside the
 * container; it is hidden whenever `active` is null.
 */
export default function FloatPreview( { container, active, media = SERVICE_MEDIA } ) {
	const float = useRef( null );
	const videos = useRef( {} );

	useEffect( () => {
		const box = container.current;
		if ( ! canPreview || ! box ) {
			return undefined;
		}
		const xTo = gsap.quickTo( float.current, 'x', { duration: 0.6, ease: 'power3.out' } );
		const yTo = gsap.quickTo( float.current, 'y', { duration: 0.6, ease: 'power3.out' } );
		const move = ( e ) => {
			const r = box.getBoundingClientRect();
			xTo( e.clientX - r.left );
			yTo( e.clientY - r.top );
		};
		box.addEventListener( 'mousemove', move );
		return () => box.removeEventListener( 'mousemove', move );
	}, [ container ] );

	// Only the active reel plays, from the start.
	useEffect( () => {
		Object.entries( videos.current ).forEach( ( [ key, v ] ) => {
			if ( ! v ) {
				return;
			}
			if ( key === active ) {
				v.currentTime = 0;
				v.play().catch( () => {} );
			} else {
				v.pause();
			}
		} );
	}, [ active ] );

	if ( ! canPreview ) {
		return null;
	}

	return (
		<div className={ `svcFloat${ active ? ' is-on' : '' }` } ref={ float } aria-hidden="true">
			<div className="svcFloat_inner">
				{ Object.entries( media ).map( ( [ key, m ] ) => {
					const cls = `svcFloat_media${ active === key ? ' is-on' : '' }`;
					return m.video
						? <video key={ key } ref={ ( v ) => ( videos.current[ key ] = v ) } className={ cls } src={ m.video } poster={ m.poster } muted loop playsInline preload="none" />
						: <img key={ key } className={ cls } src={ m.img } alt="" loading="lazy" />;
				} ) }
				<span className="svcFloat_ring" />
			</div>
		</div>
	);
}
