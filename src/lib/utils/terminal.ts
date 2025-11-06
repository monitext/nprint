import { detectRuntime } from './getRuntime';

/**
 * Attempts to determine the terminal width in characters.
 *
 * @param defaultWidth Fallback width if detection fails (default: 80).
 * @returns The terminal width in characters.
 */
export function getTerminalWidth(defaultWidth = 80): number {
	const runtime = detectRuntime();

	switch (runtime) {
		case 'bun':
			return process.stdout?.columns || defaultWidth; // Bun environment
		case 'node':
			return process.stdout?.columns || defaultWidth; // Node.js environment
		case 'deno':
			return Deno.consoleSize().columns || defaultWidth; // Deno environment
		case 'browser':
			let length: number;
			try {
				length = Math.floor(window.innerWidth / 8); // Rough estimate of characters per line
				return length > 0 ? length : defaultWidth; // Ensure positive width
			} catch (error) {
				return defaultWidth; // Fallback for browser errors
			}
		default:
			return defaultWidth; // Fallback for unknown environments
	}
}
