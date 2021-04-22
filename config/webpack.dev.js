const { resolveApp } = require("hqw-util/lib/cli/path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressBarPlugin = require("hqw-util/lib/webpack/ProgressBarPlugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const slash = require("slash2");
const path = require("path");

const HOST = process.env.HOST || "0.0.0.0";
const port = "8002";
const config = {
  mode: "development",
  entry: {
    index: {
      import: resolveApp("./src/index.js"),
      filename: "pages/index[contenthash].js"
    },
    // css:{
    //     import:require("highlight.js/styles/default.css")
    // }
  },
  output: {
    filename: "[name].js",
    // libraryTarget: "umd", //发布组件专用
    // library: "HTool",
    path: resolveApp("./dist"),
    clean: true
  },
  devtool: "inline-source-map",
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      "@": resolveApp("./src")
    }
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)?$/, // jsx/js文件的正则
        exclude: /node_modules/, // 排除 node_modules 文件夹
        use: {
          // loader 是 babel
          loader: require.resolve("babel-loader"),
          options: {
            // babel 转义的配置选项
            babelrc: false,
            presets: [
              // 添加 preset-react
              [require.resolve("@babel/preset-env"), { modules: false }],
              require.resolve("@babel/preset-react")
            ],
            plugins: [
              require.resolve("@babel/plugin-transform-runtime"),
              require.resolve("@babel/plugin-proposal-class-properties")
            ],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.(css|less)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: require.resolve("css-loader"),
            options: {
              modules: {
                localIdentName: "hqw_[name]_[hash:base64:5]",
                getLocalIdent: (
                    context,
                    localIdentName,
                    localName,
                    options
                  ) => {
                    if (context.resourcePath.includes("global.less")) {
                      return localName;
                    }
                    const match = context.resourcePath.match(/src(.*)/);
                    if (match && match[1]) {
                      const antdProPath = match[1].replace(".less", "");
                      const arr = slash(antdProPath)
                        .split("/")
                        .map(a => a.replace(/([A-Z])/g, "-$1"))
                        .map(a => a.toLowerCase());
                      return `hqw${arr.join("-")}-${localName}`.replace(
                        /--/g,
                        "-"
                      );
                    }
                    return localName;
                  },
                namedExport: false
              }
            }
          },
          {
            loader: require.resolve("less-loader")
          }
        ]
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: require.resolve("html-loader")
          },
          {
            loader: require.resolve("markdown-loader"),
            options: {
              highlight: function(code, lang) { 
                const hljs = require("highlight.js");
                const language = hljs.getLanguage(lang) ? lang : "plaintext";
                return hljs.highlight(code, { language }).value;
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new ProgressBarPlugin(),
    new WebpackBuildNotifierPlugin({
      title: "hqwfa Project",
      logo: path.resolve(__dirname, "../assest/hqw.png"),
      warningIcon: path.resolve(__dirname, "../assest/warn.png"),
      failureIcon: path.resolve(__dirname, "../assest/error.png"),
      successIcon: path.resolve(__dirname, "../assest/success.png")
      //   suppressSuccess: true // don't spam success notifications
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "../assest/index.html"),
      filename: "index.html",
      inject: true
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ],
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`
    }
  },
  performance: false
};
const serverConfig = {
  contentBase: resolveApp("./dist"),
  hot: true,
  host: HOST
};
module.exports = {
  config,
  serverConfig
};
