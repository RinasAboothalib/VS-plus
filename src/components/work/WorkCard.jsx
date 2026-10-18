import { useEffect, useRef, useState } from 'react';
import TLink from '../TLink.jsx';
import { canHover, reduced, ytCommand, ytEmbed } from '../../lib/motion.js';

/**
 * Masonry card. Cards with a YouTube id preview the film muted on hover:
 * the embed is created on first hover, then paused/resumed via the iframe API.
 */
export default function WorkCard( { title, href, img, alt, o = 'h', yt, tags = [], className = '' } ) {
	const card = useRef( null );
	const frame = useRef( null );
	const [ playing, setPlaying ] = useState( false );
	const [ embed, setEmbed ] = useState( false );
	const ready = useRef( false );
	const hovering = useRef( false );

	useEffect( () => {
		if ( ! yt || reduced || ! canHover ) {
			return undefined;
		}
		const el = card.current;
		const enter = () => {
			hovering.current = true;
			if ( ! frame.current ) {
				setEmbed( true );
				return;
			}
			if ( ready.current ) {
				ytCommand( frame.current, 'playVideo' );
				setPlaying( true );
			}
		};
		const leave = () => {
			hovering.current = false;
			setPlaying( false );
			if ( ready.current ) {
				ytCommand( frame.current, 'pauseVideo' );
			}
		};
		el.addEventListener( 'mouseenter', enter );
		el.addEventListener( 'mouseleave', leave );
		return () => {
			el.removeEventListener( 'mouseenter', enter );
			el.removeEventListener( 'mouseleave', leave );
		};
	}, [ yt ] );

	const onLoad = () => {
		// YouTube needs a moment after load before the first frame paints.
		setTimeout( () => {
			ready.current = true;
			if ( hovering.current ) {
				setPlaying( true );
			} else {
				ytCommand( frame.current, 'pauseVideo' );
			}
		}, 900 );
	};

	return (
		<div className={ `workWrap singleWork ${ className }` } ref={ card }>
			<TLink to={ href } aria-label={ title }>
				<div className={ `workPlaceholder ${ o }${ playing ? ' is-playing' : '' }` } data-yt={ yt || undefined }>
					<img src={ img } alt={ alt || title } loading="lazy" decoding="async" />
					{ yt && <span className="playBadge">Hover to play</span> }
					{ embed && (
						<iframe ref={ frame } src={ ytEmbed( yt, `autoplay=1&mute=1&controls=0&loop=1&playlist=${ yt }&disablekb=1` ) }
							title="" tabIndex={ -1 } aria-hidden="true" allow="autoplay; encrypted-media" onLoad={ onLoad } />
					) }
				</div>
			</TLink>
			<div className="workData">
				<h4><TLink to={ href }><span>{ title }</span></TLink></h4>
				<ul className="taglist">{ tags.map( ( t ) => <li key={ t }>{ t }</li> ) }</ul>
			</div>
		</div>
	);
}
