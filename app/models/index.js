export function setAttributes(model, attributes, keys = null) {
  if (attributes) {
    (keys || Object.keys(model)).forEach(key => {
      model[key] = attributes[key]
    })
  }
}
