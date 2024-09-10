<template>
  <div class="menu-container">
    <section id="logo">
      <!-- <img src="../../../new_logo.png"> -->
    </section>
    <section id="navigator">
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu collapse text-color="rgb(100, 100, 100)"
          active-text-color="rgb(41, 40, 40)" :default-active="$route.path">
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </section>
  </div>
</template>

<script setup lang="ts">
import useUserStore from "@/store/modules/user";
import Menu from "./index.vue"
import { useRoute } from "vue-router";

let userStore = useUserStore();
let $route = useRoute();
</script>

<style scoped lang="scss">
.menu-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: $menu_background_color;

  section#logo {
    width: 100%;
    aspect-ratio: 1 / 1;
    /* 宽高比设置为1:1 */
    display: flex;

    img {
      width: 110%;
      margin: auto;
    }
  }

  section#navigator {
    width: 100%;
    height: 70%;
    background-color: transparent;

    .scrollbar {
      margin-top: 30%;
      width: 100%;
      background-color: transparent;

      .el-menu {
        width: 100%;
        background-color: transparent;
        border-right: none;
      }
    }
  }

}
</style>