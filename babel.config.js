module.exports = {
  presets: ["@babel/preset-env", "@babel/preset-react"],
  resolve: {
    fallback: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      timers: require.resolve("timers-browserify"),
    },
  },
};
