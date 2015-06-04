const chai = require('chai');
const should = chai.should();
const util = require('../../../app/stores/util/NavStoreUtil');
const _ = require('lodash');

describe('NavStoreUtil', () => {

  const fullMenu = [{
    header: 'Maps',
    selected: false,
    cells: [{
      name: 'Mitchell Family',
      id: 556,
      action: 'showGraph'
    },
    {
      name: 'Berman-Considine',
      id: 146,
      action: 'showGraph'
    }]
  }, {
    header: 'Stories',
    selected: false,
    cells: [{
      name: 'Mary Had a Little Lamb',
      id: 1,
      action: 'tellStory'
    }]
  }];


  const noneSelected = [{
    header: 'Maps',
    selected: false,
    cells: []
  }, {
    header: 'Stories',
    selected: false,
    cells: []
  }];

  const col1Selected = [{
     header: 'Maps',
     selected: true,
     cells: [{
       name: 'Mitchell Family',
       id: 556,
       action: 'showGraph'
     },
     {
       name: 'Berman-Considine',
       id: 146,
       action: 'showGraph'
     }]
  },
  {
     header: 'Stories',
     selected: false,
     cells: []
  }];

  const col2Selected = [{
    header: 'Maps',
    selected: false,
    cells: []
  }, {
    header: 'Stories',
    selected: true,
    cells: [{
      name: 'Mary Had a Little Lamb',
      id: 1,
      action: 'tellStory'
    }]
  }];

  describe('#deselectAll', () => {

    it('deselects all columns and hides all cells', () =>
       util.deselectAll(fullMenu).should.eql(noneSelected));

    it('does not mutate the original menu', () => {
      const original = _.clone(fullMenu);
      util.deselectAll(fullMenu);
      original.should.eql(fullMenu);
    });
  });

  describe('#selectColumn', () => {

    describe('on a collapsed column', () => {

      it('expands the column and collapses others', () => {
        util.selectColumn(noneSelected, fullMenu, 'Maps').should.eql(col1Selected);
        util.selectColumn(col2Selected, fullMenu, 'Maps').should.eql(col1Selected);
        util.selectColumn(noneSelected, fullMenu, 'Stories').should.eql(col2Selected);
        util.selectColumn(col1Selected, fullMenu, 'Stories').should.eql(col2Selected);
      });

    });

    describe('on an expanded column', () => {

      it('collapses the column', () => {
        util.selectColumn(col1Selected, fullMenu, 'Maps').should.eql(noneSelected);
        util.selectColumn(col2Selected, fullMenu, 'Stories').should.eql(noneSelected);
      });

    });


    it('does not mutate the original menu', () => {
      const original = _.clone(fullMenu);
      util.selectColumn(noneSelected, fullMenu, 'Maps');
      original.should.eql(fullMenu);
    });
  });

});
