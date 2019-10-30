import { legacyComputeViewBox,
         computeViewBox } from '../../app/util/dimensions'

import { newGraph } from '../../app/graph/graph'
import { simpleGraph } from '../testData'

describe('refactor legacy computeViewBox', function() {
  it('returns same calculation for zoom = 1', function() {
    let legacyViewBox = legacyComputeViewBox(simpleGraph, 1)
    let viewBox = computeViewBox(simpleGraph, 1)
    expect(legacyViewBox).to.eql(viewBox)
  })

  it('returns same calculation for zoom = 1.2', function() {
    let legacyViewBox = legacyComputeViewBox(simpleGraph, 1.2)
    let viewBox = computeViewBox(simpleGraph, 1.2)
    expect(legacyViewBox).to.eql(viewBox)
  })

  it('returns default viewBox', function() {
    let defaultViewBox  = { minX: -200, minY: -200, w: 400, h: 400 }
    let g = newGraph()
    let legacyViewBox = legacyComputeViewBox(g, 1)
    let viewBox = computeViewBox(g, 1)

    expect(viewBox).to.eql(defaultViewBox)
    expect(legacyViewBox).to.eql(defaultViewBox)

  })
})
