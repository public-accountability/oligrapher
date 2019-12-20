import * as helpers from '../app/util/helpers'
import * as render from '../app/util/render'
import Oligrapher from '../app/Oligrapher'

describe('Oligrapher', function() {
  describe('new Oligrapher.jsx()', function() {
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

    it ("merges in configuration with default state", function() {
      let oli = new Oligrapher({settings: { debug: true} })
      let state = oli.store.getState()
      expect(state.settings.debug).to.eql(true)
      expect(state.graph.nodes).to.eql({})
    })
  })
})
