# search-tinymt-seed
[RNGeek/search-tinymt-seed](https://github.com/RNGeek/search-tinymt-seed) のRust実装です.

## Requirements
Rust 及び `wasm32-unknown-unknown` ターゲットを有効化する必要があります.

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
```
