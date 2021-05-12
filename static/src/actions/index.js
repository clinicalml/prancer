import * as fileActionCreators from './files';
import * as labelActionCreators from './labels';
import * as colormapActionCreators from './colormap';
import * as umlsActionCreators from './umls';
import * as tutorialActionCreators from './tutorial'
import * as logActionCreators from './log'

const actionCreators = {
  ...fileActionCreators,
  ...labelActionCreators,
  ...colormapActionCreators,
  ...umlsActionCreators,
  ...tutorialActionCreators,
  ...logActionCreators
};

export default actionCreators
