import Vue from "vue";
import App from "./App.vue";
import { createRouter } from "./router";
import { createStore } from "./store";
import { sync } from "vuex-router-sync";

// 导出一个工厂函数，用于创建新的应用程序、router 和 store 实例，每次 SSR 请求都会调用
export function createApp() {
  // 创建 router 和 store 实例
  const router = createRouter();
  const store = createStore();

  // 同步路由到 store：将路由的 $route 设置为 store 的状态 `store.state.route`
  sync(store, router);

  // 创建应用程序实例
  // 将 router、store、ssr context 注入到所有子组件，确保 `this.$router` and `this.$store` 在所有组件都可以使用
  const app = new Vue({
    router,
    store,
    render: (h) => h(App),
  });

  // 导出 app、router、store
  // 在这里不挂载 app，因为在服务器和客户端的处理是不同的
  return { app, router, store };
}
