import { createContext, useCallback, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { reduced } from '../lib/motion.js';

/*
 * Page transitions. The nav's liquid backdrop registers cover() (sweep in over
 * the page) and reveal() (sweep away). go() covers, navigates, and the layout
 * reveals once the new route has rendered.
 */

const TransitionCtx = createContext( null );

export function TransitionProvider( { children } ) {
	const navigate = useNavigate();
	const handlers = useRef( { cover: null, reveal: null } );
	const busy = useRef( false );

	const register = useCallback( ( h ) => {
		handlers.current = h;
	}, [] );

	const go = useCallback( ( to ) => {
		const { cover } = handlers.current;
		if ( reduced || ! cover || busy.current ) {
			navigate( to );
			return;
		}
		busy.current = true;
		let done = false;
		const finish = () => {
			if ( done ) {
				return;
			}
			done = true;
			busy.current = false;
			navigate( to );
		};
		cover( finish );
		// Animation frames pause in background tabs; never let that strand a click.
		setTimeout( finish, 1200 );
	}, [ navigate ] );

	const reveal = useCallback( () => {
		if ( handlers.current.reveal ) {
			handlers.current.reveal();
		}
	}, [] );

	return (
		<TransitionCtx.Provider value={ { go, reveal, register } }>
			{ children }
		</TransitionCtx.Provider>
	);
}

export function useTransition() {
	return useContext( TransitionCtx );
}
