import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import { FaBezierCurve } from "react-icons/fa"

import Toolbox from "./Toolbox"

export default function OrganizeTool() {
  const dispatch = useDispatch()
  const forceDirectedLayout = useCallback(
    () => dispatch({ type: "FORCE_LAYOUT_REQUESTED" }),
    [dispatch]
  )

  return (
    <Toolbox title="Organize Map">
      <div className="organize-map">
        <table>
          <tbody>
            <tr>
              <td>
                <a title="Force-directed" onClick={forceDirectedLayout}>
                  <FaBezierCurve />
                </a>
              </td>
              <td>
                <strong>Force-directed:</strong> use physics simulation to automatically arrange
                nodes
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Toolbox>
  )
}
