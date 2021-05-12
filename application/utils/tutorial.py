import json
import os
import time
import shutil

from .constants import *


def load_annotations(fname):
    f = open(fname, 'r')
    return json.load(f)


def get_span(ann):
    s = ann['spans'][0]
    return [s['start'], s['end']]


def clean_ann(ann):
    text = ann['text']
    start, end = ann['spans'][0]['start'], ann['spans'][0]['end']
    if text.startswith((' ', '\n', '.', ',')):
        text = text[1:]
        start = start + 1
    if text.startswith(('per ')):
        text = text[4:]
        start = start + 4
    if text.endswith((' ', '\n', '.', ',')):
        text = text[:-1]
        end = end - 1
    if text.endswith(' of') or text.endswith('\nof'):
        text = text[:-3]
        end = end - 3
    ann['spans'][0]['end'] = end
    ann['spans'][0]['start'] = start
    # ann['text'] = text
    return ann


def convert_annotations(annotations):
    dict_annotations = {}
    for ann in annotations:
        is_suggestion = ann['creationType'] == 'auto' or ann['creationType'] == 'dynamic'
        decision = ann['decision']
        # Ignore rejected/undecided suggestions as annotations
        if not (is_suggestion and (decision == 'rejected' or decision == 'undecided')):
            ann = clean_ann(ann)
            dict_annotations[tuple(get_span(ann))] = ann
    return dict_annotations


def span_length(span):
    return span[1] - span[0]


def count_span_overlap(span1, span2):
    sorted_spans = [span1, span2] if span1[0] <= span2[0] else [span2, span1]
    left, right = sorted_spans[0], sorted_spans[1]
    return max(left[1] - right[0], 0)


def count_ann_overlap(ann1, ann2):
    span1 = get_span(ann1)
    span2 = get_span(ann2)
    return count_span_overlap(span1, span2)


def is_correct_labels(gold, user):
    gold_label_ids = set(map(lambda label: label["labelId"], gold["labels"]))
    user_label_ids = set(map(lambda label: label["labelId"], user["labels"]))
    return len(gold_label_ids.intersection(user_label_ids)) > 0


def max_start(result):
    def get_start(ann):
        return get_span(ann)[0]
    max_start = -1
    if result['userMatches']:
        for u in result['userMatches']:
            if get_start(u) > max_start:
                max_start = get_start(u)
    if result['gold']:
        g = result['gold']
        if get_start(g) > max_start or max_start == -1:
            max_start = get_start(g)
    return max_start


def compare_ann(user_ann, gold_ann):
    results = []

    gold_user_span_matches = {}
    gold_spans = set()
    user_spans = set()

    # Add all exact gold:user span matches
    for g in gold_ann:
        gold = gold_ann[g]
        if g in user_ann:
            gold_spans.add(g)
            user_spans.add(g)
            gold_user_span_matches[g] = [g]

    # Add all remaining user spans that have partial gold:user span matches
    user_spans_unmatched = set(user_ann.keys()) - user_spans
    gold_spans_unmatched = set(gold_ann.keys()) - gold_spans
    gold_spans_unmatched_sorted = sorted(gold_spans_unmatched, key=span_length)
    for u in user_spans_unmatched:
        # Compare with unmatched gold spans, prioritizing by overlap length
        best_match = max(gold_spans_unmatched_sorted, key=lambda g: count_span_overlap(u, g), default=None)
        # If partial match found, add to existing results
        if best_match and count_span_overlap(best_match, u) > 0:
            gold_spans.add(best_match)
            user_spans.add(u)
            if best_match not in gold_user_span_matches:
                gold_user_span_matches[best_match] = []
            gold_user_span_matches[best_match].append(u)

    # Convert gold:user matches to JSON results
    for g in gold_user_span_matches:
        matched_spans = gold_user_span_matches[g]
        potential_match = matched_spans[0]
        span_score = 1 if g == potential_match else 0
        label_score = 1 if span_score and is_correct_labels(gold_ann[g], user_ann[potential_match]) else 0
        sorted_matched_spans = sorted(matched_spans, key=lambda s: s[0])
        results.append({
            'gold': gold_ann[g],
            'userMatches': [user_ann[u] for u in sorted_matched_spans],
            'spanScore': span_score,
            'labelScore': label_score
        })

    # Add missing gold spans to JSON results
    gold_spans_unmatched = gold_spans_unmatched - gold_spans
    for g in gold_spans_unmatched:
        results.append({
            'gold': gold_ann[g],
            'userMatches': None,
            'spanScore': 0,
            'labelScore': 0
        })

    # Add extra user spans to JSON results
    user_spans_unmatched = user_spans_unmatched - user_spans
    for u in user_spans_unmatched:
        results.append({
            'gold': None,
            'userMatches': [user_ann[u]],
            'spanScore': 0,
            'labelScore': 0
        })

    return sorted(results, key=lambda r: max_start(r))


def create_user_dir(userId):
    user_dirpath = USERS_DIRECTORY + '/' + userId

    try:
        os.mkdir(user_dirpath)
    except OSError:
        print("Creation of the directory %s failed." % user_dirpath)
        return False
    else:
        print("Success creating directory %s." % user_dirpath)
        return True


def file_evaluation(fileId, userId):
    user_filepath = USERS_DIRECTORY + '/' + userId + '/' + fileId + '.json'
    user_ann = convert_annotations(load_annotations(user_filepath))
    gold_filepath = TUTORIAL_DIRECTORY + '/' + fileId + '-gold.json'
    gold_ann = convert_annotations(load_annotations(gold_filepath))
    return compare_ann(user_ann, gold_ann)


def clear_user_annotations(userId):
    timestamp = int(time.time())
    for i in range(1, TUTORIAL_LENGTH + 1):
        filepath = USERS_DIRECTORY + '/' + userId + '/' + str(i) + '.json'
        storage = STORAGE_DIRECTORY + '/' + userId + '-' + str(i) + '-' + str(timestamp) + '.json'
        if os.path.exists(filepath):
            try:
                shutil.copyfile(filepath, storage)
                os.remove(filepath)
            except IOError:
                print("Tutorial storage not writeable.")
                return None
            except OSError:
                print("Tutorial filepath not found.")
                return None
    return True
