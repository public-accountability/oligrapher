import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import sinon from 'sinon'

import EditEdgeStyle from '../../app/components/EditEdgeStyle'
import Edge from '../../app/graph/edge'
import Node from '../../app/graph/node'

describe('<EditEdgeStyle />', function() {
  let edge, node1, node2, updateEdge

  beforeEach(function() {
    node1 = Node.new({ name: 'bob' })
    node2 = Node.new({ name: 'bozo' })
    edge = Edge.newEdgeFromNodes(node1, node2, {
      arrow: false,
      dash: false
    })
    updateEdge = sinon.spy()
  })

  it('updates edge when arrows and dash buttons are clicked', function() {
    const { container } = render(
      <EditEdgeStyle edge={edge} nodes={[node1, node2]} updateEdge={updateEdge} />
    )

    container.querySelectorAll('button.edge-style-button').forEach((button, i) => {
      let buttonContent = button.innerHtml
      fireEvent.click(button)
      expect(updateEdge.callCount).to.equal(i + 1)
      expect(buttonContent).not.to.equal(button.innerHTML)
    })
  })
})