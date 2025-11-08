# @monitext/nprint

## 0.0.1

### Patch Changes

- Fix: resolved unkown style injection on `cols`, `bgHex`, `hex`

  Due to mishandled chaining behavior, all instance of `ColorChain`,
  now `ColorNode` ended up sharing the same state (stylestack)
