<template>
  <div class="restore-container">
    <section id="main-part">
      <transition name="fade">
        <component :is="currentComponent"> </component>
      </transition>
    </section>
    <section id="select-part">
      <div class="button-box">
        <div :class="['General', { active: currentPage === 'General' }]" @click="() => setCurrentPage('General')">
          <p>General</p>
        </div>
        <div :class="['DNS', { active: currentPage === 'DNS' }]" @click="() => setCurrentPage('DNS')">
          <p>DNS</p>
        </div>
        <div :class="['HTTP', { active: currentPage === 'HTTP' }]" @click="() => setCurrentPage('HTTP')">
          <p>HTTP</p>
        </div>
        <div :class="['ICMP', { active: currentPage === 'ICMP' }]" @click="() => setCurrentPage('ICMP')">
          <p>ICMP</p>
        </div>
        <div :class="['FTP', { active: currentPage === 'FTP' }]" @click="() => setCurrentPage('FTP')">
          <p>FTP</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import useLayoutSettingStore from '@/store/modules/setting';
import General from "./general/index.vue"
import DNS from "./DNS/index.vue"
import HTTP from "./HTTP/index.vue"
import ICMP from "./ICMP/index.vue"
import FTP from "./FTP/index.vue"



// 定义组件映射关系的类型
type ComponentMap = {
  [key: string]: any; // 此处可以根据实际情况替换为组件类型
};

// 当前组件的引用
let settingStore = useLayoutSettingStore();
let currentComponent = ref(settingStore.restore);
let currentPage = ref(settingStore.restoreString);

function setCurrentPage(name: string): void {
  // 定义组件映射关系
  const componentMap: ComponentMap = {
    // Securityrecommendations,
    General,
    DNS,
    HTTP,
    ICMP,
    FTP
  };

  settingStore.restoreString = name;
  currentPage.value = name;

  // 检查是否存在对应的组件
  if (componentMap[name]) {
    currentComponent.value = componentMap[name];
    settingStore.restore = componentMap[name];
  } else {
    console.error(`Component "${name}" not found`);
  }
}
</script>

<style scoped lang="scss">
.restore-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  section#main-part {
    width: 93%;
    height: 100%;
  }

  section#select-part {
    width: 7%;
    height: 100%;
    display: flex;

    .button-box {
      width: 90%;
      height: 30%;
      border-radius: 5px;
      border: 2px solid rgb(212, 210, 210);
      margin: auto;

      div {
        display: flex;
        width: 100%;
        height: 20%;
        border: 1px solid rgb(237, 237, 237);
        cursor: pointer;
        transition: all 0.3s;



        p {
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 600;
          margin: auto;
          color: rgb(121, 121, 121);
        }

        &.active {

          border-radius: 5px;
          background-color: rgb(225, 225, 225);
          border: 2px solid rgb(0, 0, 0);
          transform: scale(1.05);

          p {
            color: rgb(0, 0, 0);
          }
        }
      }

    }
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