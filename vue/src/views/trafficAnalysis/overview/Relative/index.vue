<template>
  <div ref="chart" class="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import useChartStore from '@/store/modules/chart';

let useChart = useChartStore();

const chart = ref(null);

const initChart = async () => {
  if (chart.value) {
    const myChart = echarts.init(chart.value);

    await useChart.chartFlowTime();
    const coordinatesData = useChart.data;

    // 处理关系图数据
    const processGraphData = (data: any) => {
      const nodesMap = new Map();
      const links: any = [];
      const linkSet = new Set(); // 记录已添加的连接

      data.forEach((item: any) => {
        const sourceIP = item.sourceIP;
        const targetIP = item.destinationIP;
        const value = item.value; // 假设 'value' 是每个连接的唯一标识符

        // 对 IP 进行排序以保持连接方向的一致性
        const sortedIPs = [sourceIP, targetIP].sort();

        const linkKey = `${sortedIPs[0]}-${sortedIPs[1]}`;
        const reversedLinkKey = `${sortedIPs[1]}-${sortedIPs[0]}`;

        if (!linkSet.has(linkKey) && !linkSet.has(reversedLinkKey)) {
          // 统计每个节点的度（连接数）
          nodesMap.set(sourceIP, (nodesMap.get(sourceIP) || 0) + 1);
          nodesMap.set(targetIP, (nodesMap.get(targetIP) || 0) + 1);

          links.push({
            source: sourceIP,
            target: targetIP,
            value: value, // 包括 value 或其他需要的属性
            lineStyle: {
              width: 2,
              color: 'gray',
              emphasis: {
                focus: 'adjacency'
              }
            }
          });

          // 添加连接键值对
          linkSet.add(linkKey);
        } else {
          // 仅增加节点度，不添加重复连接
          nodesMap.set(sourceIP, (nodesMap.get(sourceIP) || 0) + 1);
          nodesMap.set(targetIP, (nodesMap.get(targetIP) || 0) + 1);
        }
      });

      // 将节点映射转换为数组格式
      const nodes = Array.from(nodesMap.entries()).map(([name, degree]) => ({
        name,
        value: Math.min(degree, 50) // 根据需要调整节点大小限制
      }));

      return { nodes, links };
    };

    const graphData = processGraphData(coordinatesData);

    const option = {
      title: {
        text: 'IP Pair Relationship Graph',
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
            repulsion: 1500 // 调整节点之间的斥力，使得线更长
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
            curveness: 0.2 // 设置曲率为0，使用直线
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
