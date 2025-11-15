import { cols } from '../cols/colorPack';
import { ChalkStyleKeys } from '../cols/colorPolify';
import { render } from '../lang/render';

interface VBarOptions {
  bar?: string;
  color?: ChalkStyleKeys;
  bold?: boolean;
  pad?: number;
}

const DEFAULT_BAR = '│';

export function vbar(
  str: string,
  {
    bar = DEFAULT_BAR,
    color = 'gray',
    bold = false,
    pad = 1,
  }: VBarOptions = {},
) {
  const lines = str.trim().split('\n');

  const styleSet = bold ? cols.bold : cols;
  const styledBar = styleSet[color]?.(bar) ?? bar;

  const result = lines
    .map((line) => `${styledBar}${' '.repeat(pad)}${line}`)
    .join('\n');

  return `${result}`;
}

// Example
console.log(
  ...render(
    vbar(`Welcome to fish, the friendly interactive shell\nType help for instructions on how to use fish`,
      { color: 'cyan', bold: true },
    ),
  ),
);
