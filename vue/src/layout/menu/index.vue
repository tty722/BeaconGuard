<template>
  <template v-for="item in menuList" :key="item.path">
      <!--没有子路由-->
      <template v-if="!item.children">
        <el-menu-item
          :index="item.path"
          v-if="!item.meta.hidden"
          @click="goRoute"
        >
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <template #title>
            <span style="font-weight: 500">{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 有子路由但是只有一个子路由 -->
      <template v-if="item.children && item.children.length == 1">
        <el-menu-item
          :index="item.children[0].path"
          v-if="!item.children[0].meta.hidden"
          @click="goRoute"
        >
          <el-icon>
            <component :is="item.children[0].meta.icon"></component>
          </el-icon>
          <template #title>
            <span style="font-weight: 500">{{
              item.children[0].meta.title
            }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 有子路由且个数大于一个1 -->
      <el-sub-menu :index="item.path" v-if="shouldRenderSubMenu(item)">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span style="font-weight: 500">{{ item.meta.title }}</span>
        </template>
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
//获取父组件传递过来的全部路由数组
defineProps(["menuList"]);

//获取路由器对象
let $router = useRouter();
//点击菜单的回调
const goRoute = (vc: any) => {
  $router.push(vc.index);
};

// 辅助函数，检查是否应该渲染子菜单
const shouldRenderSubMenu = (item: any) => {
  if (item.children && item.children.length > 1) {
    // 如果有子路由，遍历检查是否有隐藏的子路由
    return item.children.every((child: any) => !child.meta.hidden);
  } else {
    // 没有子路由或只有一个子路由时直接返回 true
    return false;
  }
};
</script>
<script lang="ts">
export default {
  name: "Menu",
};
</script>

<style scoped lang="scss">
.el-menu-item {
  width: 100%;
  height: 80px;

  .el-icon {
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
