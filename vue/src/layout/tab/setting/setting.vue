<template>
  <div class="setting-container">
    <section id="refresh">
      <el-tooltip class="box-item" effect="dark" content="刷新" placement="bottom">
        <el-button icon="Refresh" @click="updateHandler"></el-button>
      </el-tooltip>
    </section>
    <section id="fullScreen">
      <el-tooltip class="box-item" effect="dark" content="全屏" placement="bottom">
        <el-button icon="FullScreen" @click="fullScreenHandler"></el-button>
      </el-tooltip>

    </section>
    <section id="avator">
      <!-- <el-tooltip class="box-item" effect="dark" content="个人主页" placement="bottom"> -->
        <img src="../../../../kun.png" @click="drawer = true" class="avator" />
        <el-drawer size="25%" v-model="drawer" append-to-body="true" direction="rtl" style="border-radius: 2%"
          class="right_drawer" destroy-on-close="true">
          <template #title>
            <p style="
          font-family: Arial, Helvetica, sans-serif;
          font-weight: 600;
          font-size: 25px;
          display: flex;
          align-items: center;
        ">
              Hi,{{ userStore.username }}
            </p>
          </template>
          <Drawer></Drawer>
        </el-drawer>
      <!-- </el-tooltip> -->
      <span>{{ userStore.username }}</span>
    </section>
  </div>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting';
import useUserStore from '@/store/modules/user';
import { ref } from 'vue';
import Drawer from "./drawer/index.vue"

let userStore = useUserStore();
let useSettingStore = useLayoutSettingStore();

let drawer = ref(false);


//刷新按钮回调
const updateHandler = () => {
  useSettingStore.refresh = !useSettingStore.refresh;
}

//全屏按钮回调
const fullScreenHandler = () => {
  //DOM对象的一个属性:可以用来判断当前是不是全屏模式[全屏:true,不是全屏:false]
  let full = document.fullscreenElement;
  //切换为全屏模式
  if (!full) {
    //文档根节点的方法requestFullscreen,实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    //变为不是全屏模式->退出全屏模式
    document.exitFullscreen();
  }
}



</script>

<style scoped lang="scss">
.setting-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;

  section#refresh {
    margin-left: 73%;
    width: 5%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-button {
      margin: auto;
      width: 60%;
      aspect-ratio: 1 / 1;
      /* 宽高比设置为1:1 */
    }
  }

  section#fullScreen {
    width: 5%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-button {
      margin: auto;
      width: 60%;
      aspect-ratio: 1 / 1;
      /* 宽高比设置为1:1 */
    }
  }

  section#avator {
    width: 5%;
    height: 100%;
    display: flex;
    flex-direction: row;
    margin-left: 2%;

    img {
      margin: auto;
      width: 50px;
      border-radius: 50%;
      border: 2px solid rgb(77, 77, 77);
    }

    span {
      margin: auto;
      margin-left: 30%;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 20px;
      font-weight: 700;
    }
  }
}
</style>