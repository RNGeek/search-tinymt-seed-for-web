export type Action = Search | Progress | Complete

export interface FSA {
  type: string,
  payload: any,
}

export interface Search extends FSA {
  type: 'SEARCH',
  payload: {
    natures: number[],
    hasShinyCharm: boolean,
  },
}

export interface Progress extends FSA {
  type: 'PROGRESS',
  payload: {
    foundSeeds: number[],
    progressRate: number,
    calculatingSeed: number,
    elapsedTime: number,
    remainingTime: number,
    completingTime: number,
  },
}

export interface Complete extends FSA {
  type: 'COMPLETE',
  payload: {
    foundSeeds: number[],
    completingTime: number,
  },
}
