import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import { useHotkeys } from "react-hotkeys-hook"
import { MdClose } from "react-icons/md"

//  This isn't a box of tools. It's a box with one tool
export default function Toolbox({ title, children }: ToolboxProps) {
  const dispatch = useDispatch()
  const closeTool: () => void = useCallback(() => dispatch({ type: "CLOSE_TOOL" }), [dispatch])

  useHotkeys("escape", closeTool, { filter: () => true })

  return (
    <div className="oligrapher-toolbox">
      <header>
        {title}
        <button onClick={closeTool}>
          <MdClose />
        </button>
      </header>
      <main>{children}</main>
    </div>
  )
}

interface ToolboxProps {
  title: string
  children: JSX.Element
}
