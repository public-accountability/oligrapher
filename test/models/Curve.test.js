import Curve from '../../app/models/Curve.js'

describe('Curve', function() {
  let start = { x: 0, y: 0 }
  let end =  { x: 10, y: 0 }

  it('sets start & end attributes', function() {
    const c = new Curve({ start, end })
    expect(c.start).to.eq(start)
    expect(c.end).to.eq(end)
  })

  it('calculates control', function() {
    const c = new Curve({ start, end })
    expect(c.control).to.be.ok
  })

  it('uses control from attributes if defined', function() {
    let control = { x: 2, y: 2}
    const c = new Curve({ start, end, control })
    expect(c.control).to.eql(control)
  })

  describe('get d', function() {
    let control = { x: 2, y: 2}
    const c = new Curve({ start, end, control })

    it('returns svg path attribute string', function() {
      expect(c.d).to.eql("M 0,0 Q 2,2 10,0")
    })
  })
})
