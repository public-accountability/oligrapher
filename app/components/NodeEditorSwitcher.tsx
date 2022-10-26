import React from "react"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import { FaRegDotCircle } from "@react-icons/all-files/fa/FaRegDotCircle"
import { MdImage } from "@react-icons/all-files/md/MdImage"
import { MdPhotoSizeSelectSmall } from "@react-icons/all-files/md/MdPhotoSizeSelectSmall"
import { MdFormatColorFill } from "@react-icons/all-files/md/MdFormatColorFill"

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
  color: <MdFormatColorFill />,
  size: <MdPhotoSizeSelectSmall />,
  image: <MdImage />,
}

const MenuButton = ({ text, page, currentPage, setPage }: MenuEditorPropTypes) => {
  const color = currentPage === page ? "primary" : "secondary"
  return (
    <IconButton
      color={color}
      onClick={() => setPage(page)}
      title={text}
      size="small"
      sx={{ mt: "5px" }}
    >
      {ICONS[page]}
    </IconButton>
  )
}

export default function ({ currentPage, setPage }: NodeEditorSwitcherPropTypes) {
  return (
    <Stack direction="row" spacing={1}>
      <MenuButton text="Node" page="main" currentPage={currentPage} setPage={setPage} />
      <MenuButton text="Color" page="color" currentPage={currentPage} setPage={setPage} />
      <MenuButton text="Size" page="size" currentPage={currentPage} setPage={setPage} />
      <MenuButton text="Image" page="image" currentPage={currentPage} setPage={setPage} />
    </Stack>
  )
}
