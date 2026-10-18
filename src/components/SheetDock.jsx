import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { pad, thumb } from '../lib/motion.js';
import { useSheet, SHEET_MAX } from '../context/SheetContext.jsx';
import TLink from './TLink.jsx';

/* Floating contact-sheet dock, bottom left, shown once a frame is on the roll. */
export default function SheetDock() {
	const { list, remove, clear, toastMsg } = useSheet();
	const [ open, setOpen ] = useState( false );
	const { pathname } = useLocation();
	const onContact = pathname.startsWith( '/contact' );

	useEffect( () => {
		if ( ! list.length ) {
			setOpen( false );
		}
	}, [ list.length ] );

	return (
		<>
			{ ! onContact && (
				<div className={ `sheetDock${ list.length ? ' is-on' : '' }` }>
					<div className="sheetPanel" id="contact-sheet" role="dialog" aria-label="Your contact sheet" hidden={ ! open } data-lenis-prevent>
						<div className="sheetPanel_top">
							<span>Contact sheet · <b>{ pad( list.length ) }</b> / { SHEET_MAX } exp</span>
							<button type="button" className="sheetClear" onClick={ clear }>Clear roll</button>
						</div>
						<ul className="sheetPanel_list">
							{ list.map( ( f, i ) => (
								<li key={ f }>
									<img src={ thumb( f ) } alt="" />
									<span>{ i + 1 }A</span>
									<button type="button" onClick={ () => remove( f ) } aria-label={ `Remove frame ${ i + 1 }` }>✕</button>
								</li>
							) ) }
						</ul>
						<p className="sheetPanel_note">Frames you like become references for your brief.</p>
						<TLink className="pillBtn sheetSend" to="/contact/#brief" onClick={ () => setOpen( false ) }>Send to the studio →</TLink>
					</div>
					<button type="button" className="sheetToggle" aria-expanded={ open } aria-controls="contact-sheet"
						onClick={ () => setOpen( ( o ) => ! o ) }>
						Contact sheet <span>{ list.length }</span>
					</button>
				</div>
			) }
			<div className={ `toast${ toastMsg ? ' is-on' : '' }` } role="status">{ toastMsg }</div>
		</>
	);
}
