import React from 'react'
import Tooltip  from '@material-ui/core/Tooltip'
import { Clear } from '@material-ui/icons'
import InfoModal from './InfoModal'
import { Filtermap, Label, UMLSDefinition } from './types'
import { hex2rgba, createBackground } from './utils'

interface LabelListItemProps {
  label: Label
  colormap: Filtermap<string>
  selected?: boolean
  onClick?: () => void
  onDeleteClick?: () => void
  onUMLSClick: () => void
  UMLSInfo: UMLSDefinition[]
  onMouseEnter: () => void
  onMouseLeave: () => void
}

class LabelListItem extends React.Component<LabelListItemProps, {}> {
  constructor(props: LabelListItemProps) {
    super(props)
  }

  render() {
    const { labelId, title, categories, confidence } = this.props.label
    const categoryText = categories
      ? categories.map(c => c.title).join(' | ')
      : 'None'
    const tooltipText = <div>
      <div>{title}</div>
      <div>CUI: {labelId}</div>
      <div>Categories: {categoryText}</div>
    </div>

    // @ts-ignore
    const colorOpacity = .5
    const categoryColors = categories && categories.map(
      c => hex2rgba(this.props.colormap[c.type], colorOpacity)
    )
    const background = createBackground(categoryColors)

    return (
      <Tooltip title={tooltipText}>
        <div
          className={`label-item hover-state ${confidence ? 'label-item-suggestion' : ''}`}
          onClick={this.props.onClick}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}

        >
          <div className="label-title" style={{ background, border: this.props.selected && '2px solid black' }}>
            <div className="label-title-text">{title}</div>
            <div className="label-link" onClick={e => e.stopPropagation()}>
              <InfoModal
                title={title}
                cui={labelId}
                onClick={this.props.onUMLSClick}
                UMLSInfo={this.props.UMLSInfo}
              />
            </div>
            <div className="label-delete-button">
              {this.props.onDeleteClick && this.props.selected &&
                <Clear
                  className='hover-state'
                  style={{fontSize: 20}}
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    this.props.onDeleteClick();
                  }}
                />
              }
            </div>
          </div>
        </div>
      </Tooltip>
    )
  }
}

export default LabelListItem
