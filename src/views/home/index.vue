<template>
  <div class="title" @click="clickTitle">{{ item?.title }}</div>
</template>

<script>
import homeStoreModule from "./homeStore";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("homeStore");

export default {
  name: "Home",
  asyncData({ store, route }) {
    store.registerModule("homeStore", homeStoreModule);
    // 触发 action 后，会返回 Promise
    return store.dispatch("homeStore/fetchItem");
  },
  destroyed() {
    // 重要信息：当多次访问路由时，避免在客户端重复注册模块。
    this.$store.unregisterModule("homeStore");
  },
  computed: {
    // item() {
    //     return this.$store.state.homeStore.item;
    //   },
    ...mapState(["item"]),
  },
  methods: {
    clickTitle() {
      console.log("clickTitle");
    },
  },
};
</script>

<style scope lang="less">
.title {
  background-color: aqua;
}
</style>
