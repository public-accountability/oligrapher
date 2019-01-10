module.exports = function (api) {
  const presets = [
    "@babel/preset-env",
    ["@babel/preset-react", { "modules": false } ]
  ];
  const plugins = [];

  api.cache.never();

  return {
    presets,
    plugins
  };
};
