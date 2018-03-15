import { add, gen_by_index } from './wasm/lib.rs'

const seed = 1
const index = 50
const sum = add(1, 2)
const rand = gen_by_index(seed, index)

console.assert(sum === 3, `${sum} !== 3`)
console.assert((rand >>> 0) === 2292524454, `(${rand} >>> 0) !== 2292524454`)
