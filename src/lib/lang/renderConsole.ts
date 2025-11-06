import {
	chalkCSSPolify as cssPolify,
	ChalkStyleKeys,
} from '../cols/colorPolify';
import { Node } from './pseudoParser';

export interface ConsoleRenderResult {
	text: string;
	styles: string[];
}

/**
 * Renders an array of nodes into a console-friendly format.
 *
 * This function processes each node in the provided array, rendering its text
 * and styles, and combines them into a single result. The resulting object
 * contains the concatenated text and an array of styles for console rendering.
 *
 * @param nodes - An array of `Node` objects to be rendered.
 * @returns An object containing the rendered text and an array of styles.
 */
export function renderConsole(nodes: Node[]): ConsoleRenderResult {
	const result: ConsoleRenderResult = { text: '', styles: [] };

	for (const node of nodes) {
		const { text, styles } = renderNode(node);
		result.text += text;
		result.styles.push(...styles);
	}

	return result;
}

function renderNode(node: Node): ConsoleRenderResult {
	if (node.type === 'text') {
		return { text: '%c' + node.content, styles: [''] };
	} else if (node.type === 'styled') {
		const style =
			cssPolify[node.style as ChalkStyleKeys] ||
			node.style.match(/^hex#([0-9a-fA-F]{3}){1,2}$/)
				? `color: ${node.style.replace('hex', '')}`
				: node.style.match(/^bgHex#([0-9a-fA-F]{3}){1,2}$/)
					? `background-color: ${node.style.replace('bgHex', '')}`
					: '';
		const childrenResult = renderConsole(node.children);

		// Apply this node's style to its children
		const styledText = childrenResult.text.replace(/%c/g, '%c');
		const styledStyles = childrenResult.styles.map(() => style);

		return {
			text: styledText,
			styles: styledStyles,
		};
	}
	return { text: '', styles: [] };
}
