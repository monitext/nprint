# @monitext/nprint

## v0.2.0

Nprint is a cross-platform console logging and styling utility that works seamlessly in Node.js, Deno, Bun, and browsers (Yes — even browser consoles support full color!). It provides a rich API for color manipulation, syntax highlighting, and terminal utilities, making it an essential tool for developers who want to enhance their console output.

## Features

- 🎨 **Cross-platform color support** - Works in Node.js, Bun, Deno, and browsers.
- 🖥️ **Auto-runtime detection** - Automatically detects the environment and applies appropriate styling.
- 🌈 **Rich color API** - Support for named colors, hex colors, and background colors.
- 💻 **Syntax highlighting** - Powered by highlight.js with multiple themes.
- 📏 **Terminal utilities** - Terminal width detection and horizontal rule generation.
- 🔄 **Flexible rendering** - Support for both synchronous and asynchronous operations.
- 🎯 **TypeScript support** - Fully typed with comprehensive TypeScript definitions.

## Installation

Install the library using your favorite package manager:

```bash
npm install @monitext/nprint
# or
pnpm add @monitext/nprint
# or
yarn add @monitext/nprint
```

## Quick Start

### Basic Color Usage

You can use `nprint` in two ways:

#### Using the Wrapper

```typescript
import { nprint } from "@monitext/nprint";

const output = nprint.write(({ push }) => {
  const { cols } = nprint;
  push(cols.red('Error: Something went wrong!'));
  push(cols.green('Success: Operation completed'));
  push(cols.blue.bold('Bold blue text'));
});

nprint.log(output); // Wrapper around console.log
```

#### Using the Render Function

```typescript
import { write, render, cols } from "@monitext/nprint";

const output = write(({ push }) => {
  push(cols.red('Error: Something went wrong!'));
  push(cols.green('Success: Operation completed'));
  push(cols.blue.bold('Bold blue text'));
});

console.log(...render(output));
```

### Hex Colors

```typescript
import { nprint } from '@monitext/nprint';

const myHex = nprint.hex("#05ffacff");

nprint.log(myHex.bold.underline("Custom styled text"));
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

The main function for creating styled output. Automatically detects whether the function is synchronous or asynchronous.

```typescript
const output = write(({ push, cols, hex, bgHex, code, pretty }) => {
  push('Regular text');
  push(cols.red('Red text'));
  push(hex('#FF0000')('Hex red text'));
});
```

#### `writeSync(fn)`

Synchronous version of the `write` function.

```typescript
const output = writeSync(({ push, cols }) => {
  push(cols.green('Synchronous green text'));
});
```

#### `writeAsync(fn)`

Asynchronous version of the `write` function.

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
cols.red('Red text');
cols.green.bold('Bold green text');
cols.bgBlue('Text with blue background');
```

#### `hex(color)`

Apply custom hex colors to text:

```typescript
hex('#FF5733')('Orange text');
```

#### `bgHex(color)`

Apply custom hex background colors:

```typescript
bgHex('#333333')('Text with dark background');
```

### Syntax Highlighting

#### `code(options)`

Render syntax-highlighted code:

```typescript
const output = code({
  lang: 'typescript',
  content: 'const x = 42;',
  theme: 'githubDark',
});
```

#### `registerLang(name, descriptor)`

Register a new language for syntax highlighting:

```typescript
import { registerLang } from '@monitext/nprint';
import python from 'highlight.js/lib/languages/python';

registerLang('python', python);
```

### Utility Functions

#### `getTerminalWidth(defaultWidth?)`

Get the current terminal width:

```typescript
const width = getTerminalWidth(); // Auto-detect
```

#### `detectRuntime()`

Detect the current JavaScript runtime:

```typescript
const runtime = detectRuntime();
// Returns: "node" | "bun" | "deno" | "browser" | "unknown"
```

#### Horizontal Rules

```typescript
write(({ push, pretty }) => {
  pretty.hr({
    char: "=",
    width: 50,
    title: "Section Title",
    align: "center",
    titleColor: "blue",
    hrColor: "gray",
  });
});
```

## Advanced Usage

### Custom Color Combinations

```typescript
write(({ push, cols, hex, bgHex }) => {
  push(cols.bold(cols.underline(cols.red('Bold underlined red'))));
  push(bgHex('#1a1a1a')(hex('#00ff00')('Green on dark background')));
});
```

### Async Operations

```typescript
const output = await writeAsync(async ({ push, cols }) => {
  push(cols.blue('Loading data...'));
  const data = await fetchData();
  push(cols.green('Data loaded successfully!'));
});
```

## TypeScript Support

The library is fully typed and provides excellent IntelliSense support:

```typescript
import type { Theme } from '@monitext/nprint';

const theme: Theme = 'githubDark'; // Autocomplete available
```

## Environment Support

- ✅ **Node.js** - Full ANSI color support
- ✅ **Bun** - Full ANSI color support
- ✅ **Deno** - Full ANSI color support
- ✅ **Browser** - Console styling with CSS
- ✅ **TypeScript** - Complete type definitions

## Why @monitext/nprint?

Unlike other libraries like Chalk or Colorette, `@monitext/nprint` unifies terminal and browser styling, includes syntax highlighting out of the box, and is built around a pseudo-rendering system that makes it easy to format strings, code, and pretty outputs in one place.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue.