import { noop } from "lodash"
import React from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { useDispatch } from "react-redux"
import { Caption } from "../graph/caption"

type CaptionTextboxProps = {
  currentlyEdited: boolean
  isEditing: boolean
  caption: Caption
  status: "normal" | "highlighted" | "faded"
  height: number
  width: number
}

// div representing a caption
// contentEditable=true when editing
// https://stackoverflow.com/questions/49639144/why-does-react-warn-against-an-contenteditable-component-having-children-managed
const CaptionTextBox = React.forwardRef<HTMLDivElement, CaptionTextboxProps>(
  function captionTextBox(props, ref) {
    const dispatch = useDispatch()

    const className = `caption-text-text caption-text-${props.status}${
      props.isEditing ? " editing" : ""
    }${props.currentlyEdited ? " editor-open" : ""}`

    const style = {
      fontFamily: props.caption.font,
      fontSize: props.caption.size + "px",
      fontWeight: props.caption.weight,
      height: props.height + "px",
      width: props.width + "px",
    }

    const onBlur = props.currentlyEdited
      ? function (event: React.ChangeEvent) {
          const attributes = { text: event.target.textContent }
          dispatch({ type: "UPDATE_CAPTION", attributes })
        }
      : noop

    const onKeyDown = props.currentlyEdited
      ? function (event: React.KeyboardEvent) {
          if (event.key === "Enter") {
            event.preventDefault()
            ref.current.blur()
          }
        }
      : noop

    return (
      <div
        ref={ref}
        className={className}
        style={style}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        contentEditable={props.currentlyEdited}
        suppressContentEditableWarning={true}
      >
        {props.caption.text}
      </div>
    )
  }
)

export default CaptionTextBox
