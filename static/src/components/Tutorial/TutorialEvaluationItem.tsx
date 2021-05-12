import React from 'react';
import Tooltip  from '@material-ui/core/Tooltip'
import { CheckCircleTwoTone, ErrorTwoTone } from '@material-ui/icons';
import { TutorialEvaluationItem, EvaluationLabelAnalysis } from './types'
import { Filtermap, Label, Annotation } from '../Annotation/types'
import AnnotatedToken from '../Annotation/AnnotatedToken'
import {
  isAnnotationAmbiguous,
  isCorrectTutorialEvaluationItem,
  isAnnotationCorrect,
  isSpanCorrect,
  generateLabelAnalysis,
  isAnnotationCUILess
} from './utils'

const ERROR_COLOR = (a: Number) => 'rgba(255, 176, 0, ' + a + ')'
const ERROR_STYLE = { backgroundColor: ERROR_COLOR(0.25) }

interface LabelItemProps {
  label: Label
  colormap: Filtermap<string>
}

interface TutorialEvaluationItemProps {
  evaluationItem: TutorialEvaluationItem
  colormap: Filtermap<string>
}

const LabelItem: React.SFC<LabelItemProps> = props => {
  const { label, colormap } = props
  const { labelId, title, categories } = label

  return <Tooltip title={<div>
    <div>CUI: {labelId}</div>
    <div>Categor{categories.length > 1 ? 'ies' : 'y'}: {categories.map(c => c.title).join(', ')}</div>
  </div>}>
    <span className="tutorial-label-item hover-state" style={{
      textDecoration: 'underline ' + colormap[categories[0].type] + ' solid'
    }}>
      {title}
    </span>
  </Tooltip>
}

function spansToElement(
  spans: string[],
  descriptor: string
): JSX.Element {
  return (
    <div style={descriptor !== 'correct' ? ERROR_STYLE : {}}>
      Annotation on span{spans.length > 1 ? 's' : ''}
      <b> {spans.join(', ')}</b>
      {spans.length > 1 ? ' are' : ' is'} {descriptor}.
    </div>
  )
}

function spansToElementComposite(
  extraSpans: string[],
  missingSpans: string[]
): JSX.Element {
  return (
    <div style={ERROR_STYLE}>
      Annotation on span{extraSpans.length > 1 ? 's' : ''}
      <b> {extraSpans.join(', ')} </b>
      should be on span{missingSpans.length > 1 ? 's' : ''}
      <b> {missingSpans.join(', ')}</b>.
    </div>
  )
}

function generateSpanDescription(
  gold: Annotation,
  user: Annotation
): JSX.Element {
  const isCorrect = isSpanCorrect(gold, user)

  return <div style={{ padding: 0 }}>
    {isCorrect
      ? spansToElement([user.text], 'correct')
      : spansToElementComposite([user.text], [gold.text])
    }
  </div>
}

function labelsToElement(
  labels: Label[],
  descriptor: string,
  colormap: Filtermap<string>
): JSX.Element {
  return (
    <div style={descriptor !== 'correct' ? ERROR_STYLE : {}}>
      Label{labels.length > 1 ? 's' : ''}
      <i>{labels.map(l => <LabelItem key={l.labelId} label={l} colormap={colormap} />)}</i>
      {labels.length > 1 ? 'are' : 'is'} {descriptor}.
    </div>
  )
}

function labelsToElementComposite(
  extraLabels: Label[],
  missingLabels: Label[],
  colormap: Filtermap<string>
): JSX.Element {
  return (
    <div style={ERROR_STYLE}>
      Label{extraLabels.length > 1 ? 's' : ''}
      <i>{extraLabels.map(l => <LabelItem key={l.labelId} label={l} colormap={colormap} />)}</i>
      should be label{missingLabels.length > 1 ? 's' : ''}
      <i>{missingLabels.map(l => <LabelItem key={l.labelId} label={l} colormap={colormap} />)}</i>.
    </div>
  )
}

function generateLabelDescription(
  labelAnalysis: EvaluationLabelAnalysis,
  colormap: Filtermap<string>
): JSX.Element {
  const { correctLabels, extraLabels, missingLabels } = labelAnalysis

  return <div style={{ padding: 0 }}>
    {correctLabels.length > 0 && labelsToElement(correctLabels, 'correct', colormap)}
    {extraLabels.length > 0 && missingLabels.length > 0
      ? labelsToElementComposite(extraLabels, missingLabels, colormap)
      : <div style={{ padding: 0 }}>
          {extraLabels.length > 0 && labelsToElement(extraLabels, 'unnecessary', colormap)}
          {missingLabels.length > 0 && labelsToElement(missingLabels, 'missing', colormap)}
        </div>
    }

  </div>
}

function generateItemIcon(
  isCorrect: boolean
): JSX.Element {
  if (isCorrect) {
    return <CheckCircleTwoTone color='primary' />
  } else {
    return <div style={{ color: ERROR_COLOR(1) }}><ErrorTwoTone color='inherit' /></div>
  }
}

function generateCompositeDescription(
  span: string,
  labels: Label[],
  descriptor: string,
  colormap: Filtermap<string>
): JSX.Element {
  return (
    <div style={descriptor !== 'correct' ? ERROR_STYLE : {}}>
      Annotation on span
      <b> {span} </b>
      {labels.length > 0 &&
        <span>with label{labels.length > 1 ? 's' : ''}
          <i>{labels.map(l => <LabelItem label={l} colormap={colormap} />)}</i>
        </span>
      }
      is {descriptor}.
    </div>
  )
}

function generateDescription(
  gold: Annotation,
  user: Annotation,
  colormap: Filtermap<string>
): JSX.Element {
  const labelAnalysis = generateLabelAnalysis(gold, user)
  const { correctLabels, extraLabels, missingLabels } = labelAnalysis

  const isCorrect = isAnnotationCorrect(gold, user)

  const description: JSX.Element = isCorrect
    ? generateCompositeDescription(user.text, correctLabels, 'correct', colormap)
    : !user
    ? generateCompositeDescription(gold.text, missingLabels, 'missing', colormap)
    : !gold
    ? generateCompositeDescription(user.text, extraLabels, 'unnecessary', colormap)
    : <div style={{ padding: 0 }}>
        {generateSpanDescription(gold, user)}
        {generateLabelDescription(labelAnalysis, colormap)}
      </div>

  return <div className="tutorial-evaluation-description-singular">
    {description}
    {isCorrect && missingLabels.length > 0 &&
      labelsToElement(missingLabels, 'also correct (select all labels that match)', colormap)
    }
    {isCorrect && extraLabels.length > 0 &&
      labelsToElement(extraLabels, 'not necessary', colormap)
    }
  </div>
}

function generateDescriptions(
  evaluationItem: TutorialEvaluationItem,
  colormap: Filtermap<string>
): JSX.Element {
  const { userMatches, gold } = evaluationItem

  const descriptions = userMatches ? userMatches.map(u => {
    return generateDescription(gold, u, colormap)
  }) : [generateDescription(gold, null, colormap)]

  const isCodeless = gold && isAnnotationCUILess(gold)
  const isAmbiguous = gold && isAnnotationAmbiguous(gold)

  return <div>
    {descriptions}
    {isCodeless &&
      <div style={{ padding: 0 }}>
        * Label <i>CUI-less</i> indicates that this span doesn't have an exact CUI match.
      </div>
    }
    {isAmbiguous &&
      <div style={{ padding: 0 }}>
        * This match is marked as ambiguous.
      </div>
    }
  </div>
}

const TutorialEvaluationItem: React.SFC<TutorialEvaluationItemProps> = props => {
  const { evaluationItem, colormap } = props
  const { gold, userMatches } = evaluationItem
  const annotation = gold ? gold : userMatches[0]

  const isCorrect = isCorrectTutorialEvaluationItem(evaluationItem)

  return (
    <div className="tutorial-evaluation-item">
      <div className="tutorial-evaluation-icon">
        {generateItemIcon(isCorrect)}
      </div>
      <div className="tutorial-evaluation-token">
        <AnnotatedToken
          token = {{
            id: annotation.annotationId,
            text: annotation.text,
            span: annotation.spans[0],
            annotations: [annotation]
          }}
          colormap = {colormap}
          selectedAnnotationId = {null}
          onAnnotationSelection = {null}
          onSuggestionUpdate = {null}
          onTextSelection = {null}
          onMouseEnter = {null}
          onMouseLeave = {null}
        />
      </div>
      <div className="tutorial-evaluation-description">
        {generateDescriptions(evaluationItem, colormap)}
      </div>
    </div>
  )
}

export default TutorialEvaluationItem
