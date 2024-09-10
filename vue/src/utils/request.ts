// 对 Axios 进行了二次封装，利用请求和响应拦截器来处理 HTTP 请求和响应
import axios from "axios";
import { ElMessage } from "element-plus";
import useUserStore from "@/store/modules/user";
//创建axios实例
let request = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_API,//基础路径damn man
  baseURL: "http://127.0.0.1:3000",
  timeout: 500000,
});
//请求拦截器
request.interceptors.request.use((config) => {
  //获取用户相关小仓库:获取token，登录成功后携带给服务器
  let userStore = useUserStore();
  if (userStore.token) {
    config.headers.token = userStore.token;
  }
  //返回配置对象
  //config配置对象，headera属性请求头，经常给服务器端携带公共参数
  return config;
});
//响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    //处理网络错误
    let msg = "";
    let status = error.response.status;
    switch (status) {
      case 401:
        msg = "token过期";
        break;
      case 403:
        msg = "无权访问";
        break;
      case 404:
        msg = "请求地址错误";
        break;
      case 500:
        msg = "服务器出现问题";
        break;
      default:
        msg = "无网络";
    }
    ElMessage({
      type: "error",
      message: msg,
    });
    return Promise.reject(error);
  }
);
export default request;
