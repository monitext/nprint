# @monitext/nprint (Licensed Under Apache 2.0)

A comprehensive color utility library for Monitext that provides cross-platform
terminal and browser console styling with syntax highlighting capabilities.

## Features

- 🎨 **Cross-platform color support** - Works in Node.js, Bun, Deno, and
  browsers
- 🖥️ **Auto-runtime detection** - Automatically detects the environment and
  applies appropriate styling
- 🌈 **Rich color API** - Support for named colors, hex colors, and background
  colors
- 💻 **Syntax highlighting** - Powered by highlight.js with multiple themes
- 📏 **Terminal utilities** - Terminal width detection and horizontal rule
  generation
- 🔄 **Flexible rendering** - Support for both synchronous and asynchronous
  operations
- 🎯 **TypeScript support** - Fully typed with comprehensive TypeScript
  definitions

## Installation

```bash
npm install @monitext/nprint
# or
pnpm add @monitext/nprint
# or
yarn add @monitext/nprint
```

## Quick Start

### Basic Color Usage

```typescript
import { cols, render, write } from '@monitext/nprint';

// Using predefined colors
const output = write(({ push }) => {
	push(cols.red('Error: Something went wrong!'));
	push(cols.green('Success: Operation completed'));
	push(cols.blue.bold('Bold blue text'));
});

console.log(...render(output));
```

### Hex Colors

```typescript
import { render, write } from '@monitext/nprint';

const output = write(({ push, hex, bgHex }) => {
	push(hex('#FF5733').bold.dim('Custom orange text'));
	push(bgHex('#333333')(hex('#FFFFFF')('White text on dark background')));
});

console.log(...render(output));
```

### Syntax Highlighting

```typescript
import { code, registerLang, render } from '@monitext/nprint';
import javascript from 'highlight.js/lib/languages/javascript';

// Register the language first
registerLang('javascript', javascript);

const output = code({
	lang: 'javascript',
	content: `
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet("World");
  `,
	theme: 'githubDark', // or "monokai", "vs", "far"
});

console.log(...render(output));
```

## API Reference

### Core Functions

#### `write(fn)`

The main function for creating styled output. Automatically detects whether the
function is synchronous or asynchronous. As Well this function is also a mini
wrapper as it reexpose utlis like cols,code hex an alike

```typescript
const output = write(({ push, cols, hex, bgHex, code, pretty }) => {
	push('Regular text');
	push(cols.red('Red text'));
	push(hex('#FF0000')('Hex red text'));
});
```

#### `writeSync(fn)`

Synchronous version of the write function.

```typescript
const output = writeSync(({ push, cols }) => {
	push(cols.green('Synchronous green text'));
});
```

#### `writeAsync(fn)`

Asynchronous version of the write function.

```typescript
const output = await writeAsync(async ({ push, cols }) => {
	await someAsyncOperation();
	push(cols.blue('Asynchronous blue text'));
});
```

### Color Functions

#### `cols`

Object containing all available color functions based on chalk styling:

```typescript
// Text colors
cols.black('text');
cols.red('text');
cols.green('text');
cols.yellow('text');
cols.blue('text');
cols.magenta('text');
cols.cyan('text');
cols.white('text');
cols.gray('text');

// Background colors
cols.bgBlack('text');
cols.bgRed('text');
cols.bgGreen('text');
// ... etc

// Text styles
cols.bold('text');
cols.italic('text');
cols.underline('text');
cols.strikethrough('text');
cols.dim('text');

// Chainable
cols.italic.bold('text');
cols.italic.underline('text');
cols.dim.gray.underline('text');
```

#### `hex(color)`

Apply custom hex colors to text:

```typescript
hex('#FF5733')('Orange text');
hex('#F00')('Short hex red text');
hex('#F00').bold.underline('text');
```

#### `bgHex(color)`

Apply custom hex background colors:

```typescript
bgHex('#333333')('Text with dark background');
bgHex('#F0F')('Text with magenta background');
```

### Syntax Highlighting In General

#### `code(options)`

Render syntax-highlighted code:

```typescript
const output = code({
	lang: 'typescript', // Language for highlighting
	content: 'const x = 42;', // Code content
	theme: 'githubDark', // Optional theme
});
```

**Available themes:**

- `"githubDark"` (default)
- `"monokai"`
- `"vs"`
- `"far"`

#### `registerLang(name, descriptor)`

Register a new language for syntax highlighting

```ts
import { registerLang } from '@monitext/nprint';
import python from 'highlight.js/lib/languages/python';

registerLang('python', python);
```

#### ⚠️ Important Considerations

- This uses **highlight.js** under the hood, so it is naturally a dependency.
- Some package managers (like **npm** or **yarn**) are forgiving and will allow importing it even if it’s not explicitly declared in your project, because it exists as a dependency of `@monitext/nprint`.
- Strict package managers (like **pnpm**) require that **highlight.js** be explicitly declared as a dependency in your project for this to work correctly.

### Utility Functions

#### `getTerminalWidth(defaultWidth?)`

Get the current terminal width:

```typescript
import { getTerminalWidth } from '@monitext/nprint';

const width = getTerminalWidth(); // Auto-detect
const widthWithFallback = getTerminalWidth(120); // With custom fallback
```

#### `detectRuntime()`

Detect the current JavaScript runtime:

```typescript
import { detectRuntime } from '@monitext/nprint';

const runtime = detectRuntime();
// Returns: "node" | "bun" | "deno" | "browser" | "unknown"
```

### Pretty Utilities

The `pretty` object provides additional formatting utilities:

#### Horizontal Rules

```typescript
write(({ push, pretty }) => {
 // Basic horizontal rule
 pretty.hr();

 // Custom horizontal rule
  pretty.hr({
   char: "=",
   width: 50,
   title: "Section Title",
   align: "center",
   titleColor: "blue",
   hrColor: "gray",
  }),
});
```

#### Configuration

```typescript
write(({ pretty, push, code }) => {
	// Change join character
	pretty.joinWith(' | ');

	// Set code default theme
	pretty.setCodeTheme('monokai');
	push(code({ lang: 'js', content: "console.log('monokai')" }));
	push(cols.red('Text 1'));
	push(cols.blue('Text 2'));
});
```

## Core Concept

### How it works

A PseudoLang & A Pseudo(Renderer|Parser)

`cols`, `hex`, `bgHex`, `code`, `write`..., all return an intermediate pseudo
html like language that is on the fly interpreted by the `render` function.

> note: the terme `Pseudo`, because the implementation is as barbone as possible

### Rendering functions

As exposed rendering fn:

- render
- renderToBrowser
- renderToNodeLike

Each of em return an array of string, for browser & nodelike compatibility.

This functionality can be tweaked to directly return a string through the
`createRenderer` function.

It expect an object :

```ts
{
  "mode"?: renderingMode , "join"?: boolean
}
```

**Render modes:**

- `"auto"` - Auto-detect environment (default)
- `"nodelike"` - Force terminal rendering
- `"browser"` - Force browser console rendering

**Join:**

Control wherever or not to join the output before returning it

#### **Browser vs Terminal**

The library automatically detects the runtime environment and applies
appropriate styling:

- **Terminal environments** (Node.js, Bun, Deno): Uses ANSI escape codes
- **Browser environments**: Uses console styling with CSS

## Advanced Usage

### Custom Color Combinations

```typescript
write(({ push, cols, hex, bgHex }) => {
	// Combine multiple styles
	push(cols.bold(cols.underline(cols.red('Bold underlined red'))));

	// Mix hex and named colors
	push(bgHex('#1a1a1a')(hex('#00ff00')('Green on dark background')));

	// Complex styling
	push(
		cols.italic(
			bgHex('#FFE4B5')(hex('#8B4513')('Brown text on moccasin background')),
		),
	);
});
```

### Multi-line Output with Custom Separators

```typescript
write(({ push, pretty, cols }) => {
	pretty.joinWith('\n─────────────\n');

	push(cols.cyan('Section 1'));
	push(cols.magenta('Section 2'));
	push(cols.yellow('Section 3'));
});
```

### Code Blocks with Custom Themes

```typescript
write(({ push, code, pretty }) => {
	pretty.setCodeTheme('monokai');

	const jsCode = code({
		lang: 'javascript',
		content: `
      class Logger {
        static log(message) {
          console.log(\`[\${new Date().toISOString()}] \${message}\`);
        }
      }
    `,
	});

	push(jsCode);
});
```

### Async Operations

```typescript
const output = await writeAsync(async ({ push, cols, code }) => {
	push(cols.blue('Loading data...'));

	const data = await fetchData();

	push(
		code({
			lang: 'json',
			content: JSON.stringify(data, null, 2),
		}),
	);

	push(cols.green('Data loaded successfully!'));
});

console.log(...output);
```

## TypeScript Support

The library is fully typed and provides excellent IntelliSense support:

```typescript
import type { Theme } from '@monitext/nprint';

const theme: Theme = 'githubDark'; // Autocomplete available

// Full type safety
write(({ push, cols }) => {
	push(cols.red('Fully typed!')); // All methods are typed
});
```

## Environment Support

- ✅ **Node.js** - Full ANSI color support
- ✅ **Bun** - Full ANSI color support
- ✅ **Deno** - Full ANSI color support
- ✅ **Browser** - Console styling with CSS
- ✅ **TypeScript** - Complete type definitions

## Examples

### CLI Tool Output

```typescript
import { getTerminalWidth, write } from '@monitext/nprint';

const width = getTerminalWidth();

const output = write(({ push, pretty, cols }) => {
	pretty.hr({ title: 'Build Results', width });
	push(cols.green('✓ Compilation successful'));
	push(cols.yellow('⚠ 2 warnings'));
	push(cols.red('✗ 0 errors'));
	pretty.hr({ width });
});

console.log(...render(output));
```

### Log Formatter

```typescript
function createLogger() {
	return {
		info: (message: string) => {
			const output = write(({ push, cols }) => {
				push(`${cols.blue('[INFO]')} ${message}`);
			});
			console.log(...output);
		},

		error: (message: string) => {
			const output = write(({ push, cols }) => {
				push(`${cols.red('[ERROR]')} ${message}`);
			});
			console.log(...output);
		},
	};
}

const logger = createLogger();
logger.info('Application started');
logger.error('Database connection failed');
```

## Why @monitext/nprint?

Unlike Chalk or Colorette, this library unifies terminal + browser styling,
includes syntax highlighting out of the box, and is built around a
pseudo-rendering system that makes it easy to format string, code, and pretty
outputs in one place.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or notify
me for issue.
