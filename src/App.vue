<template>
  <div>
    <h2>性格</h2>
    <div v-for="(nature, index) in natures" :key="index">
      {{ index + 1 }}:  <input type="number" min="0" max="24" step="1" v-model.number="natures[index]" />
    </div>
    <button :disabled="calculating" @click="onClick">計算</button>
    <h2>Seed候補</h2>
    <ul>
      <li v-for="(seed, index) in seeds" :key="index">
        {{ toU32Hex(seed) }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { toU32Hex } from './util'

export default Vue.extend({
  name: 'App',
  data () {
    return {
      natures: [18, 2, 12, 16, 19, 19, 20, 7],
      calculating: false,
      seeds: [] as number[],
    }
  },
  methods: {
    toU32Hex,
    async calculate (): Promise<Uint32Array> {
      const { search_tinymt_seed: searchTinymtSeed } = await import('./wasm/lib')

      const natures = new Uint32Array([18, 2, 12, 16, 19, 19, 20, 7])
      const hasShinyCharm = false

      console.time('search_tinymt_seed')
      const seeds = searchTinymtSeed(natures, hasShinyCharm)
      console.timeEnd('search_tinymt_seed')
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
