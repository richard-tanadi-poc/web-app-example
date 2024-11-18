module.exports = {
  devServer: {
    allowedHosts: ["all"],
    disableHostCheck: true,
    public: '',
    progress: false,
    proxy: {
      '^/api': {
        target: 'http://192.168.1.242/api',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
      },
    },
  },
};
