import fullEscapeMap from './escape.json';

export interface escapeMap {
	[k: string]: string;
}

export function unescapeHTML(text: string, map: escapeMap = fullEscapeMap) {
	let input = text;
	for (const k in map) {
		while (input.match(k)) {
			input = input.replace(k, map[k]);
		}
	}
	return input;
}
