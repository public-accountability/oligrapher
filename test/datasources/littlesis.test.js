import LittlesisDataSource from 'datasources/littlesis';

afterEach(() => fetch.resetMocks());

const responses = {
  findNodes: [
    {
      "id": 348096,
      "display": {
	"name": "Bob",
	"image": null,
	"url": "http://localhost:8080/person/348096-Bob"
      }
    },
    {
      "id": 345706,
      "display": {
	"name": "Alice",
	"image": null,
	"url": "http://localhost:8080/person/345706-Alice"
      }  
    }
  ]
}

test('has name attribute', () => {
  expect(LittlesisDataSource.name).toEqual('LittleSis');
});


test('findNodes requests nodes from server', done => {
  fetch.mockResponseOnce(JSON.stringify(responses.findNodes))

  LittlesisDataSource.findNodes("people", (nodes) => {
    expect(nodes).toEqual(responses.findNodes);
    done();
  });
});
