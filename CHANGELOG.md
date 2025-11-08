# @monitext/nprint

## 0.1.0

### Minor Changes

- Introduced `nprint.log`, `nprint.warn`, and `nprint.error` helpers with automatic rendering support.
- Added unified print pipeline with `render(...strings)` integration.

## 0.0.2

### Patch Changes

- Fix: minor fix on `render` fn

  Due to forgotten `""` on multiple input join,
  the render fn would introducde a "," between ouput

## 0.0.1

### Patch Changes

- Fix: resolved unkown style injection on `cols`, `bgHex`, `hex`

  Due to mishandled chaining behavior, all instance of `ColorChain`,
  now `ColorNode` ended up sharing the same state (stylestack)
