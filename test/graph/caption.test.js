import Caption from '../../app/graph/caption'
import { expect } from 'chai'

describe('Caption', function() {
  specify('Caption.new', function(){
    expect(Caption.new().id).to.be.ok
  })

  specify('caption.new merge values', function(){
    let c = Caption.new({x: 1, y:2})
    expect(c.x).to.eql(1)
    expect(c.y).to.eql(2)
  })
})
