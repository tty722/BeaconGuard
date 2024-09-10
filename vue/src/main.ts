import 'element-plus/dist/index.css'
//引入sass样式
import '@/styles/index.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'

//引入element-plus提供的所有图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import ElementPlus from 'element-plus'
import {zhCn} from 'element-plus/es/locales.mjs'
import {createApp} from 'vue'
import pinia from './store'
import './permisstion.ts'//路由守卫
import App from './App.vue'
//引入路由进行注册
import router from './router'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}


app.use(pinia);
app.use(router);
//安装插件
app.use(ElementPlus, {
  locale: zhCn,
})
//将element-plus挂载到挂载点上
app.mount('#app')
