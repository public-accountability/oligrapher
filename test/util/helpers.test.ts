import { isLittleSisId } from '../../app/util/helpers'

test("isLittleSisId", () => {
  expect(isLittleSisId('foobar')).toBe(false)
  expect(isLittleSisId('123942')).toBe(true)
})
