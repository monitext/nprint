import hljs from 'highlight.js/lib/core';
import type { CodeScheme, HtmlNode } from './types';
import githubDark from './styles/github-dark';
//@ts-ignore no @types for this lib
import HTML from 'html-parse-stringify';
import { unescapeHTML } from './unescape';
import type { Node } from './types';

/**
 * Parses and styles a code snippet from a string using a given language and theme.
 * This function utilizes a JSDOM-like approach to apply theme styles with CSS selectors.
 * @param language The language of the code (e.g., 'typescript', 'javascript').
 * @param content The raw code content as a string.
 * @param theme The theme object containing styling rules.
 * @returns The styled code as a string, with pseudo-language formatting.
 */
export function parseCode(
	language: string,
	content: string,
	theme: CodeScheme = githubDark,
): string {
	// Highlight the code with highlight.js to get HTML with class names.
	const highlightedHtml = hljs.highlight(content, { language }).value;

	// Parse the HTML string into a custom tree structure.
	const document = HTML.parse(unescapeHTML(`<div>${highlightedHtml}</div>`));

	// A map to store the styling functions for each element.
	const styleMap = new Map<HtmlNode, ((...x: string[]) => string)[]>();

	// Iterate through theme styles and apply them using a custom querySelectorAll.
	for (const selector in theme.styles) {
		if (Object.prototype.hasOwnProperty.call(theme.styles, selector)) {
			const styleFunctions = theme.styles[selector];
			try {
				// Find all elements matching the CSS selector using a custom implementation.
				const elements = querySelectorAll(selector, document[0] as HtmlNode);
				elements.forEach((element) => {
					const existingStyles = styleMap.get(element) || [];
					styleMap.set(element, [...existingStyles, ...styleFunctions]);
				});
			} catch (error) {
				console.error(`Invalid selector: "${selector}". Error: ${error}`);
			}
		}
	}

	// Perform a DFS to construct the final output string, applying styles from the map.
	return dfs(document[0] as HtmlNode);

	/**
	 * Recursively finds nodes matching a CSS selector within a given node.
	 * This custom implementation handles multiple class selectors.
	 * @param selector The CSS selector (e.g., '.hljs-string.hljs-title').
	 * @param node The starting node of the search.
	 * @returns An array of matching HtmlNodes.
	 */
	function querySelectorAll(selector: string, node: HtmlNode): HtmlNode[] {
		const matches: HtmlNode[] = [];
		const selectorClasses = selector
			.split('.')
			.map((s) => s.trim())
			.filter((s) => s.length > 0);

		// const isRecursive = selector.includes(' ');

		function dfs(currentNode: Node, ancestorClasses: string = '') {
			if (currentNode.type === 'tag') {
				// Check if the current node matches all classes in the selector.
				const nodeClasses = (currentNode?.attrs?.class || '').split(' ');

				let accumuletedClasses: string[];

				const allClassesMatch = selectorClasses.every((selClass) => {
					// if(!isRecursive){
					return nodeClasses.includes(selClass);
					// }
					if (!accumuletedClasses) {
						accumuletedClasses = [...ancestorClasses.split(' '), selClass];
					}
					return nodeClasses.every((c) => {
						return accumuletedClasses.includes(c);
					});
				});

				if (allClassesMatch) {
					matches.push(currentNode);
				}

				// Recurse on children.
				if (currentNode.children) {
					for (const child of currentNode.children) {
						dfs(child, ancestorClasses + ' ' + (node?.attrs?.class || ''));
					}
				}
			}
		}
		dfs(node);
		return matches;
	}

	/**
	 * Recursively traverses the custom tree and applies styles from the styleMap.
	 * @param node The current node to process.
	 * @returns The styled string content of the node and its children.
	 */
	function dfs(node: Node): string {
		// If the node is a text node, return its content.
		if (node.type === 'text') {
			return node.content || '';
		}

		// If the node is a tag, process its children first to apply styles.
		if (node.type === 'tag') {
			let result = '';
			if (node.children) {
				result = node.children.map((child) => dfs(child)).join('');
			}

			// Apply styles from the styleMap to the processed children's content.
			const stylesToApply = styleMap.get(node) || [];
			if (stylesToApply.length > 0) {
				return stylesToApply.reduce((acc, styleFn) => styleFn(acc), result);
			}
			return result;
		}

		return '';
	}
}
