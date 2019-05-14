# dedupe-dependent-chunks-webpack-plugin

> Webpack plugin to dedupe modules from chunks known to load only after others with those modules.

[![npm add -D dedupe-dependent-chunks-webpack-plugin (copy)](https://copyhaste.com/i?t=npm%20add%20-D%20dedupe-dependent-chunks-webpack-plugin)](https://copyhaste.com/c?t=npm%20add%20-D%20dedupe-dependent-chunks-webpack-plugin "npm add -D dedupe-dependent-chunks-webpack-plugin (copy)")

Suppose you have a part of your app whose code you lazy load with [Webpack dynamic imports](https://webpack.js.org/guides/code-splitting/#dynamic-imports),
or even [`react-loadable`](https://github.com/jamiebuilds/react-loadable).

That lazy-loaded page may itself may lazy load other code,
e.g., code below the fold or only needed on interactions.
This code might only be used on this page and nowhere else in the app.

Even if the lazy-loaded page chunk and its additional lazy-loaded chunks share some common modules,
Webpack may not understand that your UI guarantees that the latter will _only ever_ be loaded _after_ the former.

The `DedupeDependentChunksWebpackPlugin` lets you manually inform Webpack that it can remove shared modules
from any other lazy-loaded chunks that your lazy-loaded chunks might load.

Example `webpack.config.js`:

```js
const DedupeDependentChunksPlugin = require("dedupe-dependent-chunks-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  plugins: [
    new DedupeDependentChunksPlugin({
      "some-lazy-part": ["a-lazy-component-of-its"]
    })
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      name: true
    }
  }
};
```

See [`example`](./example) for an (admittedly trivial) example app.

Licensed by the [MIT License](./LICENSE).
