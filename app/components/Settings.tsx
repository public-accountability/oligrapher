import React, { useCallback } from "react"
import { useDispatch } from "react-redux"

import { useSelector } from "../util/helpers"
import Toolbox from "./Toolbox"

const OPTIONS = {
  Privacy: {
    private: "Set map to private",
    clone: "Allow map cloning",
    list_sources: "Show source links",
  },
  View: {
    defaultStoryMode: "Default: Story Mode",
    defaultExploreMode: "Default: Explore Mode",
    storyModeOnly: "Story Mode Only",
    exploreModeOnly: "Explore Mode Only",
    edgeDraggingWhenPresenting: "Edges can be dragged",
  },
  Editing: {
    automaticallyAddEdges: "Automatically add edges",
    scrollToZoom: "Scroll to zoom",
    useClassicAddConnections: "Classic add connections tool",
  },
  Development: {
    debug: "Show debugging information",
    showControlpoint: "Show curve control point",
  },
}

export default function Settings() {
  const dispatch = useDispatch()
  const settings = useSelector(state => state.attributes.settings)

  const onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    dispatch({ type: "UPDATE_SETTING", key: event.target.name, value: event.target.checked })
  }

  return (
    <Toolbox title="Settings">
      <div className="oligrapher-settings">
        {Object.keys(OPTIONS).map(label => (
          <div key={label}>
            <label>{label}</label>
            {Object.keys(OPTIONS[label]).map(key => (
              <div className="settings-option" key={key}>
                <div className="settings-option-name">{OPTIONS[label][key]}: </div>
                <div>
                  <input type="checkbox" name={key} checked={settings[key]} onChange={onChange} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Toolbox>
  )
}
