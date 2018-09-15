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
import { NATURES } from '../rng'

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
