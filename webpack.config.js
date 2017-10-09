const path = require('path')

module.exports = {
  entry: {
    path: './src/main.js',
  },
  output: {
    path: path.resolve(__dirname,'dist', 'javascripts'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
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
