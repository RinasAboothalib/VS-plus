/*
 * Flagship projects: the studio's own campaign videos, from the VS+ Instagram
 * and YouTube channel. Instagram videos are served from /assets/projects
 * (720p H.264, encoded from the posts); YouTube videos play in YouTube's
 * embedded player. Text comes from each post's own caption; results are the
 * verified figures already used on the site.
 *
 *   category — the filter it appears under: 'social' (Influencer / Social media
 *              campaigns), 'case' (Digital Case Studies) or 'tvc' (TVC Campaigns)
 *   group  — layout row: 'reel' (vertical, 9:16) or 'film' (landscape 16:9, or square)
 *   shape  — the video's own shape: 'reel', 'film' or 'square'
 *   result — [figure, label] picked out on the card, where we have one
 */
const B = ( name ) => `/assets/brands/${ name }`;
const P = ( name ) => `/assets/projects/${ name }`;

export default [
	{
		id: 'ponds', category: 'social', client: 'Pond’s Sri Lanka', title: 'Pond’s Sri Lanka', group: 'reel', shape: 'reel',
		format: 'Instagram reel', date: 'June 2024',
		line: 'Videography for the Pond’s Sri Lanka campaign.',
		video: P( 'ponds.mp4' ), poster: P( 'ponds.jpg' ),
		url: 'https://www.instagram.com/p/C8EYPxkhXag/',
		logo: { mark: B( 'ponds-logo.webp' ) },
		result: [ '+142%', 'Social engagement lift' ]
	},
	{
		id: 'closeup', category: 'tvc', client: 'Closeup Sri Lanka', title: 'Closeup Toothpaste', group: 'reel', shape: 'reel',
		format: 'Video advertisement', date: 'June 2024',
		line: 'Our video advertisement for Closeup Sri Lanka.',
		video: P( 'closeup.mp4' ), poster: P( 'closeup.jpg' ),
		url: 'https://www.instagram.com/p/C8ti7z1h1a7/',
		logo: { tile: B( 'closeup-logo.webp' ) } // hul.co.in (Unilever)
	},
	{
		id: 'heritance', category: 'case', client: 'Heritance Hotels', title: 'Heritance Ayurveda', group: 'film', shape: 'film',
		format: 'Hospitality film', date: 'March 2024',
		line: 'Elevating hospitality to cinematic perfection: a video production for Heritance Ayurveda.',
		video: P( 'heritance.mp4' ), poster: P( 'heritance.jpg' ),
		url: 'https://www.instagram.com/p/C4AoMc0h5wf/',
		logo: { mark: B( 'heritance-logo.svg' ) } // heritancehotels.com
	},
	{
		id: 'dankotuwa', category: 'case', client: 'Dankotuwa Porcelain', title: 'Dankotuwa Porcelain', group: 'film', shape: 'square',
		format: 'CGI campaign', date: 'January 2024',
		line: 'Conceptualised with CGI animations for an augmented-reality outcome.',
		video: P( 'dankotuwa.mp4' ), poster: P( 'dankotuwa.jpg' ),
		url: 'https://www.instagram.com/p/C2y6eVhhXJN/',
		logo: { mark: B( 'dankotuwa-logo.webp' ) },
		result: [ '8K', 'Photorealistic CGI fidelity' ]
	},
	{
		id: 'itc', category: 'social', client: 'ITC Hotels', title: 'ITC Ratnadeepa × Peter Kuruvita', group: 'film', shape: 'film',
		format: 'Film trailer', date: 'YouTube',
		line: 'Trailer for ITC Ratnadeepa with chef Peter Kuruvita.',
		yt: 'd-_dQ9-LmxE', poster: P( 'itc.jpg' ),
		url: 'https://www.youtube.com/watch?v=d-_dQ9-LmxE',
		logo: { mark: B( 'itc-hotels-logo.svg' ) } // itchotels.com
	},
	{
		id: 'iihs', category: 'tvc', client: 'IIHS', title: 'IIHS — Success Stories', group: 'film', shape: 'film',
		format: 'Brand film', date: 'YouTube',
		line: 'IIHS brand film: success stories, featuring Dehan.',
		yt: 'OuY1KR-WiSE', poster: P( 'iihs.jpg' ),
		url: 'https://www.youtube.com/watch?v=OuY1KR-WiSE',
		logo: { mark: B( 'iihs-logo.webp' ) } // iihs.edu.lk
	},
	{
		id: 'ahmad', category: 'social', client: 'Ahmad Tea', title: 'Ahmad Tea — AI Content', group: 'reel', shape: 'reel',
		format: 'AI content · Short', date: 'YouTube',
		line: 'AI-generated content for Ahmad Tea.',
		yt: 'lMLzgMJ3UTU', poster: P( 'ahmad.jpg' ),
		url: 'https://www.youtube.com/shorts/lMLzgMJ3UTU',
		logo: { mark: B( 'ahmad-tea-logo.webp' ) },
		result: [ '+68%', 'YoY social follower growth' ]
	},
	{
		id: 'milo', category: 'social', client: 'Milo', title: 'Iced Milo Recipe', group: 'reel', shape: 'reel',
		format: 'Recipe short', date: 'YouTube',
		line: 'A recipe short for Iced Milo.',
		yt: 'UP4V8Kg-_J4', poster: P( 'milo.jpg' ),
		url: 'https://www.youtube.com/shorts/UP4V8Kg-_J4',
		logo: { tile: B( 'milo-logo.webp' ) } // milo.com.au (Nestlé)
	}
];
