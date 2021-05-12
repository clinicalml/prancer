import React from 'react'
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import { Pause, PlayArrow } from '@material-ui/icons'

interface PauseModalProps {
  onPause: () => void
  onPlay: () => void
}

interface PauseModalState {
  open: boolean
}

class PauseModal extends React.Component<PauseModalProps, PauseModalState> {
  constructor(props: PauseModalProps) {
    super(props)

    this.state = {
      open: false
    }
  }

  handleOpen = () => {
    this.setState({ open: true })
    this.props.onPause()
  }

  handleClose = () => {
    this.setState({ open: false })
    this.props.onPlay()
  }

  render() {
    return (
      <div className="pause-modal">
        <Button
          className='hover-state'
          variant={'contained'}
          onClick={this.handleOpen}
          color="primary"
        >
          <Pause />
        </Button>
        <Modal
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div className="modal-content pause-modal-content">
            <h2>Annotation paused.</h2>
              <Button
                className='hover-state'
                variant={'contained'}
                onClick={this.handleClose}
                color="primary"
              >
                <PlayArrow />
              </Button>
          </div>
        </Modal>
      </div>
    )
  }
}

export default PauseModal
