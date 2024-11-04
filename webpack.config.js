const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require("dotenv").config();
const webpack = require("webpack");

module.exports = {
  // Development mode enables built-in optimizations and sets process.env.NODE_ENV to 'development'
  mode: "development",

  // Entry point of the application
  entry: "./src/index.js",

  // Output configuration for the development build
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  // Source maps for debugging
  devtool: "inline-source-map",

  // Webpack Dev Server configuration
  devServer: {
    server: "http",
    static: "./dist", // Folder to serve the files from
    historyApiFallback: true, // Fallback to index.html for Single Page Applications
    hot: true, // Enable Hot Module Replacement
    open: true, // Open the browser after server had been started
    port: 3000, // Port to run the server on
  },

  // Loaders and rules for handling different file types
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Match JavaScript and JSX files
        exclude: /node_modules/, // Exclude the node_modules directory
        use: {
          loader: "babel-loader", // Use babel-loader for transpiling
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"], // Presets for ES6 and React
            plugins: ["@babel/plugin-proposal-class-properties"], // Plugin for class properties
          },
        },
      },
      {
        test: /\.css$/, // Match CSS files
        use: ["style-loader", "css-loader"], // Use style-loader and css-loader for CSS files
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/, // Match image files
        type: "asset/resource", // Use asset/resource to emit a separate file and export the URL
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },

  // Plugins for enhancing the development experience
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./public/BP_resources", to: "BP_resources" },
        { from: "./public/bp_assets", to: "bp_assets" },
      ],
    }),
    new CleanWebpackPlugin(), // Clean the /dist folder
    new HtmlWebpackPlugin({
      template: "./public/index.html", // Template for the HTML file
      favicon: "./public/favicon.ico", // Favicon path
    }),
    new webpack.HotModuleReplacementPlugin(), // Enable hot module replacement
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.parsed), // Be cautious with exposing all environment variables
      "process.env.REACT_APP_BACKEND_URL": JSON.stringify(
        process.env.REACT_APP_BACKEND_URL
      ),
    }),
  ],
};
