import { toU32Hex, toMinutes } from './util'
import SearchWorker from 'worker-loader!./workers/search.worker'
import { Search, Action, Mode } from './workers/action';

interface Result {
  foundSeeds: number[],
  completingTime: number,
}

export class SearchWorkerManager {
  private worker: Worker

  constructor() {
    this.worker = new SearchWorker()
  }

  search(mode: Mode, natures: number[], hasShinyCharm: boolean): Promise<Result> {
    return new Promise((resolve) => {
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
            const { payload } = action
            console.log({
              '進捗': `${payload.progressRate.toFixed(1)}%`,
              '見つかったSeed': payload.foundSeeds.map(toU32Hex),
              '現在のseed': toU32Hex(payload.calculatingSeed),
              '経過時間': `${toMinutes(payload.elapsedTime)}分`,
              '予想総計算時間': `${toMinutes(payload.completingTime)}分`,
              '予想残り時間': `${toMinutes(payload.remainingTime)}分`,
            })
            break;
  
          case "COMPLETE":
            resolve(action.payload)
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
