import { Annotation, CUI_TYPE, EXPERIMENT_TYPE, Label, MANUAL, Token } from '../types'
import { getSelectedText, getSelectionSpans } from './selectionUtils'

export const createAnnotation = (
  selection: Selection,
  text: string,
  labels: Label[],
  CUIMode: CUI_TYPE,
  experimentMode: EXPERIMENT_TYPE,
): Annotation => {
  const currentTime = Date.now();

  const annotation: Annotation = {
    annotationId: currentTime,
    createdAt: currentTime,
    text: getSelectedText(selection, text),
    spans: getSelectionSpans(selection),
    labels,
    CUIMode,
    experimentMode,
    creationType: MANUAL,
    decision: null
  }

  return annotation
}

export const createAnnotationFromToken = (
  token: Token,
  labels: Label[],
  CUIMode: CUI_TYPE,
  experimentMode: EXPERIMENT_TYPE,
): Annotation => {
  const currentTime = Date.now();

  const annotation: Annotation = {
    annotationId: currentTime,
    createdAt: currentTime,
    text: token.text,
    spans: [token.span],
    labels,
    CUIMode,
    experimentMode,
    creationType: MANUAL,
    decision: null
  }

  return annotation
}

export const getAnnotationTag = (annotation: Annotation): string => {
  return annotation.labels.map(l => l.title).join(' | ')
}

export const isAnnotationSelected = (
  annotation: Annotation,
  selectedAnnotationId: number
): boolean => {
  return selectedAnnotationId === annotation.annotationId
}
