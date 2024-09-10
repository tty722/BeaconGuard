<template>
    <div class="table-container">
        <section id="main" ref="mainSection" @scroll="handleScroll" v-loading="loadingMore">
            <el-table :data="visibleData" :row-style="tableRowStyle" style="width: 100%;" highlight-current-row
                @row-click="handleRowClick">
                <el-table-column prop="time" label="Time" width="200"></el-table-column>
                <el-table-column prop="sourceIP" label="Source IP"></el-table-column>
                <el-table-column prop="destinationIP" label="Destination IP"></el-table-column>
                <el-table-column prop="label" label="Attack Type"></el-table-column>
            </el-table>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import 'element-plus/dist/index.css';
import { formatDateByYYMMDDHHMMSS } from '@/utils/formatDate';
import offlineChartStore from '@/store/modules/offline-chart';

const chartStore = offlineChartStore();

interface DataItem {
    time: string;
    protocol: string;
    sourceIP: string;
    sourcePort: number;
    destinationIP: string;
    destinationPort: number;
    label: string
}

const formattedData = ref<DataItem[]>([]);
const loading = ref<boolean>(true);
const loadingMore = ref<boolean>(false);
const selectedRow = ref<DataItem | null>(null);

const mainSection = ref<HTMLElement | null>(null);
const visibleData = ref<DataItem[]>([]);

onMounted(async () => {
    try {
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
                chartStore.attack.map((item: DataItem) => ({
                    ...item,
                    time: formatDateByYYMMDDHHMMSS(item.time)
                }))
            );
        }, 50);
    });
};

const loadMoreData = async () => {
    if (loadingMore.value) return;
    loadingMore.value = true;

    await new Promise<void>((resolve) => {
        const startIndex = visibleData.value.length;
        const newData = formattedData.value.slice(startIndex, startIndex + 17); // 每次加载20条数据
        visibleData.value = [...visibleData.value, ...newData];
        resolve();
    });

    loadingMore.value = false;
};

const handleScroll = () => {
    const mainElement = mainSection.value;
    if (mainElement) {
        const { scrollTop, clientHeight, scrollHeight } = mainElement;
        if (scrollTop + clientHeight >= scrollHeight - 15) {
            loadMoreData();
        }
    }
};

const tableRowStyle = ({ row }: { row: DataItem }) => {
    const baseStyle = {
        fontFamily: 'Arial, sans-serif',
        fontSize: '13px',
        fontWeight: '600'
    };

    switch (row.label) {
        case 'Bot':
            return { ...baseStyle, background: '#63ff63' };
        case 'DoS':
            return { ...baseStyle, background: '#B0B5D9' };
        case 'PortScan':
            return { ...baseStyle, background: '#c1ffdf' };
        case 'DDoS':
            return { ...baseStyle, background: '#ffc3be' };
        case 'BruteForce':
            return { ...baseStyle, background: '#C4B7D7' };
        case 'Heartbleed':
            return { ...baseStyle, background: '#FCE0FF' };
        case 'icmInfiltrationp':
            return { ...baseStyle, background: '#ffcccc' };
        case 'WebAttack':
            return { ...baseStyle, background: '#eeb3ff' };
        default:
            return baseStyle;
    }
};

const handleRowClick = (row: DataItem) => {
    selectedRow.value = row;
};
</script>

<style scoped lang="scss">
.table-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    section#main {
        width: 100%;
        height: 100%;
        overflow: auto;
        /* 防止内部滚动内容撑开容器 */
        display: flex;
        flex-direction: column;
        border-radius: 5px;
        border: 2px solid rgb(207, 207, 207);


    }
}
</style>

<!-- 切换动画 -->
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