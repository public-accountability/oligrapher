import reducers from '../app/reducers'

describe('Display Reducer', function() {
  describe('SET_MODE', function() {
    it('changes editor to true', function() {
      const state = { foo: 'bar',
                      display: { modes: { editor: false, story: false } } }

      const action = {type: 'SET_MODE', mode: 'editor', enabled: true}

      expect(reducers(state, action))
        .to.eql({ foo: 'bar', display: { modes: { editor: true, story: false } }})
    })
  })

  describe('OPEN_TOOL', function() {
    it('changes tool', function() {
      const state = { display: { editor: { editNode: null, tool: 'node' } }}
      const action = { type: 'OPEN_TOOL', item: 'edge'}
      expect(reducers(state, action)) .to.eql({display: { editor: { editNode: null, tool: 'edge' } }})
    })

    it("removes editNode", function() {
      const state = { display: { editor: { editNode: 'abc', tool: 'node' } } }
      const action = { type: 'OPEN_TOOL', item: 'edge'}
      expect(reducers(state, action)) .to.eql({ display: { editor: { editNode: null, tool: 'edge' } }})
    })
  })

  describe('OPEN_EDIT_NODE_MENU', function() {
    it('set editNode', function() {
      const state = {display : { editor: { editNode: 'abc', tool: 'node' } } }
      const action = { type: 'OPEN_EDIT_NODE_MENU', id: 'xyz'}
      expect(reducers(state, action))
        .to.eql({display: { editor: { editNode: 'xyz', tool: 'node' } }})
    })
  })
})
