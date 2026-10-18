import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import data from '../../data/site.js';
import { startScroll, stopScroll } from '../../lib/motion.js';

/* Full showreel with sound and controls. Esc, the close button or a backdrop click closes it. */
export default function ShowreelModal( { open, onClose } ) {
	const close = useRef( null );
	const video = useRef( null );

	useEffect( () => {
		if ( ! open ) {
			return undefined;
		}
		const last = document.activeElement;
		stopScroll();
		close.current.focus();
		video.current.play().catch( () => {} );
		const onKey = ( e ) => e.key === 'Escape' && onClose();
		document.addEventListener( 'keydown', onKey );
		return () => {
			document.removeEventListener( 'keydown', onKey );
			startScroll();
			if ( last && last.focus ) {
				last.focus();
			}
		};
	}, [ open, onClose ] );

	if ( ! open ) {
		return null;
	}
	return createPortal(
		<div className="reelModal" role="dialog" aria-modal="true" aria-label="Visual Studios Plus showreel"
			onClick={ ( e ) => e.target === e.currentTarget && onClose() }>
			<button type="button" className="reelModal_close" ref={ close } onClick={ onClose } aria-label="Close showreel">✕</button>
			<video ref={ video } src={ data.site.showreel } controls playsInline poster="/assets/img/Cover.jpeg" />
		</div>,
		document.body
	);
}
