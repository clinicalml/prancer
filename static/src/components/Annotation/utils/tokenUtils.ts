import { Annotation, CharacterSpan, Token, WordToken } from '../types'

export const isTokenSelected = (token: Token, id: number): boolean => {
  if (id === null) {
    return false
  }

  const { annotations } = token

  if (annotations) {
    const tokenIds = annotations.map(a => a.annotationId)
    return tokenIds.includes(id)
  }

  return false
}

const createToken = (
  text: string,
  span: CharacterSpan,
  annotations: Annotation[],
  id: number = span.start
): Token => {
  return {
    id: id,
    text: text.slice(span.start, span.end),
    span,
    annotations,
  }
}

const createAnnotatedTokens = (text: string, annotations: Annotation[]) => {
  // create individual tokens for each annotation span
  const annotatedTokens: Token[] = []
  for (var a of annotations) {
    for (var span of a.spans) {
      annotatedTokens.push(createToken(text, span, [a]))
    }
  }
  return annotatedTokens
}

const sortTokensByStart = (tokens: Token[]): Token[] => {
  return [...tokens].sort((a, b) => a.span.start - b.span.start)
}

const sortTokensByEnd = (tokens: Token[]): Token[] => {
  return [...tokens].sort((a, b) => a.span.end - b.span.end)
}

const addAnnotatedToken = (
  text: string,
  span: CharacterSpan,
  spanningTokens: Token[],
  distinctTokens: Token[]
): boolean => {
  // add a text span corresponding to specific annotations as a token
  if (spanningTokens.length > 0 && span.start >= 0) {
    const annotations = spanningTokens.map(t => t.annotations[0])
    const textSpan = text.slice(span.start, span.end)
    if (textSpan.replace(/\s/g, '').length) {
      distinctTokens.push(createToken(text, span, annotations))
      return true
    }
  }
  return false
}

const createIndependentAnnotatedTokens = (text: string, annotations: Annotation[]) => {
  // create non-overlapping ordered array of tokens with annotations
  const annotatedTokens: Token[] = []

  if (annotations.length === 0) {
    return annotatedTokens
  }

  const tokens = createAnnotatedTokens(text, annotations)
  const tokensByStart: Token[] = sortTokensByStart(tokens)
  const tokensByEnd: Token[] = sortTokensByEnd(tokens)
  var tokensByStartIndex = 0
  var tokensByEndIndex = 0

  var characterIndex = -1
  var spanningTokens: Token[] = []

  while (
    characterIndex < text.length
    && tokensByStartIndex < tokens.length
    && tokensByEndIndex < tokens.length
  ) {
    const minStartToken: Token = tokensByStart[tokensByStartIndex]
    const minEndToken: Token = tokensByEnd[tokensByEndIndex]

    if (minStartToken.span.start < minEndToken.span.end) {
      // next token starts before the current token ends
      const span: CharacterSpan = {
        start: characterIndex,
        end: minStartToken.span.start
      }

      addAnnotatedToken(text, span, spanningTokens, annotatedTokens)

      // add all annotations starting at the next span section to the relevant set
      characterIndex = span.end
      while (
        tokensByStartIndex < tokens.length
        && characterIndex === tokensByStart[tokensByStartIndex].span.start
      ) {
        spanningTokens.push(tokensByStart[tokensByStartIndex])
        tokensByStartIndex += 1
      }
    } else {
      // current token ends before the next token starts
      const span: CharacterSpan = {
        start: characterIndex,
        end: minEndToken.span.end,
      }

      addAnnotatedToken(text, span, spanningTokens, annotatedTokens)

      // remove all annotations ending with this span section from the relevant set
      characterIndex = span.end
      spanningTokens = spanningTokens.filter(a => a.span.end !== characterIndex)
      while (
        tokensByEndIndex < tokens.length
        && characterIndex === tokensByEnd[tokensByEndIndex].span.end
      ) {
        tokensByEndIndex += 1
      }
    }
  }

  // handle all relevant annotations whose spans have not ended yet
  while (tokensByEndIndex < tokens.length) {
    const minEndToken: Token = tokensByEnd[tokensByEndIndex]
    const span: CharacterSpan = {
      start: characterIndex,
      end: minEndToken.span.end,
    }

    addAnnotatedToken(text, span, spanningTokens, annotatedTokens)

    characterIndex = span.end
    spanningTokens = spanningTokens.filter(a => a.span.end !== characterIndex)
    while (
      tokensByEndIndex < tokens.length
      && characterIndex === tokensByEnd[tokensByEndIndex].span.end
    ) {
      tokensByEndIndex += 1
    }
  }

  return annotatedTokens
}

const createWordTokens = (text: string) => {
  const strings = text.replace(/\n/g, ' \n ').split(' ')
  // const strings = text.split(' ')
  var start = 0

  return strings.map((s, i) => {
    if (i > 0 && s == '\n' && strings[i - 1] != '\n') {
      start = start - 1
    }

    const end = start + s.length
    const wordToken: WordToken = {
      id: start,
      text: s,
      span: { start, end }
    }
    start = s == '\n' ? end : end + 1
    return wordToken
  })
}

export const createTokensWithAnnotations = (text: string, annotations: Annotation[]) => {
  const tokens: Token[] = []
  if (!text) {
    return tokens;
  }

  const sortedAnnotatedTokens = createIndependentAnnotatedTokens(text, annotations)
  const wordTokens: WordToken[] = createWordTokens(text)

  var tokenId = 0
  for (var i = 0; i < sortedAnnotatedTokens.length; i++) {
    const annotatedToken: Token = sortedAnnotatedTokens[i]
    const { start, end } = annotatedToken.span

    // add all full words before annotation
    while (wordTokens[tokenId].span.end < start) {
      tokens.push(createToken(text, wordTokens[tokenId].span, null))
      tokenId += 1
    }

    // add part of word before annotation
    const prevAnnotatedToken = i > 0 && sortedAnnotatedTokens[i - 1]
    const prevSpanStart = prevAnnotatedToken
      ? Math.max(prevAnnotatedToken.span.end, wordTokens[tokenId].span.start)
      : wordTokens[tokenId].span.start
    if (prevSpanStart < start) {
      const span: CharacterSpan = {
        start: prevSpanStart,
        end: start
      }
      tokens.push(createToken(text, span, null))
    }

    // add annotated token
    tokens.push(annotatedToken)

    // move tokenId to after annotation
    while (wordTokens[tokenId].span.end <= end) {
      tokenId += 1
    }

    // add part of word after annotation if exists
    const nextAnnotatedToken = i < sortedAnnotatedTokens.length - 1 && sortedAnnotatedTokens[i + 1]
    const nextSpanEnd = nextAnnotatedToken
      ? Math.min(nextAnnotatedToken.span.start, wordTokens[tokenId].span.end)
      : wordTokens[tokenId].span.end
    if (wordTokens[tokenId].span.start < end && end < nextSpanEnd) {
      const span: CharacterSpan = {
        start: end,
        end: nextSpanEnd,
      }
      tokens.push(createToken(text, span, null))

      if (nextSpanEnd === wordTokens[tokenId].span.end) {
        tokenId += 1
      }
    }
  }

  for (var i = tokenId; i < wordTokens.length; i++) {
    tokens.push(createToken(text, wordTokens[i].span, null))
  }

  return tokens
}
