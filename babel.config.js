module.exports = function(api) {
  const isTest = api.env('test')

  // These are run in reverse order. @babel/preset-react is run first.
  const presets = [
    [ "@babel/preset-env", { useBuiltIns: "usage", corejs: 3 } ],
    [ "@babel/preset-react", {} ],
    [ "@babel/preset-typescript"]
  ]

  const plugins = ["@loadable/babel-plugin"]

  // const plugins = [
  //   "@babel/plugin-proposal-class-properties",
  //   "@babel/plugin-proposal-optional-chaining",
  //   "@loadable/babel-plugin"
  // ]

  api.cache(true)
  // api.cache.never()

  return { presets, plugins }
}
