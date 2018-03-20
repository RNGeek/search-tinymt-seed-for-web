import { Tinymt32 } from '@mizdra/tinymt'

function genRange (rng: Tinymt32.Rng, m: number): number {
  return rng.gen() % m
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

export default function searchTinymtSeedJS (natures: number[], hasShinyCharm: boolean): number[] {
  console.assert(natures.length === 8)
  natures.forEach(nature => {
    console.assert(Number.isSafeInteger(nature))
    console.assert(nature >= 0)
    console.assert(nature < 25)
  })

  const seeds: number[] = []
  let param: Tinymt32.Param = {
    mat1: 0x8F7011EE,
    mat2: 0xFC78FF1F,
    tmat: 0x3793FDFF,
  }

  eachU32((seed) => {
    const rng = Tinymt32.fromSeed(param, seed)

    let found = natures
      .every(nature => nature === getEggNature(rng, hasShinyCharm))

    if (found) {
      seeds.push(seed)
    }
  })

  return seeds
}
