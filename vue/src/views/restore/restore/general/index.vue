<template>
  <div class="restore-container">
    <section id="upload">
      <Upload></Upload>
    </section>
    <section id="restore">
      <div class="header">
        <p>Restore Files</p>
      </div>
      <div class="body">
        <div class="container">
          <div class="restore">
            <Restore></Restore>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>


<script setup lang="ts">
import { onMounted } from "vue";
import Upload from "./upload/index.vue"
import useRestoreStore from "@/store/modules/restore"
import Restore from "./restore/index.vue"

onMounted(async () => {
  try {
    const restoreStore = useRestoreStore();
    await restoreStore.restoreAttributesGetData();
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped>
.restore-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  section#upload {
    width: 50%;
    height: 100%;
  }


  section#restore {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
      width: 100%;
      height: 5%;

      p {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
        font-weight: 700;
        text-align: center;
      }
    }

    .body {
      width: 100%;
      height: 95%;
      padding: 10px;

      .container {
        width: 100%;
        height: 100%;
        border: 1px solid rgb(147, 147, 147);


        .restore {
          display: flex;
          flex-direction: column;
          width: 70%;
          height: auto;
          margin-left: auto;
          margin-right: auto;
        }
      }
    }
  }


}
</style>