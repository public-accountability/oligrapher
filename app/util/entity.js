export function entityLink(id, name, ext) {
  const baseUrl = 'https://littlesis.org'
  const primaryEntityType = ext.toLowerCase() === 'person' ? 'person' : 'org'
  const slug = id.toString() + '-'  + name.replace(' ', '_')
  return [baseUrl, primaryEntityType, slug].join('/')
}
