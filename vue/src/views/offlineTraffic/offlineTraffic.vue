<template>
  <div class="container">
    <transition name="fade-upload">
      <div v-show="offlineStore.toExitAnalysis == true" class="uploadFile" style="margin-top: 100px">
        <p>请上传你的 pcap/pcapng/cap 文件</p>
        <el-upload
          ref="upload"
          class="upload-demo"
          drag
          :auto-upload="false"
          accept=".pcap,.pcapng,.cap"
          :on-change="handleFileChange"
          :before-upload="beforeUpload"
          :on-exceed="handleExceed"
          :on-progress="handleProgress"
          action="http://127.0.0.1:3000/api/offline/pcapRestore"
          @success="handleSuccess"
          @error="handleError"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处上传或
            <em style="font-weight: 700; color:black">点击选择文件</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">上传的文件应为 pcap/pcapng/cap 格式，且大小不超过 200MB</div>
          </template>
        </el-upload>
        <el-button class="ml-3" @click="handleUpload" type="primary">上传文件</el-button>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="offlineStore.toExitAnalysis == false" class="analysis">
        <TrafficAnalysis></TrafficAnalysis>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { UploadInstance, UploadFile, UploadProgressEvent } from 'element-plus';
import TrafficAnalysis from './trafficAnalysis/index.vue';
import useOfflineStore from '@/store/modules/offline';

const upload = ref<UploadInstance>();
const uploadFile = ref<UploadFile | null>(null); // 保存当前文件
const uploadPercentage = ref(0);
const showProgress = ref(false);
let offlineStore = useOfflineStore();

const handleFileChange = (file: UploadFile) => {
  uploadFile.value = file; // 保存文件
};

const beforeUpload = (file: UploadFile) => {
  if (file?.size && file.size > 200 * 1024 * 1024) {
    alert('文件大小不能超过 200MB');
    return false;
  }
  return true;
};

const handleExceed = () => {
  alert('只能上传一个文件');
};

const handleProgress = (event: UploadProgressEvent) => {
  if (event.percent) {
    uploadPercentage.value = Math.floor(event.percent); // 更新进度条
  }
};

const handleUpload = () => {
  if (!uploadFile.value) {
    alert('请选择一个文件');
    return;
  }

  showProgress.value = true;

  // 使用 submit 方法手动上传文件
  upload.value?.submit();
};

const handleSuccess = () => {
  showProgress.value = false;
  uploadPercentage.value = 100;
  offlineStore.toExitAnalysis = false;
};

const handleError = () => {
  showProgress.value = false;
  uploadPercentage.value = 0;
  alert('上传失败，请重试');
};
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

<style scoped lang="scss">
.fade-enter-active {
  transition: all 0.4s;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
