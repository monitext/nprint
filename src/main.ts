import { write, writeAsync, writeSync } from './lib/write/writeExtends';
import { bgHex, cols, hex } from './lib/cols/colorPack';
import { detectRuntime } from './lib/utils/getRuntime';
import { getTerminalWidth } from './lib/utils/terminal';
import { code, registerLang } from './lib/code/code';
import { hr } from './lib/utils/horizontalRule';
import {
	createRenderer,
	render,
	renderToBrowser,
	renderToNodeLike,
} from './lib/lang/render';
import {
	writeCore,
	writeCoreAsync,
	writeCoreSync,
} from './lib/write/writeCore';

export {
	// writing utilities
	write,
	writeAsync,
	writeSync,
	writeCore,
	writeCoreAsync,
	writeCoreSync,
	// colors
	bgHex,
	cols,
	hex,

	// runtime info
	detectRuntime,
	getTerminalWidth,

	// code rendering
	code,
	registerLang,

	// layout
	hr,

	// renderers
	createRenderer,
	render,
	renderToBrowser,
	renderToNodeLike,
};

export const nprint = {
	// writing utilities
	write,
	writeAsync,
	writeSync,
	writeCore,
	writeCoreAsync,
	writeCoreSync,
	// colors
	bgHex,
	cols,
	hex,

	// runtime info
	detectRuntime,
	getTerminalWidth,

	// code rendering
	code,
	registerLang,

	// layout
	hr,

	// renderers
	createRenderer,
	render,
	renderToBrowser,
	renderToNodeLike,
};

export default nprint;
