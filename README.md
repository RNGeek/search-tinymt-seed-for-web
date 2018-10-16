# search-tinymt-seed-for-web
[RNGeek/search-tinymt-seed](https://github.com/RNGeek/search-tinymt-seed) のRust実装です.

## Requirements
Rust 及び `wasm32-unknown-unknown` ターゲットを有効化する必要があります.
また `cargo-watch`, `wasm-bindgen-cli` のインストールが必要です.


```bash
# Rust のインストール
# ref: https://www.rust-lang.org/ja-JP/install.html
$ curl https://sh.rustup.rs -sSf | sh
$ export PATH="$HOME/.cargo/bin:$PATH"
$ rustc --version


## nightlyの有効化
$ rustup install nightly
$ rustup default nightly
$ rustc --version


# `wasm32-unknown-unknown` ターゲットの有効化
# ref: https://www.hellorust.com/news/native-wasm-target.html
$ rustup update
$ rustup target add wasm32-unknown-unknown --toolchain nightly


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

# Start webpack-dev-server
$ yarn run dev
```
