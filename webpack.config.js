const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const rootPath = resolve(__dirname, '.')
const srcPath = resolve(rootPath, './src')
const distPath = resolve(rootPath, './dist')

module.exports = {
  entry: {
    app: [
      'tslib',
      resolve(srcPath, './index.ts'),
    ],
  },
  output: {
    path: distPath,
    filename: 'js/[name].[hash].js',
  },

  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' },
    ],
  },

  resolve: {
    extensions: ['.js', '.ts', '.wasm'],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: resolve(distPath, './index.html'),
      template: resolve(rootPath, './index.html'),
      inject: true,
    }),
  ],
}
