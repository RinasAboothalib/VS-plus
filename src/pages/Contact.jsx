import { useEffect, useRef, useState } from 'react';
import data from '../data/site.js';
import { usePage } from '../context/PageContext.jsx';
import { useSheet } from '../context/SheetContext.jsx';
import useReveals from '../lib/useReveals.js';
import { thumb } from '../lib/motion.js';
import { load, save } from '../lib/store.js';

const DRAFT_KEY = 'vs-brief-draft';
const EMPTY = { name: '', email: '', company: '', message: '', interests: [] };

export default function Contact() {
	const root = useRef( null );
	const fieldRefs = { name: useRef( null ), email: useRef( null ), message: useRef( null ) };
	const { list: refs, remove } = useSheet();
	const [ form, setForm ] = useState( () => ( { ...EMPTY, ...load( DRAFT_KEY, {} ) } ) );
	const [ error, setError ] = useState( '' );
	const { site } = data;

	usePage( {
		page: 'contact',
		title: 'Contact — Visual Studios Plus',
		description: 'Contact Visual Studios Plus — info@visualstudiosplus.com, +94 74 043 6639 / +94 74 043 5332. Level 1, 36 Haig Road, Colombo 04, Sri Lanka.',
		cta: { title: 'Let’s make something matter.', button: 'Back to the form' }
	} );
	useReveals( root );

	// Keep an unsent draft per visitor.
	useEffect( () => {
		save( DRAFT_KEY, form );
	}, [ form ] );

	const set = ( key ) => ( e ) => setForm( ( f ) => ( { ...f, [ key ]: e.target.value } ) );
	const toggleInterest = ( name ) => setForm( ( f ) => ( {
		...f,
		interests: f.interests.includes( name ) ? f.interests.filter( ( x ) => x !== name ) : [ ...f.interests, name ]
	} ) );

	function submit( e ) {
		e.preventDefault();
		const name = form.name.trim();
		const email = form.email.trim();
		const message = form.message.trim();
		const company = form.company.trim();
		const problems = [];
		if ( ! name ) {
			problems.push( [ 'name', 'your name' ] );
		}
		if ( ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( email ) ) {
			problems.push( [ 'email', 'a valid e-mail' ] );
		}
		if ( ! message ) {
			problems.push( [ 'message', 'a few words about the project' ] );
		}
		if ( problems.length ) {
			setError( 'Please add ' + problems.map( ( p ) => p[ 1 ] ).join( ', ' ) + '.' );
			fieldRefs[ problems[ 0 ][ 0 ] ].current.focus();
			return;
		}
		setError( '' );

		const lines = [
			'Name: ' + name,
			'Email: ' + email,
			...( company ? [ 'Company / brand: ' + company ] : [] ),
			...( form.interests.length ? [ 'Interested in: ' + form.interests.join( ', ' ) ] : [] ),
			'',
			message
		];
		if ( refs.length ) {
			lines.push( '', 'Reference frames from my contact sheet:', ...refs.map( ( f ) => `${ window.location.origin }/assets/photos/full/${ f }` ) );
		}
		window.location.href = `mailto:${ site.email }?subject=${ encodeURIComponent( 'Project brief — ' + ( company || name ) ) }&body=${ encodeURIComponent( lines.join( '\n' ) ) }`;
	}

	return (
		<div ref={ root } className="fgContact" data-theme="light">
			{ /* Side by side: the brief form on the left, the headline on the right (first on phones). */ }
			<section className="fgContact_split">
				<header className="fgContact_hero">
					<h1 className="fgContact_title">
						<span>Let’s make</span>
						<span className="fgHero_accent">something</span>
						<span>matter</span>
					</h1>
					<p className="fgContact_sub">Commission your next commercial film, request a channel retainer deck, or schedule a coffee at our Colombo 04 studio floor.</p>
				</header>

				<form className="briefForm" id="brief" noValidate onSubmit={ submit }>
					<p className="lede">Tell us about your brand, campaign or digital vision.</p>

					<fieldset className="briefSet">
						<legend className="fLabel">I’m interested in</legend>
						<div className="chipRow chipRow--wrap">
							{ data.services.map( ( s ) => {
								const on = form.interests.includes( s[ 1 ] );
								return (
									<button key={ s[ 0 ] } type="button" className={ `chip${ on ? ' is-active' : '' }` } data-interest aria-pressed={ on }
										onClick={ () => toggleInterest( s[ 1 ] ) }>{ s[ 1 ] }</button>
								);
							} ) }
						</div>
					</fieldset>

					{ refs.length > 0 && (
						<div className="briefRefs">
							<p className="fLabel">Reference frames from your contact sheet · { refs.length }</p>
							<ul className="briefRefs_list">
								{ refs.map( ( f, i ) => (
									<li key={ f }>
										<img src={ thumb( f ) } alt={ `Reference frame ${ i + 1 }` } />
										<button type="button" onClick={ () => remove( f ) } aria-label="Remove reference frame">✕</button>
									</li>
								) ) }
							</ul>
						</div>
					) }

					<div className="briefFields">
						<label className="field"><span>Your name *</span>
							<input ref={ fieldRefs.name } type="text" name="name" autoComplete="name" required value={ form.name } onChange={ set( 'name' ) } /></label>
						<label className="field"><span>Email *</span>
							<input ref={ fieldRefs.email } type="email" name="email" autoComplete="email" required value={ form.email } onChange={ set( 'email' ) } /></label>
						<label className="field field--full"><span>Company / brand</span>
							<input type="text" name="company" autoComplete="organization" value={ form.company } onChange={ set( 'company' ) } /></label>
						<label className="field field--full"><span>Tell us about the project *</span>
							<textarea ref={ fieldRefs.message } name="message" rows={ 3 } required value={ form.message } onChange={ set( 'message' ) } /></label>
					</div>
					{ error && <p className="briefError" role="alert">{ error }</p> }
					<div className="briefSubmit">
						<button type="submit" className="fgBtn fgBtn--solid">Start project brief</button>
						<p className="contactNote">Opens your email app with your message ready to send.</p>
					</div>
				</form>
			</section>
		</div>
	);
}
