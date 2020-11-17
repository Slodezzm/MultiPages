const path = require('path')

module.exports = {
  entry: {
    KPlayer: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: '[name].min.js',
    library: '[name]',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: {
          loader: "babel-loader",
          options: {
            // presets: [
            //   [
            //     "@bable/preset-env",
            //     {
            //       useBuiltIns: "usage",
            //       corejs: 2
            //     }
            //   ]
            // ]
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      },
      {
        test: /\.svg$/,
        use: [
          'svg-inline-loader'
        ]
      },
      {
        test: /\.art$/,
        use: [
          'art-template-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
    ]
  }
}

