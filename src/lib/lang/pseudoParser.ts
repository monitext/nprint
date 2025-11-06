import {
	matchClosingTag,
	matchOpeningTag,
	splitByPseudoColorLangTags,
} from './pseudoLang';

/**
 * This module provides utilities for handling a pseudo-language used for styling text.
 * The pseudo-language uses specific tags to denote styles, allowing for easy parsing and manipulation of styled text.
 */

export interface TextNode {
	type: 'text';
	content: string;
}

export interface StyledNode {
	type: 'styled';
	style: string;
	children: Array<TextNode | StyledNode>;
}

export type Node = TextNode | StyledNode;

export type NodeList = Node[];

/**
 * Converts a string with pseudo-language style markers into a tree structure.
 * The function parses segments of the text enclosed within `[mtxt-style[[...]]][[/mtxt-style]]`
 * markers and constructs a hierarchical representation of the styled text.
 *
 * @param text - The input string to be converted into a tree structure.
 * @returns A tree structure representing the styled text, where each node is either a text node or a styled node.
 *
 * @example
 * ```typescript
 * const input = "Hello [mtxt-style[[red]]]world[[/mtxt-style]]!";
 * const tree = pseudoLangToTree(input);
 * console.log(JSON.stringify(tree, null, 2));
 * // Output:
 * // [
 * //   { type: 'text', content: 'Hello ' },
 * //   {
 * //     type: 'styled',
 * //     style: 'red',
 * //     children: [{ type: 'text', content: 'world' }]
 * //   },
 * //   { type: 'text', content: '!' }
 * // ]
 * ```
 */
export function pseudoLangToTree(text: string) {
	const input = splitByPseudoColorLangTags(text);
	const stack: StyledNode[] = [];
	const root: Array<TextNode | StyledNode> = [];

	for (const segment of input) {
		const openMatch = matchOpeningTag(segment);
		const stackLen = stack.length;
		if (openMatch) {
			const style = openMatch;
			const newNode: StyledNode = { type: 'styled', style, children: [] };
			if (stackLen > 0) {
				stack.at(-1)?.children.push(newNode);
			} else {
				root.push(newNode);
			}
			stack.push(newNode);
		} else if (matchClosingTag(segment)) {
			stack.pop();
		} else {
			const newNode: TextNode = { type: 'text', content: segment };
			if (stackLen > 0) {
				stack.at(-1)?.children.push(newNode);
			} else {
				root.push(newNode);
			}
		}
	}

	return root;
}
