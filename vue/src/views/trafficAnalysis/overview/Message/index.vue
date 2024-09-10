<template>
  <div class="Message-container">
    <section id="circle-container">
      <div class="btn">
        <p :class="{ active: currentPage === 'IP' }" @click="setCurrentPage('IP')">IP</p>
        <div class="vertical-divider"></div>
        <p :class="{ active: currentPage === 'Port' }" @click="setCurrentPage('Port')">Port</p>
      </div>
      <div class="chart">
        <component :is="currentComponent"> </component>
      </div>
    </section>
    <section id="message-box">
      <div class="message">
        <AsyncTable></AsyncTable>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { ref } from "vue";
import IP from "../Flow/ip/index.vue"
import Port from "../Flow/port/index.vue"
import useLayoutSettingStore from '@/store/modules/setting';


// 定义组件映射关系的类型
type ComponentMap = {
  [key: string]: any; // 此处可以根据实际情况替换为组件类型
};

let settingStore = useLayoutSettingStore();
let currentPage = ref(settingStore.IPString);
let currentComponent = ref(settingStore.IP);

function setCurrentPage(name: string): void {
  // 定义组件映射关系
  const componentMap: ComponentMap = {
    IP,
    Port
  };

  settingStore.IPString = name;
  currentPage.value = name;

  // 检查是否存在对应的组件
  if (componentMap[name]) {
    currentComponent.value = componentMap[name];
    settingStore.IP = componentMap[name];
  } else {
    console.error(`Component "${name}" not found`);
  }
}
// 使用 defineAsyncComponent 延迟加载 Table 组件
const AsyncTable = defineAsyncComponent(() => import('./table/table.vue'));
</script>

<style scoped lang="scss">
.Message-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  section#circle-container {
    width: 30%;
    flex-direction: column;

    .btn {
      width: 100%;
      height: 5%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
  
      p {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        padding: 0 5px;
        transition: all 0.3s;
        color: rgb(33, 199, 160);
      }
  
      p.active {
        color: rgb(234, 106, 127);
      }
  
      .vertical-divider {
        width: 2px;
        height: 50%;
        background-color: rgb(178, 178, 178);
        margin: 0 10px;
      }
    }

    .chart {
      width: 100%;
      height: 95%;
    }
  }

  section#message-box {
    width: 70%;
    height: 100%;
    display: flex;

    .message {
      width: 100%;
      height: 90%;
      margin: auto;
    }
  }
}
</style>
