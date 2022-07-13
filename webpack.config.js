const path = require("path");

module.exports = {
  entry: "./index.js",
  target: "node",
  optimization: {
    minimize: true,
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /(node_modules)/,
      },
    ],
  },
};
