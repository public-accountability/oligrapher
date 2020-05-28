import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import pick from 'lodash/pick'
import uniq from 'lodash/uniq'
import { Button } from '@material-ui/core'
import { MdPhotoSizeSelectSmall, MdFormatColorFill, MdImage } from "react-icons/md"

import Toolbox from './Toolbox'
import EditNodeColorPage from './EditNodeColorPage'
import SizePicker from './SizePicker'
import { callWithTargetValue } from '../util/helpers'

// returns attribute value the given nodes have in common
function sharedAttribute(nodes, attribute) {
  const attributes = uniq(nodes.map(node => node[attribute]))
  return attributes.length === 1 ? attributes[0] : null
}

export default function StyleNodesMenu() {
  const dispatch = useDispatch()
  const nodeIds = useSelector(state => state.display.selection.node)
  const nodes = useSelector(state => Object.values(pick(state.graph.nodes, nodeIds)))
  const colors = useSelector(state => Object.values(state.graph.nodes).map(node => node.color))

  const [page, setPage] = useState('color')
  const [image, setImage] = useState(sharedAttribute(nodes, 'image') || '')
  const [color, setColor] = useState(sharedAttribute(nodes, 'color') || '#cccccc')
  const [scale, setScale] = useState(sharedAttribute(nodes, 'scale') || 1)

  const handleImageChange = useCallback(callWithTargetValue(setImage), [])

  const handleSubmit = useCallback(() => {
    const attributes = pick({ image, color, scale }, page)
    dispatch({ type: 'UPDATE_NODES',  nodeIds, attributes: attributes })
  }, [dispatch, nodeIds, image, color, scale, page])

  return (
    <Toolbox title="Style Nodes">
      <div className="oligrapher-style-nodes">
        <main>
          { page === 'color' &&
            <EditNodeColorPage color={color} onChange={setColor} colors={colors} />
          }

          { page === 'size' && 
            <SizePicker scale={scale} onChange={setScale} />
          }

          { page === 'image' &&
            <>
              <label>Image</label>
              <input type="url" value={image} placeholder="image url" onChange={handleImageChange} />
            </>
          }
        </main>

        <hr />

        <div className="editor-page-buttons">
          <div>
            <span title="Color" className="entity-color-icon" onClick={() => setPage('color')}>
              <MdFormatColorFill />
            </span>

            <span title="Size" className="entity-size-icon" onClick={() => setPage('size')}>
              <MdPhotoSizeSelectSmall />
            </span>

            <span title="Image" className="entity-image-icon" onClick={() => setPage('image')}>
              <MdImage />
            </span>
          </div>
        </div>

        <hr />

        <footer>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary" 
            size="small" 
            disabled={nodeIds.length === 0} 
            disableElevation={true}
          >
            Apply
          </Button> 
          <div className="oligrapher-style-nodes-count">Nodes selected: {nodeIds.length}</div>
        </footer>
      </div>
    </Toolbox>
  )
}