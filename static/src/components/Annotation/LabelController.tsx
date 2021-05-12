import React from 'react'
import SearchBar from './SearchBar'
import LabelListItem from './LabelListItem'
import LabelFilter from './LabelFilter'
import {
  CUI_TYPE,
  Label,
  Filtermap,
  UMLSDefinition,
  LOG_TYPE,
  LOG_SCROLL,
  LOG_LABEL_FILTER,
  LOG_LABEL_ADD,
  LOG_LABEL_REMOVE,
  SEARCH_TYPE,
  LOG_LABEL_MOUSE_ON,
  LOG_LABEL_MOUSE_OFF,
  SEARCH_AUTOMATIC
} from './types'
import { filterLabelsByType } from './utils'

let scrollTimeout: number = null

interface LabelControllerProps {
  selectedText: string
  searchedLabels: Label[]
  selectedLabels: Label[]
  colormap: Filtermap<string>
  searchMode: SEARCH_TYPE
  CUIMode: CUI_TYPE
  onEnterPress: (searchTerm: string, isKeyword: boolean) => void
  onCUIModeChange: (mode: CUI_TYPE) => void
  setSelectedLabels: (labels: Label[]) => void
  deleteAnnotation: () => void
  onTextSelection: (selection: Selection) => void
  onUMLSClick: (cui: string) => void
  UMLSInfo: UMLSDefinition[]
  addLogEntryBound: (action: LOG_TYPE, metadata: string[]) => boolean
}

interface LabelControllerState {
  searchText: string
  selectedFilter: string
}

class LabelController extends React.Component<LabelControllerProps, LabelControllerState> {
  constructor(props: LabelControllerProps) {
    super(props)

    this.state = {
      searchText: '',
      selectedFilter: null
    }
  }

  componentDidUpdate(prevProps: LabelControllerProps) {
    const { selectedText } = this.props

    if (prevProps.selectedText !== selectedText) {
      this.setState({searchText: selectedText})
      this.handleFilterChange(null)
    }
  }

  handleEnterPress = (searchTerm: string, isKeyword: boolean) => {
    this.props.onEnterPress(searchTerm, isKeyword)
    this.setState({searchText: searchTerm})
  }

  addLabel = (label: Label, i: number) => {
    const { selectedLabels, setSelectedLabels, searchMode } = this.props
    if (!selectedLabels.map(l => l.labelId).includes(label.labelId)) {
      setSelectedLabels([...selectedLabels, label])
    }

    this.props.addLogEntryBound(LOG_LABEL_ADD, [label.labelId, String(i), searchMode])
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

  handleFilterChange = (newFilter: string) => {
    const selectedFilter = newFilter == this.state.selectedFilter
      ? null
      : newFilter;

    if (selectedFilter !== null)
      this.props.addLogEntryBound(LOG_LABEL_FILTER, [selectedFilter]);

    this.setState({
      selectedFilter
    })
  }

  onLabelListScroll = () => {
    clearTimeout(scrollTimeout)
    var { addLogEntryBound } = this.props

    scrollTimeout = setTimeout(function() {
      addLogEntryBound(LOG_SCROLL, []);
    }, 1000)
  }

  render() {
    const {
      selectedLabels,
      searchedLabels,
      colormap,
      addLogEntryBound,
      searchMode
    } = this.props

    const {
      selectedFilter
    } = this.state

    const filteredLabels = filterLabelsByType(searchedLabels, selectedFilter)

    return (
      <div className="label-controller">
        <div className="bordered-section divided-section" style={{ height: '100%' }}>
          <div style={{ paddingBottom: 20, overflow: 'hidden' }}>
            <div style={{ width: '100%' }}>
              <SearchBar
                initialText={this.state.searchText}
                label='Search: '
                onChange={null}
                onEnter={(searchTerm) => this.handleEnterPress(searchTerm, true)}
              />
            </div>
          </div>

          <LabelFilter
            colormap={colormap}
            onFilterChange={this.handleFilterChange}
            selectedFilter={this.state.selectedFilter}
          />

          <h4
            className="label-controller-description"
            style={{
              marginTop: 35,
              paddingTop: 10,
              fontWeight: 'normal',
              color: searchMode === SEARCH_AUTOMATIC ? 'red' : 'black'
            }}
          >
            {searchMode === SEARCH_AUTOMATIC ? "Recommended" : "Searched"} Labels:
          </h4>

          <div onWheel={this.onLabelListScroll}>
            {filteredLabels.map((label, i) =>
              <LabelListItem
                key={label.labelId}
                label={label}
                colormap={colormap}
                selected={selectedLabels.map(l=>l.labelId).includes(label.labelId)}
                onClick={() => this.addLabel(label, i)}
                onDeleteClick={() => this.removeLabel(label.labelId)}
                onUMLSClick={() => this.props.onUMLSClick(label.labelId)}
                UMLSInfo={this.props.UMLSInfo}
                onMouseEnter={() => addLogEntryBound(LOG_LABEL_MOUSE_ON, [label.labelId])}
                onMouseLeave={() => addLogEntryBound(LOG_LABEL_MOUSE_OFF, [label.labelId])}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default LabelController
