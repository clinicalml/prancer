import json
import os
import pandas as pd 

from .constants import *
from .suggestions import suggest_mapped_annotations, load_csv_annotations


def get_filenames_from_directory():
    filenames = []
    for f in os.listdir(FILES_DIRECTORY):
        name, ext = os.path.splitext(f)
        if '.txt' in ext:
            filenames.append(name)
    return sorted(filenames)


def get_file_data(id, textDir=FILES_DIRECTORY, annDir=FILES_DIRECTORY):
    filepath = textDir + '/' + id + '.txt'
    ann_filepath = annDir + '/' + id + '.json'
    csv_path =  textDir + '/' + id + '.csv'
    try:
        with open(filepath, 'r') as infile:
            file_text = infile.read()
    except FileNotFoundError:
        print(filepath + " not found.")
        file_text = ""

    try:
        with open(ann_filepath, 'r') as infile:
            file_ann = json.load(infile)
    except FileNotFoundError:
        file_ann = []
        if SUGGESTION_METHOD == "MAP":
            file_ann = suggest_mapped_annotations(file_text)
        if SUGGESTION_METHOD == "CSV":
            print("inside CSV annotations")
            try:
                with open(csv_path, 'r') as csvfile:
                    anns = pd.read_csv(csvfile)
                    file_ann = load_csv_annotations(file_text, anns)           
            except FileNotFoundError:
                print(csv_path + " not found.")

        save_annotations_file(id + '.json', file_ann, annDir)

    return {"text": file_text, "annotations": file_ann}


def save_annotations_file(filename, annotations, dir=FILES_DIRECTORY):
    filepath = dir + '/' + filename
    try:
        with open(filepath, 'w') as outfile:
            json.dump(annotations, outfile)
    except FileNotFoundError:
        print(filepath + " not found.")
        return None
    return filepath
