import Curve from '../../app/graph/curve'
import Node from '../../app/graph/node'

import { xy } from '../../app/util/helpers'

describe('Curve', function() {
  describe('helper functions', function() {
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

  describe('calculateGeometry', function() {
    let edge = { cx: null, cy: null, x1: 0, y1: 0, x2: 10, y2: 0, s1: 1, s2: 1 }

    it('calculates midpoint', function(){
      expect(xy(Curve.calculateGeometry(edge))).to.eql({x: 5, y: 0})
    })

    it('sets cx, cy', function() {
      const geom = Curve.calculateGeometry(edge)
      expect(geom.cx).to.be.a('number')
      expect(geom.cy).to.be.a('number')
    })

    it('sets xa,ya, xb, yb', function() {
      const geom = Curve.calculateGeometry(edge)
      const keys = ['xa', 'ya', 'xb', 'yb']
      keys.forEach( key => expect(geom[key], `${key} is not a number`).to.be.a('number'))
    })

    it("sets is_reverse", function(){
      expect(Curve.calculateGeometry(edge).is_reverse).to.be.false
      expect(Curve.calculateGeometry({...edge, x2: -1}).is_reverse).to.be.true
    })
  })
})
