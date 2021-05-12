import { Annotation, Label } from '../Annotation/types'

export const EQUAL = 'equal'
export const NONE = 'none'
export const OVERLAP = 'overlap'
export type SPANS_TYPE = typeof EQUAL | typeof NONE | typeof OVERLAP;

export const CORRECT = 'correct'
export const INCORRECT = 'incorrect'
export const PARTIAL = 'partial'
export type LABELS_TYPE = typeof CORRECT | typeof INCORRECT | typeof PARTIAL;

export type TutorialEvaluationItem = {
  gold: Annotation,
  userMatches: Annotation[],
  spanScore: Number,
  labelScore: Number
}

export type EvaluationLabelAnalysis = {
  correctLabels: Label[],
  extraLabels: Label[],
  missingLabels: Label[]
}
