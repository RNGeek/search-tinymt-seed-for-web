<template>
  <div class="container">
    <Header/>
    <div class="main">
      <Calculator/>
    </div>
    <Footer/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { toU32Hex } from './util'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Calculator from './components/Calculator.vue'

export default Vue.extend({
  name: 'App',
  components: { Header, Footer, Calculator },
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}

.main {
  padding: 0 20px;
}
</style>
