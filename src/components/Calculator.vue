<template>
  <div>
    <h2>入力</h2>

    <el-form label-width="100px">
      <el-form-item
        v-for="(nature, index) in natures"
        :key="index"
        :label="`${index + 1}匹目の性格`">
        <InputNature v-model="natures[index]" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="hasShinyCharm">光るお守り</el-checkbox>
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

export default Vue.extend({
  name: 'Calculator',
  components: { InputNature },
  data () {
    return {
      natures: [17, 24, 7, 16, 6, 20, 12, 18],
      hasShinyCharm: false,
      calculating: false,
      seeds: [] as number[],
      time: 0,
    }
  },
  methods: {
    toU32Hex,
    async calculate (): Promise<Uint32Array> {
      const { search_tinymt_seed: searchTinymtSeed } = await import('../wasm/lib')

      const start = new Date()
      const seeds = searchTinymtSeed(new Uint32Array(this.natures), this.hasShinyCharm)
      const end = new Date()

      this.time = end.getTime() - start.getTime()
      return seeds
    },
    async onClick (): Promise<void> {
      this.calculating = true
      this.seeds = Array.from(await this.calculate())
      this.calculating = false
    },
  },
})
</script>
