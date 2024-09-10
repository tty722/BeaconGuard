//路由鉴权：判断路由访问的权限设置
import router from "./router";
import nprogress from "nprogress";
//引入进度条样式
import "nprogress/nprogress.css";

nprogress.configure({ showSpinner: false }); //禁用加载过程中的旋转图标，只显示进度条，从而改变进度条的外观
//获取用户相关仓库的token数据，去判断用户是否登录成功
import useUserStore from "./store/modules/user";
import pinia from "./store";
let userStore = useUserStore(pinia);

//全局守卫：任意路由切换都会触发
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  /**
   * to:目的路由
   * from：源路由
   * next：路由的放行函数
   */
  nprogress.start();
  //获取用户token判断用户是否登录或者注册
  let token = userStore.token;
  let username = userStore.username;
  if (token) {
    //已经登录或者注册
    if (to.path == "/login" || to.path == "/register"|| to.path == "/") {
      next({ path: "/layout" }); //如果已经进入主页面，不允许回到登录或者注册界面
    } else {
      if (username) {
        //判断有无用户信息
        next(); //有用户信息放行
      } else {
        //没有用户信息，守卫发送用户信息请求然后放行
        try {
          await userStore.userInfo();
          next({ ...to });
        } catch (error) {
          //token过期，退出登录，将用户有关数据清空
          await userStore.userLogout();
          next({ path: "/login" });
        }
      }
    }
  } else {
    //还未登录或注册
    if (to.path == "/login" || to.path == "/register"|| to.path == "/") {
      next();
    } else {
      next({ path: "/login" });
    }
  }
});

//全局后置守卫
router.afterEach((to: any, from: any) => {
  // to and from are both route objects.
  nprogress.done();
});
