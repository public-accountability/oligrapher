import * as helpers from '../app/helpers';
import * as render from '../app/util/render';
import Oligrapher from '../app/Oligrapher'

describe('main', function() {
  beforeEach(function() {
    sinon.stub(render, 'renderNewApplication')
    sinon.stub(helpers, 'getElementById')
  });

  afterEach(function() {
    render.renderNewApplication.restore();
    helpers.getElementById.restore();
  });

  it("merges configuration together", function() {
    let oli = new Oligrapher({ "logActions": true})
    expect(oli.config.domId).to.equal('oligrapher');
    expect(oli.config.logActions).to.equal(true);
  })
})
