import { setAttributes, maybeSetValues } from '../../app/models'

describe('setAttributes', function() {
  it("sets attributes from a hash if it is a key on the model", function(){
    let TestClass = class {
      foo = null
    }

    let testInstance = new TestClass()
    setAttributes(testInstance, { foo: 'bar', one: 'one'})
    expect(testInstance.foo).to.eq('bar')
    expect(testInstance.one).to.be.undefined
  })
})


describe.only('maybeSetValues', function() {
  it("does nothing is src or dest is not defined", function() {
    expect(() => maybeSetValues(undefined, {}, 'foo','bar'))
      .to.not.throw()
  })

  it("sets values from src", function() {
    let src = {one: 1, two: 2}
    let dest = {}
    maybeSetValues(src, dest, 'one', 'two')
    expect(dest.one).to.eq(1)
    expect(dest.two).to.eq(2)
  })

  it("whitelisting keys", function() {
    let src = {one: 1, two: 2}
    let dest = {}
    maybeSetValues(src, dest, 'one')
    expect(dest.one).to.eq(1)
    expect(dest.two).to.eq(undefined)
  })
})
