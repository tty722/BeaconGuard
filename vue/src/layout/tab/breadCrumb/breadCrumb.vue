<template>
  
  <img src="../../../../new_logo.png" alt="">
  <!-- 顶部左侧静态 -->
  <el-icon style="margin-right: 10px">
    <Fold></Fold>
  </el-icon>
  <!-- 左侧静态面包屑 -->
  <el-breadcrumb>
    <!-- 面包动态展示路由名字与标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 面包屑展示匹配路由的标题 -->
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>

</template>

<script setup lang="ts">
import { Fold } from "@element-plus/icons-vue";
import { useRoute } from "vue-router";
//定义一个响应式数据控制图标切换

//获取路由对象
let $route = useRoute();


</script>
<script lang="ts">
export default {
  name: "BreadCrumb",
};
</script>
<style scoped>
.el-icon{
  margin-top: auto;
  margin-bottom: auto;
  margin-left: -5%;
  
  .fold{
    width: 100px;
  }
}

.el-breadcrumb{
  margin-left: 10px;
  display: flex;
  flex-direction: column;

  span{
    margin: auto;
    font-size: 15px;
  }
}

</style>
