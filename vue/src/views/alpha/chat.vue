<template>
    <div class="chat-container">
        <div class="message-container">
            <div v-if="alphaStore.addSession" class="addSession chat-window">
                <img src="../../../logo1.jpg" alt="">
                <div class="introduction-box">
                    <div class="box">
                        <el-icon size="20" style="margin-bottom: 10px;">
                            <DocumentChecked style="color: #a376f7;" />
                        </el-icon>
                        <p>基于SecGPT2的智能体</p>
                    </div>
                    <div class="box">
                        <el-icon size="20" style="margin-bottom: 10px;">
                            <Postcard style="color: #769bf7;" />
                        </el-icon>
                        <p>关于网络安全的知识问答</p>
                    </div>
                    <div class="box">
                        <el-icon size="20" style="margin-bottom: 10px;">
                            <Reading style="color: #f7b551;" />
                        </el-icon>
                        <p>提供网络安全建议</p>
                    </div>
                </div>
            </div>
            <div v-if="!alphaStore.addSession" class="chat-window">
                <div class="messages" ref="chatWindow">
                    <div v-for="(message, index) in alphaStore.messages" :key="index"
                        :class="['message', message.sender]">
                        <img v-if="message.sender === 'agent'" class="avatar" src="../../../logo.png" alt="智能体头像">
                        <div class="bubble">
                            <span v-html="renderMarkdown(message.content)"></span>
                        </div>
                        <img v-if="message.sender === 'user'" class="avatar" src="../../../kun.png" alt="用户头像">
                    </div>
                </div>
            </div>
        </div>
        <div class="input-container">
            <input v-model="userInput" placeholder="Say something" @keyup.enter="sendMessage" class="chat-input" />
            <el-button type="primary" @click="sendMessage" icon="Position" class="send-button"></el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css'; // 选择一个样式，可以替换为你喜欢的样式
import useAlphaStore from '@/store/modules/alpha';
import { onMounted, ref, nextTick, watch } from 'vue';
import MarkdownIt from 'markdown-it'

let alphaStore = useAlphaStore();
const userInput = ref('');
const chatWindow = ref<HTMLElement | null>(null);

// 滚动到底部
const scrollToBottom = () => {
    nextTick(() => {
        if (chatWindow.value) {
            chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
        }
    });
};

//发送信息
const sendMessage = async () => {
    if (userInput.value.trim()) {
        if (!alphaStore.addSession) {
            const messageContent = userInput.value.trim();
            userInput.value = '';

            const userMessage = {
                content: messageContent,
                timestamp: new Date().toISOString(),
                sender: 'user',
            };
            await alphaStore.messages.push(userMessage);
            console.log(alphaStore.messages);


            // 滚动到底部
            scrollToBottom();

            try {
                await alphaStore.alphaAnswer(messageContent);
                const response = alphaStore.message;
                await alphaStore.messages.push(alphaStore.data)

                // 调用逐字显示函数
                displayMessageGradually(response, 'agent');
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        } else {
            //将状态转换为非添加会话状态
            alphaStore.addSession = false;

            const messageContent = userInput.value.trim();
            userInput.value = '';

            const userMessage = {
                content: messageContent,
                timestamp: new Date().toISOString(),
                sender: 'user',
            };
            alphaStore.messages.push(userMessage);

            // 滚动到底部
            scrollToBottom();

            try {
                await alphaStore.alphaAddSession(messageContent);
                const response = alphaStore.message;
                await alphaStore.messages.push(alphaStore.data)

                // 调用逐字显示函数
                displayMessageGradually(response, 'agent');
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    }
};

// 逐字显示消息内容
const displayMessageGradually = (messageContent: any, sender: any) => {
    let displayedContent = '';
    let index = 0;
    const intervalId = window.setInterval(() => {
        if (index < messageContent.length) {
            if (messageContent[index] === '<') {
                let endIndex = messageContent.indexOf('>', index);
                if (endIndex !== -1) {
                    displayedContent += messageContent.slice(index, endIndex + 1);
                    index = endIndex + 1;
                } else {
                    displayedContent += messageContent[index];
                    index++;
                }
            } else {
                displayedContent += messageContent[index];
                index++;
            }

            const agentMessage = {
                content: displayedContent + '<span class="dot-cursor">|</span>', // 添加光标
                timestamp: new Date().toISOString(),
                sender: sender,
            };
            alphaStore.messages[alphaStore.messages.length - 1] = agentMessage;
            scrollToBottom();
        } else {
            clearInterval(intervalId);

            // 删除光标
            const finalMessage = {
                content: displayedContent,
                timestamp: new Date().toISOString(),
                sender: sender,
            };
            alphaStore.messages[alphaStore.messages.length - 1] = finalMessage;
            scrollToBottom();
        }
    }, 30);
};


// 页面加载时滚动到底部
onMounted(() => {
    scrollToBottom();
});

// 监听 addSession 和 currentSessionId 的变化
watch(
    [() => alphaStore.addSession, () => alphaStore.currentSessionId],
    ([addSession, currentSessionId]) => {
        if (!addSession) {
            scrollToBottom();
        }
        if (currentSessionId) {
            scrollToBottom();
            console.log('ok');
        }
    }
);


const renderMarkdown = (text: string) => {
    const md: any = new MarkdownIt({
        html: true, // 允许 HTML
        highlight: function (str, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return `
                        <div class="code-container" style="position: relative;margin-top:-50px;">
    <pre class="hljs" style="border-radius: 8px; padding: 15px; background-color: #2e2e2e;">
        <code style="color: #f8f8f2; font-family: 'Courier New', Courier, monospace;">${hljs.highlight(str, { language: lang }).value}</code>
    </pre>
    <button class="copy-button" style="position: absolute; top: 40px; right: 10px; background-color: #2e2e2e; color: white; border: none; padding: 5px 10px; font-size: 12px; border-radius: 5px; cursor: pointer;">复制</button>
</div>
`;
                } catch (__) { }
            }
            return `
                     <div class="code-container" style="position: relative;">
    <pre class="hljs" style="border-radius: 8px; padding: 15px; background-color: #2e2e2e;">
        <code style="color: #f8f8f2; font-family: 'Courier New', Courier, monospace;">${hljs.highlight(str, { language: lang }).value}</code>
    </pre>
    <button class="copy-button" style="position: absolute; top: 40px; right: 10px; background-color: #2e2e2e; color: white; border: none; padding: 5px 10px; font-size: 12px; border-radius: 5px; cursor: pointer;">复制</button>
</div>
`;
        }
    });

    md.renderer.rules.paragraph_open = () => {
        return `<p style="margin-top: 5px; margin-bottom: 5px; margin-left: 40px; font-size: 1em; font-weight: 500;">`;
    };

    md.renderer.rules.heading_open = (tokens: any, idx: any) => {
        const level = tokens[idx].tag.slice(1);
        if (level === '1') {
            return `<h1 style="text-align: center; margin-bottom: 50px; font-size: 30px; font-weight: 800;">`;
        } else if (level === '2') {
            return `<h2 style="margin-left: 20px; margin-top: 30px; margin-bottom: 20px; font-size: 20px; font-weight: 700;">`;
        } else if (level === '3') {
            return `<h3 style="margin-left: 30px; margin-top: 20px; margin-bottom: 10px; font-size: 18px; font-weight: 600;">`;
        } else {
            return `<h${level}>`;
        }
    };

    md.renderer.rules.strong_open = () => {
        return `<strong style="font-weight: 600;">`;
    };

    md.renderer.rules.list_item_open = () => {
        return `<li style="font-weight: 600;">`;
    };

    md.renderer.rules.bullet_list_open = () => {
        return `<ul style="list-style-type: disc;">`;
    };

    nextTick(() => {
        document.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', () => {
                // 使用类型断言，确保 previousElementSibling 不为 null 且是 HTMLElement 类型
                const codeElement = button.previousElementSibling as HTMLElement | null;

                if (codeElement && 'innerText' in codeElement) {
                    const code = codeElement.innerText; // 确保 innerText 存在
                    navigator.clipboard.writeText(code).then(() => {
                        button.innerHTML = '已复制'; // 使用 innerHTML 或 innerText 来避免类型问题
                        setTimeout(() => {
                            button.innerHTML = '复制';
                        }, 2000);
                    }).catch(err => {
                        console.error('复制失败:', err);
                    });
                } else {
                    console.error('无法获取代码内容或代码元素不存在');
                }
            });
        });
    });

    return md.render(text);
};


</script>

<style scoped lang="scss">
.chat-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .message-container {
        width: 100%;
        height: 90%;

        .chat-window {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
        }
    }

    .input-container {
        width: 70%;
        margin: auto;
        display: flex;
        align-items: center;
        padding: 10px;
        border-top: 1px solid #ddd;
        background-color: #e1e1e1;
        border-radius: 30px;

        .chat-input {
            flex: 1;
            margin-right: 10px;
            border: none;
            padding: 10px 15px;
            background-color: #e1e1e1;
            font-size: 16px;
            border-radius: 20px;
        }

        .send-button {
            border-radius: 50%;
            width: 40px;
            height: 40px;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #c2c2c2;
            border: none;
            color: white;

            &:hover {
                background-color: #a2a2a3;
            }
        }
    }
}

.messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 12px;
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
}

.message {
    display: flex;
    margin-bottom: 10px;

    &.user {
        justify-content: flex-end;

        .bubble {
            margin-right: 10px;
            background-color: #e4e3e3;
        }
    }

    &.agent {
        justify-content: flex-start;

        .bubble {
            margin-left: 10px;
            background-color: #d8dade;
        }
    }
}

.bubble {
    max-width: 70%;
    padding: 15px;
    border-radius: 50px;
    position: relative;
    background-color: #f0f0f0;
    display: flex;
    /* Flexbox for centering text */
    align-items: center;
    /* Vertical centering */
    justify-content: center;
    /* Horizontal centering */
    word-wrap: break-word;
    /* Ensure long words break */
}


.dot-cursor {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: black;
    border-radius: 50%;
    margin-left: 3px;
    animation: blink 1s step-end infinite;
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}


.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}

.addSession {
    display: flex;
    flex-direction: column;

    img {
        width: 250px;
        margin: auto;
        margin-bottom: 5%;
    }

    .introduction-box {
        width: 50%;
        height: 20%;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 20%;
        display: flex;
        flex-direction: row;

        .box {
            width: 25%;
            height: 70%;
            margin: auto;
            border: 1.5px solid rgb(202, 202, 202);
            padding: 10px;
            font-size: 15px;
            border-radius: 20px;
        }

        .box:hover {
            background-color: #d5d5d5;
        }
    }
}
</style>
