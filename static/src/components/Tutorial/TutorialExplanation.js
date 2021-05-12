import * as React from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { NavigateNext } from '@material-ui/icons';
import * as actionCreators from '../../actions';
import TextController from '../Annotation/TextController';
import TutorialEvaluationItem from './TutorialEvaluationItem';
import { TUTORIAL_LENGTH } from '../../../constants';


function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.default, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class TutorialExplanation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
      annotations: [],
      goldAnnotations: [],
      evaluation: [],
      colormap: {}
    };
  }

  componentDidMount() {
    this.fetchData();
    this.fetchColormap();
  }

  async fetchData() {
    const { params } = this.props;
    const { fileId, userId } = params;

    const file = this.props.getFile(fileId, './tutorial', './tutorial/users/'+userId);
    const goldFile = this.props.getFile(fileId + '-gold', './tutorial', './tutorial');
    const evaluationFunction = this.props.getTutorialEvaluation(fileId, userId);

    const data = await file.then((response) => response.data);
    const goldData = await goldFile.then((response) => response.data);
    const evaluationData = await evaluationFunction.then((response) => response.data);

    this.setState({
      text: data.file.text,
      annotations: data.file.annotations,
      goldAnnotations: goldData.file.annotations,
      evaluation: evaluationData.evaluation
    })
  }

  async fetchColormap() {
    const colormapPromise = this.props.getColormap();
    const data = await colormapPromise.then((response) => response.data);

    this.setState({
      colormap: data.colormap,
    });
  }

  onNextClick = () => {
    const { params: { fileId, userId }, restartTutorial } = this.props;

    if (Number(fileId) < TUTORIAL_LENGTH) {
      browserHistory.push(`/tutorial/${userId}/${Number(fileId) + 1}`);
    } else {
      restartTutorial(userId);
      browserHistory.push(`/tutorial/done`);
    }
  }

  calculateSpanScore = () => {
    const { evaluation } = this.state;
    return evaluation.reduce((score, item) => score + item.spanScore, 0)
  }

  calculateLabelScore = () => {
    const { evaluation } = this.state;
    return evaluation.reduce((score, item) => score + item.labelScore, 0)
  }

  render() {
    const { params } = this.props;
    const { evaluation, text, colormap, annotations, goldAnnotations } = this.state;

    const fileId = params.fileId;

    const totalCount = goldAnnotations.length;
    const spanScore = this.calculateSpanScore();
    const labelScore = this.calculateLabelScore();

    return (
      <div className="tutorial-explanation">
        <h1>Tutorial {fileId} Explanation</h1>

        <div style={{
          overflow: 'scroll',
          paddingBottom: 50
        }}>
          <div style={{
            height: '340px',
            padding: 0
          }}>
            <div className="col-md-5">
              <h3>Standard Annotations</h3>
              <TextController
                text={text}
                colormap={colormap}
                annotations={goldAnnotations}
                selectedAnnotationId={null}
                onAnnotationSelection={null}
                onSuggestionUpdate={null}
                onTextSelection={null}
              />
            </div>
            <div className="col-md-1" />
            <div className="col-md-5">
              <h3>Your Annotations</h3>
              <TextController
                text={text}
                colormap={colormap}
                annotations={annotations}
                selectedAnnotationId={null}
                onAnnotationSelection={null}
                onSuggestionUpdate={null}
                onTextSelection={null}
              />
            </div>
          </div>

          <div style={{
            padding: 0
          }}>
            <div className="tutorial-explanations">

              <h4 className="tutorial-score">
                <div>
                  Span Score: {spanScore} / {totalCount} {
                    spanScore == totalCount && <span>&#x2B50;</span>
                  }
                </div>
                <div>
                  Label Score: {labelScore} / {spanScore} {
                    labelScore == spanScore && <span>&#x2B50;</span>
                  }
                </div>
              </h4>

              <div className="tutorial-evaluation-item">
                <div className="tutorial-evaluation-icon">
                  Status
                </div>
                <div className="tutorial-evaluation-token">
                  Correct Annotation
                </div>
                <div className="tutorial-evaluation-description">
                  <div>Description</div>
                </div>
              </div>

              {evaluation && evaluation.map(item => (
                <TutorialEvaluationItem
                  evaluationItem={item}
                  colormap={colormap}
                />
              ))}

              <div style={{ textAlign: 'center' }}>* Hover over underlined labels in the descriptions to see further detail.</div>
            </div>
          </div>
        </div>

        <div className="next-button">
          <Button
            className='hover-state'
            variant={'contained'}
            onClick={this.onNextClick}
            color="primary"
          >
            Next <NavigateNext />
          </Button>
        </div>
      </div>
    );
  }
}

export default TutorialExplanation;
