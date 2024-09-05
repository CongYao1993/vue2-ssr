<template>
  <div>
    <div class="title" @click="clickTitle">{{ item?.title }}</div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("homeStore");

export default {
  name: "Home",
  asyncData({ store, route }) {
    // 触发 action 后，会返回 Promise
    return store.dispatch("homeStore/fetchItem");
  },
  computed: {
    // item() {
    //   return this.$store.state.homeStore.item;
    // },
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
  margin: 40px;
  background-color: aqua;
}
</style>
