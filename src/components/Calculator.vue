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
import searchTinymtSeedJS from '../search-tinymt-seed'

type Mode = 'js' | 'wasm'

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
    async calculate (): Promise<number[]> {
      if (this.mode === 'js') {
        return this.calculateJS()
      } else if (this.mode === 'wasm') {
        return this.calculateWASM()
      } else {
        throw Error(`(mode === ${JSON.stringify(this.mode)}) の値が不正です.`)
      }
    },
    async calculateJS (): Promise<number[]> {
      const result = await searchTinymtSeedJS(this.natures, this.hasShinyCharm)
      return result.foundSeeds
    },
    async calculateWASM (): Promise<number[]> {
      const { search_tinymt_seed: searchTinymtSeedWASM } = await import('../wasm/lib')
      return Array.from(searchTinymtSeedWASM(new Uint32Array(this.natures), this.hasShinyCharm))
    },
    async onClick (): Promise<void> {
      this.calculating = true

      const start = new Date()
      this.seeds = await this.calculate()
      const end = new Date()

      this.time = end.getTime() - start.getTime()
      this.calculating = false
    },
  },
})
</script>
