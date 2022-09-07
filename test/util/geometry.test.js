import { xy, translatePoint } from '../../app/util/geometry'

describe("geometry", function () {
  test("xy", function () {
    let obj = { foo: 'bar', x: 4, y: 2 }
    expect(xy(obj)).toEqual({ x: 4, y: 2 })
    obj = { foo: 'bar' }
    expect(xy(obj)).toEqual({})
  })

  test("translatePoint", function () {
    let point = { x: 10, y: 10 }
    let deltas = { x: -10, y: 10 }
    let result = { x: 0, y: 20 }
    expect(translatePoint(point, deltas)).toEqual(result)
  })
})
