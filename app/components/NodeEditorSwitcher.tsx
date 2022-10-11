import React from "react"
import type { NodeEditorPages } from "./NodeEditor"

type NodeEditorSwitcherPropTypes = {
  currentPage: NodeEditorPages
  setPage: (page: NodeEditorPages) => void
}

const MenuButton = ({ text, page, currentPage, setPage }) => {
  return (
    <button onClick={() => setPage(page)} className="{currentPage === page ? 'active' : ''}">
      {text}
    </button>
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
