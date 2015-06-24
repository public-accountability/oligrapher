const chai = require('chai');
const should = chai.should();
const Graph = require('../../app/models/Graph');

describe('Graph methods', () => {

  describe('#parseApiGraph', () => {

    it('produces a Graph object', () => {

      const fakeApiGraph = require('../support/sampleData/fakeApiGraph');
      const fakeGraph = require('../support/sampleData/fakeGraph');
      const g = Graph.parseApiGraph(fakeApiGraph);

      g.id.should.eql(fakeGraph.id);
      g.display.should.eql(fakeGraph.display);
      g.nodes.size.should.eql(fakeGraph.nodes.size);
      g.edges.size.should.eql(fakeGraph.edges.size);
    });

  });

});
