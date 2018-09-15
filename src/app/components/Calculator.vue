<template>
  <div>
    <h2>入力</h2>

    <el-form label-width="100px">
      <el-form-item label="計算方式">
        <el-radio-group v-model="mode">
          <el-radio label="js">JavaScript</el-radio>
          <el-radio label="wasm">WebAssembly</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-for="(nature, index) in natures"
        :key="index"
        :label="`${index + 1}匹目の性格`">
        <InputNature v-model="natures[index]" />
      </el-form-item>
      <el-form-item label="光るお守り">
        <el-checkbox v-model="hasShinyCharm">有効</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button v-if="calculating" type="danger" @click="onCancel">キャンセル</el-button>
        <el-button v-else type="primary" :disabled="calculating" @click="onCalculate">計算開始</el-button>
      </el-form-item>
    </el-form>

    <h2>進捗</h2>
    <el-progress
      :text-inside="true"
      :stroke-width="18"
      :percentage="progressRate"
      :status="calculating ? undefined : 'success'" />
    <div class="progress-description">
      <span>検索中: {{ toU32Hex(calculatingSeed) }}</span>
      /
      <span>予想残り時間: {{ toMinutes(remainingTime) }}分</span>
      /
      <span>予想総計算時間: {{ toMinutes(completingTime) }}分</span>
    </div>

    <h2>Seed候補</h2>
    <p>計算時間: {{ toMinutes(realCompletingTime) }}分 ({{ realCompletingTime }}ms)</p>
    <result-table :has-shiny-charm="hasShinyCharm" :found-seeds="foundSeeds" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { toU32Hex, toMinutes } from '../util'
import InputNature from './InputNature.vue'
import ResultTable from './ResultTable.vue'
import { WorkerManager, Result, ProgressData } from '../worker-manager'
import { Mode } from '../../worker/action'

export default Vue.extend({
  name: 'Calculator',
  components: { InputNature, ResultTable },
  data () {
    return {
      mode: 'wasm' as Mode,
      natures: [17, 24, 7, 16, 6, 20, 12, 18],
      hasShinyCharm: false,
      calculating: false,
      foundSeeds: [] as number[],
      realCompletingTime: 0,
      start: 0,
      calculatingSeed: 0xFFFF_FFFF,
      now: 0,
      manager: null as WorkerManager | null,
    }
  },
  computed: {
    progressRate(): number {
      const val = this.calculatingSeed / 0xFFFF_FFFF * 100
      return Math.floor(val * 10) / 10
    },
    elapsedTime(): number {
      return this.now - this.start
    },
    completingTime(): number {
      if (this.calculatingSeed === 0) return 0
      return this.elapsedTime * (0xFFFF_FFFF / this.calculatingSeed)
    },
    remainingTime(): number {
      if (this.calculatingSeed === 0) return 0
      return this.completingTime - this.elapsedTime
    },
  },
  methods: {
    toU32Hex,
    toMinutes,
    async calculate (): Promise<Result> {
      const manager = new WorkerManager();
      this.manager = manager

      manager.addProgressListener(progressData => this.updateProgress(progressData))

      this.start = Date.now()

      const result = await manager.search(this.mode, this.natures, this.hasShinyCharm)
      manager.terminate()
      return result
    },
    updateProgress(progressData: ProgressData): void {
      const { calculatingSeed, foundSeeds } = progressData
      this.calculatingSeed = calculatingSeed
      this.foundSeeds = foundSeeds
      this.now = Date.now()
    },
    onCancel (): void {
      if (this.manager === null) throw new Error('Invalid operation: onCancel')
      this.calculating = false
      this.manager.terminate()
    },
    async onCalculate (): Promise<void> {
      this.calculating = true
      this.calculatingSeed = 0
      this.foundSeeds = []
      this.now = Date.now()

      const result = await this.calculate()
      this.foundSeeds = result.foundSeeds
      this.realCompletingTime = result.completingTime

      this.calculating = false
    },
  },
})
</script>

<style scoped>
.progress-description {
  color: #606060;
  font-size: 0.8em;
  text-align: right;
  padding: 2px 0;
}
</style>

