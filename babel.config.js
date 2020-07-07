require("@babel/register")({
  ignore: [
    /node_modules\/(?!@public-accountability\/littlesis-api)/
  ]
})

module.exports = function(api) {
  // These are run in reserve order. @babel/preset-react is run first.
  const presets = [
    [ "@babel/preset-env", { useBuiltIns: "usage", corejs: 3 } ],
    [ "@babel/preset-react", {} ]
  ]

  const plugins = [
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining"
  ]

  api.cache.never()

  return {
    presets,
    plugins
  }
}
