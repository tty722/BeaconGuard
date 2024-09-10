<template>
  <div class="ftp-container">
    <section id="left">
      <Table></Table>
    </section>
    <section id="right">
      <Time></Time>
    </section>
  </div>
</template>

<script setup lang="ts">
import Table from "./chart/table.vue"
import Time from "./chart/time.vue"
</script>

<style scoped lang='scss'>
.ftp-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  section#left{
    width: 50%;
    height: 100%;
  }

  section#right{
    width: 50%;
    height: 100%;
  }
}
</style>