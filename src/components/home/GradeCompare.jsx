import { useLayoutEffect, useRef, useState } from 'react';
import data from '../../data/site.js';
import { gsap, reduced } from '../../lib/motion.js';

const { frames, looks, log } = data.grade;

/* Before/after slider: a simulated flat LOG frame against the graded delivery, with four looks. */
export default function GradeCompare() {
	const [ frame, setFrame ] = useState( 0 );
	const [ look, setLook ] = useState( 0 );
	const [ pos, setPos ] = useState( 50 );
	const stage = useRef( null );
	const dragging = useRef( false );

	useLayoutEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		// A one-time sweep shows the comparison is draggable.
		const o = { v: 50 };
		const update = () => setPos( o.v );
		const tl = gsap.timeline( { scrollTrigger: { trigger: stage.current, start: 'top 70%', once: true } } )
			.to( o, { v: 18, duration: 0.9, ease: 'power2.inOut', onUpdate: update } )
			.to( o, { v: 82, duration: 1.2, ease: 'power2.inOut', onUpdate: update } )
			.to( o, { v: 50, duration: 0.8, ease: 'power2.inOut', onUpdate: update } );
		return () => {
			tl.scrollTrigger?.kill();
			tl.kill();
		};
	}, [] );

	const fromEvent = ( e ) => {
		const r = stage.current.getBoundingClientRect();
		setPos( Math.max( 0, Math.min( 100, ( ( e.clientX - r.left ) / r.width ) * 100 ) ) );
	};

	const [ label, src, alt ] = frames[ frame ];
	const [ lookName, filter, overlay ] = looks[ look ];

	return (
		<section className="gradeSection" aria-labelledby="gradeTitle">
			<div className="gradeInner">
				<div className="gradeHead">
					<p className="eyebrow">(06) Colour grading</p>
					<h2 className="sectionTitle" id="gradeTitle">From flat LOG to the finished frame.</h2>
					<p className="lede">Drag across the frame. Every shoot is colour graded in-house in DaVinci Resolve before it reaches your feed.</p>
				</div>
				<div className="gradeCompare">
					<div className="gradeStage" ref={ stage }
						onPointerDown={ ( e ) => {
							dragging.current = true;
							e.currentTarget.setPointerCapture( e.pointerId );
							fromEvent( e );
						} }
						onPointerMove={ ( e ) => ( dragging.current || e.pointerType === 'mouse' ) && fromEvent( e ) }
						onPointerUp={ () => {
							dragging.current = false;
						} }>
						<img className="gradeImg gradeImg--after" src={ src } alt={ `${ alt } (${ label })` } style={ { filter } } />
						<span className="gradeOverlay" aria-hidden="true" style={ { background: overlay || 'none' } } />
						<div className="gradeBefore" aria-hidden="true" style={ { clipPath: `inset(0 ${ 100 - pos }% 0 0)` } }>
							<img className="gradeImg gradeImg--before" src={ src } alt="" style={ { filter: log } } />
						</div>
						<span className="gradeTag gradeTag--l">LOG · Flat profile</span>
						<span className="gradeTag gradeTag--r">Graded · { lookName }</span>
						<div className="gradeHandle" aria-hidden="true" style={ { left: `${ pos }%` } }><span>◂ ▸</span></div>
						<input className="gradeRange" type="range" min="0" max="100" value={ Math.round( pos ) }
							aria-label="Compare LOG and graded frame" onChange={ ( e ) => setPos( Number( e.target.value ) ) } />
					</div>
					<div className="gradeControls">
						<div className="chipRow" role="group" aria-label="Frame">
							{ frames.map( ( f, i ) => (
								<button key={ f[ 0 ] } type="button" className={ `chip${ i === frame ? ' is-active' : '' }` } aria-pressed={ i === frame } onClick={ () => setFrame( i ) }>{ f[ 0 ] }</button>
							) ) }
						</div>
						<div className="chipRow" role="group" aria-label="Look">
							{ looks.map( ( l, i ) => (
								<button key={ l[ 0 ] } type="button" className={ `chip${ i === look ? ' is-active' : '' }` } aria-pressed={ i === look } onClick={ () => setLook( i ) }>{ l[ 0 ] }</button>
							) ) }
						</div>
					</div>
					<p className="gradeNote">The flat LOG view is simulated from the delivered frame to show the grading step.</p>
				</div>
			</div>
		</section>
	);
}
