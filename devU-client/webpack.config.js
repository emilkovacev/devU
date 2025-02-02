const HtmlWebPackPlugin = require("html-webpack-plugin");
const HtmlWebpackInjector = require('html-webpack-injector');
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

const path = require("path");

module.exports = () => {

  const isDevServer = process.env.WEBPACK_DEV_SERVER;
  const env = process.env.NODE_ENV || "local";
  const dotenv = require('dotenv').config({ path: `./.env.${env}` });
  const envPlugin = new Dotenv({ path: `./.env.${env}`, systemvars: true });
  const htmlPlugin = new HtmlWebPackPlugin({
    template: "./src/index.html",
    filename: "./index.html",
    favicon: "./src/assets/favicon.ico",
    chunks: ["bundle", "index_head"],
  });
  const injectorPlugin = new HtmlWebpackInjector();
  const inlineSourceMaps = new webpack.SourceMapDevToolPlugin({
    filename: "[file].map",
    fallbackModuleFilenameTemplate: '[absolute-resource-path]',
    moduleFilenameTemplate: '[absolute-resource-path]'
  });

  return {
    module: {
      rules: [
        {
          test: /\.(tsx|ts|jsx|js)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        { test: /\.(sa|sc|c)ss$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader", options: { modules: true } },
            { loader: "sass-loader", options: {
                implementation: require("sass"),
                sassOptions: {
                  // Only thing this does is allow us to import variables without relative pathing
                  data: '@import "variables";',
                  includePaths: [path.resolve(__dirname, "src/assets")],
                  outputStyle: 'compressed',
                  sourceMap: true,
                  outFile: 'style.css'
                },
              }
            },
          ],
          exclude: /react-datepicker.css/
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2|png)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]",
                outputPath: "./assets/fonts/",
                publicPath:  "/assets/fonts/",
              },
            },
          ],
        },
        {
          test:[ /react-datepicker.css/],
          use: [{
            loader: 'style-loader'
          },{
            loader: 'css-loader',
          }],
          exclude:/src/
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],
      modules: [ path.join(__dirname, './src'), 'node_modules' ],
    },
    entry: {
      bundle: "./src/index.tsx",
      index_head: "./src/services/htmlHead.service.ts",
    },
    output: {
      path: path.join(__dirname, `/dist/${env}`),
      filename: "[name]-[fullhash:5].js",
      publicPath: "/",
    },
    optimization: {
      nodeEnv: `${env}`,
      usedExports: true,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
      },
    },
    stats: {
      entrypoints: false,
      children: false,
    },
    plugins: [envPlugin, htmlPlugin, injectorPlugin, inlineSourceMaps],
    devServer: {
      hot: true,
      port: process.env.PORT || 9000,
      static: {
        directory: path.join(__dirname, "dist"),
      },
      historyApiFallback: true,
    },
    devtool: 'inline-source-map',
  };
};
