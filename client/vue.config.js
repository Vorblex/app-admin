const path = require('path');

module.exports = {
  configureWebpack: {
    devServer: {
      watchOptions: {
        ignored: path.resolve(__dirname, 'public/uploads/')
      }
    },
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src/'),
        '@': path.resolve(__dirname, 'src/components/'),
        'styles': 'sass'
      }
    }
  }
}