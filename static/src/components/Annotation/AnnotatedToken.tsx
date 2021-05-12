import React from 'react'
import Menu from '@material-ui/core/Menu';
import Tooltip  from '@material-ui/core/Tooltip'
import { Check, Clear, Edit } from '@material-ui/icons';
import { ACCEPTED, AUTO, DECISION_TYPE, Filtermap, MODIFIED, REJECTED, Token, DYNAMIC, MANUAL, UNDECIDED } from './types'
import Mark from './Mark'
import { getAnnotationTag, isTokenSelected } from './utils'

interface AnnotatedTokenProps {
  token: Token
  colormap: Filtermap<string>
  selectedAnnotationId: number
  onAnnotationSelection: (id: number) => void
  onSuggestionUpdate: (id: number, decision: DECISION_TYPE) => void
  onTextSelection: (selection: Selection) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

interface AnnotatedTokenState {
  suggestionAnchorEl: any
  optionsAnchorEl: any
  annotationIndex: number
}

class AnnotatedToken extends React.Component<AnnotatedTokenProps, AnnotatedTokenState> {
  constructor(props: AnnotatedTokenProps) {
    super(props)

    this.state = {
      suggestionAnchorEl: null,
      optionsAnchorEl: null,
      annotationIndex: 0
    }
  }

  handleSuggestionClick = (event: any) => {
    this.setState({
      suggestionAnchorEl: event.currentTarget
    });
  };

  handleSuggestionClose = () => {
    this.setState({
      suggestionAnchorEl: null
    });
  };

  handleSuggestionUpdate = (result: DECISION_TYPE) => {
    const { token, onSuggestionUpdate, onTextSelection } = this.props

    const primaryAnnotation = token.annotations[this.state.annotationIndex]
    onSuggestionUpdate(primaryAnnotation.annotationId, result)
    this.handleSuggestionClose()

    if (result == ACCEPTED || result == REJECTED) {
      onTextSelection(null)
    }
  }

  handleOptionsClick = (event: any) => {
    this.setState({
      optionsAnchorEl: event.currentTarget
    })
  }

  handleOptionsClose = () => {
    this.setState({
      optionsAnchorEl: null
    });
  }

  handleOptionsUpdate = (option: number) => {
    const annotations = this.props.token.annotations;
    this.props.onAnnotationSelection(annotations[option].annotationId);
    const primaryAnnotation = annotations[option];
    const isAnnotationSuggestion = (
      primaryAnnotation.creationType == AUTO || primaryAnnotation.creationType == DYNAMIC
    );

    if (isAnnotationSuggestion) {
      this.setState({
        suggestionAnchorEl: this.state.optionsAnchorEl
      })
    }

    this.setState({
      annotationIndex: option
    });

    this.handleOptionsClose()
  }

  render() {
    const { token, colormap, onAnnotationSelection, selectedAnnotationId } = this.props;
    const { annotations, span } = token;

    const tokenSelected = isTokenSelected(token, selectedAnnotationId);
    const hasSuggestion = annotations.find(a =>
      a.creationType == AUTO || a.creationType == DYNAMIC
    ) || false;
    const hasUndecidedSuggestion = hasSuggestion && annotations.find(a =>
      a.creationType != MANUAL && a.decision == UNDECIDED
    );

    const primaryAnnotation = this.state.annotationIndex < annotations.length
      ? annotations[this.state.annotationIndex]
      : annotations[0];
    const isAnnotationSuggestion = primaryAnnotation
      && (primaryAnnotation.creationType == AUTO || primaryAnnotation.creationType == DYNAMIC);
    const hasOptions = annotations.length > 1;

    const annotationClick = (event: any) => {
      onAnnotationSelection(primaryAnnotation.annotationId)
      if (isAnnotationSuggestion)
        this.handleSuggestionClick(event)
      if (hasOptions) {
        this.handleOptionsClick(event)
      }
    }

    const labels = primaryAnnotation ? primaryAnnotation.labels : [];

    const color = labels.length > 0
      ? isAnnotationSuggestion && primaryAnnotation.decision == REJECTED
      ? '#ffffff'
      : labels[0].categories.length > 0 ? colormap[labels[0].categories[0].type] : '9e9e9e'
      : '#fffacd';

    const border = hasSuggestion ? true : false;

    const fill = !hasUndecidedSuggestion;

    return (
      <div
        key={`${span.start}-${span.end}`}
        style={{ display: 'inline-block' }}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
      >
        <Mark
          {...token}
          key={`${span.start}-${span.end}`}
          tag={annotations.map(a => getAnnotationTag(a)).join(' | ')}
          onClick={annotationClick}
          color={color}
          opacity={tokenSelected ? 0.75 : 0.25}
          border={border}
          fill={fill}
        />
        {
          isAnnotationSuggestion && (
            <Menu
              className="suggestion-menu"
              anchorEl={this.state.suggestionAnchorEl}
              getContentAnchorEl={null}
              elevation={0}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              transformOrigin={{ vertical: 'top', horizontal: 'center' }}
              keepMounted
              open={Boolean(this.state.suggestionAnchorEl)}
              onClose={this.handleSuggestionClose}
            >
              <div
                className={`suggestion-menu-item hover-state ${primaryAnnotation.decision == ACCEPTED ? 'suggestion-menu-selected' : ''}`}
                onClick={() => this.handleSuggestionUpdate(ACCEPTED)}
              >
                <Tooltip title={"Accept"}>
                  <Check className="suggestion-menu-icon" style={{ color: '#4CAF50' }}/>
                </Tooltip>
              </div>
              <div
                className={`suggestion-menu-item hover-state ${primaryAnnotation.decision == MODIFIED ? 'suggestion-menu-selected' : ''}`}
                onClick={() => this.handleSuggestionUpdate(MODIFIED)}
              >
                <Tooltip title={"Modify"}>
                  <Edit className="suggestion-menu-icon" style={{ color: '#FFFF00' }}/>
                </Tooltip>
              </div>
              <div
                className={`suggestion-menu-item hover-state ${primaryAnnotation.decision == REJECTED ? 'suggestion-menu-selected' : ''}`}
                onClick={() => this.handleSuggestionUpdate(REJECTED)}
              >
                <Tooltip title={"Reject"}>
                  <Clear className="suggestion-menu-icon" style={{ color: '#FF0000' }}/>
                </Tooltip>
              </div>
            </Menu>
          )
        }
        {
          hasOptions && (
            <Menu
              className="options-menu"
              anchorEl={this.state.optionsAnchorEl}
              getContentAnchorEl={null}
              elevation={0}
              anchorOrigin={{ vertical: -5, horizontal: 'center' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              keepMounted
              open={Boolean(this.state.optionsAnchorEl)}
              onClose={this.handleOptionsClose}
            >
              {
                annotations.map((a, i) => (
                  <div
                    key={a.annotationId + '-' + i}
                    className={`suggestion-menu-item hover-state ${this.state.annotationIndex == i ? 'suggestion-menu-selected' : ''}`}
                    onClick={() => this.handleOptionsUpdate(i)}
                  >
                    {a.labels.length > 0 ? a.labels[0].title : 'empty'}
                  </div>
                ))
              }
            </Menu>
          )
        }
      </div>
    );
  }
}

export default AnnotatedToken
