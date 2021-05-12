export const SEARCH_AUTOMATIC = 'auto';
export const SEARCH_MANUAL = 'manual';
export type SEARCH_TYPE = typeof SEARCH_AUTOMATIC | typeof SEARCH_MANUAL;

export const CUI_NORMAL = 'normal';
export const CUI_AMBIGUOUS = 'ambiguous';
export const CUI_CODELESS = 'codeless';
export type CUI_TYPE = typeof CUI_NORMAL | typeof CUI_AMBIGUOUS | typeof CUI_CODELESS;

export const EXPERIMENT_0 = 0;
export const EXPERIMENT_1 = 1;
export const EXPERIMENT_2 = 2;
export const EXPERIMENT_3 = 3;
export type EXPERIMENT_TYPE = typeof EXPERIMENT_0
| typeof EXPERIMENT_1
| typeof EXPERIMENT_2
| typeof EXPERIMENT_3;

export const MANUAL = 'manual';
export const AUTO = 'auto';
export const DYNAMIC = 'dynamic';
export type CREATION_TYPE = typeof MANUAL | typeof AUTO | typeof DYNAMIC;

export const UNDECIDED = 'undecided';
export const ACCEPTED = 'accepted';
export const REJECTED = 'rejected';
export const MODIFIED = 'modified';
export type DECISION_TYPE = typeof UNDECIDED | typeof ACCEPTED | typeof REJECTED | typeof MODIFIED;

export const LOG_HIGHLIGHT = 'HIGHLIGHT';
export const LOG_SCROLL = 'SCROLL';
export const LOG_LABEL_ADD = 'LABEL-ADD';
export const LOG_LABEL_REMOVE = 'LABEL-REMOVE';
export const LOG_RECOMMEND = 'RECOMMEND-KEYWORD';
export const LOG_SEARCH_KEYWORD = 'SEARCH-KEYWORD';
export const LOG_SEARCH_CODE = 'SEARCH-CODE';
export const LOG_LABEL_FILTER = 'LABEL-FILTER';
export const LOG_ANNOTATION_ADD = 'ANNOTATION-ADD';
export const LOG_ANNOTATION_REMOVE = 'ANNOTATION-REMOVE';
export const LOG_SUGGESTION_ACTION = 'SUGGESTION-ACTION';
export const LOG_LABEL_INFO = 'LABEL-INFO';
export const LOG_PAUSE = 'PAUSE';
export const LOG_PLAY = 'PLAY';
export const LOG_ANNOTATION_MOUSE_ON = 'ANNOTATION-MOUSE-ON';
export const LOG_ANNOTATION_MOUSE_OFF = 'ANNOTATION-MOUSE-OFF';
export const LOG_TOKEN_MOUSE_ON = 'TOKEN-MOUSE-ON';
export const LOG_TOKEN_MOUSE_OFF = 'TOKEN-MOUSE-OFF';
export const LOG_LABEL_MOUSE_ON = 'LABEL-MOUSE-ON';
export const LOG_LABEL_MOUSE_OFF = 'LABEL-MOUSE-OFF';
export const LOG_CUI_MODE_CHANGE = 'CUI-MODE-CHANGE';
export const LOG_ANNOTATION_SELECT = 'ANNOTATION-SELECT';
export type LOG_TYPE = typeof LOG_HIGHLIGHT | typeof LOG_SCROLL
  | typeof LOG_LABEL_ADD | typeof LOG_LABEL_REMOVE
  | typeof LOG_LABEL_FILTER | typeof LOG_LABEL_INFO
  | typeof LOG_RECOMMEND
  | typeof LOG_SEARCH_CODE | typeof LOG_SEARCH_KEYWORD
  | typeof LOG_ANNOTATION_ADD | typeof LOG_ANNOTATION_REMOVE
  | typeof LOG_SUGGESTION_ACTION
  | typeof LOG_PAUSE | typeof LOG_PLAY
  | typeof LOG_ANNOTATION_MOUSE_ON | typeof LOG_ANNOTATION_MOUSE_OFF
  | typeof LOG_TOKEN_MOUSE_ON | typeof LOG_TOKEN_MOUSE_OFF
  | typeof LOG_LABEL_MOUSE_ON | typeof LOG_LABEL_MOUSE_OFF
  | typeof LOG_CUI_MODE_CHANGE | typeof LOG_ANNOTATION_SELECT

export const HIGH_CONFIDENCE = 'high';
export const LOW_CONFIDENCE = 'low';
export type CONFIDENCE_TYPE = typeof HIGH_CONFIDENCE | typeof LOW_CONFIDENCE;

export type CharacterSpan = {
  start: number;
  end: number;
}

export type Category = {
  title: string;
  type: string;
}

export type Label = {
  labelId: string;
  title: string;
  categories: Category[];
  confidence?: CONFIDENCE_TYPE;
}

export type LabelCounts = { [id: string]: Label & {count: number}; }

export type Annotation = {
  annotationId: number;
  createdAt: number;  // UTC timestamp in milliseconds
  text: string;
  spans: CharacterSpan[];
  labels: Label[];
  CUIMode: CUI_TYPE;
  experimentMode: EXPERIMENT_TYPE;
  creationType: CREATION_TYPE;
  decision: DECISION_TYPE;
}

export type Token = {
  id: number,
  text: string,
  span: CharacterSpan,
  annotations: Annotation[],
}

export type WordToken = {
  id: number,
  text: string,
  span: CharacterSpan,
}

export interface Filtermap<T> {
    [Key: string]: T;
}

export type UMLSDefinition = {
  rootSource: string,
  value: string
}
