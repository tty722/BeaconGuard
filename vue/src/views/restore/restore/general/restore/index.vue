<template>
  <div class="restored-files-container">
    <div v-for="file in restoreStore.restoredFiles" :key="file.fileId" class="download-container">
      <div class="icon">
        <img :src="getIconUrl(file.contentType)">
      </div>
      <div class="file-info">
        <a class="file-name" :href="getViewUrl(file.filename, file.contentType)" target="_blank">
          {{ file.filename }}.{{ file.contentType }}
        </a>
        <p class="file-length">{{ file.length }} Bytes</p>
      </div>
      <div class="file-download">
        <a :href="getDownloadUrl(file.filename, file.contentType)" download>
          <Download style="width: 1.5em; height: 1.5em;" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import useRestoreStore from '@/store/modules/restore';
import { Download } from "@element-plus/icons-vue";

const restoreStore = useRestoreStore();

const getViewUrl = (filename: string, contentType: string) => {
  console.log( new URL('@/assets/test.cap', import.meta.url).href,new URL(`${import.meta.env.BASE_URL}/localhost:5173/src/assets/${filename}.${contentType}`, import.meta.url).href);

  // 文件内容展示 URL
  return new URL(`${import.meta.env.BASE_URL}/localhost:5173/src/assets/${filename}.${contentType}`, import.meta.url).href;
};

const getDownloadUrl = (filename: string, contentType: string) => {
  // 文件下载 URL
  return new URL(`${import.meta.env.BASE_URL}/localhost:5173/src/assets/${filename}.${contentType}`, import.meta.url).href;
};

const getIconUrl = (contentType: string) => {
  if (contentType === "png" || contentType === "jpg" || contentType === "jpeg")
    return '../../../../../icon/picture.png';
  return `../../../../../icon/${contentType}.png`;
};

onMounted(async () => {
  try {
    await restoreStore.restoreAttributesGetData();
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped lang="scss">
.restored-files-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.download-container {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;

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
      margin-bottom: 2px;

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
    }
  }
}
</style>
