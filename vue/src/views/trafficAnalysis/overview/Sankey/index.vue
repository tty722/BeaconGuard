<template>
  <div class="sankey-container">
    <section id="select-form">
      <Form></Form>
    </section>
    <section id="sankey">
      <Sankey></Sankey>
    </section>
  </div>
</template>

<script setup lang="ts">
import Form from "../form.vue"
import Sankey from "./sankeyPic/index.vue";

</script>

<style scoped lang="scss">
.sankey-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  section#select-form {
    width: 25%;
    height: 100%;
  }

  section#sankey {
    width: 75%;
    height: 100%;
    padding:10px;
  }
}
</style>