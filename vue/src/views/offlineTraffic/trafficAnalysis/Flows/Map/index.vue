<template>
    <div class="map-container">
        <section id="map">
            <Map></Map>
        </section>
    </div>
</template>

<script setup lang="ts">
import Map from "./map.vue"
</script>

<style scoped lang="scss">
.map-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    section#map {
        width: 100%;
        height: 100%;
    }

}
</style>