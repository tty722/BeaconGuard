<template>
  <div class="time_traffic" ref="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import offlineChartStore from "@/store/modules/offline-chart";

const chart = ref<HTMLDivElement | null>(null);
const chartInstance = ref<echarts.ECharts | null>(null);

// 处理后端数据
const processBackendData = (
  data: { time: string; label: string }[],
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

  const labelCounts: any = Array.from({ length: numPeriods }, () => {
    return {
      Bot: 0, DDoS: 0, DoS: 0, BruteForce: 0, Heartbleed: 0, Infiltration: 0, PortScan: 0, WebAttack: 0
    };
  });

  data.forEach((item) => {
    const time = new Date(item.time).getTime();
    const periodIndex = timePeriods.findIndex(
      (period) => time >= period.start.getTime() && time < period.end.getTime()
    );
    if (periodIndex !== -1) {
      labelCounts[periodIndex][item.label]++;
    }
  });

  return { timePeriods, labelCounts };
};

// 更新图表
const updateChart = (
  data: { time: string; label: string }[],
  numPeriods: number
) => {
  const { timePeriods, labelCounts } = processBackendData(data, numPeriods);

  const series = [
    {
      name: "Bot",
      type: "line",
      stack: "total",
      data: labelCounts.map((count: any) => count["Bot"] || 0),
      label: { formatter: "{a}" },
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
            color: "#63ff63",
          },
          {
            offset: 1,
            color: "#63ff63",
          },
        ]),
      },
    },
    {
      name: "DoS",
      type: "line",
      stack: "total",
      data: labelCounts.map((count: any) => count["DoS"] || 0),
      label: { formatter: "{a}" },
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
            color: "#7f8eff",
          },
          {
            offset: 1,
            color: "#B0B5D9",
          },
        ]),
      },
    },
    {
      name: "PortScan",
      type: "line",
      stack: "total",
      data: labelCounts.map((count: any) => count["PortScan"] || 0),
      label: { formatter: "{a}" },
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
            color: "#39ff99",
          },
          {
            offset: 1,
            color: "#c1ffdf",
          },
        ]),
      },
    },
    {
      name: "DDoS",
      type: "line",
      stack: "total",
      data: labelCounts.map((count: any) => count["DDoS"] || 0),
      label: { formatter: "{a}" },
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
            color: "#ff5e4f",
          },
          {
            offset: 1,
            color: "#fd9b92",
          },
        ]),
      },
    },
    {
      name: "BruteForce",
      type: "line",
      stack: "total",
      data: labelCounts.map((count: any) => count["BruteForce"] || 0),
      label: { formatter: "{a}" },
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
            color: "#a66aff",
          },
          {
            offset: 1,
            color: "#C4B7D7",
          },
        ]),
      },
    },
    {
      name: "Heartbleed",
      type: "line",
      stack: "total",
      data: labelCounts.map((count: any) => count["Heartbleed"] || 0),
      label: { formatter: "{a}" },
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
            color: "#ef5eff",
          },
          {
            offset: 1,
            color: "#FCE0FF",
          },
        ]),
      },
    },
    {
      name: "Infiltration",
      type: "line",
      stack: "total",
      data: labelCounts.map((count: any) => count["Infiltration"] || 0),
      label: { formatter: "{a}" },
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
            color: "#727272",
          },
          {
            offset: 1,
            color: "#ffcccc",
          },
        ]),
      },
    },
    {
      name: "WebAttack",
      type: "line",
      stack: "total",
      data: labelCounts.map((count: any) => count["WebAttack"] || 0),
      label: { formatter: "{a}" },
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
            color: "#db5cfe",
          },
          {
            offset: 1,
            color: "#eeb3ff",
          },
        ]),
      },
    },
  ];

  chartInstance.value!.setOption({
    title: {
      text: "Network Attack Traffic",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
    },
    legend: {
      show: true,
      top: '40',
      itemGap: 10, // 图例每项之间的间隔
      data: ["Bot", "DoS", "PortScan", "DDoS", "BruteForce", "Heartbleed", "Infiltration", 'WebAttack'],
      textStyle: {
        color: "#333", // 文字的颜色
        fontWeight: "bold",
      },
    },
    xAxis: {
      type: "category",
      data: timePeriods.map((period) =>
        period.start.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      ),
    },
    yAxis: {
      type: "value",
    },
    series: series,
    color: [
      "#63ff63",
      "#7f8eff",
      "#39ff99",
      "#ff5e4f",
      "#a66aff",
      "#ef5eff",
      "#727272",
      "#db5cfe",
      "red",
    ],
  });
};

onMounted(() => {
  setTimeout(async () => {
    if (chart.value instanceof HTMLDivElement) {
      let chartStore = offlineChartStore();
      await chartStore.alertTime();
      await chartStore.alertTable();
      let data = chartStore.data;

      chartInstance.value = echarts.init(chart.value);
      updateChart(data, 5); // 将时间段平均分成 20 份
      window.addEventListener(
        "resize",
        chartInstance.value.resize as EventListener
      );
    } else {
      console.error("chart.value is not an instance of HTMLDivElement");
    }
  }, 50);
});

onBeforeUnmount(() => {
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
