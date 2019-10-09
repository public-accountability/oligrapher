export function setAttributes(model, attributes) {
  if (attributes) {
    Object.keys(model).forEach(key => {
      model[key] = attributes[key]
    })
  }
}
