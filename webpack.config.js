// Generated using webpack-cli https://github.com/webpack/webpack-cli
// import { CleanWebpackPlugin } from "clean-webpack-plugin";
const path = require("path");
//clean-webpack-plugin: 实现每次编译时先清理上次编译结果
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js", // 输出文件名
    library: "SimpleJS", // 库的名称 -全局引入时可以使用
    libraryTarget: "umd", // 支持的模块系统
    // umdNamedDefine: true // 会为 UMD 模块创建一个命名的 AMD 模块
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
