module.exports = function (api) {
  // These are run in reserve order. @babel/preset-react is run first.
  const presets = [
    [ "@babel/preset-env",   { useBuiltIns: "usage", corejs: 3 } ],
    [ "@babel/preset-react", {} ]
  ];

  const plugins = [];

  api.cache.never();

  return {
    presets,
    plugins
  };
};
