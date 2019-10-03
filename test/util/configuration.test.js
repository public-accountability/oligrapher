import configuration from '../../app/util/configuration'

describe('configuration', function(){
  it('merges default attributes with user\'s values', function() {
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


  it("throws if map mode is invalid", function(){
    expect(
      () => configuration({mode: "invalidMode"})
    ).to.throw();
  })
})
