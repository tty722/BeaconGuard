<template>
  <div class="chart" ref="circle_chart"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import * as echarts from "echarts";
import getOnlineTrafficStore from "@/store/modules/online";

const circle_chart = ref<HTMLDivElement | null>(null);
let mychart: echarts.ECharts | null = null;

// 初始化图表
const initChart = () => {
  if (circle_chart.value instanceof HTMLDivElement) {
    mychart = echarts.init(circle_chart.value);
    mychart.setOption({
      title: {
        text: "Top DestinationPort",
        left: "center",
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)",
      },
      legend: {
        top: "center", // 图例组件离容器上侧的距离
        left: "left", // 图例组件离容器左侧的距离
        orient: "vertical", // 图例列表的布局朝向
        itemGap: 20, // 图例每项之间的间隔
        textStyle: {
          color: "#333", // 文字的颜色
          fontSize: 10, // 文字的字体大小
          fontWeight: "bold",
        },
      },
      grid: {
        left: "20%", // 图表的左侧间距
        right: "10%", // 图表的右侧间距
        top: "10%", // 图表的上侧间距
        bottom: "10%", // 图表的下侧间距
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["30%", "50%"],
          center: ["65%", "50%"], // 将饼图向右移动
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [],
        },
      ],
    });
  }
};

// 更新图表数据
const updateChartData = (circle1: any) => {
  if (mychart) {
    const top4Data = circle1.top4.map((item: any, index: number) => ({
      name: item.key,
      value: item.count,
      itemStyle: {
        color: ["#ADD8E6", "#FADADD", "#B0E0E6", "#C4B7D7"][index], // 设置不同 sourceIP 对应的颜色
      },
    }));

    const chartData = [...top4Data];

    if (circle1.remaining > 0) {
      chartData.push({
        name: "其他",
        value: circle1.remaining,
        itemStyle: {
          color: "#D3D3D3",
        },
      });
    }

    // 更新图表配置
    mychart.setOption({
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["30%", "50%"],
          center: ["65%", "50%"], // 将饼图向右移动
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: chartData,
        },
      ],
    });
  }
};

// 定时批量处理
let intervalId: number | undefined;

onMounted(() => {
  let onlineStore = getOnlineTrafficStore();

  initChart();

  intervalId = window.setInterval(() => {
    const circle4 = onlineStore.circle4;
    if (circle4) {
      updateChartData(circle4); // 使用 store 的 circle1 数据更新图表
    }
  }, 1000); // 每2秒更新一次图表
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  padding: 5px;
}
</style>
