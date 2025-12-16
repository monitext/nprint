import { cols } from "../cols/colorPack";
import { ChalkStyleKeys } from "../cols/colorPolify";
import { render } from "../lang/render";

interface BoxOptions {
  color?: ChalkStyleKeys;
  rounded?: boolean;
}

export function box(
  str: string,
  { color = "gray", rounded = false }: BoxOptions = {},
): string {
  const lines = str.trim().split("\n");
  const width = Math.max(...lines.map((l) => l.length));
  const style = cols[color] ?? ((x: string) => x);

  // Choose characters
  const chars = rounded
    ? { tl: "╭", tr: "╮", bl: "╰", br: "╯", h: "─", v: "│" }
    : { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" };

  const top = style(`${chars.tl}${chars.h.repeat(width + 2)}${chars.tr}`);
  const bottom = style(`${chars.bl}${chars.h.repeat(width + 2)}${chars.br}`);
  const body = lines
    .map((line) => `${style(chars.v)} ${line.padEnd(width)} ${style(chars.v)}`)
    .join("\n");

  return [top, body, bottom].join("\n");
}

console.log(...render(box(`text string`, { color: "blue", rounded: true })));
