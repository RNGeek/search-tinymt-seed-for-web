import { toU32Hex, toMinutes } from './util'
import { Search, Action, Mode } from './workers/action';

declare const SEARCH_WORKER_PATH: string;

export interface Result {
  foundSeeds: number[],
  completingTime: number,
}

export class SearchWorkerManager {
  private worker: Worker

  constructor() {
    this.worker = new Worker(SEARCH_WORKER_PATH)
  }

  search(mode: Mode, natures: number[], hasShinyCharm: boolean): Promise<Result> {
    return new Promise((resolve) => {
      const start = Date.now()
      this.worker.postMessage({
        type: 'SEARCH',
        payload: {
          mode,
          natures,
          hasShinyCharm,
        }
      } as Search)

      this.worker.onmessage = (event) => {
        const action = event.data as Action
        switch(action.type) {
          case "PROGRESS":
            const { calculatingSeed, foundSeeds } = action.payload

            const progressRate = (calculatingSeed / 0xFFFF_FFFF * 100).toFixed(1)
            const elapsedTime = Date.now() - start
            const completingTime = elapsedTime * (0xFFFF_FFFF / calculatingSeed)
            const remainingTime = completingTime - elapsedTime
            console.log({
              '進捗': `${progressRate}%`,
              '見つかったSeed': foundSeeds.map(toU32Hex),
              '現在のseed': toU32Hex(calculatingSeed),
              '経過時間': `${toMinutes(elapsedTime)}分`,
              '予想総計算時間': `${toMinutes(completingTime)}分`,
              '予想残り時間': `${toMinutes(remainingTime)}分`,
            })
            break;
  
          case "COMPLETE":
            const end = Date.now()
            resolve({
              foundSeeds: action.payload.foundSeeds,
              completingTime: end - start,
            })
            return
          default:
            // nothing
        }
      }
    })
  }

  terminate(): void {
    this.worker.terminate()
  }
}
