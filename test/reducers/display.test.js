import displayReducer from '../../app/reducers/display'

describe('Display Reducer', function() {
  describe('SET_MODE', function() {
    it('changes editor to true', function() {
      const state = { foo: 'bar',
                      modes: { editor: false,
                               story: false } }

      expect(
        displayReducer(state, {type: 'SET_MODE', mode: 'editor', enabled: true})
      ).to.eql({
        foo: 'bar',
        modes: { editor: true,
                 story: false }
      })

    })
  })
})
