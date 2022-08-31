module.exports = function(api) {
  api.cache.never()
  //const isTest = api.env('test')

  // These are run in reverse order. @babel/preset-typescript is run first.
  const presets = [
    [ "@babel/preset-env", { useBuiltIns: "usage", corejs: 3 } ],
    [ "@babel/preset-react" ],
    [ "@babel/preset-typescript"]
  ]

  const plugins = []

  return { presets, plugins }
}
