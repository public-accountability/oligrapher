import React from "react"
import IconButton from "@mui/material/IconButton"
import { FaRegDotCircle } from "@react-icons/all-files/fa/FaRegDotCircle"
import { MdColorLens } from "@react-icons/all-files/md/MdColorLens"
import { MdImage } from "@react-icons/all-files/md/MdImage"
import { MdPhotoSizeSelectSmall } from "@react-icons/all-files/md/MdPhotoSizeSelectSmall"

import type { NodeEditorPages } from "./NodeEditor"

type NodeEditorSwitcherPropTypes = {
  currentPage: NodeEditorPages
  setPage: (page: NodeEditorPages) => void
}

type MenuEditorPropTypes = {
  currentPage: NodeEditorPages
  setPage: (page: NodeEditorPages) => void
  text: string
  page: NodeEditorPages
}

const ICONS = {
  main: <FaRegDotCircle />,
  color: <MdColorLens />,
  size: <MdPhotoSizeSelectSmall />,
  image: <MdImage />,
}

const MenuButton = ({ text, page, currentPage, setPage }: MenuEditorPropTypes) => {
  const active = currentPage === page
  const color = active ? "primary" : "secondary"

  return (
    <IconButton color={color} onClick={() => setPage(page)} title={text}>
      {ICONS[page]}
    </IconButton>
  )
}

export default function ({ currentPage, setPage }: NodeEditorSwitcherPropTypes) {
  return (
    <div>
      <MenuButton text="Node" page="main" currentPage={currentPage} setPage={setPage} />
      <MenuButton text="Color" page="color" currentPage={currentPage} setPage={setPage} />
      <MenuButton text="Size" page="size" currentPage={currentPage} setPage={setPage} />
      <MenuButton text="Image" page="image" currentPage={currentPage} setPage={setPage} />
    </div>
  )
}
