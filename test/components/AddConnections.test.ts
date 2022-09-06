import { fireEvent, screen } from '@testing-library/react'
import AddConnections from '../../app/components/AddConnections'

const data =  [
  {
    "id": "36932",
    "name": "New York State Senate",
    "description": "The upper house of the New York State Legislature",
    "image": null,
    "url": "https://littlesis.org/org/36932-New_York_State_Senate",
    "edges": [
      {
        "id": "541800",
        "node1_id": "115495",
        "node2_id": "36932",
        "label": "Senator",
        "arrow": "1->2",
        "dash": false,
        "url": "https://littlesis.org/relationships/541800"
      }
    ]
  }
]

const graph = {
  "nodes": {
    "115495": {
      "id": "115495",
      "name": "Eric Adams",
      "x": 0,
      "y": 0,
      "scale": 1,
      "color": "#ccc",
      "edgeIds": [],
      "description": "Mayor of NYC",
      "image": null,
      "url": "https://littlesis.org/person/115495-Eric_Adams"
    }
  },
  "edges": {},
  "captions": {}
}

const server = setupServer(jsonHandler('/oligrapher/find_connections', data))

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('AddConnections', async function() {
  const result = renderWithStore(AddConnections, { id:  '115495' }, { graph })
  expect(screen.getByText(/loading/)).toBeInTheDocument()
  expect(await screen.findByTestId("entity-search-results")).toBeInTheDocument()

  expect(screen.getByText("New York State Senate")).toBeTruthy()
  expect(result.container.querySelector('.entity-search-description').textContent).toEqual(data[0].description)

  // on click
})
