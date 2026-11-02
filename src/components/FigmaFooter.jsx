import { useLayoutEffect, useRef } from 'react';
import data from '../data/site.js';
import { gsap, reduced } from '../lib/motion.js';
import TLink from './TLink.jsx';
import { SocialIcons } from './SocialIcon.jsx';

/* Footer from the Figma home frame: four link columns over the oversized wordmark. */
export default function FigmaFooter() {
	const { email, phones } = data.site;
	const root = useRef( null );

	// The columns rise in turn, then the wordmark slides up letter group by group.
	useLayoutEffect( () => {
		if ( reduced ) {
			return undefined;
		}
		const ctx = gsap.context( () => {
			gsap.timeline( { scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } } )
				.from( '.fgFooter_col, .fgFooter_social--mid', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08 } )
				.from( '.fgFooter_title > *', { yPercent: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1 }, 0.25 );
		}, root );
		return () => ctx.revert();
	}, [] );

	return (
		<footer className="fgFooter" data-theme="dark" ref={ root }>
			<div className="fgFooter_cols">
				<div className="fgFooter_col">
					<p className="fgFooter_head">Email the studio</p>
					<a href={ `mailto:${ email }` }>{ email }</a>
				</div>
				<div className="fgFooter_col">
					<p className="fgFooter_head">call the studio</p>
					{ phones.map( ( p ) => <a key={ p } href={ `tel:${ p.replace( /\s+/g, '' ) }` }>{ p }</a> ) }
				</div>
				{ /* Social icons sit in the middle of the row, between the two column pairs. */ }
				<SocialIcons items={ data.site.socials } className="fgFooter_social fgFooter_social--mid" size={ 18 } />
				<div className="fgFooter_col fgFooter_col--push">
					<p className="fgFooter_head">Information</p>
					<TLink to="/about/">about</TLink>
					<TLink to="/work/">projects</TLink>
					<TLink to="/contact/">contact</TLink>
				</div>
				<div className="fgFooter_col">
					<p className="fgFooter_head">services</p>
					<TLink to="/social-media-marketing/">social media marketing</TLink>
					<TLink to="/web-development/">web development</TLink>
					<TLink to="/services/">content creation</TLink>
					<TLink to="/services/">Branding</TLink>
				</div>
			</div>
			<p className="fgFooter_title" aria-label="Visual Studios Plus">
				<span>Visual</span><span>Studios</span><sup aria-hidden="true">+</sup>
			</p>
		</footer>
	);
}
