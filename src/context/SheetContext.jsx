import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { load, save } from '../lib/store.js';

/*
 * Contact sheet: up to 36 archive frames a visitor marks as references.
 * Shared by the gallery, the lightbox, the floating dock and the brief form,
 * and persisted per visitor so it survives page changes and reloads.
 */

const KEY = 'vs-contact-sheet';
export const SHEET_MAX = 36;

const SheetCtx = createContext( null );

export function SheetProvider( { children } ) {
	const [ list, setList ] = useState( () => {
		const v = load( KEY, [] );
		return Array.isArray( v ) ? v : [];
	} );
	const [ toastMsg, setToastMsg ] = useState( '' );
	const toastTimer = useRef( null );

	const toast = useCallback( ( msg ) => {
		setToastMsg( msg );
		clearTimeout( toastTimer.current );
		toastTimer.current = setTimeout( () => setToastMsg( '' ), 2200 );
	}, [] );

	const commit = useCallback( ( next ) => {
		save( KEY, next );
		setList( next );
	}, [] );

	const toggle = useCallback( ( f ) => {
		setList( ( cur ) => {
			let next;
			if ( cur.includes( f ) ) {
				next = cur.filter( ( x ) => x !== f );
			} else if ( cur.length >= SHEET_MAX ) {
				toast( 'The roll is full — 36 frames max' );
				return cur;
			} else {
				next = [ ...cur, f ];
			}
			save( KEY, next );
			return next;
		} );
	}, [ toast ] );

	const remove = useCallback( ( f ) => {
		setList( ( cur ) => {
			const next = cur.filter( ( x ) => x !== f );
			save( KEY, next );
			return next;
		} );
	}, [] );

	const clear = useCallback( () => commit( [] ), [ commit ] );

	// Another tab changed the roll.
	useEffect( () => {
		const onStorage = ( e ) => {
			if ( e.key === KEY ) {
				const v = load( KEY, [] );
				setList( Array.isArray( v ) ? v : [] );
			}
		};
		window.addEventListener( 'storage', onStorage );
		return () => window.removeEventListener( 'storage', onStorage );
	}, [] );

	const value = useMemo( () => ( {
		list, toggle, remove, clear, toast, toastMsg,
		has: ( f ) => list.includes( f )
	} ), [ list, toggle, remove, clear, toast, toastMsg ] );

	return <SheetCtx.Provider value={ value }>{ children }</SheetCtx.Provider>;
}

export function useSheet() {
	return useContext( SheetCtx );
}
