import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

// 导出一个 createRouter 函数，用于创建一个新的 router 实例
export function createRouter() {
  return new Router({
    mode: "history",
    // 使用异步组件
    routes: [
      { path: "/", component: () => import("./views/home/index.vue") },
      { path: "/article", component: () => import("./views/article/index.vue") },
    ],
  });
}
