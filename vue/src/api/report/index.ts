// todo 统一管理report相关的接口
import request from "@/utils/request";

enum API {
    REPORT_URL = '/api/offline/report',
    SUGGEST_URL = '/api/offline/suggest'
}

//获得入侵威胁报告
export const reqReport=(data:any)=>request.post<any,any>(API.REPORT_URL,data)

//获得入侵策略建议
export const reqSuggest=(data:any)=>request.post<any,any>(API.SUGGEST_URL,data)