const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: {
    archives:'./templates/archives/archives.js',
    manage:'./templates/admin/manage/manageArticles.js',
    publish:'./templates/admin/publish/publish.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'static/js')
  },
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  module:{
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options:{
            presets:[
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  corejs: 3
                }
              ]
            ]
          },
        },
        exclude: '/node_modules/'
      }
    ]
  },
  // plugins:[
  //   new UglifyJsPlugin({
  //     uglifyOptions: {
  //       compress: {
  //         drop_console: false
  //       }
  //     }
  //   })
  // ],
  externals:{
    moment:'moment',
    loglevel:'log',
    axios:'axios',
    lodash:"_",
    jquery:'$'
  }
};
