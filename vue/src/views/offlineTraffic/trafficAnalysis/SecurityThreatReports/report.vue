<template>
    <div class="report" style="flex-direction: row;">
        <div class="circle">
            <div class="IP">
                <IP></IP>
            </div>
            <div class="Type">
                <dIP></dIP>
            </div>
        </div>
        <div class="main_data">
            <div class="btn">
                <el-button type="primary" @click="submitHandler">自动生成入侵威胁报告</el-button>
                <el-button type="success" @click="storeHandler">保存报告</el-button>
                <el-button type="primary" @click="suggestHandler">自动生成安全建议</el-button>
                <el-button type="success" @click="storeSuggestHandler">保存建议</el-button>
            </div>
            <div class="report_div" v-html="renderMarkdown(displayedReport)">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import { ElNotification, ElLoading } from 'element-plus';
import IP from './chart/IP.vue';
import dIP from './chart/dIP.vue';
import { onMounted, ref } from 'vue';
import { getReportData } from '@/utils/report';
import useReportStore from '@/store/modules/report';

let reportStore = useReportStore()



const displayedReport = ref('');


const renderMarkdown = (text: string) => {
    const md = new MarkdownIt();

    // markdown-it 插件来添加内联样式
    md.renderer.rules.paragraph_open = (tokens, idx) => {
        return `<p style="margin-top: 5px; margin-bottom: 5px; margin-left: 40px; font-size: 1em; font-weight: 500;">`;
    };

    md.renderer.rules.heading_open = (tokens, idx) => {
        const level = tokens[idx].tag.slice(1); // 获取标题级别 h1, h2, h3
        if (level === '1') {
            return `<h1 style="text-align: center; margin-bottom: 50px; font-size: 30px; font-weight: 800;">`;
        } else if (level === '2') {
            return `<h2 style="margin-left: 20px; margin-top: 30px; margin-bottom: 20px; font-size: 20px; font-weight: 700;">`;
        } else if (level === '3') {
            return `<h3 style="margin-left: 30px; margin-top: 20px; margin-bottom: 10px; font-size: 18px; font-weight: 600;">`;
        } else {
            return `<h${level}>`; // 如果是其他级别标题
        }
    };

    md.renderer.rules.strong_open = () => {
        return `<strong style="font-weight: 600;">`;
    };

    md.renderer.rules.list_item_open = (tokens, idx) => {
        const token = tokens[idx - 1];
        if (token && token.tag === 'ol') {
            return `<li style="margin-left: 20px; padding-left: 20px; font-weight: 600;">`;
        } else {
            return `<li style="margin-left: 20px; padding-left: 20px;font-weight: 600;">`;
        }
    };

    md.renderer.rules.bullet_list_open = () => {
        return `<ul style="margin-left: 20px; padding-left: 20px; list-style-type: disc;">`;
    };

    // 处理有序列表的起始编号
    md.renderer.rules.ordered_list_open = (tokens, idx) => {
        const token = tokens[idx];
        const start = token.attrGet('start') || 1; // 获取列表的起始编号
        return `<ol start="${start}" style="margin-left: 20px; padding-left: 20px; list-style-type: decimal; font-weight: 600;">`;
    };

    return md.render(text); // 渲染 Markdown 为 HTML
};




const submitHandler = async () => {
    // 启动加载效果
    const loadingInstance = ElLoading.service({
        lock: true,
        text: '正在生成入侵威胁报告...',
        background: 'rgba(0, 0, 0, 0.7)',
    });

    try {
        await reportStore.reportGet(); // 获取数据
        const report = reportStore.report;

        // 调试：打印渲染后的 HTML
        console.log(renderMarkdown(report));

        // 一次性渲染整个报告
        displayedReport.value = report;  // 确保直接赋值的是渲染后的 HTML
    } finally {
        // 停止加载效果
        loadingInstance.close();
    }
}


const suggestHandler = async () => {
    const loadingInstance = ElLoading.service({
        lock: true,
        text: '正在生成安全建议...',
        background: 'rgba(0, 0, 0, 0.7)',
    });

    try {
        await reportStore.suggestGet();
        // console.log(reportStore.report);
        const suggest = reportStore.suggest; // 后期改为 suggest

        console.log(renderMarkdown(suggest));

        // 一次性渲染整个报告
        displayedReport.value = suggest;  // 确保直接赋值的是渲染后的 HTML
    } finally {
        loadingInstance.close();
    }
}


const storeHandler = () => {
    ElNotification({
        title: '保存成功',
        message: `报告已保存在${reportStore.file1}`,
        type: "success",
    });
}

const storeSuggestHandler = () => {
    ElNotification({
        title: '保存成功',
        message: `报告已保存在${reportStore.file2}`,
        type: "success",
    });
}


onMounted(() => {
    setTimeout(async () => {
        await getReportData()
    }, 50);
});
</script>

<style scoped lang="scss">
.report {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    .circle {
        width: 35%;
        height: 100%;
        overflow-y: hidden;

        .IP {
            width: 100%;
            height: 50%;
        }

        .Type {
            width: 100%;
            height: 50%;
        }

        // 隐藏滚动条（适用于Webkit内核浏览器，如Chrome, Safari）
        &::-webkit-scrollbar {
            display: none;
        }

        // 隐藏滚动条（适用于Firefox）
        scrollbar-width: none; // Firefox


        .bin {
            width: 100%;
            height: 400px;
        }

    }

    .main_data {
        width: 65%;
        height: 100%;
        display: flex;
        flex-direction: column;

        .btn {
            width: 50%;
            height: 10%;
            display: flex;
            margin: auto;
            margin-top: 0;
            justify-content: space-between;

            .el-button {
                margin-top: auto;
                margin-bottom: auto;
                width: 180px;
                height: 50px;
                font-size: 15px;
                font-family: 'ali';
                font-weight: 700;
            }
        }

        .report_div {
            width: 100%;
            height: 85%;
            padding: 20px;
            margin-bottom: 5%;
            overflow-y: auto;
            background-color: white;
            border: 1px solid rgb(214, 214, 214);
            box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.42);
            border-radius: 5px;


            &::-webkit-scrollbar {
                width: 10px;
            }

            &::-webkit-scrollbar-track {
                background: #e4e4e4;
                border-radius: 10px;
            }

            &::-webkit-scrollbar-thumb {
                background: #5c5c5c;
                border-radius: 10px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background: #424242;
            }

            h1 {
                font-weight: 900;
                font-size: 100;
            }
        }
    }
}


.report_div h1,
.report_div h2,
.report_div h3,
.report_div p,
.report_div strong {
    /* 为 Markdown 渲染的标题、段落、粗体文本等提供基础样式 */
    margin: 1em 0;
}

.report_div h1 {
    font-size: 2em;
    font-weight: bold;
}

.report_div h2 {
    font-size: 1.5em;
    font-weight: bold;
}

.report_div p {
    font-size: 1em;
    font-weight: 700;
}

.report_div strong {
    font-weight: bold;
}
</style>