// todo 通过vue-router插件实现模板路由配置

import { createRouter, createWebHashHistory } from "vue-router";
//引入定义的常量路由
import { constantRoute} from "./routes";
//创建路由器
const router = createRouter({
  //路由器模式hash
  history: createWebHashHistory(),
  routes: constantRoute,
  //滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

export default router;