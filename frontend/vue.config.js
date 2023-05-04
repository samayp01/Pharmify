const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    allowedHosts: "all",
    port: 80
  },
  chainWebpack: config => {
    config.plugin('define').tap(args => {
      args[0]['process.env'].VUE_APP_VAPID_PUBLIC_KEY = JSON.stringify(process.env.VUE_APP_VAPID_PUBLIC_KEY);
      return args;
    });
  }
})
