/* localStorage that never throws (private mode, blocked storage). */
export function load( key, fallback ) {
	try {
		const v = window.localStorage.getItem( key );
		return v ? JSON.parse( v ) : fallback;
	} catch {
		return fallback;
	}
}

export function save( key, value ) {
	try {
		window.localStorage.setItem( key, JSON.stringify( value ) );
	} catch {
		/* storage unavailable: state just lives for this visit */
	}
}
