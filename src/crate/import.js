// NOTE: ドキュメントでは ES Modules でも動くと書いてあるが, 何故か動かないので CommonJS にしている
exports.postProgressAction = (foundSeeds, seed) => {
  self.postMessage({
    type: 'PROGRESS',
    payload: {
      foundSeeds: Array.from(foundSeeds),
      calculatingSeed: seed,
    },
  })
}
