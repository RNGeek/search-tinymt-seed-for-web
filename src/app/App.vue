<template>
  <el-container>
    <el-header class="header">
      <h1 class="app-title">
        <img class="app-icon" alt="Application Icon" width="48px" height="48px" src="/img/icon.svg" />
        <span class="app-detail">search-tinymt-seed on WebAssembly</span>
      </h1>
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
  font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "Segoe UI","Noto Sans Japanese","ヒラギノ角ゴ ProN W3", Meiryo, sans-serif !important;
}

</style>

<style scoped>
.header {
  border-bottom: #ccc 1px solid;
  background-color: #644bd8;
  color: #fafafa;
}
.app-title {
  display: inline;
  margin: 0;
  padding: 0;
}
.app-icon {
  margin-top: 5px;
  margin-right: 5px;
  line-height: 60px;
  vertical-align: top;
}
.app-detail {
  line-height: 60px;
  vertical-align: text-bottom;
  font-size: 4vw;
  font-weight: 100;
}
@media (min-width: 600px) {
  .app-detail {
    font-size: 25px;
  }
}

.footer {
  background-color: #f9f9f9;
  text-align: center;
  border-top: 1px #ddd solid;
  margin-top: 30px;
  padding: 20px;
}
</style>
