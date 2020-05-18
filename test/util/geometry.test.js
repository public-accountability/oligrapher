import geometry from '../../app/util/geometry'

describe("geometry", function() {
  describe("xy", function() {
    specify("object with xy", function() {
      let obj = { foo: 'bar', x: 4, y: 2}
      expect(geometry.xy(obj)).to.eql({x: 4, y: 2})
    })
  
    specify("object without xy", function() {
      let obj = { foo: 'bar' }
      expect(geometry.xy(obj)).to.eql({})
    })
  })
  
  specify("translatePoint", function() {
    let point = { x: 10, y: 10 }
    let deltas = { x: -10, y: 10 }
    let result = { x: 0, y: 20 }
    expect(geometry.translatePoint(point, deltas)).to.eql(result)
  })
})