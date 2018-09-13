<template>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="seed"
      label="Seed"
      width="140">
    </el-table-column>


    <el-table-column
      v-for="index in range(beginNatureIndex, endNatureIndex)"
      :key="index"
      :prop="`nature${index}`"
      :label="`${index + 1}匹目の性格`"
      width="140">
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import Vue from 'vue'
import { Tinymt32 } from '@mizdra/tinymt';
import { getEggNature } from '../workers/search.worker';
import { toU32Hex } from '../util';

const NATURES = [
  'がんばりや', 'さみしがり', 'ゆうかん', 'いじっぱり', 'やんちゃ',
  'ずぶとい', 'すなお', 'のんき', 'わんぱく', 'のうてんき',
  'おくびょう', 'せっかち', 'まじめ', 'ようき', 'むじゃき',
  'ひかえめ', 'おっとり', 'れいせい', 'てれや', 'うっかりや',
  'おだやか', 'おとなしい', 'なまいき', 'しんちょう', 'きまぐれ',
]

type PropType<T> = () => T

export default Vue.extend({
  name: 'ResultTable',
  props: {
    hasShinyCharm: {
      type: Boolean,
      required: true,
    },
    foundSeeds: {
      type: Array as PropType<number[]>,
      required: true,
    },
    beginNatureIndex: {
      type: Number,
      default: 8,
    },
    endNatureIndex: {
      type: Number,
      default: 11,
    },
  },
  computed: {
    tableData(): any {
      let param: Tinymt32.Param = {
        mat1: 0x8F7011EE,
        mat2: 0xFC78FF1F,
        tmat: 0x3793FDFF,
      }

      return this.foundSeeds.map(seed => {
        const rng = Tinymt32.fromSeed(param, seed)
        let rowData: any = { seed: toU32Hex(seed) }

        for (let i = 0; i < this.endNatureIndex; i++) {
          const nature = getEggNature(rng, this.hasShinyCharm)
          if (i < this.beginNatureIndex) continue;

          rowData[`nature${i}`] = NATURES[nature]
        }

        return rowData
      })
    }
  },
  methods: {
    range(begin: number, end: number): number[] {
      const length = end - begin
      return Array.from(Array(length).keys()).map(i => i + begin)
    },
  },
})
</script>
