import * as helpers from '../../app/helpers'
import configuration from '../../app/util/configuration'
import GraphModel from '../../app/models/Graph'

describe('configuration', function(){
  const fakeElement = { height: 100, width: 100 }

  beforeEach(function() {
    sinon.stub(helpers, 'getElementById').returns(fakeElement)
  })

  afterEach(function() {
    helpers.getElementById.restore()
  })

  it("merges default attributes with user's values", function() {
    let c = configuration({
      "attributes": {
        "title": "My Map",
        "user": { "name": "Alice" },
        "settings": { "private": true }
      }
    })

    expect(c.attributes.title).to.equal("My Map")
    expect(c.attributes.user.name).to.equal("Alice")
    expect(c.attributes.user.url).to.equal(null)
  })

  it("sets rootElement", function() {
    expect(configuration().settings.rootElement).to.eql(fakeElement)
    expect(helpers.getElementById.callCount).to.eql(1)
  })

  it("initializes Graph model", function() {
    let config = configuration()
    expect(config.graph).to.be.instanceOf(GraphModel)
  })
})
