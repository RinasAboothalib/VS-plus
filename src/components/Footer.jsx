import data from '../data/site.js';
import TLink from './TLink.jsx';
import CopyEmail from './CopyEmail.jsx';
import { usePageMeta } from '../context/PageContext.jsx';
import { SocialIcons } from './SocialIcon.jsx';
import FooterBrief from './FooterBrief.jsx';

/*
 * Footer: the page's call to action, then one compact row (email, phones and
 * two header-less link lists), and a bottom bar with the small VS+ mark,
 * the copyright line and the social icons.
 */
export default function Footer() {
	const { cta, page } = usePageMeta();
	const { site, services } = data;

	return (
		<footer className="siteFooter">
			<div className="footerInner">
				<div className="footerLead">
					<p className="eyebrow">Accepting select commercial briefs for 2026</p>
					<h2 className="footerTitle">{ cta.title }</h2>
					{ /* The contact page has its own brief form, so the footer keeps its plain call to action there. */ }
					<div className={ `footerLead_row${ page === 'contact' ? '' : ' footerLead_row--form' }` }>
						<p>{ cta.text }</p>
						{ page === 'contact'
							? <TLink className="pillBtn" to="/contact/#brief">{ cta.button }</TLink>
							: <FooterBrief /> }
					</div>
				</div>

				<div className="footerCols">
					<div className="footerCol">
						<p className="fLabel">Email the studio</p>
						<CopyEmail email={ site.email } />
					</div>
					<div className="footerCol">
						<p className="fLabel">Call the studio</p>
						{ site.phones.map( ( p ) => (
							<a key={ p } className="fAction" href={ `tel:${ p.replace( /\s+/g, '' ) }` }>{ p }</a>
						) ) }
					</div>
					<nav className="footerCol" aria-label="Footer">
						<ul className="footerList">
							<li><TLink to="/">Home</TLink></li>
							<li><TLink to="/social-media-marketing/">Social Media Marketing</TLink></li>
							<li><TLink to="/web-development/">Web Development</TLink></li>
							<li><TLink to="/work/">Projects &amp; Archive</TLink></li>
							<li><TLink to="/photography/">Photography</TLink></li>
							<li><TLink to="/services/">Capabilities &amp; Services</TLink></li>
							<li><TLink to="/about/">About Studio</TLink></li>
							<li><TLink to="/contact/">Contact Studio</TLink></li>
						</ul>
					</nav>
					<div className="footerCol">
						<ul className="footerList">
							{ services.map( ( s ) => (
								<li key={ s[ 0 ] }><TLink to={ `/services/#${ s[ 0 ] }` }>{ s[ 1 ] }</TLink></li>
							) ) }
						</ul>
					</div>
				</div>

				<div className="footerBar">
					<TLink className="footerBar_mark" to="/" aria-label="Visual Studios Plus — home">
						<img src="/assets/img/VSP-Square-logo.png" alt="" />
					</TLink>
					<p className="footerBar_copy">© { new Date().getFullYear() } Visual Studios Plus. All rights reserved.</p>
					<SocialIcons items={ site.socials } className="socialIcons--footer" size={ 16 } />
				</div>
			</div>
		</footer>
	);
}
