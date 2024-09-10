export interface AlphaState {
    sessions:
    {
        sessionId: string,
        sessionName: string,
        createdAt: string,
        updatedAt: string
    }[],
    currentSessionId: string,
    currentSessionName: string,
    messages: {
        content: string,
        timestamp: string,
        sender: string
    }[],
    message: string,
    addSession: boolean,
    data:{
        content: string,
        timestamp: string,
        sender: string
    }
}