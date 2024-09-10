// todo 统一管理offline相关的接口
import request from "@/utils/request";

enum API {
    OFFLINE_ALERT_CIRCLE1_URL = '/api/offline/alert/circle1',
    OFFLINE_ALERT_CIRCLE2_URL = '/api/offline/alert/circle2',
    OFFLINE_ALERT_CIRCLE3_URL = '/api/offline/alert/circle3',
    OFFLINE_ALERT_CIRCLE4_URL = '/api/offline/alert/circle4',
    OFFLINE_ALERT_DATA_URL = '/api/offline/alert/time',
    OFFLINE_ALERT_ATTACK_URL = '/api/offline/alert/attack',
    OFFLINE_ALERT_COORDINATES_URL = '/api/offline/alert/coordinates',
}

//alert中circle1数据
export const reqAlertCircle1 = () => request.get<any, any>(API.OFFLINE_ALERT_CIRCLE1_URL)

//alert中circle2数据
export const reqAlertCircle2 = () => request.get<any, any>(API.OFFLINE_ALERT_CIRCLE2_URL)

//alert中circle3数据
export const reqAlertCircle3 = () => request.get<any, any>(API.OFFLINE_ALERT_CIRCLE3_URL)

//alert中circle4数据
export const reqAlertCircle4 = () => request.get<any, any>(API.OFFLINE_ALERT_CIRCLE4_URL)

//alert中data数据
export const reqAlertData= () => request.get<any, any>(API.OFFLINE_ALERT_DATA_URL)

//alert中attack数据
export const reqAlertAttack = () => request.get<any, any>(API.OFFLINE_ALERT_ATTACK_URL)

//alert中coodinates数据
export const reqAlertCoordinates = () => request.get<any, any>(API.OFFLINE_ALERT_COORDINATES_URL)
