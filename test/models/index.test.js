import { setAttributes } from '../../app/models'
import curry from 'lodash/curry'

describe('setAttributes', function(){
  class TestClass {
    value = null

    constructor(attributes) {
      setAttributes(this, attributes)
    }
  }

  it('ignores empty constructor', function() {
    let obj = new TestClass()
    expect(obj.value).to.be.null
  })

  it('sets attributes', function() {
    let obj = new TestClass({value: 'TestValue'})
    expect(obj.value).to.eql('TestValue')
  })

  it('can be curried', function() {
    let obj = { foo: null }
    let updateObj = curry(setAttributes)(obj)
    updateObj({foo: 'bar'})
    expect(obj.foo).to.eq('bar')
  })

  it('ignores invalid attributes', function() {
    let obj = new TestClass({foo: 'bar'})
    expect(obj.foo).to.be.undefined
  })
})
