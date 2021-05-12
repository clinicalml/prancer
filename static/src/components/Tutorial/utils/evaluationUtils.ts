import {
  TutorialEvaluationItem,
  EvaluationLabelAnalysis
} from '../types'

import { Annotation, CUI_CODELESS, CUI_AMBIGUOUS } from '../../Annotation/types'

export const isSpanCorrect = (gold: Annotation, user: Annotation): boolean => {
  return gold && user
  && gold.spans[0].start === user.spans[0].start
  && gold.spans[0].end === user.spans[0].end
}

export const isAnnotationAmbiguous = (annotation: Annotation): boolean => {
  const { CUIMode, labels } = annotation

  return CUIMode === CUI_AMBIGUOUS || (
    labels.length > 1 && labels.map(l => l.title).includes('CUI-less')
  )
}

export const isAnnotationCUILess = (annotation: Annotation): boolean => {
  const { CUIMode, labels } = annotation

  return CUIMode === CUI_CODELESS || (
    labels.length == 1 && labels[0].title === 'CUI-less'
  )
}

export const generateLabelAnalysis = (
  gold: Annotation,
  user: Annotation
): EvaluationLabelAnalysis => {
  const userLabels = user ? user.labels : []
  const goldLabels = gold ? gold.labels : []

  const userLabelIds = new Set(userLabels.map(l => l.labelId))
  const goldLabelIds = new Set(goldLabels.map(l => l.labelId))

  const correctLabels = [...userLabels].filter(l => goldLabelIds.has(l.labelId))
  const extraLabels = [...userLabels].filter(l => !goldLabelIds.has(l.labelId))
  const missingLabels = [...goldLabels].filter(l => goldLabels.length > 1
    ? !userLabelIds.has(l.labelId) && l.title !== 'CUI-less'
    : !userLabelIds.has(l.labelId)
  )

  return { correctLabels, extraLabels, missingLabels }
}

export const isAnnotationCorrect = (
  gold: Annotation,
  user: Annotation
): boolean => {
  const { correctLabels } = generateLabelAnalysis(gold, user)

  return isSpanCorrect(gold, user) && correctLabels.length >= 1
}

export const isCorrectTutorialEvaluationItem = (
  evaluationItem: TutorialEvaluationItem
): boolean => {
  const { gold, userMatches } = evaluationItem

  return gold && userMatches && userMatches.some(u => isAnnotationCorrect(gold, u))
}
