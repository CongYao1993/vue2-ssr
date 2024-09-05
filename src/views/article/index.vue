<template>
  <div>{{ info?.title }}</div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("articleStore");

export default {
  name: "Article",
  asyncData({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch("articleStore/fetchArticleInfo");
  },
  computed: {
    ...mapState(["info"]),
  },
};
</script>
