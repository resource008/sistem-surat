"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine"
import { cn } from "@/lib/utils"

type PragmaticSortableItemProps = {
  id: string
  index: number
  type: string
  disabled?: boolean
  dragSurfaceOnly?: boolean
  className?: string
  children: ReactNode
  onReorder: (startIndex: number, finishIndex: number) => void
}

function isInteractiveElement(input: { clientX: number; clientY: number }) {
  const target = document.elementFromPoint(input.clientX, input.clientY)
  return Boolean(
    target?.closest(
      "[data-no-drag='true'],input,textarea,select,a,[contenteditable='true'],button,[role='button']"
    )
  )
}

function isDragSurface(input: { clientX: number; clientY: number }) {
  const target = document.elementFromPoint(input.clientX, input.clientY)
  return Boolean(target?.closest("[data-drag-surface='true']"))
}

function isNoDragControl(input: { clientX: number; clientY: number }) {
  const target = document.elementFromPoint(input.clientX, input.clientY)
  return Boolean(
    target?.closest(
      "[data-no-drag='true'],input,textarea,select,a,[contenteditable='true'],button"
    )
  )
}

export function PragmaticSortableItem({
  id,
  index,
  type,
  disabled,
  dragSurfaceOnly,
  className,
  children,
  onReorder,
}: PragmaticSortableItemProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isOver, setIsOver] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    return combine(
      draggable({
        element,
        canDrag: ({ input }) => {
          if (disabled) return false
          if (!dragSurfaceOnly) return !isInteractiveElement(input)
          return isDragSurface(input) && !isNoDragControl(input)
        },
        getInitialData: () => ({ id, index, type }),
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) =>
          !disabled
          && source.data.type === type
          && source.data.id !== id,
        getData: () => ({ id, index, type }),
        getIsSticky: () => true,
        onDragEnter: () => setIsOver(true),
        onDragLeave: () => setIsOver(false),
        onDrop: ({ source, self }) => {
          setIsOver(false)
          const startIndex = Number(source.data.index)
          const finishIndex = Number(self.data.index)

          if (
            Number.isNaN(startIndex)
            || Number.isNaN(finishIndex)
            || startIndex === finishIndex
          ) {
            return
          }

          onReorder(startIndex, finishIndex)
        },
      })
    )
  }, [disabled, dragSurfaceOnly, id, index, onReorder, type])

  return (
    <div
      ref={ref}
      data-pragmatic-sortable-item="true"
      className={cn(
        !disabled && !dragSurfaceOnly && "cursor-grab active:cursor-grabbing",
        isDragging && "opacity-60",
        isOver && "ring-2 ring-ring/40",
        className
      )}
    >
      {children}
    </div>
  )
}
