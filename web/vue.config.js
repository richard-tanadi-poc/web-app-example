module.exports = {
  devServer: {
    allowedHosts: ['all'],
    host: "0.0.0.0",
    port: 8080,
    disableHostCheck: true,
    public: '',
    progress: false,
    proxy: {
      '^/api': {
        target: 'http://192.168.1.242/api',
        ws:true,
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
        pathRewrite: {
           '^/api': ''
        }
      },
    },
  },
};
