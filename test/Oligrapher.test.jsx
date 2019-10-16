import * as helpers from '../app/helpers'
import * as render from '../app/util/render'
import Oligrapher from '../app/Oligrapher'

describe('Oligrapher', function() {
  beforeEach(function() {
    sinon.stub(render, 'renderNewApplication')
    sinon.stub(helpers, 'getElementById').returns("FakeElement")
  })

  afterEach(function() {
    render.renderNewApplication.restore()
    helpers.getElementById.restore()
  })

  it("sets the store", function() {
    let oli = new Oligrapher()
    expect(oli.store).to.exist
  })
})
