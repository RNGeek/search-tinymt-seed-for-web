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
        <el-button type="primary" :disabled="calculating" @click="onClick">計算開始</el-button>
      </el-form-item>
    </el-form>

    <h2>Seed候補</h2>
    <p>計算時間: {{ (time / 1000 / 60).toFixed(1) }}分 ({{ time }}ms)</p>
    <ul>
      <li v-for="(seed, index) in seeds" :key="index">
        {{ toU32Hex(seed) }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { toU32Hex } from '../util'
import InputNature from './InputNature.vue'
import { SearchWorkerManager, Result } from '../search-worker-manager'
import { Mode } from '../workers/action'

export default Vue.extend({
  name: 'Calculator',
  components: { InputNature },
  data () {
    return {
      mode: 'wasm' as Mode,
      natures: [17, 24, 7, 16, 6, 20, 12, 18],
      hasShinyCharm: false,
      calculating: false,
      seeds: [] as number[],
      time: 0,
    }
  },
  methods: {
    toU32Hex,
    async calculate (): Promise<Result> {
      const manager = new SearchWorkerManager();
      const result = await manager.search(this.mode, this.natures, this.hasShinyCharm)
      manager.terminate()
      return result
    },
    async onClick (): Promise<void> {
      this.calculating = true

      const result = await this.calculate()
      this.seeds = result.foundSeeds
      this.time = result.completingTime

      this.calculating = false
    },
  },
})
</script>
