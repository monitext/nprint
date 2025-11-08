import { render } from "./render";

/**
 * Represents the parameters accepted by the print functions.
 *
 * Each argument can be:
 * - A plain string
 * - An array of strings
 * - An object implementing a `toString()` method (e.g., a styled string wrapper)
 * - Any combination of the above, including nested arrays
 *
 * This flexibility allows chaining and nesting of styled outputs, as well as mixed
 * plain text and stylized segments.
 */
type PrintFnParams = (string | string[] | { toString(): void }[])[];

/**
 * Enumeration of the available console output modes.
 *
 * - `"log"`   → Standard console output
 * - `"warn"`  → Warning-level console output
 * - `"error"` → Error-level console output
 */
type PrintMode = "log" | "warn" | "error";

/**
 * Core printing utility used internally by `log`, `warn`, and `error`.
 *
 * This function takes arbitrary input (plain strings, arrays, or objects implementing `toString`)
 * and flattens them recursively into a single array of string segments.  
 * Each segment is then passed to the renderer (`render`) which resolves environment-specific
 * formatting (e.g. ANSI for TTY, CSS for browser).
 *
 * @param {PrintMode} mode - The console output mode (`log`, `warn`, or `error`).
 * @param {...PrintFnParams} params - The content to print, which can include stylized strings or objects.
 *
 * @example
 * ```ts
 * print("log", "Hello", nprint.cols.red("world"));
 * print("error", ["Critical:", nprint.cols.red("failure!")]);
 * ```
 */
function print(mode: PrintMode, ...params: PrintFnParams) {
	const result: string[] = params
		.flat(Infinity)
		.map(s => (typeof s === "string" ? s : s?.toString?.() ?? ""));

	console[mode](...render(...result));
}

/**
 * Factory helper that generates console print functions (`log`, `warn`, `error`)
 * bound to a specific output mode.
 *
 * @param {PrintMode} m - The desired console output mode.
 * @returns {(…params: PrintFnParams) => void} A print function specialized for that mode.
 *
 * @example
 * ```ts
 * const info = asPrintFn("log");
 * info("Info:", nprint.cols.cyan("system initialized"));
 * ```
 */
function asPrintFn(m: PrintMode) {
	return (...params: PrintFnParams) => print(m, ...params);
}

/**
 * Prints informational messages using the standard console output.
 *
 * Equivalent to `console.log` but supports styled or structured strings via `nprint`.
 *
 * @example
 * ```ts
 * log("Task:", nprint.cols.green("completed successfully"));
 * ```
 */
export const log = asPrintFn("log");

/**
 * Prints warning messages using `console.warn`.
 *
 * @example
 * ```ts
 * warn("Deprecated:", nprint.cols.yellow("use `initNew()` instead"));
 * ```
 */
export const warn = asPrintFn("warn");

/**
 * Prints error messages using `console.error`.
 *
 * @example
 * ```ts
 * error("Failed:", nprint.cols.red("file not found"));
 * ```
 */
export const error = asPrintFn("error");