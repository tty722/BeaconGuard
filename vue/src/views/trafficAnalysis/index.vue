<template>
  <div class="container">
    <section id="head">
      <p
        :class="{ active: currentPage === 'Overview' }"
        @click="setCurrentPage('Overview')"
      >
        Overview
      </p>
      <div class="vertical-divider"></div>
      <p
        :class="{ active: currentPage === 'Restore' }"
        @click="setCurrentPage('Restore')"
      >
        Restore
      </p>
      <div class="exit_btn">
        <el-button icon="ArrowLeftBold" @click="exitHandler"></el-button>
      </div>
    </section>
    <section id="body">
      <transition name="fade">
        <component :is="currentComponent"> </component>
      </transition>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Overview from "./overview/index.vue";
import Restore from "./restore/index.vue";
import useUserStore from "@/store/modules/user";
import useChartStore from "@/store/modules/chart";
import useLayoutSettingStore from "@/store/modules/setting";
import Flow from "./overview/Flow/index.vue";
import General from "./restore/general/index.vue";
import IP from "./overview/Flow/ip/index.vue";
import Protocol from "./restore/HTTP/chart/table.vue";

// 定义组件映射关系的类型
type ComponentMap = {
  [key: string]: any; // 此处可以根据实际情况替换为组件类型
};

let settingStore = useLayoutSettingStore();
let currentPage = ref(settingStore.offlineString);
let currentComponent = ref(settingStore.offline);

function setCurrentPage(name: string): void {
  // 定义组件映射关系
  const componentMap: ComponentMap = {
    Overview,
    Restore,
  };

  settingStore.offlineString = name;
  currentPage.value = name;

  // 检查是否存在对应的组件
  if (componentMap[name]) {
    currentComponent.value = componentMap[name];
    settingStore.offline = componentMap[name];
  } else {
    console.error(`Component "${name}" not found`);
  }
}

//退出当前流量包分析操作
let userStore = useUserStore();
let chartStore = useChartStore();
const exitHandler = () => {
  userStore.toExitAnalysis = true;

  chartStore.circle1 = {
    top4: [
      { sourceIP: "", count: 0 },
      { sourceIP: "", count: 0 },
      { sourceIP: "", count: 0 },
      { sourceIP: "", count: 0 },
    ],
    remaining: 0,
  };
  chartStore.circle2 = {
    top4: [
      { destIP: "", count: 0 },
      { destIP: "", count: 0 },
      { destIP: "", count: 0 },
      { destIP: "", count: 0 },
    ],
    remaining: 0,
  };
  chartStore.circle3 = {
    top4: [
      { sourcePort: "", count: 0 },
      { sourcePort: "", count: 0 },
      { sourcePort: "", count: 0 },
      { sourcePort: "", count: 0 },
    ],
    remaining: 0,
  };
  chartStore.circle4 = {
    top4: [
      { destPort: "", count: 0 },
      { destPort: "", count: 0 },
      { destPort: "", count: 0 },
      { destPort: "", count: 0 },
    ],
    remaining: 0,
  };
  chartStore.data = [];
  settingStore.offline = Overview;
  settingStore.offlineString = "Overview";
  settingStore.overview = Flow;
  settingStore.overviewString = "Flow";
  settingStore.restore = General;
  settingStore.restoreString = "General";
  settingStore.IP = IP;
  settingStore.IPString = "IP";
  settingStore.HTTP = Protocol;
  settingStore.HTTPstring = "Protocol";
};
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  section#head {
    width: 100%;
    height: 5%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    p {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 18px;
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
      height: 70%;
      background-color: rgb(178, 178, 178);
      margin: 0 10px;
    }

    .exit_btn {
      position: absolute;
      right: 20px;
      /* 调整按钮距离右边的距离 */

      /* 将按钮推到最右边 */
      .el-button {
        width: 5%;
        aspect-ratio: 1 / 1;
      }
    }
  }

  section#body {
    width: 100%;
    height: 95%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: white;
    border: 1px solid rgb(202, 202, 202);
    border-radius: 5px;
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
