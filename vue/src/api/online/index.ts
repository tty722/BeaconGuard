//统一管理实时相关的接口
import request from "@/utils/request";


enum API {
  ONLINESNIFF_URL = '/api/onlineSniff',
  STOPSNIFF_URL = '/api/stopSniff',
}

//实时抓包接口
export const reqOnlineSniff = () => request.get<any, any>(API.ONLINESNIFF_URL)

//停止抓包方法
export const reqStopSniff = () => request.get<any, any>(API.STOPSNIFF_URL)
