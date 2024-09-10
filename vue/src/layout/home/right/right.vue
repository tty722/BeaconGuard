<template>
  <div class="introduction">
    <div class="title">
      <img src="../../../../ruanjian.png" style="width:200px;height:50px;margin-right: auto;" />

    </div>
    <h1 style="font-size: 19px;font-weight: 700;text-align:center">第十三届中国软件杯大赛</h1>
    <h1 style="font-size: 15px;font-weight: 700;margin-top: 10px;text-align:center">A1-网络安全智能分析及溯源系统</h1>
    <p>
      随着人工智能技术的迅猛发展，网络安全与人工智能的融合成为了当前全国两会的热门议题。在这一背景下，企业已经意识到网络安全威胁的严重性和紧迫性，迫切希望利用人工智能技术来增强对网络安全威胁的防御能力。通过建立安全威胁溯源及分析系统，企业可以提升对网络安全威胁的检测和应对水平，从而保护企业的网络安全和敏感数据。
    </p>
    <div class="box">
      <el-button @click="openDialog = true">了解更多</el-button>
      <el-dialog v-model="openDialog" width="60%">
        <Competition></Competition>
      </el-dialog>
    </div>
  </div>
  <div class="product_introduction">
    <h1>产品简介</h1>
    <el-timeline class="product_line">
      <el-timeline-item center size="large" color="#757575" icon="Cpu" placement="top" class="custom-timestamp"
        @mouseenter="showCard(1)" @mouseleave="hideCard">
        <dot slot="timestamp">
          <span class="custom-timestamp-text">多模型融合入侵检测</span>
        </dot>
        <el-card v-show="activeIndex === 1" shadow="hover" style="margin-top: 10px">
          <p>
            我们的系统采用多模型融合技术，结合机器学习和网络分析，及时识别并拦截各种潜在的网络入侵行为，保障您的网络安全
          </p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item size="large" color="#757575" icon="DataAnalysis" placement="top" class="custom-timestamp"
        @mouseenter="showCard(2)" @mouseleave="hideCard">
        <dot slot="timestamp">
          <span class="custom-timestamp-text">大语言模型驱动的安全分析</span>
        </dot>
        <el-card v-show="activeIndex === 2" shadow="hover" style="margin-top: 10px">
          <p>
            借助大语言模型分析，我们为您提供详尽的安全威胁报告，全面了解您网络中的风险，并提供专业的安全建议，助您做出正确的安全决策。
          </p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item center size="large" color="#757575" icon="FirstAidKit" placement="top"
        class="custom-timestamp" @mouseenter="showCard(3)" @mouseleave="hideCard">
        <dot slot="timestamp">
          <span class="custom-timestamp-text">个性化安全建议</span>
        </dot>
        <el-card v-show="activeIndex === 3" shadow="hover" style="margin-top: 10px">
          <p>
            根据您的真实情况提供个性化的安全建议，帮助改善网络安全防护策略
          </p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item size="large" color="#757575" icon="BellFilled" placement="top" class="custom-timestamp"
        @mouseenter="showCard(4)" @mouseleave="hideCard">
        <dot slot="timestamp">
          <span class="custom-timestamp-text">实时监控与响应</span>
        </dot>
        <el-card v-show="activeIndex === 4" shadow="hover" style="margin-top: 10px">
          <p>
            我们实时监控您的网络流量和安全事件，一旦发现异常情况，立即发出警报并采取相应的应对措施，确保您的网络安全不受威胁
          </p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item size="large" color="#757575" icon="Monitor" placement="top" class="custom-timestamp"
        @mouseenter="showCard(5)" @mouseleave="hideCard">
        <dot slot="timestamp">
          <span class="custom-timestamp-text">直观用户界面</span>
        </dot>
        <el-card v-show="activeIndex === 5" shadow="hover" style="margin-top: 10px">
          <p>
            我们的界面设计简洁直观，易于操作，无论您是初学者还是专业人士，都能轻松上手，享受到我们提供的一流安全保障
          </p>
        </el-card>
      </el-timeline-item>
      <el-timeline-item size="large" color="#757575" icon="WindPower" placement="top" class="custom-timestamp"
        @mouseenter="showCard(6)" @mouseleave="hideCard">
        <dot slot="timestamp">
          <span class="custom-timestamp-text">持续优化和更新</span>
        </dot>
        <el-card v-show="activeIndex === 6" shadow="hover" style="margin-top: 10px">
          <p>
            我们不断优化和更新我们的系统，确保它始终保持在网络安全的最前沿，以满足您不断变化的安全需求
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts">
import Competition from "./competition.vue";
import { ref } from "vue";
const activeIndex = ref(0);
let openDialog = ref(false);
const showCard = (index: number) => {
  activeIndex.value = index;
};

const hideCard = (index: number) => {
  activeIndex.value = 0;
};
</script>

<style lang="scss" scoped>
.introduction {
  width: 100%;
  height: 330px;
  border-radius: 5px 5px 5px 5px;
  transition: all 0.3s;
  margin-top: 10px;
  box-shadow: 0px 0px 5px rgba($color: #676767, $alpha: 0.5);

  .title {
    display: flex;

    img {
      width: 100px;
      margin-left: 20px;
      margin-top: 20px;
    }

    h1 {
      font-size: 17px;
      font-weight: 600;
      margin-top: 45px;
    }
  }

  h2 {
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    text-align: center;
    font-weight: 600;
  }

  p {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    text-align: center;
  }

  .box {
    display: flex;
    margin-top: 30px;

    .el-button {
      width: 300px;
      border: 1px solid rgb(177, 177, 177);
      margin-left: auto;
      margin-right: auto;
      font-weight: 500;
      border-radius: 5px 5px 5px 5px;
    }

    .el-button:hover {
      color: #585858;
      border: 2px solid rgb(177, 177, 177);
      background-color: #eaeaea;
    }

    .el-button:active {
      color: #000000;
      border: 2px solid rgb(177, 177, 177);
      background-color: #959595;
    }
  }
}


.product_introduction {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  box-shadow: 0px 0px 5px rgba($color: #676767, $alpha: 0.5);
  transition: all 0.3s;

  h1 {
    font-family: "ali";
    font-size: 18px;
    font-weight: 600;
    margin-top: 50px;
    margin-left: 20px;
    margin-bottom: 20px;
  }

  .product_line {
    margin-left: 20px;
  }
}

.product_introduction:hover {
  box-shadow: 0px 0px 5px rgba($color: #585858, $alpha: 0.6);
}
</style>