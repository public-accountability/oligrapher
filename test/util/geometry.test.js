import { xy, translatePoint } from '../../app/util/geometry'

describe("geometry", function() {
  describe("xy", function() {
    specify("object with xy", function() {
      let obj = { foo: 'bar', x: 4, y: 2}
      expect(xy(obj)).to.eql({x: 4, y: 2})
    })
  
    specify("object without xy", function() {
      let obj = { foo: 'bar' }
      expect(xy(obj)).to.eql({})
    })
  })
  
  specify("translatePoint", function() {
    let point = { x: 10, y: 10 }
    let deltas = { x: -10, y: 10 }
    let result = { x: 0, y: 20 }
    expect(translatePoint(point, deltas)).to.eql(result)
  })
})