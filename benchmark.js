#!/usr/bin/env node
'use strict'

const webpack = require('webpack')

const CommonConfig = {
  entry: 'index.js',
  devtool: 'source-map', // slow, important
  output: {
    path: `${__dirname}/tmp`,
    filename: 'compiled.js',
    sourceMapFilename: '[file].map',
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
  ],
  resolve: {
    modules: [ '.', 'node_modules' ],
  },
  stats: {
    timings: true,
  }
}

const UglifyEachFileConfig = Object.assign({}, CommonConfig, {
  module: {
    loaders: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'uglify-loader',
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },
})

const UglifyOnceConfig = Object.assign({}, CommonConfig, {
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
  ],
})


function runPipelineWithConfig(config, callback) {
  webpack(config, (err, stats) => {
    if (err) return callback(err)
    if (stats.hasErrors()) return callback(new Error(JSON.stringify(stats.toJson().errors)))
    callback(null, stats)
  })
}

function main(callback, nRemaining) {
  const t1 = new Date()
  runPipelineWithConfig(UglifyOnceConfig, (err, stats) => {
    if (err) return callback(err)

    const t2 = new Date()
    const time1 = t2 - t1
    const nBytes1 = stats.compilation.assets['compiled.js'].size()
    console.log(`Uglify-once produced ${nBytes1} bytes in ${time1}ms`)

    runPipelineWithConfig(UglifyEachFileConfig, (err, stats) => {
      const t3 = new Date()
      const time2 = t3 - t2
      const nBytes2 = stats.compilation.assets['compiled.js'].size()
      console.log(`Uglify-each produced ${nBytes2} bytes in ${time2}ms`)

      if (nRemaining === 0) {
        callback()
      } else {
        main(callback, nRemaining - 1)
      }
    })
  })
}

main((err) => { if (err) throw err }, 10)
