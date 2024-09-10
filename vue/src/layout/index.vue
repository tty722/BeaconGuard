<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <section id="menu" >
      <MenuComponent></MenuComponent>
    </section>
    <!-- 顶部导航栏 -->
    <section id="tab">
      <Tab></Tab>
    </section>
    <!-- 主要窗口 -->
    <section id="main">
      <Main></Main>
    </section>
  </div>
</template>

<script setup lang="ts">
import MenuComponent from "./menu/menuComponent.vue"
import Tab from "./tab/tab.vue"
import Main from "./main/main.vue"
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;

  section#menu {
    width: $menu_width;
    height: 100vh;
  }

  section#tab {
    position: fixed;
    top: 0px;
    left: $menu_width;
    width: calc(100% - $menu_width);
    height: $tab_height;
    background-color: $main_background_color;
  }

  section#main {
    position: absolute;
    top: $tab_height;
    left: $menu_width;
    width: calc(100% - $menu_width);
    height: calc(100% - $tab_height);
    background-color: $main_background_color;
    padding: 10px;
    overflow: auto;
    transition: all 0.3s;
  }

}
</style>