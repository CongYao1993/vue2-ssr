import Vue from "vue";
import { createApp } from "./app";

const { app, router, store } = createApp();

// 初次路由时触发，在 entry-server.js 已处理 asyncData，直接设置 store.state
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
  // Object.keys(window.__INITIAL_STATE__).forEach((key) => {
  //   if (key === "route") {
  //     return;
  //   }
  //   store.registerModule(key, {
  //     namespaced: true,
  //     state: window.__INITIAL_STATE__[key],
  //   });
  // });
}

router.onReady(() => {
  // 使用 `router.beforeResolve()` 注册一个全局守卫。
  // 这和 router.beforeEach 类似，因为它在每次导航时都会触发，不同的是，解析守卫刚好会在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用。
  // 因为包裹在onReady中，所以是非初次路由时触发，用于处理 asyncData。
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

// 在当前路由改变，但是该组件被复用时调用
// 举例来说，对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，
// 由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
// 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
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
