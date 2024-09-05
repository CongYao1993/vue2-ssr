import Vue from "vue";
import Vuex from "vuex";
import homeStore from "./views/home/homeStore";
import articleStore from "./views/article/articleStore";

Vue.use(Vuex);

export function createStore() {
  return new Vuex.Store({
    modules: {
      homeStore,
      articleStore,
    },
  });
}
