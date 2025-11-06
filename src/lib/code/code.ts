import hljs from 'highlight.js/lib/core';
import { parseCode } from './parse';
import { Theme, ThemeRegistry } from './regitery';
import type { LanguageFn } from 'highlight.js';

/**
 * Renders code content based on the specified language, theme, and rendering mode.
 *
 * @param param - An object containing the following properties:
 *   @property lang - The programming language of the code content.
 *   @property content - The code content to be rendered.
 *   @property theme - (Optional) The theme to use for rendering. Defaults to "githubDark".
 *   @property render - (Optional) The rendering mode. Can be:
 *     - "auto": Automatically detects the runtime and selects the appropriate renderer.
 *     - "nodelike": Renders the code for a terminal-like environment.
 *     - "browser": Renders the code for a browser console-like environment.
 *     - "false": Disables rendering and returns the parsed pseudo-language object.
 *
 * @returns The rendered output, which can be:
 *   - A string array containing the rendered code and styles (if applicable).
 *   - The parsed pseudo-language object if `render` is set to "false".
 *
 * @note THIS USE HIGHLIGHT.JS Under the hood, it's required to import
 * the proper language pack eg:
 *
 * ```ts
 * import { code, registerLang } from "@monitext/color"
 * import js from 'highlight.js/lib/languages/javascript';
 * registerLang("javascript", js)
 *
 * const str = code({
 *      lang: "javascript",
 *      content: "console.log('mock')"
 * })
 *
 * console.log(...str)
 *
 * ```
 */
function renderCode(param: { lang: string; content: string; theme?: Theme }) {
	const themeKey = param.theme || 'githubDark';

	const pseudoLang = parseCode(
		param.lang,
		param.content,
		ThemeRegistry[themeKey],
	);

	return pseudoLang;
}

/**
 * Renders a code to string based on the provided parameters.
 *
 * @param param - An object containing the following properties:
 *   @property lang - The programming language of the code content.
 *   @property content - The actual code content to be rendered.
 *   @property [theme] - An optional theme to style the rendered code.
 *
 * @returns The rendered code as a string.
 *
 * @note THIS USE HIGHLIGHT.JS Under the hood, it's required to import
 * the proper language pack eg:
 *
 * ```ts
 * import { code, registerLang, render } from "@monitext/color"
 * import js from 'highlight.js/lib/languages/javascript';
 * registerLang("javascript", js)
 *
 * const str = code({
 *      lang: "javascript",
 *      content: "console.log('mock')"
 * })
 *
 * console.log(render(str))
 *```
 */
export function code(param: CodeParam) {
	return renderCode(param);
}

export type CodeParam = {
	lang: string;
	content: string;
	theme?: Theme;
};

/**
 * Registers a new language with the syntax highlighter.
 *
 * @param lang - The name of the language to register.
 * @param descriptor - A function that defines the syntax highlighting rules for the language.
 */
export function registerLang(lang: string, descriptor: LanguageFn) {
	hljs.registerLanguage(lang, descriptor);
}
