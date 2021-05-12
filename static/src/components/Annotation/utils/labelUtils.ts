import { Annotation, Label, LabelCounts } from '../types'

export const generateLabelCounts = (annotations: Annotation[]) => {
  const labelsWithCounts: LabelCounts = {}
  for (var a of annotations) {
    for (var l of a.labels) {
      const currentEntry = labelsWithCounts[l.labelId]
      const newCount = currentEntry ? currentEntry.count + 1 : 1
      labelsWithCounts[l.labelId] = {
        ...l,
        count: newCount
      }
    }
  }
  return labelsWithCounts
}

export const nMostCommonLabels = (labelCounts: LabelCounts, n: number): Label[] => {
  const labelCountsValues = Object.keys(labelCounts).map(key => labelCounts[key])
  const sortedLabelCounts = labelCountsValues.sort((a, b) => b.count - a.count)

  const relevantLabels = sortedLabelCounts.length <= n
    ? sortedLabelCounts
    : sortedLabelCounts.slice(0, n)

  return relevantLabels.map(l => ({
    labelId: l.labelId,
    title: l.title,
    categories: l.categories,
  }))
}

export const filterLabelsByType = (labels: Label[], filter: string): Label[] => {
  if (filter == null) {
    return labels;
  }

  return labels.filter(l => l.categories.map(c => c.type).includes(filter));
}
