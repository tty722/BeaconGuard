// todo 统一管理alphaIDS相关的接口
import request from "@/utils/request";
import { AllMessageData } from "./type";

enum API {
    ALL_SESSION_URL = '/api/alpha/allSession',
    ADD_SESSION_URL = '/api/alpha/addSession',
    DELETE_SESSION_URL = '/api/alpha/deleteSession',
    ALL_MESSAGE_URL = '/api/alpha/getAllMessage',
    ALPHA_ANSWER_URL = '/api/alpha/agentAnswer'
}

//获得所有会话信息
export const reqAllSession = () => request.get<any, any>(API.ALL_SESSION_URL)

//添加会话
export const reqAddSession = (content: string) => request.post<any, any>(API.ADD_SESSION_URL, {content})

//删除会话
export const reqDeleteSession = (sessionId: string) => request.delete<any, any>(`${API.DELETE_SESSION_URL}/${sessionId}`)

//获得会话信息
export const reqAllMessage = (sessionId: string) => request.get<any, AllMessageData>(`${API.ALL_MESSAGE_URL}/${sessionId}`);

//回复信息
export const reqAlphaAnswer = (content: string, sessionId: string) => request.post<any, any>(`${API.ALPHA_ANSWER_URL}/${sessionId}`, { content });
