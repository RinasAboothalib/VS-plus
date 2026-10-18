import data from '../data/site.js';
import TLink from './TLink.jsx';
import CopyEmail from './CopyEmail.jsx';
import { usePageMeta } from '../context/PageContext.jsx';
import { SocialIcons } from './SocialIcon.jsx';

export default function Footer() {
	const { cta } = usePageMeta();
	const { site, services } = data;

	return (
		<footer className="siteFooter">
			<div className="footerInner">
				<div className="footerLead">
					<p className="eyebrow">Accepting select commercial briefs for 2026</p>
					<h2 className="footerTitle">{ cta.title }</h2>
					<div className="footerLead_row">
						<p>{ cta.text }</p>
						<TLink className="pillBtn" to="/contact/">{ cta.button }</TLink>
					</div>
				</div>

				<div className="footerCols">
					<div className="footerCol">
						<p className="fLabel">Got a brief?</p>
						<p className="fTitle">Partner with us</p>
						<TLink className="fAction" to="/contact/">Start a project brief</TLink>
						<p className="fLabel fLabel--gap">Or email us on</p>
						<CopyEmail email={ site.email } />
					</div>
					<div className="footerCol">
						<p className="fLabel">Just want to say hi?</p>
						<p className="fTitle">Call the studio</p>
						{ site.phones.map( ( p ) => (
							<a key={ p } className="fAction" href={ `tel:${ p.replace( /\s+/g, '' ) }` }>{ p }</a>
						) ) }
					</div>
					<div className="footerCol">
						<p className="fLabel">Visit Colombo studio</p>
						<p className="fTitle">{ site.address[ 0 ] }<br />{ site.address[ 1 ] }, { site.address[ 2 ] }</p>
						<a className="fAction" href={ site.maps } target="_blank" rel="noopener noreferrer">Open in Google Maps ↗</a>
					</div>
					<div className="footerCol">
						<p className="fLabel">Direct channels</p>
						<p className="fTitle">Follow the work</p>
						<SocialIcons items={ site.socials } className="socialIcons--footer" size={ 22 } />
					</div>
				</div>

				<div className="footerNav">
					<div className="footerAbout">
						<p className="footerAbout_big">We create content meant to be experienced. Not simply consumed.</p>
						<p>Colombo’s premier creative, cinematography, and digital agency.</p>
					</div>
					<div>
						<p className="fLabel">Navigation</p>
						<ul className="footerList">
							<li><TLink to="/">Home</TLink></li>
							<li><TLink to="/work/">Projects &amp; Archive</TLink></li>
							<li><TLink to="/photography/">Photography</TLink></li>
							<li><TLink to="/services/">Capabilities &amp; Services</TLink></li>
							<li><TLink to="/about/">About Studio</TLink></li>
							<li><TLink to="/contact/">Contact Studio</TLink></li>
						</ul>
					</div>
					<div>
						<p className="fLabel">Services</p>
						<ul className="footerList">
							{ services.map( ( s ) => (
								<li key={ s[ 0 ] }><TLink to={ `/services/#${ s[ 0 ] }` }>{ s[ 1 ] }</TLink></li>
							) ) }
						</ul>
					</div>
				</div>

				<img className="footerMark" src="/assets/img/VSP-Square-logo.png" alt="" aria-hidden="true" />
				<div className="footerBar">
					<p>© { new Date().getFullYear() } Visual Studios Plus. All rights reserved. Made in Colombo.</p>
					<p>Colombo, Sri Lanka</p>
				</div>
			</div>
		</footer>
	);
}
