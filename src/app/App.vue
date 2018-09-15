<template>
  <el-container>
    <el-header class="header">
      search-tinymt-seed on WebAssembly
    </el-header>
    <el-main><Calculator/></el-main>
    <el-footer class="footer">
      &copy; 2018 <a href="https://mizdra.net" target="_blank">mizdra</a>.
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { toU32Hex } from './util'
import Calculator from './components/Calculator.vue'

export default Vue.extend({
  name: 'App',
  components: { Calculator },
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.header {
  padding: 10px 20px;
  border-bottom: #ccc 1px solid;
  background-color: #644bd8;
  color: #fafafa;
  font-size: 25px;
  font-weight: bold;
  font-family: cursive;
}

.footer {
  background-color: #f9f9f9;
  text-align: center;
  border-top: 1px #ddd solid;
  margin-top: 30px;
  padding: 20px;
}
</style>
