import { toU32Hex } from './util'

import('./wasm/lib')
  .then((module) => {
    const { search_tinymt_seed } = module

    const natures = new Uint32Array([18, 2, 12, 16, 19, 19, 20, 7])

    console.time('search_tinymt_seed')
    const seeds = search_tinymt_seed(natures, false)
    console.timeEnd('search_tinymt_seed')
    console.log(Array.from(seeds).map(toU32Hex))
  })
