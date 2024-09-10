<template>
  <div class="DNS-container">
    <section id="left">
      <Table></Table>
    </section>
    <section id="right">
      <div class="time">
        <Time></Time>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Table from './chart/table.vue';
import Time from './chart/time.vue';

</script>

<style scoped lang="scss">
.DNS-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  section#left {
    width: 50%;
    height: 100%;
    display: flex;
  }
  section#right {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .time{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
