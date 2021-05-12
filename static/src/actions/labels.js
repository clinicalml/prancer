import {
    RECOMMEND_LABELS,
    RECOMMEND_LABELS_FAILURE,
    RECOMMEND_LABELS_REQUEST,
    RECOMMEND_LABELS_SUCCESS,
    SEARCH_LABELS,
    SEARCH_LABELS_FAILURE,
    SEARCH_LABELS_REQUEST,
    SEARCH_LABELS_SUCCESS,
} from '../constants/index';

import { parseJSON } from '../utils/misc';
import { recommend_labels, search_labels } from '../utils/http_functions';

export function recommendLabelsSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: RECOMMEND_LABELS_SUCCESS,
        payload: {
            token,
        },
    };
}


export function recommendLabelsFailure(error) {
    localStorage.removeItem('token');
    return {
        type: RECOMMEND_LABELS_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function recommendLabelsRequest() {
    return {
        type: RECOMMEND_LABELS_REQUEST,
    };
}

export function recommendLabels(searchTerm, isKeyword, mode) {
    return function (dispatch) {
        dispatch(recommendLabelsRequest());
        const labels = recommend_labels(searchTerm, isKeyword, mode);
        return labels;
        // TODO: Look at how to get error messages back
        return recommend_labels(searchTerm, isKeyword, mode)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(recommendLabelsSuccess(response.token));
                } catch (e) {
                    alert(e);
                    dispatch(recommendLabelsFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid labels fetch',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(recommendLabelsFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid labels fetch',
                    },
                }));
            });
    };
}


export function searchLabelsSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: SEARCH_LABELS_SUCCESS,
        payload: {
            token,
        },
    };
}


export function searchLabelsFailure(error) {
    localStorage.removeItem('token');
    return {
        type: SEARCH_LABELS_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function searchLabelsRequest() {
    return {
        type: SEARCH_LABELS_REQUEST,
    };
}

export function searchLabels(searchTerm) {
    return function (dispatch) {
        dispatch(searchLabelsRequest());
        const labels = search_labels(searchTerm);
        return labels;
        // TODO: Look at how to get error messages back
        return search_labels(searchTerm)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(searchLabelsSuccess(response.token));
                } catch (e) {
                    alert(e);
                    dispatch(searchLabelsFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid labels fetch',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(searchLabelsFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid labels fetch',
                    },
                }));
            });
    };
}
