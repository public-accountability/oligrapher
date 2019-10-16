export function setAttributes(model, attributes) {
  if (!attributes) { return }

  const keys = Object.keys(model)

  for (const [key, value] of Object.entries(attributes)) {
    if (keys.includes(key)) {
      model[key] = value
    }
  }
}

export function maybeSetValues(src, dest, ...keys) {
  if (!(src && dest)) { return }

  for (let key in keys) {
    if (key in src) {
      dest[key] = src[key]
    }
  }
}
