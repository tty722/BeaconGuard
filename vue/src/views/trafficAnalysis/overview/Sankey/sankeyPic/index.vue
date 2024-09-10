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

    const data = useChart.data;

    // 处理Sankey图数据
    const processSankeyData = (data: any) => {
      const linksMap = new Map();

      data.forEach((item: any) => {
        const forwardKey = `${item.sourceIP}-${item.destinationIP}`;
        const reverseKey = `${item.destinationIP}-${item.sourceIP}`;

        if (linksMap.has(forwardKey)) {
          linksMap.set(forwardKey, linksMap.get(forwardKey) + 1);
        } else if (linksMap.has(reverseKey)) {
          linksMap.set(reverseKey, linksMap.get(reverseKey) + 1);
        } else {
          linksMap.set(forwardKey, 1);
        }
      });

      // 获取前十名的IP对
      const sortedLinks = Array.from(linksMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 9);

      const links = sortedLinks.map(([key, value]) => {
        const [source, target] = key.split('-');
        return { source, target, value };
      });

      const nodes = new Set();
      links.forEach(link => {
        nodes.add(link.source);
        nodes.add(link.target);
      });

      return {
        nodes: Array.from(nodes).map(name => ({ name })),
        links
      };
    };

    const sankeyData = processSankeyData(data);

    const option = {
      title: {
        text: 'Top 10 IP Pair Sankey Diagram',
        left: 'center',
        textStyle: {
          color: '#333',
          fontWeight: 'bold',
          fontSize: 16
        }
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [
        {
          type: 'sankey',
          layout: 'none',
          data: sankeyData.nodes,
          links: sankeyData.links,
          emphasis: {
            focus: 'adjacency'
          },
          levels: [
            {
              depth: 0,
              itemStyle: {
                color: '#76c7c0'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            },
            {
              depth: 1,
              itemStyle: {
                color: '#f18973'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            },
            {
              depth: 2,
              itemStyle: {
                color: '#a3e1d4'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            },
            {
              depth: 3,
              itemStyle: {
                color: '#ffdb5c'
              },
              lineStyle: {
                color: 'source',
                opacity: 0.6
              }
            }
          ],
          lineStyle: {
            curveness: 0.5,
            color: 'gradient',
            opacity: 0.7
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: '#333'
          },
          label: {
            color: '#333',
            fontWeight: 'bold',
            fontSize: 12
          },
          nodeWidth: 36,
          nodeGap: 16
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
  margin: 20px 0;
}
</style>
