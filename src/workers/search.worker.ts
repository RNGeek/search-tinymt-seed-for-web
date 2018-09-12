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

function getEggNature (rng: Tinymt32.Rng, hasShinyCharm: boolean): number {
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

function postProgressAction(startTime: number, foundSeeds: number[], seed: number) {
  const progressRate = seed / 0xFFFF_FFFF * 100
  const elapsedTime = Date.now() - startTime
  const completingTime = elapsedTime * (0xFFFF_FFFF / seed)
  const remainingTime = completingTime - elapsedTime
  ctx.postMessage({
    type: 'PROGRESS',
    payload: {
      foundSeeds: foundSeeds,
      progressRate,
      calculatingSeed: seed,
      elapsedTime,
      remainingTime,
      completingTime,
    }
  } as Progress)
}

function postCompleteAction(startTime: number, foundSeeds: number[]) {
  ctx.postMessage({
    type: 'COMPLETE',
    payload: {
      foundSeeds,
      completingTime: Date.now() - startTime,
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

  const start = Date.now()
  eachU32((seed) => {
    const rng = Tinymt32.fromSeed(param, seed)

    let found = natures
      .every(nature => nature === getEggNature(rng, hasShinyCharm))

    if (seed % 0x0100_0000 === 0 && seed !== 0) {
      postProgressAction(start, foundSeeds, seed)
    }

    if (found) {
      foundSeeds.push(seed)
      postProgressAction(start, foundSeeds, seed)
    }
  })

  postCompleteAction(start, foundSeeds)
}

async function searchTinymtSeedWASM(natures: number[], hasShinyCharm: boolean): Promise<void> {
  const { search_tinymt_seed } = await import('../wasm/lib')

  const start = Date.now()
  const foundSeeds = Array.from(search_tinymt_seed(new Uint32Array(natures), hasShinyCharm))
  postCompleteAction(start, foundSeeds)
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
