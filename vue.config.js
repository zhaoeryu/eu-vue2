const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
// const webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, dir)
}

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    port: 8080,
    client: {
      // 当出现错误时是否在浏览器中显示全屏覆盖。默认值为true
      overlay: false
    }
  },
  configureWebpack: config => {
    // 生产环境下对编译后的文件进行gzip压缩
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          // webpack 打包时，对文件进行分割，每个文件最小 204,800 个字符
          // new webpack.optimize.MinChunkSizePlugin({
          //   // Minimum number of characters
          //   minChunkSize: 1024 * 200
          // }),
          // webpack 打包时，进行gzip压缩
          new CompressionPlugin({
            // 压缩文件格式
            test: /\.(js|css|html)?$/i,
            // 压缩后的文件名
            filename: '[path][base].gz',
            // 使用gzip压缩
            algorithm: 'gzip',
            // 压缩率小于1才会压缩
            minRatio: 0.8,
            // 是否删除原有静态资源文件
            deleteOriginalAssets: false
          })
        ]
      }
    }
  },
  chainWebpack: config => {
    // 设置网站标题
    config
      .plugin('html')
      .tap(args => {
        args[0].title= 'EuBackend'
        return args
      })
    // svgIcon
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
})
