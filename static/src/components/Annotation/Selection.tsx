import React from 'react'
import Tooltip  from '@material-ui/core/Tooltip'
import { ArrowForward, Delete, HighlightOff } from '@material-ui/icons'
import LabelListItem from './LabelListItem'
import {
  CUI_TYPE,
  Label,
  Filtermap,
  UMLSDefinition,
  LOG_TYPE,
  LOG_LABEL_REMOVE,
  LOG_LABEL_MOUSE_ON,
  LOG_LABEL_MOUSE_OFF,
  CUI_NORMAL, CUI_AMBIGUOUS, CUI_CODELESS
} from './types'

interface SelectionProps {
  selectedText: string
  selectedLabels: Label[]
  colormap: Filtermap<string>
  CUIMode: CUI_TYPE
  onCUIModeChange: (mode: CUI_TYPE) => void
  setSelectedLabels: (labels: Label[]) => void
  deleteAnnotation: () => void
  onTextSelection: (selection: Selection) => void
  onUMLSClick: (cui: string) => void
  UMLSInfo: UMLSDefinition[]
  addLogEntryBound: (action: LOG_TYPE, metadata: string[]) => boolean
}

interface SelectionState {
  searchText: string
  selectedFilter: string
}

class Selection extends React.Component<SelectionProps, SelectionState> {
  constructor(props: SelectionProps) {
    super(props)

    this.state = {
      searchText: '',
      selectedFilter: null
    }
  }

  removeLabel = (id: string) => {
    const { selectedLabels, setSelectedLabels } = this.props
    const i = selectedLabels.findIndex(l => l.labelId == id)
    if (i >= 0 && i < selectedLabels.length) {
      selectedLabels.splice(i, 1)
      setSelectedLabels(selectedLabels)
    }

    this.props.addLogEntryBound(LOG_LABEL_REMOVE, [id])
  }

  render() {
    const {
      selectedText,
      selectedLabels,
      colormap,
      CUIMode,
      onTextSelection,
      deleteAnnotation,
      addLogEntryBound,
      onCUIModeChange,
      onUMLSClick,
      UMLSInfo
    } = this.props

    return (
      <div>
        <div className="selection-section">
          <Tooltip title="Clear highlighted text">
              <HighlightOff
                className='hover-state selection-clear'
                onClick={() => onTextSelection(null)}
              />
          </Tooltip>

          <div className="selection-main">
            <div className="selection-text">
              <h4>Selection:</h4>
              <h4><b>{selectedText}</b></h4>
            </div>

            <div className="selection-arrow">
              {selectedLabels.length > 0 && <ArrowForward />}
            </div>

            <div className="selection-labels">
              {selectedLabels.map((label, _i) =>
                <LabelListItem
                  key={label.labelId}
                  selected={true}
                  label={label}
                  colormap={colormap}
                  onDeleteClick={() => this.removeLabel(label.labelId)}
                  onUMLSClick={() => onUMLSClick(label.labelId)}
                  UMLSInfo={UMLSInfo}
                  onMouseEnter={() => addLogEntryBound(LOG_LABEL_MOUSE_ON, [label.labelId, "selected"])}
                  onMouseLeave={() => addLogEntryBound(LOG_LABEL_MOUSE_OFF, [label.labelId, "selected"])}
                />
              )}
            </div>
          </div>

          <Tooltip title={"Delete annotation"}>
            <Delete
              className='hover-state selection-delete'
              color="error"
              onClick={(_event) => deleteAnnotation()}
            />
          </Tooltip>
        </div>

        <div className="cui-menu">
          <div
            className={`hover-state cui-menu-option ${CUIMode === CUI_NORMAL && "selected"}`}
            onClick={() => onCUIModeChange(CUI_NORMAL)}
          >
            Normal CUI Match
          </div>

          <div
            className={`hover-state cui-menu-option ${CUIMode === CUI_AMBIGUOUS && "selected"}`}
            onClick={() => onCUIModeChange(CUI_AMBIGUOUS)}
          >
            Ambiguous CUI Match
          </div>

          <div
            className={`hover-state cui-menu-option ${CUIMode === CUI_CODELESS && "selected"}`}
            onClick={() => onCUIModeChange(CUI_CODELESS)}
          >
            No CUI Match
          </div>
        </div>
      </div>
    )
  }
}

export default Selection
