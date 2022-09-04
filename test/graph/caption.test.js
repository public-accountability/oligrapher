import Caption from '../../app/graph/caption'

describe('Caption', function() {
  test('Caption.new', function(){
    expect(Caption.new().id).toBeTruthy()
  })

  test('caption.new merge values', function(){
    let c = Caption.new({x: 1, y:2})
    expect(c.x).toEqual(1)
    expect(c.y).toEqual(2)
  })
})
