import { DisplayState, SelectionType } from './defaultState'

export function swapSelection(display: DisplayState, t: SelectionType, id: string, singleSelect: boolean = true): void {
  let ids = display.selection[t]
  const index = ids.indexOf(id)

  if (index === -1) {
    ids = singleSelect ? [id] : ids.concat(id)
  } else {
    ids.splice(index, 1)
  }

  display.selection[t] = ids
}

export function getSelection(display: DisplayState, t: SelectionType): string[] {
  return display.selection[t]
}

export function clearSelection(display: DisplayState): void {
  display.selection = {
    node: [],
    edge: [],
    caption: [],
    isSelecting: false
  }
}

export function selectionCount(display: DisplayState, t: SelectionType = 'node'): number {
  return display.selection[t].length
}
