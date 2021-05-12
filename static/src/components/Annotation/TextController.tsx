import React from 'react'
import AnnotatedToken from './AnnotatedToken'
import { createTokensWithAnnotations } from './utils'
import {
  Annotation,
  DECISION_TYPE,
  Filtermap,
  Token,
  LOG_TYPE,
  LOG_ANNOTATION_MOUSE_ON,
  LOG_ANNOTATION_MOUSE_OFF,
  LOG_TOKEN_MOUSE_OFF,
  LOG_TOKEN_MOUSE_ON
} from './types'

interface TokenProps {
  i: number
  content: string
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: () => void
}

const Token: React.SFC<TokenProps> = props => {
  return (
      <div
        className='token'
        data-i={props.i}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onClick={props.onClick}
        style={{
          display: props.content == '\n' ? 'block' : 'inline-block',
          whiteSpace: 'pre'
        }}
      >{props.content}</div>
  )
}

interface TextControllerProps {
  text: string
  colormap: Filtermap<string>
  annotations: Annotation[]
  selectedAnnotationId: number
  onAnnotationCreationToken: (token: Token) => Number
  onAnnotationSelection: (id: number) => void
  onSuggestionUpdate: (id: number, decision: DECISION_TYPE) => void
  onTextSelection: (selection: Selection) => void
  addLogEntryBound: (action: LOG_TYPE, metadata: string[]) => boolean
}

interface TextControllerState {
  anchorEl: any
}

class TextController extends React.Component<TextControllerProps, TextControllerState> {
  constructor(props: TextControllerProps) {
    super(props)

    this.state = {
      anchorEl: null
    }
  }

  handleSuggestionClick = (event: any) => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleSuggestionClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  createTokenDisplay = (token: Token, key: number) => {
    const { span: { start, end } } = token

    return token.annotations && token.annotations.length > 0
      ? (
        <AnnotatedToken
          key={key}
          token={token}
          colormap={this.props.colormap}
          selectedAnnotationId={this.props.selectedAnnotationId}
          onAnnotationSelection={this.props.onAnnotationSelection}
          onSuggestionUpdate={this.props.onSuggestionUpdate}
          onTextSelection={this.props.onTextSelection}
          onMouseEnter={() => this.props.addLogEntryBound(LOG_ANNOTATION_MOUSE_ON, [String(start), String(end)])}
          onMouseLeave={() => this.props.addLogEntryBound(LOG_ANNOTATION_MOUSE_OFF, [String(start), String(end)])}
        />
      )
      : (
        <Token
          key={key}
          i={token.id}
          content={token.text}
          onMouseEnter={() => this.props.addLogEntryBound(LOG_TOKEN_MOUSE_ON, [String(start), String(end)])}
          onMouseLeave={() => this.props.addLogEntryBound(LOG_TOKEN_MOUSE_OFF, [String(start), String(end)])}
          onClick={() => this.props.onAnnotationCreationToken(token)}
        />
      )
  }

  render() {
    const { text, annotations } = this.props
    const tokens = createTokensWithAnnotations(text, annotations)

    return (
      <div className="text-controller">
        {tokens.map((token, i) => this.createTokenDisplay(token, i))}
      </div>
    )
  }
}

export default TextController
