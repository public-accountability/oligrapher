import React from "react"
import { useSelector, useDispatch } from "react-redux"
import { FaRegCircle } from "@react-icons/all-files/fa/FaRegCircle"
import { FaRegEdit } from "@react-icons/all-files/fa/FaRegEdit"
import { FaBezierCurve } from "@react-icons/all-files/fa/FaBezierCurve"
import { FiHelpCircle } from "@react-icons/all-files/fi/FiHelpCircle"
import { FiUsers } from "@react-icons/all-files/fi/FiUsers"
import { GoTextSize } from "@react-icons/all-files/go/GoTextSize"
import { GoGear } from "@react-icons/all-files/go/GoGear"
import { GiLinkedRings } from "@react-icons/all-files/gi/GiLinkedRings"
import { FaChartLine } from "@react-icons/all-files/fa/FaChartLine"

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

export default function EditorMenuItem({ item, inUse, disabled = false }: EditorMenuItemPropTypes) {
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
