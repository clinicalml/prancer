import * as React from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { NavigateNext } from '@material-ui/icons';
import * as actionCreators from '../../actions';
import AnnotationView from '../Annotation/AnnotationView';


function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.default, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class TutorialAnnotation extends React.Component {
  render() {
    const { params } = this.props;
    const fileId = params.fileId;
    const userId = params.userId;

    return (
      <div className="tutorial-annotation">
        <h1>Tutorial {fileId}</h1>

        <div style={{
          height: 'calc(100% - 200px)',
          padding: 0
        }}>
          <AnnotationView params={params} tutorial={true} />
        </div>

        <div className="next-button">
          <Button
            className='hover-state'
            variant={'contained'}
            onClick={() => browserHistory.push(`/tutorial/explanation/${userId}/${fileId}`)}
            color="primary"
          >
            Next <NavigateNext />
          </Button>
        </div>
      </div>
    );
  }
}

export default TutorialAnnotation;
