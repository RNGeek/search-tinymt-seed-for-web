<template>
  <div class="footer">
    &copy; 2018 <a href="https://mizdra.net" target="_blank">mizdra</a>.
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'Footer',
})
</script>

<style scoped>
.footer {
  background-color: #f9f9f9;
  text-align: center;
  border-top: 1px #ddd solid;
  margin-top: 30px;
  padding: 20px;
}
</style>
