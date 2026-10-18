import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { canHover } from '../lib/motion.js';
import { useSheet } from '../context/SheetContext.jsx';

/* Click-to-copy e-mail with a tooltip that follows the cursor. Falls back to mailto:. */
export default function CopyEmail( { email, className = '' } ) {
	const [ tip, setTip ] = useState( { on: false, x: 0, y: 0 } );
	const [ copied, setCopied ] = useState( false );
	const { toast } = useSheet();
	const raf = useRef( 0 );

	const place = ( e ) => {
		const { pageX, pageY } = e;
		cancelAnimationFrame( raf.current );
		raf.current = requestAnimationFrame( () => setTip( { on: true, x: pageX + 12, y: pageY + 12 } ) );
	};

	function copy() {
		if ( navigator.clipboard && window.isSecureContext ) {
			navigator.clipboard.writeText( email ).then( () => {
				setCopied( true );
				if ( ! canHover ) {
					toast( 'E-mail copied to clipboard' );
				}
			} ).catch( () => {
				window.location.href = 'mailto:' + email;
			} );
		} else {
			window.location.href = 'mailto:' + email;
		}
	}

	return (
		<div className={ `save_to_clipboard ${ className }` } role="button" tabIndex={ 0 }
			aria-label={ `Copy ${ email } to clipboard` }
			onClick={ copy }
			onKeyDown={ ( e ) => {
				if ( e.key === 'Enter' || e.key === ' ' ) {
					e.preventDefault();
					copy();
				}
			} }
			onMouseEnter={ place } onMouseMove={ place }
			onMouseLeave={ () => setTip( ( t ) => ( { ...t, on: false } ) ) }>
			<h4>{ email }</h4>
			{ createPortal(
				<div className={ `clipboard-tooltip${ tip.on ? ' visible' : '' }` } style={ { left: tip.x, top: tip.y } } aria-hidden="true">
					{ copied ? 'E-mail copied to clipboard' : 'Click here to copy e-mail' }
				</div>,
				document.body
			) }
		</div>
	);
}
