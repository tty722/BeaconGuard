<template>
    <div ref="chart" style="width: 100%; height: 100%;"></div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import * as echarts from 'echarts';
  import worldMapData from '@/assets/world.json';
import offlineChartStore from '@/store/modules/offline-chart';
  let useChart = offlineChartStore();
  
  const chart = ref<HTMLDivElement | null>(null);
  let myChart: echarts.ECharts | null = null;
  
  const initChart = async () => {
    if (chart.value) {
      myChart = echarts.init(chart.value);
      echarts.registerMap('world', worldMapData as any);
  
      await useChart.chartMap();
      const coordinatesData = useChart.coordinates;
  
      const convertData = (data: any[]) => {
        const res = [];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          const fromCoord = [parseFloat(item.sourceLongitude), parseFloat(item.sourceLatitude)];
          const toCoord = [parseFloat(item.destinationLongitude), parseFloat(item.destinationLatitude)];
          if (fromCoord[0] && fromCoord[1] && toCoord[0] && toCoord[1]) {
            res.push({
              fromName: item.sourceIP,
              toName: item.destinationIP,
              coords: [fromCoord, toCoord],
              sourceIP: item.sourceIP,
              destinationIP: item.destinationIP,
              protocol: item.protocol,
              sourcePort: item.sourcePort,
              destinationPort: item.destinationPort,
              time: item.time
            });
          }
        }
        return res;
      };
  
      const option: echarts.EChartsOption = {
        backgroundColor: '#ffffff',
        title: {
          text: 'Attack Traffic Map',
          left: 'center',
          textStyle: {
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            if (params.data && params.data.sourceIP) {
              return `<strong>Time:</strong> ${params.data.time}<br>
                      <strong>Protocol:</strong> ${params.data.protocol}<br>
                      <strong>Source:</strong> ${params.data.sourceIP}:${params.data.sourcePort}<br>
                      <strong>Destination:</strong> ${params.data.destinationIP}:${params.data.destinationPort}`;
            }
            return '';
          }
        },
        geo: {
          map: 'world',
          roam: true,
          label: {
            show: false
          },
          itemStyle: {
            areaColor: '#e0e0e0',
            borderColor: '#111',
          }
        },
        series: [
          {
            name: 'Normal Traffic',
            type: 'lines',
            coordinateSystem: 'geo',
            zlevel: 2,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.7,
              symbolSize: 6,
              symbol: 'arrow',
              color: 'red'
            },
            lineStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#58B3CC' },
                { offset: 1, color: '#F58158' }
              ]),
              width: 1,
              curveness: 0.2
            },
            data: convertData(coordinatesData)
          },
          {
            name: 'Points',
            type: 'scatter',
            coordinateSystem: 'geo',
            zlevel: 2,
            symbol: 'pin',
            symbolSize: 10,
            itemStyle: {
              color: '#FF6A00'
            },
            data: coordinatesData.flatMap(item => [
              { name: item.sourceIP, value: [parseFloat(item.sourceLongitude), parseFloat(item.sourceLatitude)] },
              { name: item.destinationIP, value: [parseFloat(item.destinationLongitude), parseFloat(item.destinationLatitude)] }
            ])
          }
        ]
      };
  
      myChart.setOption(option);
  
      window.addEventListener('resize', resizeChart);
    }
  };
  
  const resizeChart = () => {
    if (myChart) {
      myChart.resize();
    }
  };
  
  onMounted(() => {
    initChart();
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart);
  });
  </script>
  
  <style scoped>
  .chart {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  </style>
  