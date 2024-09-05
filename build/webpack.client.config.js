const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.config");
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");

const isProd = process.env.NODE_ENV === "production";

module.exports = merge(baseConfig, {
  entry: {
    app: "./src/entry-client.js",
  },
  devtool: isProd ? false : "cheap-module-source-map",
  plugins: [
    // 将客户端的整个输出构建为单个 JSON 文件的插件。默认文件名为 `vue-ssr-client-manifest.json`
    new VueSSRClientPlugin(),
  ],
});
