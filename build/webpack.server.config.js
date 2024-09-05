const { merge } = require("webpack-merge");
const nodeExternals = require("webpack-node-externals");
const baseConfig = require("./webpack.base.config");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");

// Error: Server-side bundle should have one single entry file. Avoid using CommonsChunkPlugin in the server config.
delete baseConfig.optimization;

module.exports = merge(baseConfig, {
  // 这允许 webpack 以 Node 方式处理动态导入，且在编译 Vue 组件时，告知 `vue-loader` 输送面向服务器代码。
  target: "node",
  devtool: "cheap-module-source-map",
  entry: "./src/entry-server.js",
  output: {
    filename: "server-bundle.js",
    // 使用 Node 风格导出模块
    libraryTarget: "commonjs2",
  },
  optimization: {
    splitChunks: false,
  },
  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // 从 bundle 中排除依赖项。可以使服务器构建速度更快，并生成较小的 bundle 文件。
  externals: nodeExternals({
    // 不要排除的依赖项
    allowlist: [/\.css$/],
  }),
  // webpack5 中配合 externals 使用，为了忽略内置模块，如 path、fs 等
  externalsPresets: { node: true },
  // 将服务器的整个输出构建为单个 JSON 文件。默认文件名为 `vue-ssr-server-bundle.json`
  plugins: [new VueSSRServerPlugin()],
});
