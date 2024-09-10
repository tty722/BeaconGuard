<template>
  <div class="pagination-container">
    <el-pagination
      @current-change="handlePageChange"
      :current-page="currentPage"
      :page-size="1"
      :total="totalMessages"
      layout="prev, pager, next">
    </el-pagination>

    <div class="http-message-container">
      <div class="http-message">
        <pre>{{ formattedMessage }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import useRestoreStore from '@/store/modules/restore';

// 使用 store
const store = useRestoreStore();

const currentPage = ref(1);
const totalMessages = computed(() => store.HTTP_message.length);

const formattedMessage = computed(() => {
  const message = store.HTTP_message[currentPage.value - 1];
  if (message) {
    return `\n${message.head}`;
  }
  return '';
});

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 在组件挂载时加载数据
onMounted(async () => {
  await store.HTTPMessageData();
});
</script>

<style scoped>
.pagination-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.http-message-container {
  width: 100%;
  height: 400px; /* 设置固定高度 */
  overflow: auto; /* 允许滚动 */
  margin-top: 20px;
  background: #f7f7f7;
  border-radius: 5px;
}

.http-message {
  padding: 20px;
  white-space: pre-wrap; /* 保持 HTTP 消息的格式 */
  font-family: monospace;
  font-size: 14px;
  font-weight: 400;
  font-weight: 600;
}
</style>
