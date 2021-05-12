import React from 'react'
import Modal from '@material-ui/core/Modal';
import Tooltip  from '@material-ui/core/Tooltip'
import { InfoOutlined } from '@material-ui/icons'
import { UMLSDefinition } from './types'

interface InfoModalProps {
  title: string
  cui: string
  onClick: () => void
  UMLSInfo: UMLSDefinition[]
}

interface InfoModalState {
  open: boolean
}

class InfoModal extends React.Component<InfoModalProps, InfoModalState> {
  constructor(props: InfoModalProps) {
    super(props)

    this.state = {
      open: false
    }
  }

  handleOpen = () => {
    this.setState({ open: true })
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  render() {
    const { UMLSInfo } = this.props

    const definitions = UMLSInfo.length > 0
      ? this.props.UMLSInfo.map((defn, i) => (
          <div key={defn.rootSource + "-" + String(i)} className="defn">
            <div><b>Source: </b>{defn.rootSource}</div>
            <div dangerouslySetInnerHTML={{__html: defn.value}} />
          </div>
        ))
      : <div>No further information available.</div>

    return (
      <div className="info-modal">
        <Tooltip title="More UMLS information">
          <InfoOutlined
            className='hover-state'
            style={{fontSize: 20}}
            color='primary'
            onClick={() => {
              this.props.onClick();
              this.handleOpen();
            }}
          />
        </Tooltip>
        <Modal
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div className="modal-content">
            <div className="info-modal-content">
              <h3>{this.props.title}</h3>
              {definitions}
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}

export default InfoModal
