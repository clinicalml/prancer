import { Annotation, CUI_TYPE, EXPERIMENT_TYPE, Label, DYNAMIC, UNDECIDED, CharacterSpan, MANUAL } from '../types'


export const createSuggestion = (
  annotationId: number,
  text: string,
  spans: CharacterSpan[],
  labels: Label[],
  CUIMode: CUI_TYPE,
  experimentMode: EXPERIMENT_TYPE,
): Annotation => {
  const currentTime = Date.now();
  const annotationText = spans.map(span => text.slice(span.start, span.end)).join(' ')

  const annotation: Annotation = {
    annotationId,
    createdAt: currentTime,
    text: annotationText,
    spans,
    labels,
    CUIMode,
    experimentMode,
    creationType: DYNAMIC,
    decision: UNDECIDED
  }

  return annotation
}


export const cleanAnnotation = (annotation: Annotation): Annotation => {
  var { text, spans } = annotation
  var { start, end } = spans && spans.length > 0 && spans[0]

  const startWhitelist = [' ', '\n', '\t', '.', ',', ':', '#', ')', '(', '[', ']', '{', '}']
  startWhitelist.forEach((str) => {
    if (text.startsWith(str)) {
      text = text.slice(str.length)
      start += str.length
    }
  })

  const endWhitelist = [' ', '\n', '\t', '.', ',', ':', '#', ')', '(', '[', ']', '{', '}', ' of', '\nof']
  endWhitelist.forEach((str) => {
    if (text.endsWith(str)) {
      text = text.slice(0, text.length - str.length)
      end -= str.length
    }
  })

  return {...annotation, text, spans: [{start, end}]}
}


const spanToString = (span: CharacterSpan): string => {
  return String(span.start) + ',' + String(span.end)
}


export const propagateSuggestions = (
  fullText: string,
  annotation: Annotation,
  annotations: Annotation[]
): Annotation[] => {
  const newAnnotation = cleanAnnotation(annotation)
  const { labels, spans, CUIMode, experimentMode, text } = newAnnotation
  const { start } = spans && spans.length > 0 && spans[0]

  // remove 'undecided' suggestions on the same text
  // preserve manual / 'decided' suggestions on the same text
  const spansToPreserve = new Set()
  const suggestedAnnotations = [...annotations].filter(a => {
    if (a.annotationId === newAnnotation.annotationId) {
      return true
    }

    const clean: Annotation = cleanAnnotation(a)
    if (clean.text.toLowerCase() === text.toLowerCase()) {
      if (a.creationType !== MANUAL && a.decision === UNDECIDED) {
        return false
      } else {
        const cleanSpan: CharacterSpan = clean.spans && clean.spans[0]
        spansToPreserve.add(spanToString(cleanSpan))
        return true
      }
    }

    return true
  })

  const re = new RegExp(`\\b${text}\\b`, 'gi')
  const newSuggestions: Annotation[] = []
  const currentTime = Date.now();

  // add suggestions with same labels to all text matches
  let match
  while ((match = re.exec(fullText)) !== null) {
    if (match.index !== start) {
      const annotationId = currentTime + newSuggestions.length + 1

      const span: CharacterSpan = {
        start: match.index,
        end: match.index + match[0].length
      }

      if (!spansToPreserve.has(spanToString(span))) {
        // create new label array pointer
        const newLabels: Label[] = [];
        labels.forEach(l => newLabels.push(l))

        newSuggestions.push(createSuggestion(
          annotationId,
          fullText,
          [span],
          newLabels,
          CUIMode,
          experimentMode
        ))
      }
    }
  }

  suggestedAnnotations.push(...newSuggestions)
  return suggestedAnnotations
}
