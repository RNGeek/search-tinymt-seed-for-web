const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpackMerge = require('webpack-merge');

const rootPath = resolve(__dirname, '.')
const srcPath = resolve(rootPath, './src')
const distPath = resolve(rootPath, './dist')

const SEARCH_WORKER_PATH = '/search.worker.js'

const baseConfig = {
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        include: [srcPath],
      },
      { test: /\.vue$/, loader: 'vue-loader' },
      {
        test: /\.css$/,
        use: [ 'vue-style-loader', 'css-loader' ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        loader: 'file-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.ts', '.wasm'],
  },

  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      SEARCH_WORKER_PATH: JSON.stringify(SEARCH_WORKER_PATH),
    }),
  ],
}

const appConfig = webpackMerge(baseConfig, {
  entry: {
    app: [
      'tslib',
      resolve(srcPath, './index.ts'),
    ],
  },
  output: {
    path: distPath,
    filename: '[name].[hash].js',
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: resolve(distPath, './index.html'),
      template: resolve(rootPath, './index.html'),
      inject: true,
    }),
  ],
})

// worker-loader のバグでchunk情報やモジュール読み込み関数の初期化を行うコード (webpackBootstrap,
// ref: https://github.com/webpack/webpack/blob/a4e5f63d9d370b191bb9586570bc22bf2947e390/lib/MainTemplate.js)
// がエントリポイントだけに埋め込まれて Worker 内に埋め込まれないので, ここでは Worker を別のエントリポイントに
// 分けて問題を回避する.
// ref: https://github.com/webpack/webpack/issues/6629
const searchWorkerConfig = webpackMerge(baseConfig, {
  target: 'webworker',
  entry: {
    'search.worker': [
      resolve(srcPath, './workers/search.worker.ts'),
    ],
  },
  output: {
    path: distPath,
    filename: 'search.worker.js',
  },
})

module.exports = [appConfig, searchWorkerConfig]
