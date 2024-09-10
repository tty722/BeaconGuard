<template>
  <div class="statistics-container">
    <section id="total">
      <div 
        class="total-message" 
        @mouseenter="hover = true" 
        @mouseleave="hover = false"
      >
        <p class="label">Total</p>
        <p class="message">{{ restoreStore.statistics.total_packets }}</p>
        <transition name="slide-up">
          <div class="total-message-overlay" v-show="hover">
            <p class="label">Bytes</p>
            <p class="message">{{ restoreStore.statistics.total_bytes }}</p>
          </div>
        </transition>
      </div>
    </section>
    <section id="protocol">
      <div 
        class="protocol-message" 
        v-for="(protocol, key) in protocolStats" 
        :key="key" 
        @mouseenter="currentHover = key" 
        @mouseleave="currentHover = ''"
        :style="{ backgroundColor: protocol.color }"
      >
        <p class="label">{{ key.toUpperCase() }}</p>
        <p class="message">{{ protocol.totalPackets }}</p>
        <transition name="slide-up">
          <div class="protocol-message-overlay" v-show="currentHover === key">
            <p class="label">Bytes</p>
            <p class="message">{{ protocol.totalBytes }}</p>
          </div>
        </transition>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import useRestoreStore from '@/store/modules/restore';

let restoreStore = useRestoreStore();
const hover = ref(false);
const currentHover = ref('');

const protocolStats = ref({
  tcp: { totalPackets: 0, totalBytes: 0, color: '#ffcccc' },
  udp: { totalPackets: 0, totalBytes: 0, color: '#ccffcc' },
  http: { totalPackets: 0, totalBytes: 0, color: '#ccccff' },
  ftp: { totalPackets: 0, totalBytes: 0, color: '#ffffcc' },
  dns: { totalPackets: 0, totalBytes: 0, color: '#99D9EA' },
  icmp: { totalPackets: 0, totalBytes: 0, color: '#FCE0FF' },
});

onMounted(async () => {
  try {
    await restoreStore.restoreAttributesGetData();
    protocolStats.value = {
      ...restoreStore.statistics.protocolAnalysis,
      tcp: { ...restoreStore.statistics.protocolAnalysis.tcp, color: '#ffcccc' },
      udp: { ...restoreStore.statistics.protocolAnalysis.udp, color: '#ccffcc' },
      http: { ...restoreStore.statistics.protocolAnalysis.http, color: '#ccccff' },
      ftp: { ...restoreStore.statistics.protocolAnalysis.ftp, color: '#ffffcc' },
      dns: { ...restoreStore.statistics.protocolAnalysis.dns, color: '#99D9EA' },
      icmp: { ...restoreStore.statistics.protocolAnalysis.dns, color: '#FCE0FF' },
    };
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped lang="scss">
.statistics-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  section#total {
    width: 100%;
    height: 50%;
    display: flex;

    .total-message {
      width: 20%;
      height: 50%;
      margin: auto;
      display: flex;
      flex-direction: column;
      background-color: rgb(167, 167, 167);
      border-radius: 5px;
      border: 2px solid rgb(140, 140, 140);
      position: relative;
      overflow: hidden;

      .label {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 15px;
        font-weight: 700;
        text-align: center;
        margin-top: auto;
      }

      .message {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
        font-weight: 800;
        text-align: center;
        margin-bottom: auto;
      }

      .total-message-overlay {
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        position: absolute;
        top: 100%;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .label {
          font-size: 15px;
          font-weight: 600;
        }

        .message {
          font-size: 20px;
          font-weight: 700;
        }
      }

      &:hover .total-message-overlay {
        top: 0;
        transition: top 0.3s ease;
      }
    }
  }

  section#protocol {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: space-around;

    .protocol-message {
      width: 18%;
      height: 50%;
      margin: auto;
      display: flex;
      flex-direction: column;
      background-color: rgb(167, 167, 167);
      border-radius: 5px;
      border: 2px solid rgb(140, 140, 140);
      position: relative;
      overflow: hidden;

      .label {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 13px;
        font-weight: 700;
        text-align: center;
        margin-top: auto;
      }

      .message {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 15px;
        font-weight: 800;
        text-align: center;
        margin-bottom: auto;
      }

      .protocol-message-overlay {
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        position: absolute;
        top: 100%;
        left: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .label {
          font-size: 13px;
          font-weight: 700;
        }

        .message {
          font-size: 15px;
          font-weight: 800;
        }
      }

      &:hover .protocol-message-overlay {
        top: 0;
        transition: top 0.3s ease;
      }
    }
  }
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: top 0.3s ease;
}

.slide-up-enter, .slide-up-leave-to {
  top: 100%;
}
</style>
