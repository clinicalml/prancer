import React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Modal from '@material-ui/core/Modal';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Tooltip  from '@material-ui/core/Tooltip'
import { MoreHoriz } from '@material-ui/icons'
import { CUI_TYPE, CUI_NORMAL, CUI_AMBIGUOUS, CUI_CODELESS } from './types'

interface CUIModalProps {
  CUIMode: CUI_TYPE
  onChange: (CUIMode: CUI_TYPE) => void
  fullSize: boolean
}

interface CUIModalState {
  open: boolean
}

class CUIModal extends React.Component<CUIModalProps, CUIModalState> {
  constructor(props: CUIModalProps) {
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

  handleChange = (event: any) => {
    const newCUIMode = event.target.value
    this.props.onChange(newCUIMode)
  }

  render() {
    const button = this.props.fullSize
      ? (
        <div
          className='cui-modal-button hover-state'
          onClick={this.handleOpen}
        >
          More CUI Options
        </div>
      ) : (
        <MoreHoriz
          className='hover-state'
          onClick={this.handleOpen}
        />
      )

    return (
      <div className="CUIMode-modal">
        <Tooltip title="More CUI options">
          <div>
            {button}
          </div>
        </Tooltip>
        <Modal
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div className="modal-content CUIMode-modal-content">
            <FormControl component="fieldset">
              <FormLabel component="legend">CUI Options</FormLabel>
              <RadioGroup
                aria-label="Experiment Mode"
                name="mode"
                value={this.props.CUIMode}
                onChange={this.handleChange}
              >
                <FormControlLabel value={CUI_NORMAL} control={<Radio />} label="Normal match" />
                <FormControlLabel value={CUI_AMBIGUOUS} control={<Radio />} label="Ambiguous match" />
                <FormControlLabel value={CUI_CODELESS} control={<Radio />} label="No match" />
              </RadioGroup>
            </FormControl>
          </div>
        </Modal>
      </div>
    )
  }
}

export default CUIModal
