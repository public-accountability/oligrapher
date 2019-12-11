import displayReducer from '../../app/reducers/display'

describe('Display Reducer', function() {
  describe('SET_MODE', function() {
    it('changes editor to true', function() {
      const state = { foo: 'bar',
                      modes: { editor: false,
                               story: false } }

      const action = {type: 'SET_MODE', mode: 'editor', enabled: true}

      expect(displayReducer(state, action))
        .to.eql({ foo: 'bar', modes: { editor: true, story: false } })
    })
  })

  describe('OPEN_TOOL', function() {
    it('changes tool', function() {
      const state = { editor: { editNode: null, tool: 'node' } }
      const action = { type: 'OPEN_TOOL', item: 'edge'}
      expect(displayReducer(state, action)) .to.eql({ editor: { editNode: null, tool: 'edge' } })
    })

    it("removes editNode", function() {
      const state = { editor: { editNode: 'abc', tool: 'node' } }
      const action = { type: 'OPEN_TOOL', item: 'edge'}
      expect(displayReducer(state, action)) .to.eql({ editor: { editNode: null, tool: 'edge' } })
    })
  })

  describe('OPEN_EDIT_NODE_MENU', function() {
    it('set editNode', function() {
      const state = { editor: { editNode: 'abc', tool: 'node' } }
      const action = { type: 'OPEN_EDIT_NODE_MENU', id: 'xyz'}
      expect(displayReducer(state, action))
        .to.eql({ editor: { editNode: 'xyz', tool: 'node' } })
    })
  })
})
