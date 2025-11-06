import { ColorFn } from '../cols/colorPack';
import { ChalkStyleKeys } from '../cols/colorPolify';
import { writePseudoColorLang } from '../lang/pseudoLang';
import { getTerminalWidth } from './terminal';

export interface horizontalRuleParam {
	char?: string;
	align?: 'left' | 'center' | 'right';
	space?: number;
	title?: string | number;
	titleColor?: ChalkStyleKeys | ColorFn;
	hrColor?: ChalkStyleKeys | ColorFn;
	width?: number;
}

/**
 * Generates a horizontal rule (HR) string with optional customization for alignment,
 * character, spacing, width, and colors. The HR can also include a title.
 *
 * @param param - Configuration options for the horizontal rule.
 * @param param.char - The character used to create the horizontal rule. Defaults to "_".
 * @param param.align - The alignment of the horizontal rule. Can be "center", "left", or "right". Defaults to "center".
 * @param param.space - The number of spaces around the title. Defaults to 1.
 * @param param.width - The total width of the horizontal rule. Defaults to the terminal width or 80 if not available.
 * @param param.hrColor - The color of the horizontal rule. Can be a string or a function that applies color.
 * @param param.titleColor - The color of the title. Can be a string or a function that applies color.
 * @param param.title - The title to include in the horizontal rule. Defaults to an empty string.
 *
 * @returns A string representing the formatted horizontal rule.
 */
export function hr(param: horizontalRuleParam = {}): string {
	const char = param.char || '_';
	const align = param.align || 'center';
	const space = param.space ?? 1;
	const width = param.width || getTerminalWidth(80);
	const hrColor = param.hrColor;
	const titleColor = param.titleColor;
	const title = param.title !== undefined ? String(param.title) : '';

	const coloredChar =
		typeof hrColor == 'function'
			? hrColor(char)
			: writePseudoColorLang([hrColor || 'gray'], char);

	// Calculate total HR length minus title & spaces
	const titleWithSpace = title
		? ' '.repeat(space) + title + ' '.repeat(space)
		: '';
	const titleColored = title
		? typeof titleColor === 'function'
			? titleColor(titleWithSpace)
			: writePseudoColorLang([titleColor || 'gray'], titleWithSpace)
		: '';

	const remaining = width - titleWithSpace.length;
	const left = Math.floor(remaining / 2);
	const right = remaining - left;

	let hrString = '';

	if (align === 'center') {
		hrString =
			coloredChar.repeat(left) + titleColored + coloredChar.repeat(right);
	} else if (align === 'left') {
		hrString = titleColored + coloredChar.repeat(remaining);
	} else {
		hrString = coloredChar.repeat(remaining) + titleColored;
	}

	return hrString;
}
