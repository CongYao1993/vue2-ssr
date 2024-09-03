export default {
  namespaced: true,
  state: () => ({
    item: {},
  }),
  actions: {
    fetchItem({ commit }) {
      // `store.dispatch()` 会返回 Promise，以便我们能够知道数据在何时更新
      return new Promise((resolve) => {
        setTimeout(() => {
          commit("setItem", { item: { title: "Hello" } });
          resolve();
        }, 1000);
      });
    },
  },
  mutations: {
    setItem(state, { item }) {
      state.item = item;
    },
  },
};
