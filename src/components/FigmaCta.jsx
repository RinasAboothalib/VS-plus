import { useLayoutEffect, useRef } from 'react';
import data from '../data/site.js';
import { gsap, reduced } from '../lib/motion.js';
import TLink from './TLink.jsx';

/*
 * Contact us: the last word before the footer, in the hero's type, on a white section.
 * Home numbers it as its fourth section (`n`); other pages show it unnumbered.
 */
export default function FigmaCta( { n } ) {
	const root = useRef( null );
	const { email } = data.site;

	// The heading rises in, then the headline lines, sub line and buttons in turn.
	useLayoutEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const ctx = gsap.context( () => {
			gsap.timeline( { scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } } )
				.from( '.fgEyebrow', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' } )
				.from( '.fgCta_title > span, .fgCta_sub, .fgCta_actions .fgBtn', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', stagger: 0.08 }, 0.15 );
		}, root );
		return () => ctx.revert();
	}, [] );

	return (
		<section className="fgCta" data-theme="light" aria-labelledby="fgCtaTitle" ref={ root }>
			<h2 className="fgEyebrow">
				{ n && <>[{ n }]<span aria-hidden="true">&nbsp;&nbsp;&nbsp;</span> </> }Contact us
			</h2>
			<div className="fgCta_body">
				<p className="fgCta_title" id="fgCtaTitle">
					<span>Ready to grow</span>
					<span className="fgHero_accent">your brand?</span>
				</p>
				<p className="fgCta_sub">Tell us about your brand, campaign or launch. We reply within four business hours from our Colombo 04 studio.</p>
				<div className="fgCta_actions">
					<TLink to="/contact/" className="fgBtn fgBtn--solid">Start a project</TLink>
					<a href={ `mailto:${ email }` } className="fgBtn fgBtn--line">Email us</a>
				</div>
			</div>
		</section>
	);
}
