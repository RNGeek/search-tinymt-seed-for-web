import { Action, Progress, Complete } from './action'
import { searchTinymtSeed } from './calculator'

const ctx: DedicatedWorkerGlobalScope = self as any

export function postProgressAction (foundSeeds: number[] | Uint32Array, seed: number) {
  ctx.postMessage({
    type: 'PROGRESS',
    payload: {
      foundSeeds: Array.from(foundSeeds),
      calculatingSeed: seed,
    },
  } as Progress)
}

function postCompleteAction (foundSeeds: number[] | Uint32Array) {
  ctx.postMessage({
    type: 'COMPLETE',
    payload: {
      foundSeeds: Array.from(foundSeeds),
    },
  } as Complete)
}

function searchTinymtSeedJS (natures: number[], hasShinyCharm: boolean): void {
  const foundSeeds = searchTinymtSeed(natures, hasShinyCharm)
  postCompleteAction(foundSeeds)
}

async function searchTinymtSeedWASM (natures: number[], hasShinyCharm: boolean): Promise<void> {
  const { search_tinymt_seed: searchTinymtSeed } = await import('../wasm/calculator')

  const foundSeeds = searchTinymtSeed(new Uint32Array(natures), hasShinyCharm)
  postCompleteAction(foundSeeds)
}

ctx.onmessage = (event) => {
  const action = event.data as Action
  switch (action.type) {
    case 'SEARCH':
      const { mode, natures, hasShinyCharm } = action.payload
      if (mode === 'js') {
        searchTinymtSeedJS(natures, hasShinyCharm)
      } else if (mode === 'wasm') {
        searchTinymtSeedWASM(natures, hasShinyCharm)
      } else {
        throw new Error(`Invalid mode: ${mode}`)
      }
      break

    default:
      // nothing
  }
}
