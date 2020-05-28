import { DisplayState, SelectionType } from './defaultState'

export function swapSelection(display: DisplayState, type: SelectionType, id: string, singleSelect: boolean = true): void {
  let ids = display.selection[type]
  const index = ids.indexOf(id)

  if (index === -1) {
    ids = singleSelect ? [id] : ids.concat(id)
  } else {
    ids.splice(index, 1)
  }

  console.log(ids)

  display.selection[type] = ids
}

export function getSelection(display: DisplayState, type: SelectionType): string[] {
  return display.selection[type]
}

export function clearSelection(display: DisplayState): void {
  display.selection = {
    node: [],
    edge: [],
    caption: [],
    isSelecting: false
  }
}