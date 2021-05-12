import re
import time
import pickle
from ast import literal_eval

from .labels import cui2index, label_data
from .constants import *


suggestions = pickle.load(open(SUGGESTIONS_FILE, 'rb'))

def load_csv_annotations(text, annotation_df):
    annotations = []
    for i, row in annotation_df.iterrows():
        span = (int(row['start']), int(row['end']))
        cui = [row['cui']]
        annotations += [create_annotation(text[span[0]:span[1]], span, cui, 'high')]
    return annotations

def suggest_mapped_annotations(text):
    annotations = []
    for keyword in suggestions:
        labels = suggestions[keyword]
        annotations += keyword_annotations(text, keyword, labels, 'high')
    print(annotations)
    return annotations


def keyword_annotations(text, keyword, labels, confidence):
    ## Default to separate word, case insensitive
    try:
        return [create_annotation(text, match.span(), labels, confidence)
            for match in re.finditer(
                r'(?:^|\W)' + keyword + r'(?:$|\W)',
                text,
                flags=re.IGNORECASE
            )
        ]
    except:
        return []


def create_annotation(text, span, labels, confidence):
    timestamp = time.time()  # Didn't round to ms to preserve uniqueness
    start, end = span
    if type(labels) is str:
        labels = [labels]
    annotation = {
        "annotationId": timestamp,
        "createdAt": timestamp,
        "text": text[start:end],
        "spans": [{"start": span[0], "end": span[1]}],
        "labels": create_labels(labels, confidence),
        "CUIMode": "normal",
        "experimentMode": 0,
        "creationType": "auto",
        "decision": "undecided"
    }

    return annotation

## Only creates a suggestion for a single code
def create_labels(codes, confidence):
    print(codes, type(codes), confidence)
    if len(codes) > 0 and codes[0] in cui2index:
        print("inside here")
        data = label_data(cui2index[codes[0]])
        print(data)
        return [{
            "labelId": data[0],
            "title": data[1],
            "categories": [{"title": c[0], "type": c[1]} for c in data[2]],
            "confidence": confidence
        }]
    else:
        return []
