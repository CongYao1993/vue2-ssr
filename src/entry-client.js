import Vue from "vue";
import { createApp } from "./app";

const { app, router, store } = createApp();

// 在挂载到应用程序之前，store 就应该获取到状态，设置 store.state
if (window.__INITIAL_STATE__) {
  // store.replaceState(window.__INITIAL_STATE__);
  Object.keys(window.__INITIAL_STATE__).forEach((key) => {
    if (key === "route") {
      return;
    }
    store.registerModule(key, {
      namespaced: true,
      state: window.__INITIAL_STATE__[key],
    });
  });
}

router.onReady(() => {
  // 添加路由钩子函数，用于处理 asyncData.
  // 在初始路由 resolve 后执行，以便我们不会二次预取已有的数据。
  // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);

    // 只关心非预渲染的组件，所以对比它们，找出两个匹配列表的差异组件
    let diffed = false;
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = prevMatched[i] !== c);
    });

    if (!activated.length) {
      return next();
    }

    // 这里如果有加载指示器 (loading indicator)，就触发

    Promise.all(
      activated.map((c) => {
        if (c.asyncData) {
          return c.asyncData({ store, route: to });
        }
      })
    )
      .then(() => {
        // 停止加载指示器(loading indicator)

        next();
      })
      .catch(next);
  });

  app.$mount("#app");
});

// 当组件的参数改变时触发
Vue.mixin({
  beforeRouteUpdate(to, from, next) {
    const { asyncData } = this.$options;
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to,
      })
        .then(next)
        .catch(next);
    } else {
      next();
    }
  },
});
