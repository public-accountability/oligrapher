import React from 'react';
import Root from '../../app/containers/Root'


describe('<Root>', function() {
  it('renders container div', function()  {
    let root = shallow(<Root />);
    expect(root.find('#oligrapher-container').length).to.equal(1)
  })
})
