/** Join class names, skipping falsy ones (the shadcn `cn` helper, minus Tailwind merging). */
export function cn( ...classes ) {
	return classes.filter( Boolean ).join( ' ' );
}
