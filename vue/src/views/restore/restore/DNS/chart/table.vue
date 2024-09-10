<template>
  <div class="table-container">
    <section
      id="main"
      ref="mainSection"
      @scroll="handleScroll"
      v-loading="loadingMore"
    >
      <el-table
        :data="visibleData"
        :row-style="tableRowStyle"
        style="width: 100%"
        highlight-current-row
        @row-click="handleRowClick"
      >
        <el-table-column prop="number" label="Number" width="200"></el-table-column>
        <el-table-column prop="sourceIP" label="Source IP"></el-table-column>
        <el-table-column
          prop="destinationIP"
          label="Destination IP"
        ></el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import "element-plus/dist/index.css";
import useRestoreStore from "@/store/modules/restore";

interface DataItem {
  number: number;
  sourceIP: string;
  sourcePort: number;
  destinationIP: string;
  destinationPort: number;
}

const restoreStore = useRestoreStore();
const formattedData = ref<DataItem[]>([]);
const loading = ref<boolean>(true);
const loadingMore = ref<boolean>(false);
const selectedRow = ref<DataItem | null>(null);

const mainSection = ref<HTMLElement | null>(null);
const visibleData = ref<DataItem[]>([]);

onMounted(async () => {
  try {
    await restoreStore.DNSMessageData();
    await loadData();
    loadMoreData(); // 初始化时加载第一批数据
  } finally {
    loading.value = false;
  }
});

const loadData = async () => {
  formattedData.value = await new Promise<DataItem[]>((resolve) => {
    setTimeout(() => {
      resolve(
        restoreStore.DNS_message.map((item: DataItem) => ({
          ...item,
        }))
      );
    }, 50);
  });
};

const loadMoreData = async () => {
  if (loadingMore.value) return;
  loadingMore.value = true;

  await new Promise<void>((resolve) => {
    setTimeout(() => {
      const startIndex = visibleData.value.length;
      const newData = formattedData.value.slice(startIndex, startIndex + 20); // 每次加载20条数据
      visibleData.value = [...visibleData.value, ...newData];
      resolve();
    }, 1000); // 延迟1秒加载
  });

  loadingMore.value = false;
};

const handleScroll = () => {
  const mainElement = mainSection.value;
  if (mainElement) {
    const { scrollTop, clientHeight, scrollHeight } = mainElement;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      loadMoreData();
    }
  }
};

const tableRowStyle = () => {
  const baseStyle = {
    fontFamily: "Arial, sans-serif",
    fontSize: "13px",
    fontWeight: "600",
  };

  return { ...baseStyle, background: "#99D9EA" };
};

const handleRowClick = (row: DataItem) => {
  selectedRow.value = row;
};
</script>

<style scoped lang="scss">
.table-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: row;

  section#main {
    width: 190%;
    height: 100%;
    overflow: auto;
    border-radius: 5px;
    border: 2px solid rgb(207, 207, 207);
  }
}
</style>
