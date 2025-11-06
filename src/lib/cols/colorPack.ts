import { chalkCSSPolify, ChalkStyleKeys } from './colorPolify';
import { writePseudoColorLang } from '../lang/pseudoLang';

/**
 * @fileoverview This file manages the application of chainable styles to strings
 * using a pseudo-language system, inspired by the Chalk library.
 */

/**
 * @class ColorNode
 * @description
 * Represents a node in a color/style chain. Stores accumulated styles
 * and applies them to content via the pseudo-language system.
 */
export class ColorNode {
	/** @property {string[]} styles - Accumulated styles for this node */
	styles: string[];

	/**
	 * Creates an instance of ColorNode.
	 * @param {object} [param] - Optional parameters.
	 * @param {string[]} [param.styles] - Initial styles to add to this node.
	 * @param {string[]} [param.content] - Optional content (unused for now).
	 */
	constructor(param?: { styles?: string[]; content?: string[] }) {
		this.styles = param?.styles ?? [];
	}

	/**
	 * Applies all accumulated styles to one or more strings.
	 * This is the final method in the chain.
	 * @param {...string[]} content - The strings to style.
	 * @returns {string} The styled string in pseudo-language format.
	 */
	public apply(...content: string[]): string {
		return writePseudoColorLang(this.styles, content.join(''));
	}
}

/**
 * @function chainFn
 * @description
 * Creates a chainable color/style function using Proxy. Each chained
 * property access (e.g., `.bold`, `.italic`) returns a new Proxy
 * instance with the updated style stack.
 *
 * @param {object} [param] - Optional parameters.
 * @param {string[]} [param.styles] - Initial styles to start the chain.
 * @returns {Function & object} A callable and chainable style function.
 *
 * @example
 * const cols = chainFn();
 * const styled = cols.bold.italic("Hello");
 */
export function chainFn(param?: { styles?: string[] }) {
	const currentNode = new ColorNode(param);
	const styleFn = function (..._text: string[]) {};

	const P = new Proxy(styleFn, {
		apply(_target, _thisArg, argumentsList) {
			return currentNode.apply(...(argumentsList as string[]));
		},
		get(target, property) {
			if (property in chalkCSSPolify) {
				// Prepend the new style to the current styles
				const styles = [property as string, ...currentNode.styles];
				return chainFn({ styles });
			}
			return (target as any)[property] as any;
		},
	});

	return P;
}

/**
 * @interface ColorChain
 * @description
 * Represents the structure of a chainable object for colors and styles.
 * It is both a callable function and an object with chaining properties.
 */
export type ColorChain = {
	[K in ChalkStyleKeys]: ((...content: string[]) => string) & ColorChain;
};

/**
 * @interface HexChain
 * @description
 * Represents a chainable object that starts with a hexadecimal style.
 */
export type ColorFn = ((...content: string[]) => string) & ColorChain;

type hex = number | string;

/**
 * @typedef {string} hexadecimal
 * @description
 * A utility type for 3 or 6-digit hexadecimal color formats,
 * prefixed with '#'.
 */
type hexadecimal =
	| `#${hex}${hex}${hex}`
	| `#${hex}${hex}${hex}${hex}${hex}${hex}`;

/**
 * @constant cols
 * @description
 * The entry point for the basic color and style chain.
 * @type {ColorChain}
 */
export const cols = chainFn() as unknown as ColorChain;

/**
 * @function hex
 * @description
 * Creates a style chain that starts with a hexadecimal color.
 * @param {hexadecimal} hexadecimal - The hexadecimal color (e.g., "#ff0000").
 * @returns {HexChain} A chainable object.
 */
export function hex(hexadecimal: hexadecimal) {
	const hexFn = chainFn({ styles: ['hex' + hexadecimal] });
	return hexFn as unknown as ColorFn;
}

/**
 * @function bgHex
 * @description
 * Creates a style chain that starts with a hexadecimal background color.
 * @param {hexadecimal} hexadecimal - The hexadecimal color (e.g., "#ff0000").
 * @returns {HexChain} A chainable object.
 */
export function bgHex(hexadecimal: hexadecimal) {
	const hexFn = chainFn({ styles: ['bgHex' + hexadecimal] });
	return hexFn as unknown as ColorFn;
}
