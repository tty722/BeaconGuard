// todo 统一管理用户相关接口
import request from "@/utils/request";
import { signInFormData, signUpFormData, userInfoChangeData, userInfoReponseData } from "./type";

enum API {
  SIGNIN_URL = '/api/user/login',
  SIGNUP_URL = 'api/user/register',
  GETUSERINFO_URL = "/api/user/info",
  LOGOUT_URL = "/api/user/logout",
  USERINFOCHANGE_URL = '/api/user/info/change',

}

//登录接口方法
export const reqSignIn = (data: signInFormData) => request.post<any, any>(API.SIGNIN_URL, data);

//注册接口方法
export const reqSignUp = (data: signUpFormData) => request.post<any, any>(API.SIGNUP_URL, data);

//获取用户信息接口方法
export const reqUserInfo = () => request.get<any, userInfoReponseData>(API.GETUSERINFO_URL);

//退出登录接口方法
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL);

//修改信息接口方法
export const reqInfoChange = (data: userInfoChangeData) =>
  request.post<any, any>(API.USERINFOCHANGE_URL, data);
