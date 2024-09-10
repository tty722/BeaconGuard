<template>
  <div class="http-container">
    <section id="left">
      <div class="btn">
        <p
          :class="{ active: currentPage === 'Protocol' }"
          @click="setCurrentPage('Protocol')"
        >
          Protocol
        </p>
        <div class="vertical-divider"></div>
        <p
          :class="{ active: currentPage === 'Message' }"
          @click="setCurrentPage('Message')"
        >
          Message
        </p>
      </div>
      <div class="chart">
        <transition name="fade">
          <component :is="currentComponent"> </component>
        </transition>
      </div>
    </section>
    <section id="right">
      <Time></Time>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Message from "./chart/message.vue";
import Protocol from "./chart/table.vue";
import Time from "./chart/time.vue"
import useLayoutSettingStore from "@/store/modules/setting";

// 定义组件映射关系的类型
type ComponentMap = {
  [key: string]: any; // 此处可以根据实际情况替换为组件类型
};

let settingStore = useLayoutSettingStore();
let currentPage = ref(settingStore.HTTPstring);
let currentComponent = ref(settingStore.HTTP);

function setCurrentPage(name: string): void {
  // 定义组件映射关系
  const componentMap: ComponentMap = {
    Protocol,
    Message,
  };

  settingStore.HTTPstring = name;
  currentPage.value = name;

  // 检查是否存在对应的组件
  if (componentMap[name]) {
    currentComponent.value = componentMap[name];
    settingStore.HTTP = componentMap[name];
  } else {
    console.error(`Component "${name}" not found`);
  }
}
</script>

<style scoped lang="scss">
.http-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  section#left {
    width: 50%;
    height: 100%;
    display: flex;
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

  section#right {
    width: 50%;
    height: 100%;
  }
}
</style>


<!-- 切换动画 -->
<style scoped lang="scss">
.fade-enter-active {
  transition: all 0.4s;
  /* 设置动画过渡时间 */
}

.fade-enter-from {
  opacity: 0;
  /* 设置初始和结束状态的透明度 */
  transform: scale(0);
  /* 设置初始和结束状态的缩放比例 */
}

.fade-enter-to {
  opacity: 1;
  /* 设置结束状态的透明度 */
  transform: scale(1);
  /* 设置结束状态的缩放比例 */
}
</style>