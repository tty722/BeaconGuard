import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { viteMockServe } from 'vite-plugin-mock';

export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        enable: command === 'serve', // 在开发模式下启用 Mock 服务
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // 使用绝对路径配置别名
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/variable.scss";', // 使用别名引入 SCSS 变量文件
        },
      },
    },
    define: {
      'process.env': process.env, // 传递环境变量给你的代码
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(process.env.VITE_API_BASE_URL),
    },
  };
});
