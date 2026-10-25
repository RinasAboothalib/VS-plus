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
 *
 *   photo — the card's main picture (/assets/cases/main), never cropped: the
 *           studio's own campaign artwork or shot where we have one (Nescafé is
 *           the CFW key visual), otherwise the brand's own imagery from its
 *           official site or Instagram
 *   more  — a further verified result, from the home page's results list
 */
const B = ( name ) => `/assets/brands/${ name }`;
/* Pixel size of each main picture. */
const SIZE = {
	nescafe: [ 1448, 817 ],
	ponds: [ 1106, 1100 ],
	undp: [ 1000, 675 ],
	dankotuwa: [ 720, 1280 ],
	moc: [ 1400, 2485 ],
	amex: [ 1280, 1280 ],
	knorr: [ 1400, 2100 ],
	munchee: [ 1050, 900 ],
	ahmad: [ 1024, 1280 ],
	swisstek: [ 1024, 396 ],
	khomba: [ 1400, 1400 ],
	imorich: [ 1400, 1456 ],
	cbw: [ 1280, 1280 ],
	tedalu: [ 1018, 1280 ],
	viva: [ 722, 1280 ],
	khombatvc: [ 1400, 1400 ],
	dsi: [ 1024, 1280 ],
	sapphire: [ 1024, 1280 ],
	sozo: [ 1400, 1697 ],
	toogood: [ 1000, 808 ],
	mintpay: [ 1400, 743 ]
};
const P = ( name ) => ( { src: `/assets/cases/main/${ name }.webp`, w: SIZE[ name ][ 0 ], h: SIZE[ name ][ 1 ] } );

export default {
	'Nescafé × Colombo Fashion Week': { mark: B( 'nescafe-logo.webp' ), dark: true, photo: P( 'nescafe' ), more: [ '1.2M+', 'Campaign reach in 48h' ] }, // nescafe.com
	'Pond’s Super Light Gel Launch': { mark: B( 'ponds-logo.webp' ), photo: P( 'ponds' ) }, // ponds.in (Unilever)
	'UNDP Sri Lanka — HackaDev Social Innovation': { mark: B( 'undp-logo.svg' ), photo: P( 'undp' ) }, // undp.org
	'Dankotuwa Porcelain CGI World': { mark: B( 'dankotuwa-logo.webp' ), photo: P( 'dankotuwa' ) }, // dankotuwa.com
	'Ministry of Crab Gastronomy': { mark: B( 'ministry-of-crab-logo.webp' ), dark: true, photo: P( 'moc' ) }, // ministryofcrab.com
	'American Express × Swim Week Colombo': { mark: B( 'amex-logo.svg' ), photo: P( 'amex' ) }, // americanexpress.com
	'Knorr Mother’s Day Campaign': { mark: B( 'knorr-logo.webp' ), photo: P( 'knorr' ) }, // knorr.com (Unilever)
	'Munchee CBL — Festive AI & Lego Campaign': { mark: B( 'munchee-logo.webp' ), photo: P( 'munchee' ), more: [ '320K+', 'Direct social interactions' ] },
	'Ahmad Tea London — Digital Channel Retainer': { mark: B( 'ahmad-tea-logo.webp' ), photo: P( 'ahmad' ), more: [ '+68%', 'YoY social follower growth' ] }, // ahmadtea.com
	'Swisstek Aluminium — Technical & Solar Strategy': { mark: B( 'swisstek-logo.webp' ), photo: P( 'swisstek' ) }, // swisstekceylon.com
	'Swadeshi Khomba — Natural Herbal Digital Presence': { mark: B( 'swadeshi-logo.webp' ), photo: P( 'khomba' ) }, // swadeshiherbal.com
	'Imorich Ice Cream — 5-Year Creative Partnership': { tile: B( 'imorich.webp' ), photo: P( 'imorich' ) },
	'SOZO Sparkling Drinks — Identity & Can Design': { mark: B( 'sozo.svg' ), photo: P( 'sozo' ) },
	'Too Good Dessert Chocolatier': { mark: B( 'too-good.webp' ), photo: P( 'toogood' ) },
	'CBW (Cairns Bicycle Works) — Australia': { mark: B( 'cbw-logo.webp' ), dark: true, photo: P( 'cbw' ) }, // cairnsbicycleworks.com.au
	'Te Dalu — Boutique Hotel Ella': { mark: B( 'te-dalu-logo.webp' ), dark: true, photo: P( 'tedalu' ) }, // tedaluella.com
	'Viva Malted Food Drink — Avurudu Series': { tile: B( 'viva.webp' ), photo: P( 'viva' ) },
	'MintPay — Digital Vouchers Commercial': { mark: B( 'mintpay-logo.webp' ), photo: P( 'mintpay' ) }, // mintpay.lk
	'Swadeshi Khomba — Women’s Day TVC': { mark: B( 'swadeshi-logo.webp' ), photo: P( 'khombatvc' ) },
	'DSI Footwear — Everyday Journeys': { mark: B( 'dsi-logo.webp' ), photo: P( 'dsi' ) }, // dsi.lk
	'Sapphire Dragon Chinese Restaurant': { mark: B( 'hilton-logo.webp' ), photo: P( 'sapphire' ) }
};
