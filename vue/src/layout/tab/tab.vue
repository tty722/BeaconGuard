<template>
  <div class="tab-container">
    <section id="breadCrumb">
      <breadCrumb></breadCrumb>
    </section>
    <section id="setting">
      <setting></setting>
    </section>
  </div>
</template>

<script setup lang="ts">
import breadCrumb from "./breadCrumb/breadCrumb.vue"
import setting from "./setting/setting.vue"
</script>

<style scoped lang="scss">
.tab-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  section#breadCrumb{
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  section#setting{
    width: 70%;
    height: 100%;
  }
}

</style>