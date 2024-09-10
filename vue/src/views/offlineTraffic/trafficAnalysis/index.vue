<template>
    <div class="main_container">
        <div class="header">
            <el-menu class="demo-tabs" mode="horizontal">
                <el-menu-item @click="setCurrentPage('General')" index="1">General</el-menu-item>
                <el-menu-item @click="setCurrentPage('Alert')" index="2">Alert</el-menu-item>
                <el-menu-item @click="setCurrentPage('Flows')" index="3">Flows</el-menu-item>
                <el-menu-item @click="setCurrentPage('SecurityThreatReports')" index="4">Security Threat
                    </el-menu-item>
                <!-- <el-menu-item @click="setCurrentPage('Securityrecommendations')" index="5">Security
            recommendations</el-menu-item> -->
            </el-menu>
            <div class="exit_btn">
                <el-button icon="ArrowLeftBold" circle @click="exitHandler"></el-button>
            </div>
        </div>
        <div class="main_core">
            <transition name="fade">
                <component :is="currentComponent"> </component>
            </transition>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from "vue";
import General from './General/inde.vue'
import Alert from './Alert/index.vue'
import Flows from './Flows/index.vue'
import SecurityThreatReports from "./SecurityThreatReports/report.vue"
import useOfflineStore from "@/store/modules/offline";

let offlineStore = useOfflineStore()

// 定义组件映射关系的类型
type ComponentMap = {
    [key: string]: any; // 此处可以根据实际情况替换为组件类型
};

// 当前组件的引用
let currentComponent: Ref<any> = ref(offlineStore.offline);
let currentPage = ref(offlineStore.offlineString)

// 根据名称设置当前组件
function setCurrentPage(name: string): void {
    // 定义组件映射关系
    const componentMap: ComponentMap = {
        General,
        Alert,
        Flows,
        SecurityThreatReports,
        // Securityrecommendations,
    };
    offlineStore.offlineString = name
    currentPage.value = name

    // 检查是否存在对应的组件
    if (componentMap[name]) {
        currentComponent.value = componentMap[name];
        offlineStore.offline = componentMap[name]
    } else {
        console.error(`Component "${name}" not found`);
    }
}

//退出当前流量包分析操作
const exitHandler = () => {
    offlineStore.toExitAnalysis = true;
};
</script>

<style scoped lang="scss">
routerView {
    width: 100%;
    height: 100%;
}


.main_container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .header {
        width: 100%;
        height: 50px;
        display: flex;

        .demo-tabs {
            width: calc(100% - 50px);
            height: 100%;
        }

        .exit_btn {
            width: 50px;
            height: 100%;
            display: flex;
            justify-content: center;

            .el-button {
                margin-top: auto;
                margin-bottom: auto;
            }
        }
    }

    .main_core {
        width: 100%;
        height: 100%;
    }
}

.el-menu-item {
    width: 15%;

    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 600;
}
</style>

<!-- 切换动画 -->
<style scoped lang="scss">
.fade-enter-active {
    transition: all 0.4s;
    /* 设置动画过渡时间 */
}

.fade-enter-from {
    opacity: 0;
    /* 设置初始和结束状态的透明度 */
    transform: scale(0);
    /* 设置初始和结束状态的缩放比例 */
}

.fade-enter-to {
    opacity: 1;
    /* 设置结束状态的透明度 */
    transform: scale(1);
    /* 设置结束状态的缩放比例 */
}

.fade-enter-from {
    opacity: 0;
    transform: scale(0);
}

.fade-enter-active {
    transition: all 0.4s;
}

.fade-enter-to {
    opacity: 1;
    transform: scale(1);
}
</style>