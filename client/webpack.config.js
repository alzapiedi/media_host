module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: [__dirname, 'node_modules']
  },
  output: {
    path: __dirname + '/build',
    filename: 'app.js'
  },
  devtool: 'source-map',
  mode: 'development'
};
