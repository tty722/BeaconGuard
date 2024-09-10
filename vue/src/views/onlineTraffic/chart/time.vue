<template>
  <div class="time_traffic" ref="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import getOnlineTrafficStore from "@/store/modules/online";

const chart = ref<HTMLDivElement | null>(null);
const chartInstance = ref<echarts.ECharts | null>(null);
let intervalId: number | undefined;

// 处理后端数据
const processBackendData = (
  data: { time: string; protocol: string }[],
  numPeriods: number
) => {
  const startTime = new Date(data[0].time).getTime();
  const endTime = new Date(data[data.length - 1].time).getTime();

  const interval = (endTime - startTime) / numPeriods;

  const timePeriods = Array.from({ length: numPeriods }, (_, i) => {
    const start = new Date(startTime + i * interval);
    const end = new Date(startTime + (i + 1) * interval);
    return { start, end };
  });

  const protocolCounts: any = Array.from({ length: numPeriods }, () => {
    return { TCP: 0, HTTP: 0, UDP: 0, MDNS: 0, OTHER: 0 };
  });

  data.forEach((item) => {
    const time = new Date(item.time).getTime();
    const periodIndex = timePeriods.findIndex(
      (period) => time >= period.start.getTime() && time < period.end.getTime()
    );
    if (periodIndex !== -1) {
      protocolCounts[periodIndex][item.protocol]++;
    }
  });

  return { timePeriods, protocolCounts };
};

// 初始化图表
const initChart = () => {
  if (chart.value instanceof HTMLDivElement) {
    chartInstance.value = echarts.init(chart.value);
    chartInstance.value.setOption({
      title: {
        text: "Network Traffic",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        top: "5%",
        data: ["TCP", "HTTP", "UDP", "MDNS", "OTHER"],
      },
      xAxis: {
        type: "category",
      },
      yAxis: {
        type: "value",
      },
      color: ['#fe8c8c', '#77ea77', '#828ee7', '#47cff5', 'rgb(255, 191, 0)'],
      series: [
        {
          name: "TCP",
          type: "line",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#fe8c8c",
              },
              {
                offset: 1,
                color: "#ffcccc",
              },
            ]),
          },
        },
        {
          name: "HTTP",
          type: "line",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#77ea77",
              },
              {
                offset: 1,
                color: "#ccffcc",
              },
            ]),
          },
        },
        {
          name: "UDP",
          type: "line",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#828ee7",
              },
              {
                offset: 1,
                color: "#d0d3ea",
              },
            ]),
          },
        },
        {
          name: "MDNS",
          type: "line",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "#47cff5",
              },
              {
                offset: 1,
                color: "#a9ecff",
              },
            ]),
          },
        },
        {
          name: "OTHER",
          type: "line",
          stack: "total",
          emphasis: {
            focus: "series",
          },
          smooth: true,
          lineStyle: {
            width: 0,
          },
          showSymbol: false,
          label: {
            show: true,
            position: "top",
          },
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: "rgb(255, 191, 0)",
              },
              {
                offset: 1,
                color: "rgb(224, 62, 76)",
              },
            ]),
          },
        },
      ],
    });
  } else {
    console.error("chart.value is not an instance of HTMLDivElement");
  }
};

// 更新图表数据
const updateChartData = (data: { time: string; protocol: string }[]) => {
  const { timePeriods, protocolCounts } = processBackendData(data, 20); // 将时间段平均分成 20 份

  const series = [
    {
      name: "TCP",
      type: "line",
      stack: "total",
      data: protocolCounts.map((count: any) => count["TCP"] || 0),
    },
    {
      name: "HTTP",
      type: "line",
      stack: "total",
      data: protocolCounts.map((count: any) => count["HTTP"] || 0),
    },
    {
      name: "UDP",
      type: "line",
      stack: "total",
      data: protocolCounts.map((count: any) => count["UDP"] || 0),
    },
    {
      name: "MDNS",
      type: "line",
      stack: "total",
      data: protocolCounts.map((count: any) => count["MDNS"] || 0),
    },
    {
      name: "OTHER",
      type: "line",
      stack: "total",
      data: protocolCounts.map((count: any) => count["OTHER"] || 0),
    },
  ];

  chartInstance.value!.setOption({
    xAxis: {
      data: timePeriods.map((period) =>
        period.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      ),
    },
    series: series,
  });
};

// 定时批量处理
onMounted(() => {
  let onlineStore = getOnlineTrafficStore();

  initChart();

  intervalId = window.setInterval(() => {
    let data = onlineStore.trafficData;
    if (data.length > 0) {
      updateChartData(data.slice());
    }
  }, 2000);

  window.addEventListener(
    "resize",
    chartInstance.value!.resize as EventListener
  );
});

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (chartInstance.value) {
    window.removeEventListener(
      "resize",
      chartInstance.value.resize as EventListener
    );
    chartInstance.value.dispose();
  }
});
</script>

<style scoped>
.time_traffic {
  width: 100%;
  height: 100%;
}
</style>
