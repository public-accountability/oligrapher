import Curve from '../../app/graph/curve'
import Node from '../../app/graph/node'

describe('Curve', function() {
  let n1, n2

  beforeEach(function() {
    n1 = Node.new({x: 0, y: 0 })
    n2 = Node.new({x: 10, y: 10 })
  })

  specify('midpoint()', function() {
    expect(Curve.util.midpoint(n1, n2)).to.eql({x: 5, y: 5})
  })

  specify('parseCurveString with space', function() {
    let curveString = "M 0 0 Q -200 -300 2 3"
    expect(Curve.util.parseCurveString(curveString))
      .to.eql([[0,0], [-200, -300], [2,3]])

  })

  specify('parseCurveString w/o space', function() {
    let curveString = "M 68.02 -68.47 Q 105 -93.8 114.8 -143.595"
    expect(Curve.util.parseCurveString(curveString))
      .to.eql([ [68.02, -68.47], [105, -93.8], [114.8, -143.595] ])

  })
})
