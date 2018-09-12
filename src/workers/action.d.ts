export type Action = Search | Progress | Complete

export type Mode = 'js' | 'wasm'

export interface FSA {
  type: string,
  payload: any,
}

export interface Search extends FSA {
  type: 'SEARCH',
  payload: {
    mode: Mode,
    natures: number[],
    hasShinyCharm: boolean,
  },
}

export interface Progress extends FSA {
  type: 'PROGRESS',
  payload: {
    foundSeeds: number[],
    calculatingSeed: number,
  },
}

export interface Complete extends FSA {
  type: 'COMPLETE',
  payload: {
    foundSeeds: number[],
  },
}
