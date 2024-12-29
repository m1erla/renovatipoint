const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/ws",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
      ws: true, // Enable WebSocket
      pathRewrite: {
        "^/ws": "/ws",
      },
    })
  );

  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
    })
  );
};
