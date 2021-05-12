import React from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { NavigateNext } from '@material-ui/icons';
import * as actionCreators from '../../actions';
import { TUTORIAL_SLIDES_LINK } from '../../../constants';

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.default, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class TutorialView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      errorText: "",
      userId: ""
    };
  }

  handleChange = (event) => {
    const newValue = event.target.value;

    if (this.validateUserId(newValue))
      this.setState({ errorText: '', userId: newValue });
    else
      this.setState({ errorText: "Only alphanumeric characters are valid." })
  }

  validateUserId = (str) => {
    const regex = RegExp(/^[a-z0-9]+$/i);
    return regex.test(str);
  }

  handleSubmit = () => {
    const { userId } = this.state;

    if (this.validateUserId(userId)) {
      this.props.startTutorial(userId)
      browserHistory.push(`/tutorial/${userId}/1`)
    }
  }

  render() {
    return (
      <section>
        <div className="container text-body">
          <h1>Tutorial</h1>

          <p>
            Welcome to the tutorial for the clinical annotation platform! Before you
            begin annotating notes, we recommend reading through
            these <a href={TUTORIAL_SLIDES_LINK} target="_blank">quick slides</a> introducing
            the problem we're tackling and how the platform works.
          </p>

          <p>
            Next, we will walk through a few
            example sentences and how they should be annotated. A sentence
            will appear in the annotation text box and you will be able to try
            annotating it as if it is a real sample. When you are done, you can
            hit the 'Next' button and see a report of how your annotations compare
            to the gold standard. When you are ready, click below to begin the first
            example!
          </p>

          <div className="text-field">
            <TextField
              required
              id="userId-input"
              label="User ID"
              margin="normal"
              errorText={this.state.errorText}
              value={this.state.userId}
              onChange={this.handleChange}
            />
          </div>

          <div className="next-button">
            <Button
              className='hover-state'
              variant={'contained'}
              onClick={this.handleSubmit}
              color="primary"
            >
              Next <NavigateNext />
            </Button>
          </div>

        </div>
      </section>
    );
  }
}

export default TutorialView;
