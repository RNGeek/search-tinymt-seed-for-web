const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

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
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        include: [srcPath],
      },
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.css$/, loader: 'css-loader' },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        loader: 'file-loader',
      },

      // webpack のバグで Worker 内で Dynamic Import が利用できないので,
      // *.wasm を fetch + WebAssembly.instantiateStreaming を使って読み込む
      // ref: https://github.com/webpack/webpack/issues/7647#issuecomment-402772005
      {
        test: /\.wasm$/,
        loader: 'file-loader',
        type: 'javascript/auto', // this disabled webpacks default handling of wasm
      },
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
    new VueLoaderPlugin(),
  ],
}
