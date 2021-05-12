from collections import Counter
import os
import pickle
import string
import random
import time

## To install
import editdistance
from nltk.stem.porter import *
from nltk.corpus import stopwords

from .constants import *
from .umls_retrieve import retrieve_labels


umls, lookup = pickle.load(open(LABELS_FILE, 'rb'), encoding='bytes')
index = pickle.load(open(INDEX_FILE, 'rb'), encoding='bytes')
types, tuis = pickle.load(open(TYPES_FILE, 'rb'), encoding='bytes')
colors = pickle.load(open(COLORS_FILE, 'rb'), encoding='bytes')

cui2index = {term[0]: i for i, term in enumerate(umls)}

stemmer = PorterStemmer()
translator = str.maketrans(string.punctuation, ' '*len(string.punctuation))


def get_labels_for_code(code):
    if code in cui2index:
        return [label_data(cui2index[code])]
    else:
        return []


def get_labels_for_codes(codes):
    labels = []
    for code in codes:
        labels += get_labels_for_code(code)
    return labels


def label_data(label_id):
    label_entry = umls[label_id]
    cui = label_entry[0]
    name = label_entry[1]
    categories = [[type, category_lookup(type)] for type in label_entry[3]]
    return [cui, name, categories]


def category_lookup(type):
    tui = types[type][0]
    if tui in tuis:
        return tuis[tui]
    else:
        return 'Other'


def get_colormap_data():
    return colors


def get_umls_labels(keyword):
    api_labels = retrieve_labels(keyword)
    if len(api_labels) == 1 and api_labels[0]['ui'] == 'NONE':
        return []
    api_codes = list(map(lambda l: l['ui'], api_labels))
    return get_labels_for_codes(api_codes)


def get_algorithm_labels(keyword_entered):
    keyword = keyword_entered.lower()
    ordered_lookups = get_lookups_ordered(keyword)
    ordered_indexed = get_inverted_index_ordered(keyword, index)

    # Get rid of repeats from the lookup table
    ordered_indexed = [i for i in ordered_indexed if i not in ordered_lookups]

    combined = ordered_lookups + ordered_indexed
    return combined


# All modes -> best recommendation system
def get_labels_for_keyword(keyword_entered):
    labels = get_algorithm_labels(keyword_entered)
    return labels


def get_distance(term1, term2):
    sorted1 = "".join(sorted(term1)).strip()
    sorted2 = "".join(sorted(term2)).strip()
    return editdistance.distance(sorted1, sorted2)


def get_inverted_index_ordered(term, inverted_index, num=15):
    words = term.translate(translator).split()
    stemmed = []
    candidates = []
    scores = []
    for word in words:
        try:
            stemmed += [stemmer.stem(word)]
        except:
            return []
    count_list = []
    for stem in stemmed:
        count_list += list(inverted_index[stem])
    counter = Counter(count_list)
    if len(counter) == 0:
        return []
    max_matches = counter.most_common(1)[0][1]
    for label_id, count in counter.most_common(min(5000, len(counter))):
        if count == max_matches:
            entry = label_data(label_id)
            candidates += [entry]
            synonyms = [umls[label_id][1]] + umls[label_id][4]
            score = min([get_distance(synonym, term) for synonym in synonyms])
            scores += [score]
    return [result for _,result in sorted(zip(scores, candidates))][:num]


def get_lookups_ordered(keyword):
    if keyword not in lookup:
        return []
    label_ids = lookup[keyword]
    scores = []
    results = []
    for label_id in label_ids:
        results.append(label_data(label_id))
        score = -len(umls[label_id][4])
        if keyword == umls[label_id][1]:
            score -= 100
        scores.append(score)
    return [result for _,result in sorted(zip(scores, results))]
