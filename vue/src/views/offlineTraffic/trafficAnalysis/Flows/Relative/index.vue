<template>
    <div ref="chart" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import offlineChartStore from '@/store/modules/offline-chart';

let useChart = offlineChartStore();

const chart = ref(null);

const initChart = async () => {
    if (chart.value) {
        const myChart = echarts.init(chart.value);

        await useChart.alertTable();
        let coordinatesAttackData = useChart.attack;

        // 过滤掉 label 为 "Benign" 的数据
        coordinatesAttackData = coordinatesAttackData.filter((item: any) => item.label !== "Benign");

        // 处理关系图数据
        const processGraphData = (data: any) => {
            const nodesMap = new Map();
            const links: any = [];
            const linkSet = new Set(); // 记录已添加的连接

            data.forEach((item: any) => {
                const sourceIP = item.sourceIP;
                const targetIP = item.destinationIP;

                // 统计每个节点的度（连接数）
                nodesMap.set(sourceIP, (nodesMap.get(sourceIP) || 0) + 1);
                nodesMap.set(targetIP, (nodesMap.get(targetIP) || 0) + 1);

                const linkKey = `${sourceIP}-${targetIP}`;
                if (!linkSet.has(linkKey)) {
                    links.push({
                        source: sourceIP,
                        target: targetIP
                    });
                    linkSet.add(linkKey);
                }
            });

            // 转换节点数据格式
            const nodes = Array.from(nodesMap.entries()).map(([name, degree]) => ({
                name,
                value: Math.min(degree, 100) // 限制节点大小最大值为100
            }));

            return { nodes, links };
        };

        const graphData = processGraphData(coordinatesAttackData);

        const option = {
            title: {
                text: 'IP Pair Attack Relationship Graph',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove'
            },
            series: [
                {
                    type: 'graph',
                    layout: 'force',
                    force: {
                        repulsion: 5000 // 调整节点之间的斥力，使得线更长
                    },
                    roam: true,
                    data: graphData.nodes,
                    links: graphData.links,
                    emphasis: {
                        focus: 'adjacency'
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{b}'
                    },
                    lineStyle: {
                        width: 2,
                        curveness: 0
                    },
                    itemStyle: {
                        color: () => { // 节点颜色随机生成
                            return '#' + Math.floor(Math.random() * 16777215).toString(16);
                        }
                    },
                    symbolSize: (value: number) => {
                        return Math.max(Math.sqrt(value) * 15, 20); // 调整节点大小
                    }
                }
            ]
        };

        myChart.setOption(option);
    }
};

onMounted(() => {
    initChart();
});
</script>

<style scoped>
.chart {
    width: 100%;
    height: 100%;
}
</style>
