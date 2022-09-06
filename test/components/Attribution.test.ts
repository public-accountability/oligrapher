import Attribution from '../../app/components/Attribution'

const users = [
  { name: "TestName", url: "https://example.com/TestName" },
  { name: "Bozo", url: "https://example.com/Bozo" }
]

test("Attribution renders users byline", async function(){
  const result = renderWithStore(Attribution, { users })
  expect(result.container.querySelector('#oligrapher-attribution-users').textContent).toEqual("by TestName and Bozo")
  expect(result.container.querySelectorAll('a')[0]['href']).toEqual(users[0].url)
  expect(result.container.querySelectorAll('a')[1]['href']).toEqual(users[1].url)
})

test("Attribution renders date", async function(){
  const result = renderWithStore(Attribution, { users, date: "Test Date"})
  expect(result.container.querySelector('#oligrapher-attribution-date').textContent).toEqual("Test Date")
})
