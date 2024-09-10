<template>
  <div class="port-container">
    <div class="circle3">
      <circle3></circle3>
    </div>
    <div class="circle4">
      <circle4></circle4>
    </div>
  </div>
</template>

<script setup lang="ts">
import circle3 from "../chart/circle3.vue";
import circle4 from "../chart/circle4.vue";
</script>

<style scoped lang="scss">
.port-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .circle3 {
    width: 100%;
    height: 50%;
  }

  .circle4 {
    width: 100%;
    height: 50%;
  }
}
</style>
