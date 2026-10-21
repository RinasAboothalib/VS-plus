/*
 * Brand logo for each case study, keyed by its title (caseStudies[n][3]).
 *
 *   tile — a square brand tile (the client's official Instagram profile
 *          mark, with its own background) that fills the frame
 *   mark — a transparent logo (client website or the site's partner set),
 *          shown whole on white
 *
 * A case without an entry gets a monogram tile instead.
 */
const B = ( name ) => `/assets/brands/${ name }`;
const P = ( file ) => `/assets/logos/${ file }`;

export default {
	'Nescafé × Colombo Fashion Week': { tile: B( 'nescafe.webp' ) },
	'Pond’s Super Light Gel Launch': { tile: B( 'ponds.webp' ) },
	'UNDP Sri Lanka — HackaDev Social Innovation': { mark: P( 'UNDP_logo-1.png' ) },
	'Dankotuwa Porcelain CGI World': { tile: B( 'dankotuwa.webp' ) },
	'Ministry of Crab Gastronomy': { tile: B( 'ministry-of-crab.webp' ) },
	'American Express × Swim Week Colombo': { mark: P( 'American-Express-logo-a.png' ) },
	'Knorr Mother’s Day Campaign': { tile: B( 'knorr.webp' ) },
	'Munchee CBL — Festive AI & Lego Campaign': { mark: P( 'Munchee-Logo-a.png' ) },
	'Ahmad Tea London — Digital Channel Retainer': { mark: P( 'AhmadTeaLogoTransparent-a.png' ) },
	'Swisstek Aluminium — Technical & Solar Strategy': { tile: B( 'swisstek.webp' ) },
	'Swadeshi Khomba — Natural Herbal Digital Presence': { tile: B( 'khomba.webp' ) },
	'Imorich Ice Cream — 5-Year Creative Partnership': { tile: B( 'imorich.webp' ) },
	'SOZO Sparkling Drinks — Identity & Can Design': { mark: B( 'sozo.svg' ) },
	'Too Good Dessert Chocolatier': { mark: B( 'too-good.webp' ) },
	'CBW (Cairns Bicycle Works) — Australia': { tile: B( 'cbw.webp' ) },
	'Te Dalu — Boutique Hotel Ella': { tile: B( 'te-dalu.webp' ) },
	'Viva Malted Food Drink — Avurudu Series': { tile: B( 'viva.webp' ) },
	'MintPay — Digital Vouchers Commercial': { tile: B( 'mintpay.webp' ) },
	'Swadeshi Khomba — Women’s Day TVC': { tile: B( 'khomba.webp' ) },
	'DSI Footwear — Everyday Journeys': { tile: B( 'dsi.webp' ) },
	'Sapphire Dragon Chinese Restaurant': { mark: P( 'hilton-a.png' ) }
};
