<template>
  <div class="time_traffic" ref="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import useChartStore from "@/store/modules/chart";

const chart = ref<HTMLDivElement | null>(null);
const chartInstance = ref<echarts.ECharts | null>(null);

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
    return { TCP: 0, HTTP: 0, UDP: 0, DNS: 0, FTP: 0, ICMP: 0, OTHER: 0 };
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

// 更新图表
const updateChart = (
  data: { time: string; protocol: string }[],
  numPeriods: number
) => {
  const { timePeriods, protocolCounts } = processBackendData(data, numPeriods);

  const series = [
    {
      name: "TCP",
      type: "line",
      data: protocolCounts.map((count: any) => count["TCP"] || 0),
      label: { formatter: "{a}" },
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
            color: "#ffcccc",
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
      data: protocolCounts.map((count: any) => count["HTTP"] || 0),
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
            color: "#ccffcc",
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
      data: protocolCounts.map((count: any) => count["UDP"] || 0),
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
            color: "#B0B5D9",
          },
          {
            offset: 1,
            color: "#B0B5D9",
          },
        ]),
      },
    },
    {
      name: "DNS",
      type: "line",
      stack: "total",
      data: protocolCounts.map((count: any) => count["DNS"] || 0),
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
            color: "#99D9EA",
          },
          {
            offset: 1,
            color: "#99D9EA",
          },
        ]),
      },
    },
    {
      name: "FTP",
      type: "line",
      stack: "total",
      data: protocolCounts.map((count: any) => count["FTP"] || 0),
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
            color: "#C4B7D7",
          },
          {
            offset: 1,
            color: "#C4B7D7",
          },
        ]),
      },
    },
    {
      name: "ICMP",
      type: "line",
      stack: "total",
      data: protocolCounts.map((count: any) => count["ICMP"] || 0),
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
            color: "#FCE0FF",
          },
          {
            offset: 1,
            color: "#FCE0FF",
          },
        ]),
      },
    },
    {
      name: "OTHER",
      type: "line",
      stack: "total",
      data: protocolCounts.map((count: any) => count["OTHER"] || 0),
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
            color: "#fe8c8c",
          },
          {
            offset: 1,
            color: "#ffcccc",
          },
        ]),
      },
    },
  ];

  chartInstance.value!.setOption({
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
      show: true,
      data: ["TCP", "UDP", "HTTP", "DNS", "FTP", "ICMP", "OTHER"],
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
      "#ffcccc",
      "#ccffcc",
      "#B0B5D9",
      "#99D9EA",
      "#C4B7D7",
      "#FCE0FF",
      "#B8B8B8",
      "red",
    ],
  });
};

onMounted(() => {
  setTimeout(async () => {
    if (chart.value instanceof HTMLDivElement) {
      let chartStore = useChartStore();
      await chartStore.chartFlowTime();
      let data = chartStore.data;

      chartInstance.value = echarts.init(chart.value);
      updateChart(data, 20); // 将时间段平均分成 20 份
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
