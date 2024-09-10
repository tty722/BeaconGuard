<template>
    <div class="alphaIDS">
        <section id="left">
            <div class="session addSession" @click="addSessionHandler">
                <img src="../../../logo.png" alt="">
                <p>新建会话</p>
                <el-icon size="20">
                    <Plus />
                </el-icon>
            </div>
            <div v-for="session in sortedSessions" :key="session.sessionId"
                :class="['session', { 'active-session': session.sessionId === alphaStore.currentSessionId }]"
                @click="selectSessionhandler(session.sessionId, session.sessionName)">
                <p class="sessionName">{{ session.sessionName }}</p>
                <div class="sessionOperation">
                    <el-icon @click="shareSessionhandler">
                        <Notification />
                    </el-icon>
                    <el-icon style="color: rgb(255, 75, 75);" @click="deleteSessionhandler(session.sessionId)">
                        <Delete />
                    </el-icon>
                </div>
            </div>
        </section>
        <section id="right">
            <chat></chat>
        </section>
    </div>
</template>


<script setup lang="ts">
import { onMounted, computed } from 'vue';
import useAlphaStore from '@/store/modules/alpha';
import chat from './chat.vue';
import { ElMessage, ElMessageBox } from 'element-plus'

const alphaStore = useAlphaStore();

// 计算属性：根据 updatedAt 对会话进行排序
const sortedSessions = computed(() => {
    return alphaStore.sessions.sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
});

// 删除会话
const deleteSessionhandler = async (sessionId: string) => {
    try {
        const result = await ElMessageBox.confirm(
            'Are you sure you want to delete this session?',
            'Confirm Deletion',
            {
                distinguishCancelAndClose: true,
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                type: 'warning',
            }
        );

        if (result === 'confirm') {
            await alphaStore.alphaDelete(sessionId);
            await alphaStore.alphaAllSession();

            ElMessage({
                type: 'success',
                message: 'Session has been deleted.',
            });
        } else {
            ElMessage({
                type: 'info',
                message: 'Operation has been cancelled.',
            });
        }
    } catch (action) {
        ElMessage({
            type: 'info',
            message:
                action === 'cancel'
                    ? 'Deletion operation has been cancelled.'
                    : 'The delete dialog has been closed.',
        });
    }
};


// 分享会话
const shareSessionhandler = () => {
    console.log('Sharing session');
}

// 选择会话
const selectSessionhandler = async (sessionId: string, sessionName: string) => {
    await alphaStore.alphaAllMessage(sessionId);
    alphaStore.currentSessionId = sessionId;
    alphaStore.currentSessionName = sessionName;
    alphaStore.addSession = false;
}

// 新建会话
const addSessionHandler = () => {
    alphaStore.currentSessionId = '';
    alphaStore.currentSessionName = '';
    alphaStore.messages = [];
    alphaStore.message = '';
    alphaStore.addSession = true;
}

onMounted(async () => {
    try {
        await alphaStore.alphaAllSession();
    } catch (error) {
        console.error('Failed to load sessions:', error);
    }
});
</script>

<style scoped lang="scss">
.addSession {
    img {
        width: 40px;
        height: 40px;
        margin-left: 20px;
        margin-top: auto;
        margin-bottom: auto;
    }

    p {
        margin: auto 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #383838;
        transition: color 0.3s;

        &:hover {
            color: rgba(0, 0, 0, 0.6);
        }
    }

    .el-icon {
        width: 30px;
        height: 50px;
        margin: auto;
        color: #5c5c5c;
    }
}

.session {
    width: 90%;
    min-height: 50px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    border-radius: 15px;
    display: flex;
    position: relative;
    font-size: 15px;
    font-weight: 500;
    font-family: ui-sans-serif, -apple-system, system-ui, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, Helvetica, Apple Color Emoji, Arial, Segoe UI Emoji, Segoe UI Symbol;

    &:hover,
    &.active-session {
        background-color: #e1e1e1;

        .sessionOperation {
            visibility: visible;
        }
    }
}

.sessionName {
    margin: auto 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #383838;
    transition: color 0.3s;

    &:hover {
        color: rgba(0, 0, 0, 0.6);
    }
}

.sessionOperation {
    visibility: hidden;
    width: 30%;
    height: 100%;
    margin-left: auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    .el-icon {
        width: 30px;
        height: 50px;
        margin: auto;
        color: #5c5c5c;
    }
}

.alphaIDS {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;

    section#left {
        width: 20%;
        max-height: 100%;
        overflow-y: auto;
        display: flex;
        flex-direction: column;

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
    }

    section#right {
        width: 80%;
        height: 100%;
    }
}
</style>
