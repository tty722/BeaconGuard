// todo 定义用户相关的小仓库

import { defineStore } from "pinia";
import { UserState } from "./types/type";
import { constantRoute } from "@/router/routes";
import { GET_TOKEN, REMOVE_TOKEN, SET_TOKEN } from "@/utils/token";
import { changeInfoResponseData, signInFormData, signInResponseData, signUpFormData, signUpResponseData, userInfoChangeData, userInfoReponseData } from "@/api/user/type";
import { reqInfoChange, reqLogout, reqSignIn, reqSignUp, reqUserInfo } from "@/api/user/index";
import { formatDate } from "@/utils/birthday";
import useChartStore from "./chart";
import useOfflineStore from "./offline";


let useUserStore = defineStore('User', {
  state: (): UserState => {
    return {
      _id: '',
      username: "",
      email: "",
      phoneNumber: -1,
      birthday: '',
      gender: "male",
      personalityTag: '',
      token: GET_TOKEN(), //用户唯一标识
      menuRoutes: constantRoute, //所有路由对象数组
    };
  },

  actions: {
    //用户登录方法
    async userSignIn(data: signInFormData) {
      const result: signInResponseData = await reqSignIn(data);//等待登录请求响应

      if (result.code === 200) {
        //pinia仓库存储一份token
        this.token = result.data?.token as string;
        this.username = data.username;

        //本地持久化存储一份
        SET_TOKEN(result.data?.token as string);
        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },

    //用户注册方法
    async userSignUp(data: signUpFormData) {
      const result: signUpResponseData = await reqSignUp(data);

      if (result.code === 200) {
        //pinia仓库存储一份token
        this.token = result.data?.token as string;

        //本地持久化存储一份
        SET_TOKEN(result.data?.token as string);
        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    },

    //获取用户信息方法
    async userInfo() {
      const result: userInfoReponseData = await reqUserInfo(); //获取用户信息接口

      if (result.code == 200) {
        this._id = result.data?.checkUser._id as string;
        this.username = result.data?.checkUser.username as string;
        this.email = result.data?.checkUser.email as string;
        this.phoneNumber = result.data?.checkUser.phone as number;
        this.personalityTag = result.data?.checkUser.personalityTag as string;
        this.gender = result.data?.checkUser.gender as string;
        this.birthday = formatDate(result.data?.checkUser.birthday);

        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },

    //退出登录方法
    async userLogout() {
      //退出登录请求
      const result: any = await reqLogout();
      if (result.code == 200) {
        //目前没有mock接口:退出登录接口(通知服务器本地用户唯一标识失效)
        this.token = "";
        this.username = "";
        let OfflineStore = useOfflineStore()
        OfflineStore.toExitAnalysis = true;

        //清空图表数据缓存
        let chartStore = useChartStore();
        chartStore.circle1 = {
          top4: [
            { sourceIP: "", count: 0 },
            { sourceIP: "", count: 0 },
            { sourceIP: "", count: 0 },
            { sourceIP: "", count: 0 }
          ],
          remaining: 0,
        };
        chartStore.circle2 = {
          top4: [
            { destIP: "", count: 0 },
            { destIP: "", count: 0 },
            { destIP: "", count: 0 },
            { destIP: "", count: 0 }
          ],
          remaining: 0,
        };
        chartStore.circle3 = {
          top4: [
            { sourcePort: "", count: 0 },
            { sourcePort: "", count: 0 },
            { sourcePort: "", count: 0 },
            { sourcePort: "", count: 0 }
          ],
          remaining: 0,
        };
        chartStore.circle4 = {
          top4: [
            { destPort: "", count: 0 },
            { destPort: "", count: 0 },
            { destPort: "", count: 0 },
            { destPort: "", count: 0 }
          ],
          remaining: 0,
        };
        chartStore.data = [];

        REMOVE_TOKEN();
        return "ok";
      } else {
        return Promise.reject(new Error(result.message));
      }
    },

    //修改用户信息的方法
    async userInfoChange(data: userInfoChangeData) {
      const result: changeInfoResponseData = await reqInfoChange(data); //获取用户信息接口

      if (result.code == 200) {
        this.username = data.username;
        this.phoneNumber = data.phone;
        this.personalityTag = data.personalityTag;
        this.gender = data.gender;
        this.birthday = formatDate(data.birthday);
        return 'ok';
      }
      else {
        return Promise.reject(new Error(result.message));
      }

    },
  }
})

//对外暴露
export default useUserStore;