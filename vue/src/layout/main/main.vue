<template>
  <div class="box">
    <!-- 路由组件出口位置 -->
    <router-view v-slot="{ Component }" class="routerView">
      <transition name="fade">
        <!-- 渲染过度动画 -->
        <component :is="Component" v-if="flag" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
//获取骨架小仓库
import useLayoutSettingStore from "@/store/modules/setting";
import { nextTick, ref, watch } from "vue";
let LayoutSettingStore = useLayoutSettingStore();
//监听仓库内容是否发生变化，如果发生变化，说明用户点击过刷新按钮

let flag = ref(true);
watch(
  () => LayoutSettingStore.refresh,
  () => {
    //点击刷新按钮：路由组件销毁
    flag.value = false;
    nextTick(() => {
      flag.value = true;
    });
  }
);
</script>
<script lang="ts">
export default {
  name: "Main",
};
</script>
<style scoped lang="scss">
.box {
  width: 100%;
  height: 100%;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.4s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}

.box {
  width: 100%;
  overflow-y: auto;
  overflow: hidden;
}
</style>
