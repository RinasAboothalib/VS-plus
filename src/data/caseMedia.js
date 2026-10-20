/*
 * One cover per case study, keyed by its title (caseStudies[n][3]).
 * Covers come from each client's own Instagram profile (public/assets/clients);
 * Pond's and Knorr use the campaign media already in public/assets/cases.
 * A case without an entry gets a monogram tile instead.
 */
const C = ( name ) => `/assets/clients/${ name }.webp`;

export default {
	'Pond’s Super Light Gel Launch': { video: '/assets/cases/ponds-reel.mp4#t=2.5' },
	'Dankotuwa Porcelain CGI World': { img: C( 'dankotuwa' ) },
	'Ministry of Crab Gastronomy': { img: C( 'ministry-of-crab' ) },
	'American Express × Swim Week Colombo': { img: C( 'amex' ) },
	'Knorr Mother’s Day Campaign': { img: '/assets/cases/knorr-2.webp' },
	'Munchee CBL — Festive AI & Lego Campaign': { img: C( 'munchee' ) },
	'Ahmad Tea London — Digital Channel Retainer': { img: C( 'ahmad-tea' ) },
	'Swisstek Aluminium — Technical & Solar Strategy': { img: C( 'swisstek' ) },
	'Swadeshi Khomba — Natural Herbal Digital Presence': { img: C( 'khomba' ) },
	'Imorich Ice Cream — 5-Year Creative Partnership': { img: C( 'imorich' ) },
	'CBW (Cairns Bicycle Works) — Australia': { img: C( 'cbw' ) },
	'Te Dalu — Boutique Hotel Ella': { img: C( 'te-dalu' ) },
	'Viva Malted Food Drink — Avurudu Series': { img: C( 'viva' ) },
	'MintPay — Digital Vouchers Commercial': { img: C( 'mintpay' ) },
	'Swadeshi Khomba — Women’s Day TVC': { img: C( 'khomba-tvc' ) },
	'DSI Footwear — Everyday Journeys': { img: C( 'dsi' ) },
	'Sapphire Dragon Chinese Restaurant': { img: C( 'hilton' ) }
};
