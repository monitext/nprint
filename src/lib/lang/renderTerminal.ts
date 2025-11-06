import { ChalkStyleKeys } from '../cols/colorPolify';
import { Node } from './pseudoParser';
import chalk from 'chalk';

/**
 * Renders an array of nodes into a single string representation by processing
 * each node through the `renderNode` function and concatenating the results.
 *
 * @param nodes - An array of `Node` objects to be rendered.
 * @returns A string representation of the rendered nodes.
 */
export function renderTerminal(nodes: Node[]): string {
	return nodes.map((node) => renderNode(node)).join('');
}

function renderNode(node: Node): string {
	if (node.type === 'text') {
		return node.content;
	} else if (node.type === 'styled') {
		const chalkFn = chalk[node.style as ChalkStyleKeys]
			? chalk[node.style as ChalkStyleKeys]
			: // Utilisation d'une regex corrigée pour les codes hexadécimaux à 3 ou 6 chiffres
				node.style.match(/^hex#([0-9a-fA-F]{3}){1,2}$/)
				? (x: string) => chalk.hex(node.style.replace('hex', ''))(x)
				: node.style.match(/^bgHex#([0-9a-fA-F]{3}){1,2}$/)
					? (x: string) => chalk.hex(node.style.replace('bgHex', ''))(x)
					: (x: string) => x;
		const inner = renderTerminal(node.children);
		return chalkFn(inner);
	}
	return '';
}
