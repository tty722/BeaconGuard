<template>
  <div class="time_traffic" ref="chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import useRestoreStore from "@/store/modules/restore";

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
    return { ICMP: 0 };
  });

  data.forEach((item) => {
    const time = new Date(item.time).getTime();
    const periodIndex = timePeriods.findIndex(
      (period) => time >= period.start.getTime() && time < period.end.getTime()
    );
    if (periodIndex !== -1 && item.protocol.toLowerCase() === 'icmp') {
      protocolCounts[periodIndex]['ICMP']++;
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
      name: "ICMP",
      type: "line",
      stack: "total",
      data: protocolCounts.map((count: any) => count["ICMP"] || 0),
      label: {
        formatter: '{c}', // 数据标签的格式
        fontSize: 14,
        fontWeight: 'bold'
      },
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
  ];

  chartInstance.value!.setOption({
    title: {
      text: "ICMP Traffic",
    },
    tooltip: {
      trigger: "axis", // 设置触发方式为鼠标悬停时显示
      axisPointer: {
        type: "cross",
      },
    },
    legend: {
      show: true, // 隐藏图例
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
    emphasis: {
      focus: "series",
      label: {
        show: true,
        fontSize: 40,
        fontWeight: "bold",
      },
    },
    color: ['#FCE0FF'], // 设置颜色，只显示HTTP的颜色
  });
};

onMounted(() => {
  setTimeout(async () => {
    if (chart.value instanceof HTMLDivElement) {
      let restoreStore=useRestoreStore();
      await restoreStore.ICMPProtocolData();
      let data = restoreStore.ICMP_protocol;
      console.log(data);
      

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
