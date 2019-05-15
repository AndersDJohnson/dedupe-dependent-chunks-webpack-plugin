const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DedupeDependentChunksPlugin = require("../src/DedupeDependentChunksPlugin");

module.exports = {
  entry: "./index.js",
  plugins: [
    process.env.NODEDUPE
      ? null
      : new DedupeDependentChunksPlugin([[["lazy-2"], ["lazy-2-1"]]]),
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
