const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DedupeDependentChunksPlugin = require("../src/DedupeDependentChunksPlugin");

// const dedupeOptions = [[["lazy-2"], ["lazy-2-1"]]];
const dedupeOptions = ["lazy-2-1"];

module.exports = {
  entry: "./index.js",
  plugins: [
    process.env.NODEDUPE
      ? null
      : new DedupeDependentChunksPlugin(dedupeOptions),
    process.env.DEBUG && new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin()
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: "all",
      name: true
    }
  }
};
