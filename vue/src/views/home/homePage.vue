<template>
  <div class="homePage" :class="{ hidden: !videoLoaded }">
    <video autoplay muted loop id="background-video" @loadeddata="onVideoLoaded">
      <source src="../../../background.mp4" type="video/mp4" />
    </video>
    <header>
      <img src="../../../logo.png" />
      <div class="sign-button">
        <el-button @click="signInHandler">Sign in</el-button>
        <el-button @click="signUpHandler">Sign up</el-button>
      </div>
    </header>
    <section id="body">
      <div class="welcome">
        <h1>Welcome to BeaconGuard</h1>
        <p>
          <strong>BeaconGuard</strong> is a powerful tool for capturing and
          analyzing network traffic, designed to provide deep insights into your
          network's activity.
        </p>
        <div class="timeline">
          <div v-for="(feature, index) in features" :key="index" class="timeline-item"
            :class="{ visible: isVisible(index) }">
            <div class="timeline-icon" :style="{
              backgroundColor: 'white',
              borderColor: feature.color,
              boxShadow: feature.colorx
            }">
              <el-icon :style="{ color: feature.color }" style="width: 30px">
                <Aim v-if="feature.icon === 'Aim'" class="custom-icon" />
                <Search v-if="feature.icon === 'Search'" class="custom-icon" />
                <Box v-if="feature.icon === 'Box'" class="custom-icon" />
                <DataAnalysis v-if="feature.icon === 'DataAnalysis'" class="custom-icon" />
                <Picture v-if="feature.icon === 'Picture'" class="custom-icon" />
              </el-icon>
            </div>
            <div class="timeline-content" :style="{
              borderLeftColor: feature.color,
            }">
              <h2 :style="{ color: feature.color }">{{ feature.title }}</h2>
              <p>{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="img-container">
        <img v-slide-in v-for="image in images" :src="image" :key="image" alt="Image" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElIcon } from "element-plus";
import vSlideIn from "@/utils/vSlideIn";
import { useRouter } from "vue-router";

// 创建一个 ref 用于存储图片路径数组
const images = ref<string[]>([]);
;

defineExpose({
  directives: {
    vSlideIn,
  },
});


const features = ref([
  {
    title: "Real-time & Offline Packet Capture",
    description:
      "Seamlessly capture live network traffic or analyze pre-recorded data using libpcap.",
    color: "#45f3ed",
    colorx: "0 0 150px 40px #45f3ed",
    icon: "Aim",
  },
  {
    title: "Comprehensive Packet Analysis",
    description:
      "Decode packets, reassemble IP fragments and TCP streams, and extract valuable application layer protocol content like HTTP and FTP.",
    color: "#59ff6f",
    colorx: "0 0 150px 40px #59ff6f",
    icon: "Search",
  },
  {
    title: "Robust Data Storage",
    description:
      "Store your processed data securely in MongoDB or on your file system for easy retrieval and analysis.",
    color: "#ffafd8",
    colorx: "0 0 150px 40px #ffafd8",
    icon: "Box",
  },
  {
    title: "In-depth Statistical Analysis",
    description:
      "Gain insights into communication patterns and traffic for various protocols including TCP, UDP, ICMP, HTTP, and FTP.",
    color: "#905ff1",
    colorx: "0 0 150px 40px #905ff1",
    icon: "DataAnalysis",
  },
  {
    title: "Visualize Your Data",
    description:
      "Use our intuitive web application to visualize your analysis results. Built with Vue.js, Vite, and TypeScript for a seamless user experience.",
    color: "#6ba4ff",
    colorx: "0 0 150px 40px #6ba4ff",
    icon: "Picture",
  },
]);

const videoLoaded = ref(false);

const visibleItems = ref<Array<number>>([]);

const isVisible = (index: number) => visibleItems.value.includes(index);

let $router = useRouter();

//登录方法
const signInHandler = () => {
  $router.push("login");
}

//注册跳转方法
const signUpHandler = () => {
  $router.push("register");
}

//标签滚动
const onScroll = () => {
  const scrollY = window.scrollY;
  features.value.forEach((_, index) => {
    const element = document.querySelector(
      `.timeline-item:nth-child(${index + 1})`
    );
    if (element) {
      const elementTop = element.getBoundingClientRect().top + scrollY;
      if (scrollY + window.innerHeight > elementTop) {
        if (!visibleItems.value.includes(index)) {
          visibleItems.value.push(index);
        }
      }
    }
  });
};

// 加载图片路径的方法
function loadImages() {
  const imageCount = 7; // 根据实际图片数量调整
  for (let i = 1; i <= imageCount; i++) {
    images.value.push(`/images/image${i}.png`);
  }
}

onMounted(() => {
  window.addEventListener("scroll", onScroll);
  loadImages();
  onScroll(); // Initial check in case some items are already visible
});

//视频加载
const onVideoLoaded = (event: Event) => {
  videoLoaded.value = true;
  const videoElement = event.target as HTMLVideoElement;
  videoElement.playbackRate = 1.3; // 更改播放速度，例如：1.5表示1.5倍速播放
};
</script>

<style scoped lang="scss">
.homePage {
  display: flex;
  flex-direction: column;
  height: 100vh;
  transition: opacity 0.5s;
  opacity: 1;

  &.hidden {
    opacity: 0;
  }

  header {
    width: 100%;
    height: 70px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    img {
      height: 70px;
      margin: auto 20px auto 20px;
    }

    .sign-button {
      width: 250px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 15px;

      .el-button {
        width: 100px;
        height: 40px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 18px;
        font-weight: 600;
        background-color: transparent;
        color: rgb(230, 237, 243);
        border-color: rgb(230, 237, 243);
      }

      .el-button:hover {
        transition: all 0.3s;
        color: rgb(230, 237, 243);
        box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.9);
      }


    }
  }

  section#body {
    height: 1500px;
    flex: 1;
    z-index: 1;
    display: flex;
    flex-direction: column;

    .welcome {
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;

      h1 {
        text-align: center;
        margin-top: 15%;
        font-family: "Mona Sans", "Mona Sans Header Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 120px;
        font-weight: 700;
        color: rgb(230, 237, 243);
      }

      p {
        text-align: center;
        margin-top: 50px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
        font-weight: 700;
        color: rgb(230, 237, 243);

        strong {
          font-weight: 900;
          font-size: 25px;
        }
      }

      .timeline {
        margin-top: 25%;
        position: relative;
        padding: 2rem 0;
        margin-left: 20%;
        border-left: 5px solid transparent;

        &::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: -2.5px;
          width: 5px;
          background: linear-gradient(to bottom,
              #45f3ed,
              #59ff6f,
              #ffafd8,
              #905ff1,
              #6ba4ff);
        }
      }

      .timeline-item {
        opacity: 0;
        transition: opacity 1s ease-out, transform 0.5s ease-out;
        margin: 2rem 0;
        position: relative;
        padding-left: 2rem;
        transform: translateY(100px);
      }

      .timeline-item.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .timeline-icon {
        width: 3rem;
        height: 3rem;
        border-radius: 100%;
        position: absolute;
        left: -1.5rem;
        top: 0.5rem;
        background-color: white;
        display: flex;
        align-items: center;
        justify-content: center;

        .custom-icon {
          font-size: 100rem;
        }
      }

      .timeline-content {
        padding: 1rem;
        height: 300px;

        h2 {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 35px;
          font-weight: 600;
        }

        p {
          font-family: Helvetica, Arial, sans-serif;
          font-size: 40px;
          font-weight: 600;
          text-align: left;
          width: 70%;
          margin-top: 30px;
        }
      }
    }

    .img-container {
      width: 100%;
      height: auto;
      margin-top: 100px;
      display: flex;
      flex-direction: column;

      img {
        width: 65%;
        margin-top: 100px;
        margin-bottom: 100px;
        margin-left: auto;
        margin-right: auto;

      }

    }

  }

  #background-video {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }
}
</style>
