<template>
  <div class="chart" ref="circle_chart"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as echarts from "echarts";
import useChartStore from "@/store/modules/chart";
import { circle1Type } from "@/store/modules/types/type";

const circle_chart = ref<HTMLDivElement | null>(null);

// 初始化饼图
const initChart = (data: circle1Type) => {
  if (!circle_chart.value) return;

  // 获取 echarts 实例
  const mychart = echarts.init(circle_chart.value);

  // 构造图表数据
  const chartData = [
    ...data.top4.map((item, index) => ({
      name: item.sourceIP,
      value: item.count,
      itemStyle: {
        color: ["#ADD8E6", "#FADADD", "#B0E0E6", "#C4B7D7"][index], // 设置不同 sourceIP 对应的浅色调
      },
    })),
    {
      name: "其他",
      value: data.remaining,
      itemStyle: {
        color: "#D3D3D3",
      },
    },
  ];

  // 设置图表配置
  mychart.setOption({
    title: {
      text: "Top SourceIP",
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
        avoidLabelOverlap: false,
        center: ["65%", "50%"], // 将饼图向右移动
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
};

onMounted(() => {
  setTimeout(async () => {
    let chartStore = useChartStore();
    await chartStore.chartFlowCircle1();
    let data = chartStore.circle1;
    initChart(data);
  }, 50);
});
</script>

<style scoped lang="scss">
.chart {
  width: 100%;
  height: 100%;
  padding: 5px;
}
</style>
