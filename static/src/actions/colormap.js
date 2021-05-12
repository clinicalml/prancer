import {
    GET_COLOR_MAP,
    GET_COLOR_MAP_FAILURE,
    GET_COLOR_MAP_REQUEST,
    GET_COLOR_MAP_SUCCESS,
} from '../constants/index';

import { parseJSON } from '../utils/misc';
import { get_colormap } from '../utils/http_functions';

export function getColormapSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: GET_COLOR_MAP_SUCCESS,
        payload: {
            token,
        },
    };
}


export function getColormapFailure(error) {
    localStorage.removeItem('token');
    return {
        type: GET_COLOR_MAP_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function getColormapRequest() {
    return {
        type: GET_COLOR_MAP_REQUEST,
    };
}

export function getColormap(searchTerm, isKeyword, mode) {
    return function (dispatch) {
        dispatch(getColormapRequest());
        const colormap = get_colormap();
        return colormap;
        // TODO: Look at how to get error messages back
        return get_color_map()
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(getColormapSuccess(response.token));
                } catch (e) {
                    alert(e);
                    dispatch(getColormapFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid colormap fetch',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(getColormapFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid colormap fetch',
                    },
                }));
            });
    };
}
