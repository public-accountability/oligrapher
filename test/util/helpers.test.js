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
})
