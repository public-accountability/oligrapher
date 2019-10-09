import React from 'react'
import Svg from '../../../app/components/graph/Svg'

describe('<Svg>', function() {
  let props = {
      viewPortWidth: 10,
      viewPortHeight: 10,
      viewBoxMinX: 1,
      viewBoxMinY: 2,
      viewBoxWidth: 3,
      viewBoxHeight: 4
    }

  it('sets viewBox string', function() {
    let svg = shallow(<Svg  {...props}><div></div></Svg>)
    expect(svg.prop('viewBox')).to.equal("1 2 3 4")
    expect(svg.prop('xmlns')).to.not.exist
  })

  it('has xmlns attribute if outermost is true', function() {
    let svg = shallow(<Svg  {...props} outermost={true} ><div></div></Svg>)
    expect(svg.prop('xmlns')).to.exist
  })

  it('sets width & height', function() {
    let svg = shallow(<Svg  {...props}><div></div></Svg>)
    expect(svg.prop('width')).to.equal(10)
    expect(svg.prop('height')).to.equal(10)
  })
})
