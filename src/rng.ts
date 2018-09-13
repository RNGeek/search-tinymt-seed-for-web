import { Tinymt32 } from '@mizdra/tinymt'

function genRange (rng: Tinymt32.Rng, m: number): number {
  return (rng.gen() >>> 0) % m
}

function skip (rng: Tinymt32.Rng, n: number): void {
  for (let i = 0; i < n; i++) rng.nextState()
}

export function eachU32 (fn: (seed: number) => void): void {
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

export const GEN7_EGG_PARAM: Tinymt32.Param = {
  mat1: 0x8F7011EE,
  mat2: 0xFC78FF1F,
  tmat: 0x3793FDFF,
}

export const NATURES = [
  'がんばりや', 'さみしがり', 'ゆうかん', 'いじっぱり', 'やんちゃ',
  'ずぶとい', 'すなお', 'のんき', 'わんぱく', 'のうてんき',
  'おくびょう', 'せっかち', 'まじめ', 'ようき', 'むじゃき',
  'ひかえめ', 'おっとり', 'れいせい', 'てれや', 'うっかりや',
  'おだやか', 'おとなしい', 'なまいき', 'しんちょう', 'きまぐれ',
]
