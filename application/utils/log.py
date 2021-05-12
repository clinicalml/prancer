import time

from .constants import *


CURRENT_LOG = ""


def log_entry(info_list):
    return ",".join([str(i) for i in info_list]) + '\n'


def open_log():
    global CURRENT_LOG
    timestamp = int(time.time())
    filepath = LOG_DIRECTORY + '/' + str(timestamp) + '.csv'
    try:
        with open(filepath, 'a') as f:
            CURRENT_LOG = filepath
            print("Activity log opened: ", CURRENT_LOG)
            f.write(log_entry([timestamp, 'START']))
            f.close()
    except FileNotFoundError:
        print(filepath + " not found.")
        return None
    return filepath


def add_log(id, action, annotation_id, metadata):
    timestamp = int(time.time())
    try:
        with open(CURRENT_LOG, 'a') as f:
            f.write(log_entry([timestamp, id, action, annotation_id] + metadata))
            f.close()
    except FileNotFoundError:
        print("Log file not found: " + CURRENT_LOG)
        return False
    return True
