import { add, gen_by_index } from './wasm/lib.rs'

const u32 = (num: number) => num >>> 0

const seed = 1
const index = 50

const sum = add(1, 2)
const rand = gen_by_index(seed, index)

console.assert(u32(sum) === 3, `u32(${sum}) !== 3`)
console.assert(u32(rand) === 2292524454, `u32(${rand}) !== 2292524454`)
