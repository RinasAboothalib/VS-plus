import { useEffect, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap, pad, reduced, slugify, startScroll, stopScroll } from '../../lib/motion.js';
import media from '../../data/caseMedia.js';

/* Case study tuple: [type, year, client, title, line, tags, metric, metricLabel, text] */

export function FeatureCase( { c } ) {
	const [ type, year, client, title, line, tags, metric, label, text ] = c;
	return (
		<article className="featureCase">
			<p className="eyebrow">{ type } · { year }</p>
			<p className="caseClient">{ client }</p>
			<h3>{ title }</h3>
			<p className="caseLine">{ line }</p>
			{ text && <p className="caseText">{ text }</p> }
			<ul className="pillList">{ tags.map( ( t ) => <li key={ t }>{ t }</li> ) }</ul>
			{ metric && <p className="featureCase_metric"><span>{ metric }</span>{ label }</p> }
		</article>
	);
}

/* The client's logo: a square brand tile, a transparent mark on white, or a monogram. */
function CaseLogo( { title, client } ) {
	const m = media[ title ];
	const initials = client.replace( /\(.*?\)/g, '' ).split( /[\s/&×—-]+/ ).filter( Boolean ).slice( 0, 2 ).map( ( w ) => w[ 0 ] ).join( '' );
	if ( m?.tile ) {
		return <div className="caseLogo caseLogo--tile"><img src={ m.tile } alt={ `${ client } logo` } loading="lazy" decoding="async" /></div>;
	}
	if ( m?.mark ) {
		return <div className={ `caseLogo caseLogo--mark${ m.dark ? ' caseLogo--dark' : '' }` }><img src={ m.mark } alt={ `${ client } logo` } loading="lazy" decoding="async" /></div>;
	}
	return <div className="caseLogo caseLogo--mono" aria-hidden="true"><span>{ initials }</span></div>;
}

/*
 * One case study as a card (after cuberto.com's "What we do"): collapsed it is a
 * light bar with the title, type and number; once active (CaseList decides, as
 * it scrolls into view) it turns dark and opens to show the story, tags, the
 * client's logo and the result.
 */
export function CaseRow( { c, index, hidden = false, active = false } ) {
	const [ type, year, client, title, line, tags, metric, label, text ] = c;
	return (
		<li className={ `caseCard${ active ? ' is-active' : '' }` } hidden={ hidden } data-index={ index }
			data-type={ slugify( type ) } id={ `case-${ slugify( title ) }` }>
			<div className="caseCard_bg" aria-hidden="true" />
			<div className="caseCard_head">
				<h3>{ title }</h3>
				<p className="caseCard_meta">{ type } · { year }</p>
				<span className="caseCard_num">{ pad( index + 1 ) }</span>
			</div>
			<div className="caseCard_body">
				<div className="caseCard_bodyIn">
					<div className="caseCard_text">
						<p className="caseClient">{ client }</p>
						<p className="caseLine">{ line }</p>
						{ text && <p className="caseText">{ text }</p> }
						<ul className="pillList">{ tags.map( ( t ) => <li key={ t }>{ t }</li> ) }</ul>
					</div>
					<div className="caseCard_side">
						<CaseLogo title={ title } client={ client } />
						{ metric && <p className="caseCard_metric"><span>{ metric }</span>{ label }</p> }
					</div>
				</div>
			</div>
		</li>
	);
}

/*
 * One case study as a carousel card (after the Work page's "TVC & films"): the
 * whole main picture with the client's logo popped onto its corner and the headline result on it, then the
 * title and its tags. Opening it shows the full story (CaseDialog).
 */
export function CaseSlide( { c, index, hidden = false, low = false, onOpen } ) {
	const [ type, year, client, title, , , metric, label ] = c;
	const m = media[ title ] || {};
	return (
		<li className={ `caseSlide${ low ? ' caseSlide--low' : '' }` } hidden={ hidden } data-index={ index } id={ `case-${ slugify( title ) }` }>
			{ /* Every card is the same 4:5 portrait frame; each picture is framed on its subject. */ }
			<button type="button" className="caseSlide_media" onClick={ onOpen } aria-label={ `${ title } — read the case study` }
				style={ m.photo ? { '--focus': m.photo.focus } : undefined }>
				{ m.photo
					? <img className="caseSlide_img" src={ m.photo.src } alt="" loading="lazy" decoding="async" width={ m.photo.w } height={ m.photo.h } />
					: <span className="caseSlide_panel" aria-hidden="true"><span>{ client }</span></span> }
				<span className="caseSlide_logo"><CaseLogo title={ title } client={ client } /></span>
				{ metric && <span className="caseSlide_result"><b>{ metric }</b>{ label }</span> }
				<span className="caseSlide_open" aria-hidden="true">Read the case ↗</span>
			</button>
			<div className="caseSlide_data">
				<h3><button type="button" onClick={ onOpen }>{ title }</button></h3>
				<ul className="taglist"><li>{ type }</li><li>{ year }</li><li>{ pad( index + 1 ) }</li></ul>
				{ m.more && <p className="caseSlide_more"><b>{ m.more[ 0 ] }</b> { m.more[ 1 ] }</p> }
			</div>
		</li>
	);
}

/* The full case study over the page: picture, story, tags and every verified result. */
export function CaseDialog( { c, onClose, onStep } ) {
	const ref = useRef( null );
	const [ type, year, client, title, line, tags, metric, label, text ] = c;
	const m = media[ title ] || {};

	useEffect( () => {
		const last = document.activeElement;
		stopScroll();
		ref.current.querySelector( '.caseDialog_close' ).focus();
		const key = ( e ) => {
			if ( e.key === 'Escape' ) {
				onClose();
			} else if ( e.key === 'ArrowRight' ) {
				onStep( 1 );
			} else if ( e.key === 'ArrowLeft' ) {
				onStep( -1 );
			}
		};
		window.addEventListener( 'keydown', key );
		return () => {
			window.removeEventListener( 'keydown', key );
			startScroll();
			last?.focus?.();
		};
	}, [ onClose, onStep ] );

	useLayoutEffect( () => {
		if ( ! reduced ) {
			gsap.fromTo( ref.current.querySelector( '.caseDialog_panel' ), { y: 40, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'expo.out' } );
			gsap.fromTo( ref.current.querySelectorAll( '.caseDialog_text > *' ), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.04, delay: 0.1 } );
		}
	}, [ title ] );

	return createPortal(
		<div className="caseDialog" role="dialog" aria-modal="true" aria-label={ title } ref={ ref }>
			<div className="caseDialog_backdrop" onClick={ onClose } />
			<div className="caseDialog_panel">
				<div className="caseDialog_media">
					{ m.photo ? <img src={ m.photo.src } alt={ `${ client } — ${ title }` } /> : <span className="caseSlide_panel"><span>{ client }</span></span> }
				</div>
				<div className="caseDialog_text">
					<p className="eyebrow">{ type } · { year }</p>
					<p className="caseClient">{ client }</p>
					<h3>{ title }</h3>
					<p className="caseLine">{ line }</p>
					{ text && <p className="caseText">{ text }</p> }
					{ ( metric || m.more ) && (
						<ul className="caseDialog_results">
							{ metric && <li><b>{ metric }</b><span>{ label }</span></li> }
							{ m.more && <li><b>{ m.more[ 0 ] }</b><span>{ m.more[ 1 ] }</span></li> }
						</ul>
					) }
					<ul className="pillList">{ tags.map( ( t ) => <li key={ t }>{ t }</li> ) }</ul>
					<div className="caseDialog_nav">
						<button type="button" className="stripBtn" onClick={ () => onStep( -1 ) } aria-label="Previous project">←</button>
						<button type="button" className="stripBtn" onClick={ () => onStep( 1 ) } aria-label="Next project">→</button>
					</div>
				</div>
				<button type="button" className="caseDialog_close" onClick={ onClose } aria-label="Close">✕</button>
			</div>
		</div>,
		document.body
	);
}
