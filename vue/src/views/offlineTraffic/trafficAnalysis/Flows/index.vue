<template>
    <div class="alert-container">
        <section id="main-part">
            <transition name="fade">
                <component :is="currentComponent"> </component>
            </transition>
        </section>
        <section id="select-part">
            <div class="button-box">
                <div :class="['Sankey', { active: currentPage === 'sankey'||currentPage === 'flowSankey' }]" @click="() => setCurrentPage('sankey')">
                    <p>Sankey</p>
                </div>
                <div :class="['Map', { active: currentPage === 'map' }]" @click="() => setCurrentPage('map')">
                    <p>Map</p>
                </div>
                <div :class="['Relative', { active: currentPage === 'relative' }]"
                    @click="() => setCurrentPage('relative')">
                    <p>Relative</p>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import sankey from './Sankey/index.vue'
import map from './Map/index.vue'
import relative from './Relative/index.vue'
import useOfflineStore from '@/store/modules/offline';

// 定义组件映射关系的类型
type ComponentMap = {
    [key: string]: any; // 此处可以根据实际情况替换为组件类型
};

// 当前组件的引用
let offlineStore = useOfflineStore()
let currentComponent = ref(offlineStore.flows);
let currentPage = ref(offlineStore.flowsString);

function setCurrentPage(name: string): void {
    // 定义组件映射关系
    const componentMap: ComponentMap = {
        // Securityrecommendations,
        sankey,
        map,
        relative
    };

    offlineStore.flowsString = name;
    currentPage.value = name;

    // 检查是否存在对应的组件
    if (componentMap[name]) {
        currentComponent.value = componentMap[name];
        offlineStore.flows = componentMap[name];
    } else {
        console.error(`Component "${name}" not found`);
    }
}
</script>

<style scoped lang="scss">
.alert-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    section#main-part {
        width: 93%;
        height: 100%;
    }

    section#select-part {
        width: 7%;
        height: 100%;
        display: flex;

        .button-box {
            width: 90%;
            height: 15%;
            border-radius: 5px;
            border: 2px solid rgb(212, 210, 210);
            margin: auto;

            div {
                display: flex;
                width: 100%;
                height: 33.3%;
                border: 1px solid rgb(237, 237, 237);
                cursor: pointer;
                transition: all 0.3s;



                p {
                    font-family: Arial, Helvetica, sans-serif;
                    font-weight: 600;
                    margin: auto;
                    color: rgb(121, 121, 121);
                }

                &.active {

                    border-radius: 5px;
                    background-color: rgb(225, 225, 225);
                    border: 2px solid rgb(0, 0, 0);
                    transform: scale(1.05);

                    p {
                        color: rgb(0, 0, 0);
                    }
                }
            }

        }
    }
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
</style>