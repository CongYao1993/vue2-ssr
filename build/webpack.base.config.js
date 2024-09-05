const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 分离 CSS 文件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // 压缩 CSS
const { VueLoaderPlugin } = require("vue-loader");

const NODE_ENV = process.env.NODE_ENV;
const isProd = NODE_ENV === "production";

const styleLoader = isProd ? MiniCssExtractPlugin.loader : "vue-style-loader";

module.exports = {
  mode: NODE_ENV || "development",
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/dist/",
    filename: isProd ? "js/[name].[contenthash:6].bundle.js" : "js/[name].bundle.js",
    chunkFilename: isProd ? "js/chunk_[name]_[contenthash:6].js" : "js/chunk_[name].js",
  },
  resolve: {
    extensions: [".js", ".vue", ".json", ".ts", ".html"],
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
  },
  optimization: {
    splitChunks: { chunks: "all" },
    runtimeChunk: { name: "runtime" },
    minimizer: isProd
      ? [
          // 在 webpack@5 中，可以使用 `...` 语法来扩展现有的 minimizer（包括 `terser-webpack-plugin`）
          `...`,
          new CssMinimizerPlugin(),
        ]
      : [],
  },
  plugins: isProd
    ? [
        new MiniCssExtractPlugin({
          filename: "styles/[name].[contenthash:6].css",
        }),
        new VueLoaderPlugin(),
      ]
    : [new VueLoaderPlugin()],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        include: [path.resolve(__dirname, "../src")],
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [styleLoader, "css-loader", "less-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
          },
        },
        generator: {
          // 将图片文件输出到 static/imgs 目录中
          // 将图片文件命名 [hash:8][ext][query]
          // [hash:8]: hash值取8位
          // [ext]: 使用之前的文件扩展名
          // [query]: 添加之前的query参数
          filename: "static/imgs/[hash:8][ext][query]",
        },
      },
    ],
  },
};
