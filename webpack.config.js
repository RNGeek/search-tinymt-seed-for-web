const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpackMerge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin')

const rootPath = resolve(__dirname, '.')
const srcPath = resolve(rootPath, './src')
const staticPath = resolve(rootPath, './static')
const distPath = resolve(rootPath, './dist')
const cratePath = resolve(rootPath, '.')

const appPath = resolve(srcPath, './app')
const workerPath = resolve(srcPath, './worker')

const baseConfig = {
  module: {
    rules: [
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
    new WasmPackPlugin({
      crateDirectory: cratePath,
      forceMode: 'release',
    }),
    new CopyWebpackPlugin([{ from: staticPath, to: distPath }]),
  ],
}

const appConfig = webpackMerge(baseConfig, {
  entry: {
    app: [
      'tslib',
      resolve(appPath, './index.ts'),
    ],
  },
  output: {
    path: distPath,
    filename: '[name].[hash].js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
          configFile: resolve(appPath, './tsconfig.json'),
        },
        include: [srcPath],
      },
    ],
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
    'worker': [
      resolve(workerPath, './worker.ts'),
    ],
  },
  output: {
    path: distPath,
    filename: 'worker.js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          configFile: resolve(workerPath, './tsconfig.json'),
        },
        include: [srcPath],
      },
    ],
  },
})

module.exports = [appConfig, searchWorkerConfig]
