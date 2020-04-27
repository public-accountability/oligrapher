import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { callWithTargetValue } from '../../util/helpers'

import Toolbox from './Toolbox'
import LittleSis from '../../datasources/littlesis3'

const addEditorAction = (setLoading, oligrapherId) => username => dispatch => {
  if (!oligrapherId) {
    throw new Error('Cannot add editors to maps without an id')
  }

  setLoading(true)

  LittleSis
    .editors(oligrapherId)
    .add(username)
    .then( json => {
      setLoading(false)
      dispatch({ type: 'SET_EDITORS', editors: json.editors })
    })
    .catch( err => {
      console.error(err)
      setLoading(false)
    })
}

function EditorList({editors}) {
  return <span>{editors.join(', ')}</span>
}

EditorList.propTypes = {
  editors: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default function Editors() {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const editors = useSelector(state => state.attributes.editors)
  const oligrapherId = useSelector(state => state.attributes.id)
  const submitUsername =  addEditorAction(setLoading, oligrapherId)


  return (
    <Toolbox title="Add Editors">
      <div className="add-editors-body">
        <div className="add-editors-fields">
          <input type="type"
                value={username}
                onChange={callWithTargetValue(setUsername)}
                placeholder="Enter username" />

          {/*This field is in our designs but it doesn't do anything right now. */}
          <textarea row="3"
                    cols="25"
                    value={message}
                    onChange={callWithTargetValue(setMessage)}
                    placeholder="Message" />
        </div>

        <hr />

        <div className="add-editors-bottom-row">
          <div>
            <label> editors </label>
            <EditorList editors={editors} />
          </div>
          <div>
            <button name="submit"
                    onClick={() => dispatch(submitUsername(username)) }
                    disabled={loading}>
              ✓
            </button>
          </div>
        </div>
      </div>
    </Toolbox>
  )
}
