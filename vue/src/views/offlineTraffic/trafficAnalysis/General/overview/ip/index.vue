<template>
  <div class="ip-container">
    <div class="circle1">
      <circle1></circle1>
    </div>
    <div class="circle2">
      <circle2></circle2>
    </div>
  </div>
</template>

<script setup lang="ts">
import circle1 from "../chart/circle1.vue";
import circle2 from "../chart/circle2.vue";
</script>

<style scoped lang="scss">
.ip-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .circle1 {
    width: 100%;
    height: 50%;
  }

  .circle2 {
    width: 100%;
    height: 50%;
  }
}
</style>
