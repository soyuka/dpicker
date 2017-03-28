const root = `${__dirname}/..`
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PRODUCTION = process.env.NODE_ENV === 'production'

const extractSass = new ExtractTextPlugin({
  filename: 'style.css',
  disable: PRODUCTION === false
})

module.exports = {
  entry: `${root}/src/index.js`,
  devtool: PRODUCTION === false ? 'cheap-eval-source-map' : 'source-map',
  output: {
    filename: 'bundle.js',
    path: `${root}/public/dist`
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
            loader: "css-loader" // translates CSS into CommonJS
          }, {
            loader: "sass-loader", // compiles Sass to CSS
            options: {
              includePaths: [`${root}/node_modules/bootstrap-sass/assets/stylesheets`]
            }
          }],
          fallback: 'style-loader'
        })
      }
    ]
  },
  devServer: {
    contentBase: `${root}/public`
  },
  plugins: [
    extractSass
  ]
}
