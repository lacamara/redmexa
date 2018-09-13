const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    publicPath: 'http://agir.local:3000/assets/components/',
    filename: '[name]-[hash].js',
  },
  watchOptions: {
    poll: 1000
  },
  devServer: {
    publicPath: 'http://agir.local:3000/assets/components/',
    contentBase: path.join(__dirname, '/assets/components/'),
    compress: true,
    hot: true,
    hotOnly: true,
    host: '0.0.0.0',
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    allowedHosts: [
      'agir.local'
    ]
  },
  optimization: {
    namedModules: true,
    noEmitOnErrors: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
});
