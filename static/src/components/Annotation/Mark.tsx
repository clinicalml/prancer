import React from 'react'
import Tooltip  from '@material-ui/core/Tooltip'
import { CharacterSpan } from './types'
import { INLINE_LABELS } from './config'
import { hex2rgba } from './utils'

export interface MarkProps {
  key: string
  text: string
  span: CharacterSpan
  tag: string
  color?: string
  opacity?: number
  border?: boolean
  fill?: boolean
  onClick: Function
}

const Mark: React.SFC<MarkProps> = props => (
  <Tooltip title={props.tag}>
    <div
      className='token hover-state'
      style={{
        display: 'inline-block',
        backgroundColor: props.fill && (props.color ? hex2rgba(props.color, props.opacity || 1) : '#dddddd'),
        padding: '0 8px 0',
        border: props.border && `2px solid ${props.color || '#dddddd'}`,
        // borderTop: props.border && `2px solid ${props.color || '#dddddd'}`
      }}
      data-i={props.span.start}
      onClick={(event) => props.onClick(event)}
    >
      {INLINE_LABELS && props.tag && (
        <div data-i={props.span.start} style={{fontSize: '0.7em', fontWeight: 500, display: 'block', textAlign: 'center'}}>{props.tag}</div>
      )}
      <div data-i={props.span.start} style={{display: 'block'}}>{props.text}</div>
    </div>
  </Tooltip>
)

export default Mark
