const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 分离 CSS 文件
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); // 压缩 CSS
const { VueLoaderPlugin } = require("vue-loader");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  devtool: isProd ? false : "cheap-module-source-map",
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "../dist/",
    filename: "[name].[chunkhash].js",
    clean: true, // 自动将上次打包目录资源清空，webpack5.20.0+
  },
  resolve: {
    alias: {
      public: path.resolve(__dirname, "../public"),
    },
  },
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
        use: [isProd ? MiniCssExtractPlugin.loader : "vue-style-loader", "css-loader", "less-loader"],
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
  optimization: {
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
          filename: "common.[chunkhash].css",
        }),
        new VueLoaderPlugin(),
      ]
    : [new VueLoaderPlugin()],
};
