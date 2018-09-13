const ctx: DedicatedWorkerGlobalScope = self as any

import { Tinymt32 } from '@mizdra/tinymt'
import { Action, Progress, Complete } from './action';
import { eachU32, getEggNature, GEN7_EGG_PARAM } from '../rng';

export function postProgressAction(foundSeeds: number[] | Uint32Array, seed: number) {
  ctx.postMessage({
    type: 'PROGRESS',
    payload: {
      foundSeeds: Array.from(foundSeeds),
      calculatingSeed: seed,
    }
  } as Progress)
}

function postCompleteAction(foundSeeds: number[] | Uint32Array) {
  ctx.postMessage({
    type: 'COMPLETE',
    payload: {
      foundSeeds: Array.from(foundSeeds),
    }
  } as Complete)
}

function searchTinymtSeedJS (natures: number[], hasShinyCharm: boolean): void {
  const foundSeeds: number[] = []

  eachU32((seed) => {
    const rng = Tinymt32.fromSeed(GEN7_EGG_PARAM, seed)

    let found = natures
      .every(nature => nature === getEggNature(rng, hasShinyCharm))

    if (seed % 0x0100_0000 === 0 && seed !== 0) {
      postProgressAction(foundSeeds, seed)
    }

    if (found) {
      foundSeeds.push(seed)
      postProgressAction(foundSeeds, seed)
    }
  })

  postCompleteAction(foundSeeds)
}

async function searchTinymtSeedWASM(natures: number[], hasShinyCharm: boolean): Promise<void> {
  const { search_tinymt_seed } = await import('../wasm/lib')

  const foundSeeds = search_tinymt_seed(new Uint32Array(natures), hasShinyCharm)
  postCompleteAction(foundSeeds)
}

ctx.onmessage = (event) => {
  const action = event.data as Action
  switch(action.type) {
    case "SEARCH":
      const { mode, natures, hasShinyCharm } = action.payload
      if (mode === 'js')
        searchTinymtSeedJS(natures, hasShinyCharm);
      else if (mode === 'wasm')
        searchTinymtSeedWASM(natures, hasShinyCharm)
      else
        throw new Error(`Invalid mode: ${mode}`)
      break;

    default:
      // nothing
  }
}
