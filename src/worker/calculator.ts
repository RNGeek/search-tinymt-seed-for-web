import { eachU32, getEggNature, GEN7_EGG_PARAM } from '../app/rng'
import { Tinymt32 } from '@mizdra/tinymt'
import { postProgressAction } from './worker'

export function searchTinymtSeed (natures: number[], hasShinyCharm: boolean): number[] {
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

  return foundSeeds
}
