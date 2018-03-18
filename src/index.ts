import { toU32Hex, u32 } from './util'

import('./wasm/lib')
  .then((module) => {
    const { add, gen_by_index, search_tinymt_seed } = module

    const sum = add(1, 2)
    const rand = gen_by_index(1, 50)
    const natures = new Uint32Array([18, 2, 12, 16, 19, 19, 20, 7])

    console.assert(u32(sum) === 3, `u32(${sum}) !== 3`)
    console.assert(u32(rand) === 2292524454, `u32(${rand}) !== 2292524454`)

    console.time('search_tinymt_seed')
    const seeds = search_tinymt_seed(natures, false)
    console.timeEnd('search_tinymt_seed')
    console.log(Array.from(seeds).map(toU32Hex))
  })
