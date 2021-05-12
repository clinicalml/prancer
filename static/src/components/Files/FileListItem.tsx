import React from 'react'

interface FileListItemProps {
  file: string
  onClick: (id: string) => void
}

const FileListItem: React.SFC<FileListItemProps> = props => {
  return (
    <div className="file-item" onClick={(event) => {
      event.preventDefault()
      props.onClick(props.file)
    }}>
      <div className="file-title" key={props.file}>
        {props.file}
      </div>
    </div>
  )
}

export default FileListItem
