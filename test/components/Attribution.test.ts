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
  const result = renderWithStore(Attribution, { users, create_date: "July 10, 2025", modified_date "July 16, 2025"})
  expect(result.container.querySelector('#oligrapher-attribution-date').textContent).toEqual("Created on July 10, 2025.  Last updated on July 16, 2025.")
})
