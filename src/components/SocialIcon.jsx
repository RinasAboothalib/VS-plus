/* Brand glyphs for the VS+ social channels (24px grid, currentColor). */
const PATHS = {
	YouTube: 'M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15.1V8.9l5.8 3.1z',
	Instagram: 'M12 2.2c3.2 0 3.6 0 4.8.1 3.2.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9-.1-1.3-.1-1.6-.1-4.8s0-3.6.1-4.8C2.4 4 4 2.4 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9c.2 4.4 2.6 6.8 7 7 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.2-4.4-2.6-6.8-7-7C15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4 6.2 6.2 0 0 0 0-12.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.9 1.4 1.4 0 0 0 0-2.9z',
	LinkedIn: 'M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.1 2.1 2.1 0 0 1 0 4.1zm1.8 13.1H3.6V9h3.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z',
	Behance: 'M22 7h-7V5h7zm1.7 10c-.4 1.3-2.1 3-5.3 3-3.2 0-5.8-1.8-5.8-5.9 0-4.1 2.4-6.2 5.7-6.2 3.2 0 5.2 1.9 5.6 4.6.1.5.1 1.2.1 2.2h-8.4c.1 3.3 3.6 3.4 4.8 2.1zm-8.4-4h5.2c-.1-1.6-1.2-2.2-2.5-2.2-1.5 0-2.4.9-2.7 2.2zM6.9 20H0V4h7.4c5.8.1 5.9 5.8 2.9 7.4 3.7 1.4 3.8 8.6-3.4 8.6zM3 10.4h3.8c2.7 0 3.1-3.2-.3-3.2H3zm3.6 3H3v3.6h3.5c3.3 0 3-3.6.1-3.6z',
	Facebook: 'M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23.1 10.1 24v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.8V24C19.6 23.1 24 18.1 24 12.1z'
};

export default function SocialIcon( { name, size = 20 } ) {
	const d = PATHS[ name ];
	if ( ! d ) {
		return null;
	}
	return (
		<svg className="socialIcon" width={ size } height={ size } viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path d={ d } fill="currentColor" />
		</svg>
	);
}

/* A row of icon links. Each keeps its channel name for screen readers and as a tooltip. */
export function SocialIcons( { items, className = '', size = 20 } ) {
	return (
		<ul className={ `socialIcons ${ className }` }>
			{ items.map( ( [ label, href ] ) => (
				<li key={ label }>
					<a href={ href } target="_blank" rel="noopener noreferrer" aria-label={ `${ label } (opens in a new tab)` } title={ label } data-brand={ label.toLowerCase() }>
						<SocialIcon name={ label } size={ size } />
					</a>
				</li>
			) ) }
		</ul>
	);
}
