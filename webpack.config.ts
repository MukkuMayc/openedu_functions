import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const config: any = {
  entry: "./static/src/index.tsx",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build", "static"),
  },
  devServer: {
    contentBase: path.join(__dirname, "static"),
    compress: true,
    port: 9000,
    historyApiFallback: true,
    proxy: {
      "/api/*": {
        target: "http://localhost:8080",
        secure: false,
        changeOrigin: true,
      },
    },
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./static/index.html",
    }),
  ],
};

export default config;
