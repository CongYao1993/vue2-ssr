import { createApp } from "./app";

export default (context) => {
  // 因为组件可能是动态的，且 asyncData 获取数据是异步的，所以返回一个 Promise。
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    // 设置服务器端 router 的位置
    router.push(context.url);

    // 在路由器完成初始导航之后被解析，这时所有和初始路由有关联的异步入口钩子函数和异步组件都已经被解析
    // 仅在首次加载页面时被调用，之后切换路由不会再调用
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }

      // 对所有匹配的路由组件调用 `asyncData()`
      Promise.all(
        matchedComponents.map((Component) => {
          if (Component.asyncData) {
            return Component.asyncData({
              store,
              route: router.currentRoute,
            });
          }
        })
      )
        .then(() => {
          // 在所有预取钩子asyncData resolve 后，store 已经填充入渲染应用程序所需的状态。
          // 当我们将状态附加到上下文，并且 `template` 选项用于 renderer 时，
          // context.state 将作为 window.__INITIAL_STATE__ 状态，自动嵌入到最终的 HTML 中
          context.state = store.state;

          // Promise 应该 resolve 应用程序实例，以便它可以渲染
          resolve(app);
        })
        .catch(reject);
    }, reject);
  });
};
