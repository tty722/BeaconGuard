<template>
  <div class="upload-container">
    <section id="header">
      <p>Upload File Attributes</p>
    </section>
    <section id="attributes">
      <div class="start-time">
        <div class="attributes-name">
          <p>Start Time</p>
        </div>
        <div class="attributes-value">
          <p>{{ restoreStore.startTime }}</p>
        </div>
      </div>
      <div class="processed-result">
        <div class="attributes-name">
          <p>Processed Result</p>
        </div>
        <div class="attributes-value">
          <div class="checkbox-container">
            <div class="checkbox-item">
              <label>IP Reassembly</label>
              <input type="checkbox" v-model="restoreStore.processedResults.ipReassembly" disabled />
            </div>
            <div class="checkbox-item">
              <label>TCP Stream Reassembly</label>
              <input type="checkbox" v-model="restoreStore.processedResults.tcpStreamReassembly" disabled />
            </div>
            <div class="checkbox-item">
              <label>Application Layer Extraction</label>
              <input type="checkbox" v-model="restoreStore.processedResults.applicationLayerExtraction" disabled />
            </div>
            <div class="checkbox-item">
              <label>Stored in Database</label>
              <input type="checkbox" v-model="restoreStore.processedResults.storedInDatabase" disabled />
            </div>
          </div>
        </div>
      </div>
      <div class="statistics">
        <div class="attributes-name">
          <p>Statistics</p>
        </div>
        <div class="attributes-value">
          <Statistics></Statistics>
        </div>
      </div>
      <div class="uploaded-file">
        <div class="attributes-name">
          <p>Uploaded File</p>
        </div>
        <div class="attributes-value">
          <div class="container">
            <Download></Download>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import useRestoreStore from '@/store/modules/restore';
import Statistics from "./statistics.vue"
import Download from "./download.vue"

let restoreStore = useRestoreStore();

onMounted(async () => {
  try {
    await restoreStore.restoreAttributesGetData();
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped>
.upload-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  section#header {
    width: 100%;
    height: 5%;
    text-align: center;

    p {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 20px;
      font-weight: 700;
    }
  }

  section#attributes {
    width: 100%;
    height: 95%;
    padding: 10px;
    display: flex;
    flex-direction: column;


    .attributes-name {
      width: 25%;
      height: 100%;
      border: 1px solid rgb(147, 147, 147);
      border-right: none;
      display: flex;
    }

    .attributes-value {
      width: 75%;
      height: 100%;
      border: 1px solid rgb(147, 147, 147);
      display: flex;

      p {
        font-size: 13px;
        font-weight: 600
      }
    }

    p {
      font-family: Arial, Helvetica, sans-serif;
      font-weight: 600;
      margin: auto;
    }

    .start-time {
      width: 100%;
      height: 10%;
      display: flex;
      flex-direction: row;
    }

    .processed-result {
      width: 100%;
      height: 20%;
      display: flex;
      flex-direction: row;

      .attributes-value {
        .checkbox-container {
          display: grid;
          grid-template-rows: 1fr 1fr;
          grid-template-columns: 1fr 1fr;
          height: 100%;
          width: 100%;
          align-items: center;
          justify-items: center;
          font-size: 13px;
          font-weight: 600;
          font-family: Arial, Helvetica, sans-serif;
        }

        .checkbox-item:nth-child(1) {
          grid-area: 1 / 1;
        }

        .checkbox-item:nth-child(2) {
          grid-area: 1 / 2;
        }

        .checkbox-item:nth-child(3) {
          grid-area: 2 / 1;
        }

        .checkbox-item:nth-child(4) {
          grid-area: 2 / 2;
        }
      }
    }

    .statistics {
      width: 100%;
      height: 40%;
      display: flex;
      flex-direction: row;
    }

    .uploaded-file {
      width: 100%;
      height: 30%;
      display: flex;
      flex-direction: row;

      .attributes-value {

        .container {
          display: flex;
          width: 50%;
          height: 100%;
          margin: auto;
        }
      }
    }
  }
}
</style>
