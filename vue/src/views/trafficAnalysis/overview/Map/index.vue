<template>
  <div class="map-container">
    <section id="map">
      <Map></Map>
    </section>
    <section id="city-message">
      <Table></Table>
    </section>
  </div>
</template>

<script setup lang="ts">
import Map from "./mapPic/index.vue"
import Table from "./table/table.vue"
</script>

<style scoped lang="scss">
.map-container{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  section#map{
    width: 60%;
    height: 100%;
  }

  section#city-message{
    width: 40%;
    height: 100%;
  }
}
</style>