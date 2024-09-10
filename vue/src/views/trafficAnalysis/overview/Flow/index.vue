<template>
  <div class="Flow-container">
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
    <section id="time-container">
      <div class="time">
        <Time></Time>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import IP from "./ip/index.vue"
import Port from "./port/index.vue"
import Time from "./chart/time.vue";
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
</script>

<style scoped lang="scss">
.Flow-container {
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

  section#time-container {
    width: 70%;
    height: 100%;
    display: flex;

    .time {
      width: 100%;
      height: 90%;
      margin: auto;
    }
  }
}
</style>
