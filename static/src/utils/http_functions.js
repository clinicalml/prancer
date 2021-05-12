/* eslint camelcase: 0 */

import axios from 'axios';

export function get_filenames() {
  return axios.get('/api/get_filenames', {});
}

export function get_file(id, textDir, annDir) {
  return axios.post('/api/get_file', { id, textDir, annDir });
}

export function save_annotations(id, annotations, dir) {
  return axios.post('/api/save_annotations', { id, annotations, dir });
}

export function recommend_labels(searchTerm, isKeyword, mode) {
  return axios.post('/api/recommend_labels', { searchTerm, isKeyword, mode });
}

export function search_labels(searchTerm) {
  return axios.post('/api/search_labels', { searchTerm });
}

export function get_colormap() {
  return axios.post('/api/get_colormap', {});
}

export function get_umls_info(cui) {
  return axios.post('/api/get_umls_info', { cui });
}

export function start_tutorial(userId) {
  return axios.post('/api/start_tutorial', { userId });
}

export function get_tutorial_evaluation(fileId, userId) {
  return axios.post('/api/get_tutorial_evaluation', { fileId, userId });
}

export function restart_tutorial(userId) {
  return axios.post('/api/restart_tutorial', { userId });
}

export function add_log_entry(id, action, annotation_id, metadata) {
  return axios.post('/api/add_log_entry', {id, action, annotation_id, metadata});
}
