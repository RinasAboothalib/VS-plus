import { useState } from 'react';
import data from '../data/site.js';

const EMPTY = { name: '', email: '', phone: '', company: '', service: '', message: '' };

/*
 * The footer's call to action as a short brief form (client revision, Oct 24).
 * Like the contact page, it has no server behind it: sending opens the
 * visitor's email app with the brief filled in, addressed to the studio.
 */
export default function FooterBrief() {
	const [ form, setForm ] = useState( EMPTY );
	const [ errors, setErrors ] = useState( {} );
	const [ sent, setSent ] = useState( false );
	const set = ( k ) => ( e ) => setForm( ( f ) => ( { ...f, [ k ]: e.target.value } ) );

	function submit( e ) {
		e.preventDefault();
		const next = {};
		if ( ! form.name.trim() ) {
			next.name = 'Please add your name.';
		}
		if ( ! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test( form.email.trim() ) ) {
			next.email = 'Please add a valid email.';
		}
		if ( ! form.message.trim() ) {
			next.message = 'Tell us a little about the project.';
		}
		setErrors( next );
		if ( Object.keys( next ).length ) {
			return;
		}
		const lines = [ `Name: ${ form.name }`, `Email: ${ form.email }` ];
		if ( form.phone ) {
			lines.push( `Phone: ${ form.phone }` );
		}
		if ( form.company ) {
			lines.push( `Company: ${ form.company }` );
		}
		if ( form.service ) {
			lines.push( `Service: ${ form.service }` );
		}
		lines.push( '', form.message );
		window.location.href = `mailto:${ data.site.email }?subject=${ encodeURIComponent( 'Project brief — ' + ( form.company || form.name ) ) }&body=${ encodeURIComponent( lines.join( '\n' ) ) }`;
		setSent( true );
	}

	const field = ( k, label, input ) => (
		<label className={ `field${ errors[ k ] ? ' has-error' : '' }` }>
			{ label }
			{ input }
			{ errors[ k ] && <span className="field_error" role="alert">{ errors[ k ] }</span> }
		</label>
	);

	return (
		<form className="footerBrief" noValidate onSubmit={ submit } aria-label="Start a project brief">
			<div className="footerBrief_grid">
				{ field( 'name', 'Your name *', <input type="text" name="name" autoComplete="name" value={ form.name } onChange={ set( 'name' ) } /> ) }
				{ field( 'email', 'Email *', <input type="email" name="email" autoComplete="email" value={ form.email } onChange={ set( 'email' ) } /> ) }
				{ field( 'phone', 'Phone', <input type="tel" name="phone" autoComplete="tel" value={ form.phone } onChange={ set( 'phone' ) } /> ) }
				{ field( 'company', 'Company / brand', <input type="text" name="company" autoComplete="organization" value={ form.company } onChange={ set( 'company' ) } /> ) }
				<label className="field field--full">
					Service you need
					<select name="service" value={ form.service } onChange={ set( 'service' ) }>
						<option value="">Choose a service…</option>
						{ data.serviceList.map( ( [ slug, name ] ) => <option key={ slug } value={ name }>{ name }</option> ) }
					</select>
				</label>
				<label className={ `field field--full${ errors.message ? ' has-error' : '' }` }>
					Project details *
					<textarea name="message" rows={ 4 } value={ form.message } onChange={ set( 'message' ) } />
					{ errors.message && <span className="field_error" role="alert">{ errors.message }</span> }
				</label>
			</div>
			<div className="footerBrief_foot">
				<p className="footerBrief_note" aria-live="polite">
					{ sent ? 'Your email app should open with the brief ready to send.' : 'Sending opens your email app with the brief filled in.' }
				</p>
				<button type="submit" className="pillBtn">Send the brief</button>
			</div>
		</form>
	);
}
