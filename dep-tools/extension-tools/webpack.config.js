const path = require('path');
const webpack = require('webpack');
module.exports = {
  entry: {
    manage:'../../templates/admin/manage/manage.ts',
    publish:'../../templates/admin/publish/publish.ts'
  },
  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/,
        use:{
          loader: "babel-loader",
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                    useBuiltIns:"entry",
                    corejs: "3.9.1"
                }
              ],
              [
                '@babel/preset-typescript',
              ]
            ]
          }
        },
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  target: ["web", "es5"],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../static/js'),
  },
};