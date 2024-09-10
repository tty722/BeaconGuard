<template>
    <div class="general-container">
        <section id="main-part">
            <transition name="fade">
                <component :is="currentComponent"> </component>
            </transition>
        </section>
        <section id="select-part">
            <div class="button-box">
                <div :class="['Overview', { active: currentPage === 'generalOverview'||currentPage ==='overview' }]"
                    @click="() => setCurrentPage('overview')">
                    <p>Overview</p>
                </div>
                <div :class="['Message', { active: currentPage === 'message' }]"
                    @click="() => setCurrentPage('message')">
                    <p>Message</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import overview from './overview/index.vue'
import message from './message/index.vue'
import useOfflineStore from '@/store/modules/offline';

// 定义组件映射关系的类型
type ComponentMap = {
    [key: string]: any; // 此处可以根据实际情况替换为组件类型
};

// 当前组件的引用
let offlineStore = useOfflineStore()
let currentComponent = ref(offlineStore.general);
let currentPage = ref(offlineStore.generalString);

function setCurrentPage(name: string): void {
    // 定义组件映射关系
    const componentMap: ComponentMap = {
        // Securityrecommendations,
        overview,
        message
    };

    offlineStore.generalString = name;
    currentPage.value = name;

    // 检查是否存在对应的组件
    if (componentMap[name]) {
        currentComponent.value = componentMap[name];
        offlineStore.general = componentMap[name];
    } else {
        console.error(`Component "${name}" not found`);
    }
}
</script>

<style scoped lang="scss">
.general-container {
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
      height: 10%;
      border-radius: 5px;
      border: 2px solid rgb(212, 210, 210);
      margin: auto;

      div {
        display: flex;
        width: 100%;
        height: 50%;
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