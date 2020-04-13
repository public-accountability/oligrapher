import React from 'react'
import Svg from '../../../app/components/graph/Svg'

describe('<Svg>', function() {
  let props = {
    width: "10",
    height: "10",
    viewBox: {
      minX: 1,
      minY: 2,
      w: 3,
      h: 4
    }
  }

  it('sets viewBox string', function() {
    let svg = shallow(<Svg {...props}><div></div></Svg>)
    expect(svg.prop('viewBox')).to.equal("1 2 3 4")
    expect(svg.prop('xmlns')).to.not.exist
  })

  it('has xmlns attribute if outermost is true', function() {
    let svg = shallow(<Svg {...props} outermost={true} ><div></div></Svg>)
    expect(svg.prop('xmlns')).to.exist
  })

  it('sets width & height', function() {
    let svg = shallow(<Svg {...props}><div></div></Svg>)
    expect(svg.prop('width')).to.equal("10")
    expect(svg.prop('height')).to.equal("10")
  })
})
