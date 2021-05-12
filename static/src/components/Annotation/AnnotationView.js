import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { withTheme } from '@material-ui/core/styles';
import * as actionCreators from '../../actions';
import TextController from './TextController'
import LabelController from './LabelController';
import Selection from './Selection';
import PauseModal from './PauseModal';
import {
  createAnnotation,
  createAnnotationFromToken,
  getSelectedText,
  getSelectionSpans,
  generateLabelCounts,
  isAnnotationSelected,
  nMostCommonLabels,
  selectionIsEmpty,
  propagateSuggestions
} from './utils';
import {
  CUI_NORMAL,
  CUI_AMBIGUOUS,
  CUI_CODELESS,
  EXPERIMENT_0,
  LOG_HIGHLIGHT,
  LOG_ANNOTATION_ADD,
  LOG_ANNOTATION_REMOVE,
  LOG_RECOMMEND,
  LOG_SEARCH_KEYWORD,
  LOG_SEARCH_CODE,
  LOG_SUGGESTION_ACTION,
  LOG_LABEL_INFO,
  LOG_PAUSE,
  LOG_PLAY,
  LOG_CUI_MODE_CHANGE,
  LOG_ANNOTATION_SELECT,
  SEARCH_MANUAL,
  SEARCH_AUTOMATIC,
  MANUAL,
  DYNAMIC,
  MODIFIED
} from './types';
import {
  DYNAMIC_SUGGESTIONS_ENABLED
} from '../../../constants';

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators.default, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class AnnotationView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fileId: "",
      text: "",
      annotations: [],
      colormap: {},
      selection: null,
      selectedText: "",
      selectedAnnotationId: null,
      searchedLabels: [],
      searchMode: SEARCH_MANUAL,
      CUIMode: CUI_NORMAL,
      commonLabels: [],
      selectedLabels: [],
      labelCounts: {},
      savedSelectionRanges: null,
      selectedMode: 0,
      UMLSInfo: []
    };
  }

  rootRef;

  setRootRef = (element) => {
    this.rootRef = element;
  }

  componentDidMount() {
    this.fetchData();
    this.fetchColormap();

    if (this.rootRef) this.rootRef.addEventListener('mouseup', this.handleMouseUp);
  }

  componentWillUnmount() {
    if (this.rootRef) this.rootRef.removeEventListener('mouseup', this.handleMouseUp);
  }

  async fetchData() {
    const { getFile, params, tutorial } = this.props;
    const fileId = params.fileId;
    const userId = params.userId;

    const file = tutorial
      ? getFile(fileId, './tutorial', './tutorial/users/'+userId)
      : getFile(fileId);
    const data = await file.then((response) => response.data);

    this.setState({
      fileId,
      text: data.file.text,
      annotations: data.file.annotations
    })
  }

  async fetchLabels(searchTerm, searchMode, isKeyword, experimentMode) {
    const labelPromise = searchMode === SEARCH_AUTOMATIC
      ? this.props.recommendLabels(searchTerm, isKeyword, experimentMode)
      : this.props.searchLabels(searchTerm);

    const data = await labelPromise.then((response) => response.data);
    const labels = data.labels.map(l => ({
      labelId: l[0],
      title: l[1],
      categories: l[2].map(c => ({ title: c[0], type: c[1] })),
    }));

    this.setState({
      searchedLabels: labels,
    });
  }

  fetchLabelsBound = (searchTerm, searchMode, isKeyword, experimentMode) => {
    this.fetchLabels(searchTerm, searchMode, isKeyword, experimentMode);
  }

  async fetchUMLSInfo(cui) {
    const infoPromise = this.props.getUMLSInfo(cui);
    const data = await infoPromise.then((response) => response.data);

    const UMLSInfo = data["umls_info"].map((defn) => ({
      "rootSource": defn["rootSource"],
      "value": defn["value"]
    }));

    this.setState({
      UMLSInfo,
    });
  }

  async fetchColormap() {
    const colormapPromise = this.props.getColormap();
    const data = await colormapPromise.then((response) => response.data);

    this.setState({
      colormap: data.colormap,
    });
  }

  handleMouseUp = () => {
    const selection = window.getSelection();
    this.onTextSelection(selection)
  }

  onAnnotationCreationSelection = () => {
    const { selection, selectedLabels, text, selectedMode } = this.state;
    const annotation = createAnnotation(
      selection,
      text,
      selectedLabels,
      CUI_NORMAL,
      selectedMode
    );

    return this.onAnnotationCreation(annotation);
  }

  onAnnotationCreationToken = (token) => {
    const { selectedLabels, text, selectedMode } = this.state;
    const annotation = createAnnotationFromToken(
      token,
      [],
      CUI_NORMAL,
      selectedMode
    );

    this.setState({
      selectedText: token.text,
      selectedLabels: []
    }, () => {
      this.onAnnotationCreation(annotation);
    });
  }

  onAnnotationCreation = (annotation) => {
    const nonemptyAnnotations = this.state.annotations.filter(
      a => a.labels.length != 0
    );

    const searchText = annotation.text;
    const searchMode = SEARCH_AUTOMATIC;

    this.addLogEntry(LOG_ANNOTATION_ADD, annotation.annotationId, []);

    this.setState({
      annotations: [...nonemptyAnnotations, annotation],
      selectedAnnotationId: annotation.annotationId,
      CUIMode: CUI_NORMAL
    }, () => {
      this.searchLabels(searchText, searchMode, true);
      this.handleSaveAnnotations();
    });

    return annotation.annotationId;
  }

  onAnnotationUpdate = (id) => {
    const { annotations } = this.state;
    const editedAnnotation = annotations.find(a => a.annotationId === id);

    if (editedAnnotation) {
      editedAnnotation.labels = this.state.selectedLabels;
      editedAnnotation.CUIMode = this.state.CUIMode;
      editedAnnotation.createdAt = Date.now();

      const newAnnotations = annotations.filter(a => a.annotationId !== id);
      newAnnotations.push(editedAnnotation);

      this.setState({
        annotations: DYNAMIC_SUGGESTIONS_ENABLED
          ? propagateSuggestions(
              this.state.text,
              editedAnnotation,
              newAnnotations
            )
          : newAnnotations
      }, () => {
        this.handleSaveAnnotations();
      });
    }
  }

  onSuggestionUpdate = (id, decision) => {
    this.addLogEntry(LOG_SUGGESTION_ACTION, id, [decision]);

    const { annotations } = this.state;
    const editedAnnotation = annotations.find(a => a.annotationId === id);
    editedAnnotation.decision = decision;

    if (decision === MODIFIED) {
      const newLabels = editedAnnotation.labels.filter(l => l.confidence === undefined);
      editedAnnotation.labels = newLabels;
      this.setState({
        selectedLabels: newLabels
      });
    }

    const newAnnotations = annotations.filter(a => a.annotationId !== id);
    newAnnotations.push(editedAnnotation);

    this.setState({
      annotations: newAnnotations
    }, () => {
      this.handleSaveAnnotations();
    });
  }

  onAnnotationDeletion = (id) => {
    this.addLogEntry(LOG_ANNOTATION_REMOVE, id, []);

    this.setState({
      annotations: this.state.annotations.filter(a => a.annotationId !== id),
      selectedAnnotationId: null
    }, () => {
      this.handleSaveAnnotations();
    });
  }

  onTextSelection = (selection) => {
    const spans = getSelectionSpans(selection);

    if (selection === null) {
      this.onTextSelectionClear();
    } else if (!selectionIsEmpty(selection) && spans.length > 0) {
      const span = spans[0];
      this.addLogEntry(LOG_HIGHLIGHT, null, [span.start, span.end]);

      this.setState({
        selection,
        selectedText: getSelectedText(selection, this.state.text),
        selectedLabels: []
      }, () => {
        this.onAnnotationCreationSelection();
      });
    }
  }

  onTextSelectionClear = () => {
    const nonemptyAnnotations = this.state.annotations.filter(
      a => a.labels.length != 0
    );

    this.setState({
      selection: null,
      selectedText: "",
      selectedAnnotationId: null,
      selectedLabels: [],
      savedSelectionRanges: null,
      searchedLabels: [],
      annotations: nonemptyAnnotations
    });
  }

  handleSaveAnnotations = () => {
    const { params, tutorial } = this.props;
    const { fileId, userId } = params;

    const dir = tutorial ? './tutorial/users/'+userId : null;
    this.props.saveAnnotations(fileId, this.state.annotations, dir);
  }

  deleteAnnotation = () => {
    const { selectedAnnotationId } = this.state;
    if (selectedAnnotationId) {
      this.onTextSelectionClear();
      this.onAnnotationDeletion(selectedAnnotationId);
    }
  }

  onAnnotationSelection = (id) => {
    const annotation = this.state.annotations.find(a =>
      isAnnotationSelected(a, id)
    );

    const searchText = annotation.text;
    const searchMode = SEARCH_AUTOMATIC;

    if (annotation) {
      this.setState({
        selectedAnnotationId: id,
        CUIMode: annotation.CUIMode,
        selectedLabels: annotation.labels,
        selectedText: annotation.text
      }, this.searchLabels(searchText, searchMode, true));

      this.addLogEntryBound(LOG_ANNOTATION_SELECT, [id]);
    }
  }

  searchLabels = (searchTerm, searchMode, isKeyword) => {
    this.setState({ searchMode });
    this.fetchLabels(searchTerm, searchMode, isKeyword, this.state.selectedMode);

    if (searchMode === SEARCH_MANUAL)
      this.addLogEntryBound(isKeyword ? LOG_SEARCH_KEYWORD : LOG_SEARCH_CODE, [searchTerm]);
    else
      this.addLogEntryBound(LOG_RECOMMEND, [searchTerm]);
  }

  onSearchEnterPress = (searchTerm, isKeyword) => {
    this.searchLabels(searchTerm, SEARCH_MANUAL, true);
  }

  onCUIModeChange = (mode) => {
    const selectedLabels = mode == CUI_CODELESS
      ? [{
        labelId: '0',
        title: 'CUI-less',
        categories: [{
          title: 'None',
          type: 'Other'
        }]
      }]
      : this.state.selectedLabels.filter(label => label.title != 'CUI-less')

    this.addLogEntryBound(LOG_CUI_MODE_CHANGE, [mode]);

    this.setState({
      CUIMode: mode,
      selectedLabels,
    }, () => {
      if (this.state.selectedAnnotationId)
        this.onAnnotationUpdate(this.state.selectedAnnotationId)
    });
  }

  setSelectedLabels = (labels) => {
    if (this.state.CUIMode != CUI_CODELESS) {
      this.setState({
        selectedLabels: labels
      }, () => {
        if (this.state.selectedAnnotationId)
          this.onAnnotationUpdate(this.state.selectedAnnotationId)
      });
    }
  }

  onUMLSClick = (cui) => {
    this.fetchUMLSInfo(cui);
    this.addLogEntryBound(LOG_LABEL_INFO, [cui]);
  }

  async addLogEntry(action, annotationId, metadata) {
    const logPromise = this.props.addLog(
      this.state.fileId,
      action,
      annotationId,
      metadata
    );
    const isLogged = await logPromise.then((response) => response.data);
    // console.log({action, isLogged: isLogged.log});
    return isLogged;
  }

  addLogEntryBound = (action, metadata) => {
    const annotationId = this.state.selectedAnnotationId === undefined
      ? null
      : this.state.selectedAnnotationId;

    return this.addLogEntry(action, annotationId, metadata);
  }

  onPause = () => {
    this.addLogEntryBound(LOG_PAUSE, []);
  }

  onPlay = () => {
    this.addLogEntryBound(LOG_PLAY, []);
  }

  render() {
    const { primary, secondary } = this.props.theme.palette;

    return (
      <div className="annotation-view" ref={this.setRootRef} onClick={(e) => e.preventDefault()}>
        <div style={{
          height: 'calc(100% - 250px)',
          padding: 0
        }}>
          <div className="col-md-8" style={{
            height: '100%',
            padding: 0
          }}>
            <TextController
              text={this.state.text}
              colormap={this.state.colormap}
              annotations={this.state.annotations}
              selectedAnnotationId={this.state.selectedAnnotationId}
              onAnnotationCreationToken={this.onAnnotationCreationToken}
              onAnnotationSelection={this.onAnnotationSelection}
              onSuggestionUpdate={this.onSuggestionUpdate}
              onTextSelection={this.onTextSelection}
              addLogEntryBound={this.addLogEntryBound}
            />
          </div>
          <div className="col-md-4" style={{
            height: '100%',
            padding: 0
          }}>
            <LabelController
              selectedText={this.state.selectedText}
              searchedLabels={this.state.searchedLabels}
              selectedLabels={this.state.selectedLabels}
              colormap={this.state.colormap}
              searchMode={this.state.searchMode}
              CUIMode={this.state.CUIMode}
              onTextSelection={this.onTextSelection}
              onEnterPress={this.onSearchEnterPress}
              onCUIModeChange={this.onCUIModeChange}
              setSelectedLabels={this.setSelectedLabels}
              deleteAnnotation={this.deleteAnnotation}
              onUMLSClick={this.onUMLSClick}
              UMLSInfo={this.state.UMLSInfo}
              addLogEntryBound={this.addLogEntryBound}
            />
          </div>
        </div>
        <div style={{ height: 100 }}>
          <Selection
            selectedText={this.state.selectedText}
            selectedLabels={this.state.selectedLabels}
            colormap={this.state.colormap}
            CUIMode={this.state.CUIMode}
            onCUIModeChange={this.onCUIModeChange}
            onTextSelection={this.onTextSelection}
            setSelectedLabels={this.setSelectedLabels}
            deleteAnnotation={this.deleteAnnotation}
            onUMLSClick={this.onUMLSClick}
            UMLSInfo={this.state.UMLSInfo}
            addLogEntryBound={this.addLogEntryBound}
          />
        </div>
      </div>
    );
  }
}

export default withTheme()(AnnotationView);
