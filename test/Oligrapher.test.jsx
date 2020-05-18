import Oligrapher from '../app/Oligrapher'
import ReactDOM from 'react-dom'
import sinon from 'sinon'


describe('Oligrapher', function() {
  describe('new Oligrapher.jsx()', function() {
    beforeEach(function() {
      sinon.stub(ReactDOM, 'render')
      sinon.stub(document, 'getElementById').returns("FakeElement")
    })

    afterEach(function() {
      ReactDOM.render.restore()
      document.getElementById.restore()
    })

    it("sets the store", function() {
      let oli = new Oligrapher()
      expect(oli.store).to.exist
    })

    // redux-undo creates "present" prefix to current state
    it ("merges in configuration with default state", function() {
      let oli = new Oligrapher({settings: { debug: true} })
      let state = oli.store.getState()
      expect(state.settings.debug).to.eql(true)
      expect(state.graph.nodes).to.eql({})
    })

    it("renders the application once with ReactDOM", function() {
      new Oligrapher()
      expect(ReactDOM.render.callCount).to.eql(1)
    })
  })
})
