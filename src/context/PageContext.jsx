import { createContext, useContext, useEffect, useState } from 'react';

const DEFAULT_CTA = {
	title: 'Ready to turn audience attention into measurable commercial growth?',
	text: 'From full-scale television commercials to viral social campaigns and retainer channel growth, let’s engineer something iconic together.',
	button: 'Start a project brief'
};

const PageCtx = createContext( null );

export function PageProvider( { children } ) {
	const [ meta, setMeta ] = useState( { page: '', inner: false, cta: DEFAULT_CTA } );
	return <PageCtx.Provider value={ { meta, setMeta } }>{ children }</PageCtx.Provider>;
}

export function usePageMeta() {
	return useContext( PageCtx ).meta;
}

function setMetaTag( name, content, attr = 'name' ) {
	let tag = document.head.querySelector( `meta[${ attr }="${ name }"]` );
	if ( ! tag ) {
		tag = document.createElement( 'meta' );
		tag.setAttribute( attr, name );
		document.head.appendChild( tag );
	}
	tag.setAttribute( 'content', content );
}

/**
 * Declares the current page: document title and description, the body
 * chrome (home vs inner page) and the footer call to action.
 */
export function usePage( { page, title, description, inner = true, cta = {} } ) {
	const { setMeta } = useContext( PageCtx );
	const ctaKey = JSON.stringify( cta );

	useEffect( () => {
		document.title = title;
		setMetaTag( 'description', description );
		setMetaTag( 'og:title', title, 'property' );
		setMetaTag( 'og:description', description, 'property' );
		setMeta( { page, inner, cta: { ...DEFAULT_CTA, ...cta } } );
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ page, title, description, inner, ctaKey ] );
}
