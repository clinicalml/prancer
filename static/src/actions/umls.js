import {
    GET_UMLS_INFO,
    GET_UMLS_INFO_FAILURE,
    GET_UMLS_INFO_REQUEST,
    GET_UMLS_INFO_SUCCESS,
} from '../constants/index';

import { parseJSON } from '../utils/misc';
import { get_umls_info } from '../utils/http_functions';

export function getUMLSInfoSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: GET_UMLS_INFO_SUCCESS,
        payload: {
            token,
        },
    };
}


export function getUMLSInfoFailure(error) {
    localStorage.removeItem('token');
    return {
        type: GET_UMLS_INFO_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function getUMLSInfoRequest() {
    return {
        type: GET_UMLS_INFO_REQUEST,
    };
}

export function getUMLSInfo(cui) {
    return function (dispatch) {
        dispatch(getUMLSInfoRequest());
        const info = get_umls_info(cui);
        return info;
        // TODO: Look at how to get error messages back
        return get_umls_info(cui)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(getUMLSInfoSuccess(response.token));
                } catch (e) {
                    alert(e);
                    dispatch(getUMLSInfoFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid UMLS info fetch',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(getUMLSInfoFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid UMLS info fetch',
                    },
                }));
            });
    };
}
