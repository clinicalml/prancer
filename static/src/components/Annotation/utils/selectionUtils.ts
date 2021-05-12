import { CharacterSpan } from '../types'

export const selectionIsEmpty = (selection: Selection) => {
  let position = selection.anchorNode.compareDocumentPosition(selection.focusNode)
  return position === 0 && selection.focusOffset === selection.anchorOffset
}

export const selectionIsBackwards = (selection: Selection) => {
  if (selectionIsEmpty(selection)) return false

  let position = selection.anchorNode.compareDocumentPosition(selection.focusNode)

  let backward = false
  if (
    (!position && selection.anchorOffset > selection.focusOffset) ||
    position === Node.DOCUMENT_POSITION_PRECEDING
  )
    backward = true

  return backward
}

export const copySelectionRanges = (selection: Selection) => {
  const ranges: Range[] = []
  for (var i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i).cloneRange())
  }
  return ranges
}

export const setSelectionRanges = (selection: Selection, ranges: Range[]) => {
  selection.empty()
  for (var i = 0; i < ranges.length; i++) {
    const range: Range = ranges[i]
    selection.addRange(range)
  }
}

export const getNodeId = (node: Node) => {
  return parseInt(node.parentElement.getAttribute('data-i'), 10)
}

export const getSelectionSpans = (selection: Selection) => {
  if (selection === null)
    return []

  const spans: CharacterSpan[] = []

  for (var i = 0; i < selection.rangeCount; i++) {
    const range: Range = selection.getRangeAt(i)
    let start = getNodeId(range.startContainer) + range.startOffset
    let end = getNodeId(range.endContainer) + range.endOffset

    // swap start and end variables - * unnecessary
    // if (selectionIsBackwards(selection)) {
    //   ;[start, end] = [end, start]
    // }

    if (!isNaN(start) && !isNaN(end))
      spans.push({ start, end })
  }

  return spans
}

export const getSelectedText = (selection: Selection, text: string) => {
  const spans: CharacterSpan[] = getSelectionSpans(selection)
  return spans.map(span => text.slice(span.start, span.end)).join(' ')
}
