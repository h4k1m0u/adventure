const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    // generated inside dist/ by default
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        // load 3d models/images imported in js & copy them to dist/images
        test: /\.png|\.jpg|\.glb$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    // use aliases instead of relative import paths in js
    alias: {
      modules: path.resolve(__dirname, 'src/modules'),
      assets: path.resolve(__dirname, 'src/assets'),
    },
  },
  plugins: [
    // generate dist/index.html
    new HtmlWebpackPlugin(),
  ],
};