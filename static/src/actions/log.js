import {
    ADD_LOG,
    ADD_LOG_FAILURE,
    ADD_LOG_REQUEST,
    ADD_LOG_SUCCESS,
} from '../constants/index';

import { parseJSON } from '../utils/misc';
import { add_log_entry } from '../utils/http_functions';

export function addLogSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: ADD_LOG_SUCCESS,
        payload: {
            token,
        },
    };
}


export function addLogFailure(error) {
    localStorage.removeItem('token');
    return {
        type: ADD_LOG_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function addLogRequest() {
    return {
        type: ADD_LOG_REQUEST,
    };
}

export function addLog(id, action, annotation_id, metadata) {
    return function (dispatch) {
        dispatch(addLogRequest());
        const isLogged = add_log_entry(id, action, annotation_id, metadata);
        return isLogged;
        // TODO: Look at how to get error messages back
        return add_log_entry(id, action, annotation_id, metadata)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(addLogSuccess(response.token));
                } catch (e) {
                    alert(e);
                    dispatch(addLogFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid labels fetch',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(addLogFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid labels fetch',
                    },
                }));
            });
    };
}
