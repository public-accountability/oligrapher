import { applyZoomToViewBox } from '../../app/util/dimensions'

describe('applyZoomToViewBox', function() {
  it('applies zoom', function() {
    let viewBox = {
      minX: -200,
      minY: -100,
      w: 400,
      h: 200
    }
    let zoom = 0.5
    expect(applyZoomToViewBox(viewBox, zoom)).to.eql({
      minX: -400,
      minY: -200,
      w: 800,
      h: 400
    })
  })
})