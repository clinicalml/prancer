from flask import request, render_template, jsonify, url_for, redirect, g
from index import app
from .utils.files import save_annotations_file, get_file_data, get_filenames_from_directory
from .utils.labels import get_umls_labels, get_labels_for_code, get_labels_for_keyword, get_colormap_data
from .utils.umls_retrieve import retrieve_cui_info
from .utils.tutorial import file_evaluation, clear_user_annotations, create_user_dir
from .utils.log import add_log


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/get_filenames", methods=["GET"])
def get_filenames():
    filenames = get_filenames_from_directory()

    if filenames or filenames == []:
        return jsonify(filenames=filenames)
    else:
        return jsonify(error=True), 403


@app.route("/api/get_file", methods=["POST"])  # this needs to be POST
def get_file():
    incoming = request.get_json()
    id = incoming["id"]
    textDir = incoming["textDir"]
    annDir = incoming["annDir"]

    if textDir == None and annDir == None:
        file = get_file_data(id)
    else:
        file = get_file_data(id, textDir, annDir)

    if file:
        return jsonify(file=file)
    else:
        return jsonify(error=True), 403


@app.route("/api/save_annotations", methods=["POST"])
def save_annotations():
    incoming = request.get_json()
    dir = incoming["dir"]

    if dir == None:
        is_saved = save_annotations_file(incoming["id"]+".json", incoming["annotations"])
    else:
        is_saved = save_annotations_file(incoming["id"]+".json", incoming["annotations"], dir)

    if is_saved:
        return jsonify(saved=True)
    else:
        return jsonify(saved=False), 403


@app.route("/api/search_labels", methods=["POST"])
def search_labels():
    incoming = request.get_json()
    labels = get_labels_for_keyword(incoming["searchTerm"])

    if labels or labels == []:
        return jsonify(labels=labels)
    else:
        return jsonify(error=True), 403


@app.route("/api/recommend_labels", methods=["POST"])
def recommend_labels():
    incoming = request.get_json()
    if incoming["isKeyword"]:
        labels = get_labels_for_keyword(incoming["searchTerm"])
    else:
        labels = get_labels_for_code(incoming["searchTerm"])

    if labels or labels == []:
        return jsonify(labels=labels)
    else:
        return jsonify(error=True), 403


@app.route("/api/get_colormap", methods=["POST"])
def get_colormap():
    incoming = request.get_json()
    colormap = get_colormap_data()

    if colormap:
        return jsonify(colormap=colormap)
    else:
        return jsonify(error=True), 403


@app.route("/api/get_umls_info", methods=["POST"])
def get_umls_info():
    incoming = request.get_json()
    umls_info = retrieve_cui_info(incoming["cui"])

    if umls_info or umls_info == []:
        return jsonify(umls_info=umls_info)
    else:
        return jsonify(error=True), 403


@app.route("/api/start_tutorial", methods=["POST"])
def start_tutorial():
    incoming = request.get_json()
    user_id = incoming["userId"]
    start = create_user_dir(user_id)

    if user_id:
        return jsonify(start=start)
    else:
        return jsonify(error=True), 403


@app.route("/api/get_tutorial_evaluation", methods=["POST"])
def get_tutorial_evaluation():
    incoming = request.get_json()
    evaluation = file_evaluation(incoming["fileId"], incoming["userId"])

    if evaluation:
        return jsonify(evaluation=evaluation)
    else:
        return jsonify(error=True), 403


@app.route("/api/restart_tutorial", methods=["POST"])
def restart_tutorial():
    incoming = request.get_json()
    restart = clear_user_annotations(incoming['userId'])
    return jsonify(restart=restart)


@app.route("/api/add_log_entry", methods=["POST"])
def add_log_entry():
    incoming = request.get_json()
    id = incoming["id"]
    action = incoming["action"]
    annotation_id = incoming["annotation_id"]
    metadata = incoming["metadata"]
    return jsonify(log=add_log(id, action, annotation_id, metadata))
