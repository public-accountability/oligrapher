import * as helpers from '../../app/util/helpers'

describe("Helpers", function() {
  describe("xy", function() {
    specify("object with xy", function() {
      let obj = { foo: 'bar', x: 4, y: 2}
      expect(helpers.xy(obj)).to.eql({x: 4, y: 2})
    })

    specify("object without xy", function() {
      let obj = { foo: 'bar' }
      expect(helpers.xy(obj)).to.eql({})
    })
  })

  specify("translatePoint", function() {
    let point = { x: 10, y: 10 }
    let deltas = { x: -10, y: 10 }
    let result = { x: 0, y: 20 }
    expect(helpers.translatePoint(point, deltas)).to.eql(result)
  })

  specify('createStateUpdater', function() {
    const mockOldState = { a: '1', b: '2'}
    let state = mockOldState
    const mockUseStateSetter = (f) => state = f(mockOldState)
    const updateB = helpers.createStateUpdater(mockUseStateSetter, 'b')
    expect(state).to.eql({ a: '1', b: '2'})
    updateB('3')
    expect(state).to.eql({ a: '1', b: '3'})
  })
})
