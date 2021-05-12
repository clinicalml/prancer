import React from 'react'
import Tooltip  from '@material-ui/core/Tooltip'
import { HighlightOff } from '@material-ui/icons'
import { Filtermap } from './types'
import { hex2rgba } from './utils'

interface LabelFilterProps {
  colormap: Filtermap<string>,
  onFilterChange: (filter: string) => void,
  selectedFilter: string
}

class LabelFilter extends React.Component<LabelFilterProps, {}> {
  constructor(props: LabelFilterProps) {
    super(props)
  }

  onFilterClick(filter: string) {
    this.props.onFilterChange(filter);
  }

  render() {
    const { colormap, selectedFilter } = this.props;

    const filters = [];
    for (const c in colormap) {
      const backgroundColor = c == selectedFilter
        ? hex2rgba(colormap[c], 0.75)
        : hex2rgba(colormap[c], 0.25);

      filters.push(
        <Tooltip key={c} title={c}>
          <div
            className="label-filter-item hover-state"
            onClick={() => this.onFilterClick(c)}
            style={{
              backgroundColor: backgroundColor
            }}
          >
            {c.slice(0,2)}
          </div>
        </Tooltip>
      );
    }

    filters.push(
      <Tooltip key={'All'} title={'Clear selected filter'}>
        <div
          className="label-filter-item"
          onClick={() => this.onFilterClick(null)}
          style={{
            backgroundColor: 'white',
            color: 'black'
          }}
        >
          <HighlightOff className="hover-state" />
        </div>
      </Tooltip>
    )

    return (
      <div className="label-filter">
        {filters}
      </div>
    )
  }
}

export default LabelFilter
