<template>
  <el-select v-model="stateValue">
    <el-option
      v-for="(nature, index) in natures"
      :key="nature"
      :label="nature"
      :value="index">
    </el-option>
  </el-select>
</template>

<script lang="ts">
import Vue from 'vue'

const NATURES = [
  'がんばりや', 'さみしがり', 'ゆうかん', 'いじっぱり', 'やんちゃ',
  'ずぶとい', 'すなお', 'のんき', 'わんぱく', 'のうてんき',
  'おくびょう', 'せっかち', 'まじめ', 'ようき', 'むじゃき',
  'ひかえめ', 'おっとり', 'れいせい', 'てれや', 'うっかりや',
  'おだやか', 'おとなしい', 'なまいき', 'しんちょう', 'きまぐれ',
]

export default Vue.extend({
  name: 'InputNature',
  props: {
    value: { type: Number, default: 0 },
  },
  data () {
    return {
      stateValue: this.value,
      natures: NATURES,
    }
  },
  watch: {
    stateValue (): void {
      this.$emit('input', this.stateValue)
    },
  },
})
</script>
