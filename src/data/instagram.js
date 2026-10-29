/*
 * Latest posts from instagram.com/visualstudiosplus (newest first), shown in the
 * home Portfolio strip. Covers are saved in /assets/instagram/<id>.webp at the
 * size Instagram serves its grid (w × h).
 */
const posts = [
	[ 'p', 'DfEcNcIm1aj', 'Oct 29', 512, 640 ],
	[ 'reel', 'De81mgPzCYR', 'Oct 26', 361, 640 ],
	[ 'reel', 'De3R3mQlpA4', 'Oct 23', 640, 360 ],
	[ 'p', 'DeyLklIkzx2', 'Oct 21', 512, 640 ],
	[ 'reel', 'DetNHlTj3pH', 'Oct 19', 360, 640 ],
	[ 'reel', 'DeeJG3binPs', 'Oct 14', 360, 640 ],
	[ 'p', 'DebkAUFjiG9', 'Oct 13', 512, 640 ],
	[ 'p', 'DeZumh8kxNY', 'Oct 12', 512, 640 ],
	[ 'reel', 'DeTOwZhAVZ5', 'Oct 9', 360, 640 ],
	[ 'reel', 'DePu1-Ov2_0', 'Oct 8', 360, 640 ],
	[ 'p', 'Dd1KuzJk7YR', 'Sep 28', 512, 640 ]
].map( ( [ kind, id, date, w, h ] ) => ( {
	id, date, w, h,
	kind: kind === 'reel' ? 'Reel' : 'Post',
	src: `/assets/instagram/${ id }.webp`,
	url: `https://www.instagram.com/${ kind }/${ id }/`
} ) );

export default posts;
