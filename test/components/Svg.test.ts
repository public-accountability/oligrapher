import Svg from '../../app/components/Svg'

const props = {
  width: "10",
  height: "10",
  viewBox: {
    minX: 1,
    minY: 2,
    w: 3,
    h: 4
  }
}
test('<Svg>', async function() {
  const result = renderWithStore(Svg, { ...props, children: [createElement('g', { key: 'testkey' })] } )
  expect(result.container.querySelectorAll('svg').length).toEqual(1)
})
