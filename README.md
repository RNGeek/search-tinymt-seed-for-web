# search-tinymt-seed-for-web
[RNGeek/search-tinymt-seed](https://github.com/RNGeek/search-tinymt-seed) のWeb移植版.

## Requirements
Rust toolchain 及び `cargo-watch`, `wasm-bindgen-cli` のインストールが必要です.

また, `rustup target add` で `wasm32-unknown-unknown` ターゲットを有効化する必要があります.


```bash
# Rust toolchain のインストール
# ref: https://www.rust-lang.org/ja-JP/install.html
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
$ export PATH="$HOME/.cargo/bin:$PATH"
$ rustc --version

# ref: https://www.hellorust.com/news/native-wasm-target.html
$ rustup target add wasm32-unknown-unknown


# `cargo-watch`, `wasm-bindgen-cli` のインストール
$ cargo install cargo-watch
$ cargo install wasm-bindgen-cli
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
