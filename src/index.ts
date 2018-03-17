import { add, gen_by_index, search_tinymt_seed } from './wasm/lib.rs'

const u32 = (num: number) => num >>> 0

const sum = add(1, 2)
const rand = gen_by_index(1, 50)

console.assert(u32(sum) === 3, `u32(${sum}) !== 3`)
console.assert(u32(rand) === 2292524454, `u32(${rand}) !== 2292524454`)

console.time('search_tinymt_seed')
const seed = search_tinymt_seed(18, 2, 12, 16, 19, 19, 20, 7, false)
console.timeEnd('search_tinymt_seed')
console.log(`seed == 0x${u32(seed).toString(16).toUpperCase()}`)
