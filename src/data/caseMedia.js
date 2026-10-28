/*
 * Brand logo for each case study, keyed by its title (caseStudies[n][3]).
 *
 *   mark — the logo from the client's official website (or a trimmed copy
 *          of the site's partner set), shown whole on white; `dark: true` for logos made
 *          for dark backgrounds
 *   tile — the official Instagram profile mark (with its own background)
 *          where the client has no website logo to use; fills the frame
 *
 * A case without an entry gets a monogram tile instead.
 */
const B = ( name ) => `/assets/brands/${ name }`;

export default {
	'Nescafé × Colombo Fashion Week': { mark: B( 'nescafe-logo.webp' ), dark: true }, // nescafe.com
	'Pond’s Super Light Gel Launch': { mark: B( 'ponds-logo.webp' ) }, // ponds.in (Unilever)
	'UNDP Sri Lanka — HackaDev Social Innovation': { mark: B( 'undp-logo.svg' ) }, // undp.org
	'Dankotuwa Porcelain CGI World': { mark: B( 'dankotuwa-logo.webp' ) }, // dankotuwa.com
	'Ministry of Crab Gastronomy': { mark: B( 'ministry-of-crab-logo.webp' ), dark: true }, // ministryofcrab.com
	'American Express × Swim Week Colombo': { mark: B( 'amex-logo.svg' ) }, // americanexpress.com
	'Knorr Mother’s Day Campaign': { mark: B( 'knorr-logo.webp' ) }, // knorr.com (Unilever)
	'Munchee CBL — Festive AI & Lego Campaign': { mark: B( 'munchee-logo.webp' ) },
	'Ahmad Tea London — Digital Channel Retainer': { mark: B( 'ahmad-tea-logo.webp' ) }, // ahmadtea.com
	'Swisstek Aluminium — Technical & Solar Strategy': { mark: B( 'swisstek-logo.webp' ) }, // swisstekceylon.com
	'Swadeshi Khomba — Natural Herbal Digital Presence': { mark: B( 'swadeshi-logo.webp' ) }, // swadeshiherbal.com
	'Imorich Ice Cream — 5-Year Creative Partnership': { tile: B( 'imorich.webp' ) },
	'SOZO Sparkling Drinks — Identity & Can Design': { mark: B( 'sozo.svg' ) },
	'Too Good Dessert Chocolatier': { mark: B( 'too-good.webp' ) },
	'CBW (Cairns Bicycle Works) — Australia': { mark: B( 'cbw-logo.webp' ), dark: true }, // cairnsbicycleworks.com.au
	'Te Dalu — Boutique Hotel Ella': { mark: B( 'te-dalu-logo.webp' ), dark: true }, // tedaluella.com
	'Viva Malted Food Drink — Avurudu Series': { tile: B( 'viva.webp' ) },
	'MintPay — Digital Vouchers Commercial': { mark: B( 'mintpay-logo.webp' ) }, // mintpay.lk
	'Swadeshi Khomba — Women’s Day TVC': { mark: B( 'swadeshi-logo.webp' ) },
	'DSI Footwear — Everyday Journeys': { mark: B( 'dsi-logo.webp' ) }, // dsi.lk
	'Sapphire Dragon Chinese Restaurant': { mark: B( 'hilton-logo.webp' ) }
};
