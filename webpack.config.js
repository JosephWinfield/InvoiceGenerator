var ExtractTextPlugin = require('extract-text-webpack-plugin')

var config = {
  entry: {
    path: './src/main.js',
  },
  output: {
    path: './dist/javascripts',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.css/,
        loaders:[
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  devtool: 'eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
  delete config.devtool;
  var webpack = require('webpack');
  config.plugins = [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' })  ];
}

module.exports = config;
