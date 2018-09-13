const ctx: DedicatedWorkerGlobalScope = self as any

import { Tinymt32 } from '@mizdra/tinymt'
import { Action, Progress, Complete } from './action';

function genRange (rng: Tinymt32.Rng, m: number): number {
  return (rng.gen() >>> 0) % m
}

function skip (rng: Tinymt32.Rng, n: number): void {
  for (let i = 0; i < n; i++) rng.nextState()
}

function eachU32 (fn: (seed: number) => void): void {
  let i = 0x000_00000
  while (true) {
    fn(i)
    if (i === 0xFFFF_FFFF) break
    i++
  }
}

export function getEggNature (rng: Tinymt32.Rng, hasShinyCharm: boolean): number {
  skip(rng, 1) // gender
  let nature = genRange(rng, 25) // nature
  skip(rng, 1) // ability

  // inheriting IVs
  const inherit: boolean[] = Array(6).fill(false)
  for (let i = 0; i < 3; i++) {
    let r = genRange(rng, 6)
    while (inherit[r]) {
      r = genRange(rng, 6)
    }
    inherit[r] = true
    skip(rng, 1)
  }

  skip(rng, 6) // IVs
  skip(rng, 1) // EC
  if (hasShinyCharm) {
    skip(rng, 2) // shiny charm
  }
  // skip(rng, 1) // ball
  skip(rng, 2) // unknown

  return nature
}

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
  let param: Tinymt32.Param = {
    mat1: 0x8F7011EE,
    mat2: 0xFC78FF1F,
    tmat: 0x3793FDFF,
  }

  eachU32((seed) => {
    const rng = Tinymt32.fromSeed(param, seed)

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
