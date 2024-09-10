// todo 定义用户相关接口数据类型

//登录请求数据类型
export interface signInFormData{
  username:string,
  password:string
}

//登录响应数据类型
export interface signInResponseData{
  code:number,
  message?:string,
  data?:{
    token:string
  }
}

//注册请求数据类型
export interface signUpFormData{
  email:string,
  username:string,
  password:string,
  confirmPass:string
}

//注册响应数据类型
export interface signUpResponseData{
  code:number,
  message?:string,
  data?:{
    token:string
  }
}

//获取用户信息响应数据
export interface userInfoReponseData {
  code: number;
  message?: string;
  data?: {
    checkUser: {
      _id: string,
      username: string,
      email: string,
      phone: number,
      birthday: string,
      gender: string,
      personalityTag: string
    };
  }
}

//定义用户信息修改数据类型
export interface userInfoChangeData {
  username: string,
  phone: number,
  birthday: string,
  gender: string,
  personalityTag: string,
}

//定义修改信息接口返回数据类型
export interface changeInfoResponseData{
  code: number;
  message: string;
}