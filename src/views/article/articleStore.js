export default {
  namespaced: true,
  state: () => ({
    info: {},
  }),
  actions: {
    fetchArticleInfo({ commit }) {
      // `store.dispatch()` 会返回 Promise，以便我们能够知道数据在何时更新
      return new Promise((resolve) => {
        setTimeout(() => {
          commit("setArticleInfo", { info: { title: "文章详情页" } });
          resolve();
        }, 1000);
      });
    },
  },
  mutations: {
    setArticleInfo(state, { info }) {
      state.info = info;
    },
  },
};
