<template>
  <div class="online-container">
    <section id="top">
      <div class="btn">
        <el-button v-if="status == 'out'" @click="startHandler" class="start"
          >Start</el-button
        >
        <el-button v-if="status == 'in'" @click="pauseHanlder" class="pause"
          >Pause</el-button
        >
        <el-button v-if="status == 'pause'" @click="goOnHandler" class="goon"
          >Go on</el-button
        >
        <el-button
          v-if="status == 'in' || status == 'pause'"
          @click="restartHandler"
          class="restart"
          >Restart</el-button
        >
      </div>
      <div class="time">
        <Time></Time>
      </div>
    </section>
    <section id="bottom">
      <div class="circle1">
        <Circle1></Circle1>
      </div>
      <div class="circle2">
        <Circle2></Circle2>
      </div>
      <div class="circle3">
        <Circle3></Circle3>
      </div>
      <div class="circle4">
        <Circle4></Circle4>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Circle1 from "./chart/circle1.vue";
import Circle2 from "./chart/circle2.vue";
import Circle3 from "./chart/circle3.vue";
import Circle4 from "./chart/circle4.vue";
import Time from "./chart/time.vue";
import getOnlineTrafficStore from "@/store/modules/online";

let status = ref<"out" | "in" | "pause">("out");
let onlineStore = getOnlineTrafficStore();

const startHandler = () => {
  status.value = "in";
  onlineStore.startSniff();
};

const restartHandler = () => {
  if (status.value == "in") {
    onlineStore.stopSniff();
  }
  status.value = "out";
  onlineStore.trafficData = [];
};

const pauseHanlder = () => {
  status.value = "pause";
  onlineStore.stopSniff();
};

const goOnHandler = () => {
  status.value = "in";
  onlineStore.startSniff();
};
</script>

<style scoped lang="scss">
.online-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  section#top {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: row;

    .btn {
      width: 40%;
      height: 100%;
      display: flex;
      flex-direction: row;
      padding: 100px;
      justify-content: space-between;

      .el-button {
        width: 100px;
        height: 35px;
        margin: auto;
        border: 2px solid rgb(117, 117, 117);
        font-family: Arial, Helvetica, sans-serif;
        font-size: 15px;
        font-weight: 600;
        transition: all 0.3s;
      }

      .el-button {
        color: black;
      }

      .start:hover {
        background-color: rgb(196, 255, 185);
      }

      .pause:hover {
        background-color: rgb(255, 176, 142);
      }

      .goon:hover {
        background-color: rgb(150, 211, 255);
      }

      .restart:hover {
        background-color: rgb(255, 231, 142);
      }
    }

    .time {
      width: 60%;
      height: 100%;
    }
  }

  section#bottom {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: row;

    .circle1 {
      width: 25%;
      height: 100%;
    }
    .circle2 {
      width: 25%;
      height: 100%;
    }
    .circle3 {
      width: 25%;
      height: 100%;
    }
    .circle4 {
      width: 25%;
      height: 100%;
    }
  }
}
</style>
