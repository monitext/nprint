import { detectRuntime } from '../utils/getRuntime';
import { renderConsole } from './renderConsole';
import { renderTerminal } from './renderTerminal';
import { pseudoLangToTree } from './pseudoParser';

interface RenderingParam {
	mode?: 'nodelike' | 'browser' | 'auto';
	join?: boolean;
}

export function createRenderer<T extends RenderingParam>(param?: T) {
	const renderingMode = param?.mode || 'auto';
	const joinRenderRes = param?.join || false;

	return function (...content: string[]) {
		const nodeList = pseudoLangToTree(content.join());
		let renderedResult: string[];
		let renderedLang;

		switch (renderingMode) {
			case 'nodelike':
				renderedLang = renderTerminal(nodeList);
				break;
			case 'browser':
				renderedLang = renderConsole(nodeList);
				break;
			default:
				const runtime = detectRuntime();
				if (runtime == 'browser') {
					renderedLang = renderConsole(nodeList);
				} else {
					renderedLang = renderTerminal(nodeList);
				}
				break;
		}

		if (typeof renderedLang == 'string') {
			renderedResult = [renderedLang];
		} else {
			const { text, styles } = renderedLang;
			renderedResult = [text, ...styles];
		}

		return (
			joinRenderRes == true ? renderedResult.join() : renderedResult
		) as T extends { join: true } ? string : string[];
	};
}

export const render = createRenderer({
	mode: 'auto',
	join: false,
});

export const renderToBrowser = createRenderer({
	mode: 'browser',
	join: false,
});

export const renderToNodeLike = createRenderer({
	mode: 'nodelike',
	join: false,
});
