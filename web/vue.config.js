module.exports = {
  devServer: {
    allowedHosts: ["all"],
    disableHostCheck: true,
    public: '',
    progress: false,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
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
