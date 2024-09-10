<template>
  <div class="download-container">
    <div class="icon">
      <img src="../../../../../../icon/pcap.png" alt="PCAP Icon">
    </div>
    <div class="file-info">
      <a class="file-name" :href="fileUrl" target="_blank">{{ restoreStore.uploadedFile.filename }}.{{ restoreStore.uploadedFile.contentType }}</a>
      <p class="file-length">{{ restoreStore.uploadedFile.length }} Bytes</p>
    </div>
    <div class="file-download">
      <a :href="fileUrl" download>
        <Download style="width: 1.5em; height: 1.5em;" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import useRestoreStore from '@/store/modules/restore';
import { Download } from "@element-plus/icons-vue";

const restoreStore = useRestoreStore();
const fileUrl = ref('');

onMounted(() => {
  
  fileUrl.value = new URL('@/assets/test.cap', import.meta.url).href;
});
</script>

<style scoped lang="scss">
.download-container {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 16px;

  .icon {
    display: flex;
    align-items: center;

    img {
      height: 40px;
    }
  }

  .file-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;

    .file-name {
      color: #000;
      text-decoration: none;
      font-weight: bold;
      margin-bottom: 4px;

      &:hover {
        text-decoration: underline;
      }
    }

    .file-length {
      margin: 0;
    }
  }

  .file-download {
    display: flex;
    align-items: center;

    a {
      display: flex;
      align-items: center;
      color: #000;
      margin-right: auto
    }
  }
}
</style>
