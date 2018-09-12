import { toU32Hex } from './util'
import SearchTinymtSeedJSWorker from 'worker-loader!./workers/search-tinymt-seed-js.worker'
import { Search, Action } from './workers/action';

const toMinutes = (ms: number) => (ms / 1000 / 60).toFixed(1)

interface Result {
  foundSeeds: number[],
  completingTime: number,
}

export default function searchTinymtSeedJS (natures: number[], hasShinyCharm: boolean): Promise<Result> {
  return new Promise((resolve) => {
    const worker = new SearchTinymtSeedJSWorker();
  
    worker.onmessage = (event) => {
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
  
    worker.postMessage({
      type: 'SEARCH',
      payload: {
        natures,
        hasShinyCharm,
      }
    } as Search)
  })
}
