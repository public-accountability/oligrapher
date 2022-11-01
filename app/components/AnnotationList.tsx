import React, { useCallback } from "react"
import { useDispatch } from "react-redux"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Annotation } from "../util/annotations"

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",

  // styles we need to apply on draggables
  ...draggableStyle,
})

type AnnotationListPropTypes = {
  list: Annotation[]
  currentIndex: number
}

export default function AnnotationList({ list, currentIndex }: AnnotationListPropTypes) {
  const dispatch = useDispatch()
  const show = useCallback(index => dispatch({ type: "SHOW_ANNOTATION", index }), [dispatch])
  const move = useCallback(
    (from, to) => dispatch({ type: "MOVE_ANNOTATION", from, to }),
    [dispatch]
  )

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return
    }

    move(result.source.index, result.destination.index)
  }

  const itemClassName = (index, isDragging) =>
    "annotation-list-item " +
    (isDragging ? "annotation-list-item-dragging " : " ") +
    (index === currentIndex ? "annotation-list-item-current" : "")

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {provided => (
          <div
            id="oligrapher-annotations-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {list.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={itemClassName(index, snapshot.isDragging)}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => show(index)}
                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                  >
                    {index + 1}. {item.header}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
