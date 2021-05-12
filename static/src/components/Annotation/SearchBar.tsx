import React from 'react'

interface SearchBarProps {
  initialText: string
  label: string | undefined
  onChange?: Function
  onEnter: (searchTerm: string) => void
}

interface SearchBarState {
  searchText: string
}

class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
  constructor(props: SearchBarProps) {
    super(props)

    this.state = {
      searchText: this.props.initialText
    }
  }

  handleChange = (event: any) => {
    const { onChange } = this.props

    this.setState({searchText: event.target.value})
    if (onChange)
      onChange(event.target.value)
  }

  handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { onEnter } = this.props

    if (onEnter && event.key === 'Enter') {
      onEnter(this.state.searchText)
    }
  }

  componentDidUpdate(prevProps: SearchBarProps) {
    const { initialText, onChange } = this.props

    if (prevProps.initialText !== initialText) {
      this.setState({searchText: initialText})
      if (onChange)
        onChange(initialText)
    }
  }

  render() {
    return (
      <div className="search-bar">
        <div className='search-icon'>
          {this.props.label}
        </div>
        <input
          type="text"
          value={this.state.searchText}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
        />
      </div>
    )
  }
}

export default SearchBar
