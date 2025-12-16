import { Bundle, GenerateDts } from "@monitext/devtools/builder";
import { dependencies } from "./package.json";
import { build } from "tsup";

Bundle({
  mode: "file",
  targets: [
    {
      entry: "./src/main.ts",
      outfile: "./dist/lib-min.js",
      variant: ["cjs", "esm"],
      options: {
        plateform: "neutral",
        minify: true,
        minifySyntax: true,
        minifyWhitespace: true,
        eternal: [...Object.keys(dependencies)],
      },
      extraOpts: { mainFields: ["main"], sourcemap: true },
    },
    {
      entry: "./src/main.ts",
      outfile: "./dist/lib-min-full.js",
      variant: ["cjs", "esm"],
      options: {
        plateform: "neutral",
        minify: true,
        minifySyntax: true,
        minifyWhitespace: true,
        eternal: [],
      },
      extraOpts: { mainFields: ["main"], sourcemap: true },
    },
  ],
});

build({
  entry: ["./src/main.ts"],
  format: ["cjs", "esm"],
  minify: true,
  minifySyntax: true,
  minifyWhitespace: true,
  external: [...Object.keys(dependencies)],
  sourcemap: true,
});
