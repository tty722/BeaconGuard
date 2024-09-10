// todo 统一管理图表相关的接口
import request from "@/utils/request";

enum API {
  FLOW_CIRCLE1_URL = "/api/offline/overview/flow/circle1",
  FLOW_CIRCLE2_URL = "/api/offline/overview/flow/circle2",
  FLOW_CIRCLE3_URL = "/api/offline/overview/flow/circle3",
  FLOW_CIRCLE4_URL = "/api/offline/overview/flow/circle4",
  FLOW_TIME_URL = "/api/offline/overview/flow/time",
  MAP_URL = "/api/offline/overview/map/coordinates",
}

//flow中的circle1的图数据获取
export const reqFlowCircle1 = () => request.get<any, any>(API.FLOW_CIRCLE1_URL);

//flow中的circle2的图数据获取
export const reqFlowCircle2 = () => request.get<any, any>(API.FLOW_CIRCLE2_URL);

//flow中的circle3的图数据获取
export const reqFlowCircle3 = () => request.get<any, any>(API.FLOW_CIRCLE3_URL);

//flow中的circle4的图数据获取
export const reqFlowCircle4 = () => request.get<any, any>(API.FLOW_CIRCLE4_URL);

//flow中的time的图数据获取
export const reqFlowTime = () => request.get<any, any>(API.FLOW_TIME_URL);

//map中获取map的数据
export const reqMapCoordinates = () => request.get<any, any>(API.MAP_URL);
