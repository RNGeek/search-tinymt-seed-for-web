import { Search, Action, Mode } from '../worker/action'

export interface ProgressData {
  calculatingSeed: number,
  foundSeeds: number[],
}
export interface Result {
  foundSeeds: number[],
  completingTime: number,
}

type ProgressListener = (progressData: ProgressData) => void

export class WorkerManager {
  private worker: Worker
  private progressListeners: ProgressListener[]

  constructor () {
    // NOTE: workerは `https://hostname/worker.js` に配置されている
    this.worker = new Worker('/worker.js')
    this.progressListeners = []
  }

  addProgressListener (listener: ProgressListener) {
    this.progressListeners.push(listener)
  }

  search (mode: Mode, natures: number[], hasShinyCharm: boolean): Promise<Result> {
    return new Promise((resolve) => {
      const start = Date.now()
      this.worker.postMessage({
        type: 'SEARCH',
        payload: {
          mode,
          natures,
          hasShinyCharm,
        },
      } as Search)

      this.worker.onmessage = (event) => {
        const action = event.data as Action
        switch (action.type) {
          case 'PROGRESS':
            this.progressListeners.forEach(listener => listener(action.payload))
            break

          case 'COMPLETE':
            const end = Date.now()
            resolve({
              foundSeeds: action.payload.foundSeeds,
              completingTime: end - start,
            })
            break

          default:
            // nothing
        }
      }
    })
  }

  terminate (): void {
    this.worker.terminate()
  }
}
