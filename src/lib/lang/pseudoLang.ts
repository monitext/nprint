/**
 * This module provides utilities for handling a pseudo-language used for styling text.
 * The pseudo-language uses specific tags to denote styles, allowing for easy parsing and manipulation of styled text.
 */

/**
 * Generates an opening tag for the pseudo-language style.
 * @param style - A string representing the style to be applied (e.g., "red", "bold").
 * @returns A string representing the opening tag with the specified style.
 */
function openingTag(style: string): string {
	return `[mtxt-style[[${style}]]]`;
}

/**
 * Generates a closing tag for the pseudo-language style.
 * @returns A string representing the closing tag.
 */
function closingTag(): string {
	return `[[/mtxt-style]]`;
}

/**
 * Splits a given text into an array of strings based on pseudo-language tags.
 * The function identifies and separates sections of the text that are enclosed
 * within specific pseudo-language tags (`[mtxt-style[[...]]]]` and `[[/mtxt-style]]`).
 * It preserves the tags themselves as separate elements in the resulting array.
 *
 * @param text - The input string to be split.
 * @returns An array of strings, where each element is either a segment of the
 *          original text or one of the pseudo-language tags.
 *
 * @example
 * ```typescript
 * const input = "Hello [mtxt-style[[bold]]], world! [[/mtxt-style]]";
 * const result = splitByPseudoColorLangTags(input);
 * console.log(result);
 * // Output: ["Hello ", "[mtxt-style[[bold]]]", ", world! ", "[[/mtxt-style]]"]
 * ```
 */
export function splitByPseudoColorLangTags(text: string): string[] {
	const regex = /(\[mtxt-style\[\[(.*?)\]\]\])|(\[\[\/mtxt-style\]\])/g;
	const result: string[] = [];
	let lastIndex = 0;
	let match;

	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			result.push(text.slice(lastIndex, match.index));
		}
		result.push(match[0]);
		lastIndex = regex.lastIndex;
	}

	if (lastIndex < text.length) {
		result.push(text.slice(lastIndex));
	}

	return result;
}

/** Matches and extracts the style from an opening pseudo-language tag.
 * @param text - The input string containing the pseudo-language tag.
 * @returns The extracted style string if a match is found; otherwise, returns null.
 *
 * @example
 * ```typescript
 * const input = "[mtxt-style[[red bold]]]";
 * const style = matchOpeningTag(input);
 * console.log(style); // Output: "red bold"
 * ```
 */
export function matchOpeningTag(text: string): string | null {
	const match = text.match(/\[mtxt-style\[\[(.*?)\]\]\]/);
	return match ? match[1] : null;
}

/** Checks if the given text contains a closing pseudo-language tag.
 * @param text - The input string to be checked.
 * @returns True if the text contains a closing tag; otherwise, false.
 *
 * @example
 * ```typescript
 * const input = "This is some text [[/mtxt-style]]";
 * const hasClosingTag = matchClosingTag(input);
 * console.log(hasClosingTag); // Output: true
 * ```
 */
export function matchClosingTag(text: string): boolean {
	return /\[\[\/mtxt-style\]\]/.test(text);
}

/** Wraps the given text with pseudo-language style tags based on the provided styles.
 * @param styles - An array of style strings to be applied (e.g., ["red", "bold"]).
 * @param text - The text to be wrapped with the pseudo-language tags.
 * @returns A string with the text wrapped in the appropriate opening and closing pseudo-language tags.
 *
 * @example
 * ```typescript
 * const styles = ["red", "bold"];
 * const text = "Hello, World!";
 * const result = writePseudoColorLang(styles, text);
 * console.log(result);
 * // Output: "[mtxt-style[[red bold]]]Hello, World![[/mtxt-style]]"
 * ```
 */
export function writePseudoColorLang(styles: string[], text: string): string {
	const styling = styles.map((s) => s.trim());
	let result = text;
	for (const style of styling) {
		result = wrap(result, style);
	}
	return result;
}

function wrap(text: string, style: string) {
	return `${openingTag(style)}${text}${closingTag()}`;
}
