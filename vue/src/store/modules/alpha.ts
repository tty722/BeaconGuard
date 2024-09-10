// todo 定义alphaIDS有关小仓库

import { defineStore } from "pinia";
import { AlphaState } from "./types/alpha";
import { reqAddSession, reqAllMessage, reqAllSession, reqAlphaAnswer, reqDeleteSession } from "@/api/alpha";
import { AllMessageData, allSessionData, AlphaAddSessionData, AlphaAnswerData, AlphaDeleteData } from "@/api/alpha/type";


let useAlphaStore = defineStore('Alpha', {
    state: (): AlphaState => {
        return {
            sessions: [],
            currentSessionId: '',
            currentSessionName: '',
            messages: [],
            message: '',
            addSession: true,
            data: {
                content: '',
                timestamp: '',
                sender: '',
            }
        }
    },
    actions: {
        //获得所有对话信息
        async alphaAllSession() {
            const result: allSessionData = await reqAllSession();

            if (result.code === 200 && result.data) {
                this.sessions = result.data.sessions;
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message));
            }
        },

        // 获取会话信息
        async alphaAllMessage(sessionId: string) {
            try {
                const result: AllMessageData = await reqAllMessage(sessionId);
                if (result.code === 200 && result.data) {
                    this.messages = result.data.messages;
                    return 'ok'
                } else {
                    return Promise.reject(new Error(result.message));
                }
            } catch (error) {
                return Promise.reject(new Error('Failed to load messages'));
            }
        },

        //发送信息
        async alphaAnswer(content: string) {
            try {
                const result: AlphaAnswerData = await reqAlphaAnswer(content, this.currentSessionId);
                if (result.code === 200 && result.data) {
                    this.message = result.data.content;
                    this.data = result.data
                    return 'ok'
                } else {
                    return Promise.reject(new Error(result.message));
                }
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        },

        //删除会话
        async alphaDelete(sessionId: string) {
            try {
                const result: AlphaDeleteData = await reqDeleteSession(sessionId);
                if (result.code === 200) {
                    await this.alphaAllSession();
                    return 'ok'
                } else {
                    return Promise.reject(new Error(result.message));
                }
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        },

        //新增会话
        async alphaAddSession(content: string) {
            try {
                const result: AlphaAddSessionData = await reqAddSession(content);
                if (result.code === 200 && result.data) {
                    this.currentSessionId = result.data.sessionId
                    this.currentSessionName = content
                    this.message = result.data.response.content
                    this.data = result.data.response

                    return 'ok'
                } else {
                    return Promise.reject(new Error(result.message));
                }
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    }
})



//对外暴露
export default useAlphaStore;