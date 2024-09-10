<template>
    <div class="container">
      <transition name="fade-upload">
        <div v-show="offlineStore.toExitAnalysis == true" class="uploadFile" style="margin-top: 100px">
          <p>请上传你的pcap/pcapng/cap文件</p>
          <el-upload ref="upload" class="upload-demo" drag
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" multiple :auto-upload="false"
            accept=".pcap,.pcapng,.cap">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处上传或<em style="font-weight: 700; color:black">点击选择文件</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                上传的文件应为 pcap/pcapng/cap 格式，且大小不超过 50MB
              </div>
            </template>
          </el-upload>
          <el-button class="ml-3" @click="handleUpload" type="primary">上传文件</el-button>
        </div>
      </transition>
      <transition name="fade">
        <div v-if="offlineStore.toExitAnalysis == false" class="analysis">
          <Restore></Restore>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import type { UploadInstance } from "element-plus";
  import Restore from './restore/index.vue'
import useOfflineStore from "@/store/modules/offline";
  
  const upload = ref<UploadInstance>();
  const showProgress = ref(false);
  let offlineStore=useOfflineStore()
  
  const handleUpload = () => {
    showProgress.value = true;
  
    // 模拟上传完成后跳转路由
    setTimeout(() => {
      // 替换 'path-to-redirect' 为你想要跳转的路径
      offlineStore.toExitAnalysis = false;
    }, 3000); // 3 秒后跳转
  }; // 模拟上传进度

  </script>
  
  <style scoped lang="scss">
  .container {
    width: 100%;
    display: flex;
  }
  
  p {
    margin-top: 20px;
    margin-left: 30px;
    margin-bottom: 20px;
    font-family: "ali";
  }
  
  .uploadFile {
    width: 50%;
    display: flex;
    float: left;
    flex-direction: column;
    margin-left: auto;
    margin-right: auto;
  
  
    .ml-3 {
      margin-left: auto;
      margin-right: auto;
      margin-top: 30px;
      width: 150px;
      height: 40px;
    }
  
    .el-upload__text {
      width: 225px;
      margin-left: auto;
      margin-right: auto;
      display: flex;
      flex-direction: row;
    }
  }
  
  .el-button {
    border: none;
    margin-left: 20px;
    margin-right: 20px;
    background-color: transparent;
    border: 2px solid rgb(63, 63, 63);
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 600;
    color: rgb(186, 186, 186);
    transition: all 0.3s;
  }
  
  .el-button:hover {
    color: rgb(47, 47, 47);
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.7);
  }
  
  .el-button:active {
    box-shadow: 0px 0px 7px rgba(0, 0, 0, 0.7);
  }
  
  .analysis {
    width: 100%;
    height: 90vh;
  }
  </style>
  
  <!-- 动画效果（一个出一个进） -->
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
  </style>
  