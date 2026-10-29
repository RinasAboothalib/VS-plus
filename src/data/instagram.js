/*
 * The 40 latest posts from instagram.com/visualstudiosplus (newest first), shown
 * in the home Portfolio strip. Covers are saved in /assets/instagram/<id>.webp (w × h).
 */
const posts = [
	[ 'p', 'DfEcNcIm1aj', 512, 640 ],
	[ 'reel', 'De81mgPzCYR', 361, 640 ],
	[ 'reel', 'De3R3mQlpA4', 640, 360 ],
	[ 'p', 'DeyLklIkzx2', 512, 640 ],
	[ 'reel', 'DetNHlTj3pH', 360, 640 ],
	[ 'reel', 'DeeJG3binPs', 360, 640 ],
	[ 'p', 'DebkAUFjiG9', 512, 640 ],
	[ 'p', 'DeZumh8kxNY', 512, 640 ],
	[ 'reel', 'DeTOwZhAVZ5', 360, 640 ],
	[ 'reel', 'DePu1-Ov2_0', 360, 640 ],
	[ 'p', 'Dd1KuzJk7YR', 512, 640 ],
	[ 'p', 'Ddlo-H9k7UH', 720, 900 ],
	[ 'reel', 'DdicoVXydVD', 640, 1136 ],
	[ 'reel', 'DdYD4UUMbjt', 640, 1136 ],
	[ 'p', 'DdTdT5CE16U', 720, 900 ],
	[ 'reel', 'DdIeQrUSSxr', 640, 1136 ],
	[ 'reel', 'DdA57acvcJY', 640, 1136 ],
	[ 'reel', 'DcsO4ADBc3W', 480, 854 ],
	[ 'p', 'DcnBUlYj0tL', 720, 900 ],
	[ 'reel', 'DcXof8EMS-U', 720, 1280 ],
	[ 'p', 'DcNz7WND9Si', 720, 960 ],
	[ 'reel', 'Db2ONN0h2V2', 720, 1280 ],
	[ 'p', 'DbxAoS7iII8', 720, 900 ],
	[ 'reel', 'Dbsg1BvI8ZE', 640, 1136 ],
	[ 'p', 'DbkfCEBD5bD', 720, 900 ],
	[ 'reel', 'DbcYz6QIl1L', 640, 1136 ],
	[ 'reel', 'DbSwOOnhlP-', 640, 1136 ],
	[ 'reel', 'DbNFW8IPmAI', 720, 1280 ],
	[ 'reel', 'DbLNGI7vfeO', 640, 1136 ],
	[ 'reel', 'DbC5Q2bh2Sn', 480, 854 ],
	[ 'reel', 'Da9lVGJhgj9', 720, 1280 ],
	[ 'reel', 'Da7cUyPP72R', 720, 1280 ],
	[ 'p', 'DazKEzTD8CA', 720, 901 ],
	[ 'reel', 'DarfKhsBnGx', 640, 1136 ],
	[ 'reel', 'DamZcydPJ2-', 720, 1280 ],
	[ 'reel', 'DaUW2fpBqzK', 720, 1280 ],
	[ 'reel', 'DaSfQwAhDiy', 640, 1136 ],
	[ 'reel', 'DaQUnfHPp4w', 640, 1138 ],
	[ 'p', 'DZ9db1WDytI', 720, 720 ],
	[ 'reel', 'DZ66_havFGh', 480, 854 ]
].map( ( [ kind, id, w, h ] ) => ( {
	id, w, h,
	kind: kind === 'reel' ? 'Reel' : 'Post',
	src: `/assets/instagram/${ id }.webp`,
	url: `https://www.instagram.com/${ kind }/${ id }/`
} ) );

export default posts;
