import React from "react"
import { useSelector, useDispatch } from "react-redux"

import { FaRegCircle, FaRegEdit, FaBezierCurve, FaChartLine } from "react-icons/fa"
import { FiHelpCircle, FiUsers } from "react-icons/fi"
import { GoTextSize, GoGear } from "react-icons/go"
import { GiLinkedRings } from "react-icons/gi"

const MENU = {
  node: {
    icon: <FaRegCircle />,
    title: "Add Node",
  },
  text: {
    icon: <GoTextSize />,
    title: "Add Text",
  },
  style: {
    icon: <FaRegEdit />,
    title: "Style Selected Nodes",
  },
  interlocks: {
    icon: <GiLinkedRings />,
    title: "Interlocks",
  },
  organize: {
    icon: <FaBezierCurve />,
    title: "Organize Map",
  },
  annotations: {
    icon: <FaChartLine />,
    title: "Annotations",
  },
  settings: {
    icon: <GoGear />,
    title: "Settings",
  },
  editors: {
    icon: <FiUsers />,
    title: "Editors",
  },
  help: {
    icon: <FiHelpCircle />,
    title: "Help",
  },
}

type MenuItemType =
  | "node"
  | "text"
  | "style"
  | "interlocks"
  | "organize"
  | "annotations"
  | "settings"
  | "editors"
  | "help"

type EditorMenuItemPropTypes = {
  item: MenuItemType
  disabled: boolean
  inUse: boolean
}

export default function EditorMenuItem({ item, inUse, disabled }: EditorMenuItemPropTypes) {
  const { title, icon } = MENU[item]
  const dispatch = useDispatch()
  const helpUrl = useSelector(state => state.attributes.helpUrl)

  let onClick = evt => {
    evt.stopPropagation()
    if (item === "annotations") {
      dispatch({ type: "TOGGLE_ANNOTATIONS" })
    } else if (item == "help") {
      window.open(helpUrl, "_blank")
    } else {
      dispatch({ type: "TOGGLE_TOOL", tool: item })
    }
  }

  const className =
    `editor-menu-item editor-${item}-item` +
    (disabled ? " editor-menu-item-disabled" : "") +
    (inUse ? " editor-menu-item-in-use" : "")

  return (
    <div className={className} onClick={disabled ? undefined : onClick}>
      <span title={title}>{icon}</span>
    </div>
  )
}
