<template>
  <div>{{ info?.title }}</div>
</template>

<script>
import articleStoreModule from "./articleStore";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("articleStore");

export default {
  name: "Article",
  asyncData({ store, route }) {
    store.registerModule("articleStore", articleStoreModule);
    // 触发 action 后，会返回 Promise
    return store.dispatch("articleStore/fetchArticleInfo");
  },
  destroyed() {
    // 重要信息：当多次访问路由时，避免在客户端重复注册模块。
    this.$store.unregisterModule("articleStore");
  },
  computed: {
    ...mapState(["info"]),
  },
};
</script>
