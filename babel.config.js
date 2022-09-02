module.exports = function(api) {
  api.cache.never()

  // These are run in reverse order. @babel/preset-typescript is run first.
  const presets = [
    ["@babel/preset-env", {targets: {node: 'current'}}],
    ["@babel/preset-react"],
    ["@babel/preset-typescript"]
  ]

  const plugins = []

  return { presets, plugins }
}
