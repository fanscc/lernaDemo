"use strict";
const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

// 用来判断是什么环境mock环境测走mock数据
function resolve(dir) {
  return path.join(__dirname, dir);
}

// eslint-disable-next-line no-unused-vars
let proxyTable = {
  "/": {
    target: "https://zckj.gudonger.com",
    changeOrigin: true
  }
};

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   *
   */
  publicPath: "",
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: process.env.NODE_ENV !== "development",
  productionSourceMap: process.env.NODE_ENV === "development",
  runtimeCompiler: true,
  devServer: {
    host: "127.0.0.1",
    port: 8888,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    disableHostCheck: true,
    proxy: proxyTable
  },
  configureWebpack: config => {
    // 为生产环境修改配置...
    if (process.env.NODE_ENV === "production") {
      config.plugins.push(
        //生产环境自动删除console
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_debugger: true,
              drop_console: true
            }
          },
          sourceMap: false,
          parallel: true
        })
      );
    }
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test
    config.resolve.symlinks(true);
    config.performance.set("hints", false);

    // 添加别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("static", resolve("static"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"));
    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })

      .end();
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();

    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });
    config.plugin("define").tap(args => {
      args[0]["process.env"] = {
        // 是否线上环境
        ONLINE: JSON.stringify(process.env.npm_config_env === "online")
      };
      return args;
    });
    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === "development", config => {
        config.devtool("cheap-source-map");
      });

    config.when(process.env.NODE_ENV !== "development", config => {
      config
        .plugin("ScriptExtHtmlWebpackPlugin")
        .after("html")
        .use("script-ext-html-webpack-plugin", [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          libs: {
            name: "chunk-libs",
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: "initial" // only package third parties that are initially dependent
          },
          elementUI: {
            name: "chunk-elementUI", // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]?[\\/]?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: "chunk-commons",
            test: resolve("src/components"), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk("single");
    });
  }
};
