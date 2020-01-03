# search-tinymt-seed-for-web
[RNGeek/search-tinymt-seed](https://github.com/RNGeek/search-tinymt-seed) のWeb移植版.

## Requirements
Rust toolchain のインストールが必要です.


```bash
# Rust toolchain のインストール
# ref: https://www.rust-lang.org/ja-JP/install.html
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
$ export PATH="$HOME/.cargo/bin:$PATH"
$ rustc --version
rustc 1.40.0 (73528e339 2019-12-16)
```

## Setup
```bash
# Setup
$ git clone https://github.com/mizdra/search-tinymt-seed-for-web.git
$ cd search-tinymt-seed-for-web
$ cargo check
$ yarn install

# RustとJavaScriptを自動コンパイルし, webpack-dev-server を立ち上げる
$ yarn run dev
```

## npm-scripts
- `yarn run dev`: RustとJavaScriptを自動コンパイルし, webpack-dev-server を立ち上げる
- `yarn run lint`: lint を実行する
- `yarn run test`: テストを実行する
- `yarn run build`: 本番環境向けにビルドする
