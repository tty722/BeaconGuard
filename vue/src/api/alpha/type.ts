// todo 定义alphaIDS相关的接口数据类型
export interface allSessionData {
    code: number,
    message?: string,
    data?: {
        sessions: {
            sessionId: string,
            sessionName: string,
            createdAt: string,
            updatedAt: string
        }[]
    }
}

export interface Message {
    content: string;
    timestamp: string;
    sender: string;
    _id: string;
}

export interface SessionData {
    _id: string;
    sessionName: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface AllMessageData {
    code: number;
    message?: string;
    data?: SessionData;
}

// 定义消息数据的接口
export interface MessageData {
    content: string;
    timestamp: string;
    sender: string;
}

// 定义 AlphaAnswerData 接口
export interface AlphaAnswerData {
    code: number;
    message?: string;
    data: MessageData;
}

export interface AlphaDeleteData{
    code: number;
    message: string;
}

export interface AlphaAddSessionData{
    code:number,
    message?:string,
    data?:{
        sessionId:string,
        response:MessageData
    }
}