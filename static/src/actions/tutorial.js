import {
    GET_TUTORIAL_EVALUATION,
    GET_TUTORIAL_EVALUATION_FAILURE,
    GET_TUTORIAL_EVALUATION_REQUEST,
    GET_TUTORIAL_EVALUATION_SUCCESS,
    RESTART_TUTORIAL,
    RESTART_TUTORIAL_FAILURE,
    RESTART_TUTORIAL_REQUEST,
    RESTART_TUTORIAL_SUCCESS,
    START_TUTORIAL,
    START_TUTORIAL_FAILURE,
    START_TUTORIAL_REQUEST,
    START_TUTORIAL_SUCCESS,
} from '../constants/index';


import { parseJSON } from '../utils/misc';
import { get_tutorial_evaluation, restart_tutorial, start_tutorial } from '../utils/http_functions';


export function startTutorialSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: START_TUTORIAL_SUCCESS,
        payload: {
            token,
        },
    };
}


export function startTutorialFailure(error) {
    localStorage.removeItem('token');
    return {
        type: START_TUTORIAL_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function startTutorialRequest() {
    return {
        type: START_TUTORIAL_REQUEST,
    };
}

export function startTutorial(userId) {
    return function (dispatch) {
        dispatch(startTutorialRequest());
        const filenames = start_tutorial(userId);
        return filenames;
        // TODO: Look at how to get error messages back
        return start_tutorial(userId)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(startTutorialSuccess(response.token));
                } catch (e) {
                    alert(e);
                    dispatch(startTutorialFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid file fetch',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(startTutorialFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid file fetch',
                    },
                }));
            });
    };
}


export function getTutorialEvaluationSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: GET_TUTORIAL_EVALUATION_SUCCESS,
        payload: {
            token,
        },
    };
}


export function getTutorialEvaluationFailure(error) {
    localStorage.removeItem('token');
    return {
        type: GET_TUTORIAL_EVALUATION_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function getTutorialEvaluationRequest() {
    return {
        type: GET_TUTORIAL_EVALUATION_REQUEST,
    };
}

export function getTutorialEvaluation(fileId, userId) {
    return function (dispatch) {
        dispatch(getTutorialEvaluationRequest());
        const labels = get_tutorial_evaluation(fileId, userId);
        return labels;
        // TODO: Look at how to get error messages back
        return get_tutorial_evaluation(fileId, userId)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(getTutorialEvaluationSuccess(response.token));
                } catch (e) {
                    alert(e);
                    dispatch(getTutorialEvaluationFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid tutorial evaluation fetch',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(getTutorialEvaluationFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid tutorial evaluation fetch',
                    },
                }));
            });
    };
}

export function restartTutorialSuccess(token) {
    localStorage.setItem('token', token);
    return {
        type: RESTART_TUTORIAL_SUCCESS,
        payload: {
            token,
        },
    };
}


export function restartTutorialFailure(error) {
    localStorage.removeItem('token');
    return {
        type: RESTART_TUTORIAL_FAILURE,
        payload: {
            status: error.response.status,
            statusText: error.response.statusText,
        },
    };
}

export function restartTutorialRequest() {
    return {
        type: RESTART_TUTORIAL_REQUEST,
    };
}

export function restartTutorial(userId) {
    return function (dispatch) {
        dispatch(restartTutorialRequest());
        const filenames = restart_tutorial(userId);
        return filenames;
        // TODO: Look at how to get error messages back
        return restart_tutorial(userId)
            .then(parseJSON)
            .then(response => {
                try {
                    dispatch(restartTutorialSuccess(response.token));
                } catch (e) {
                    alert(e);
                    dispatch(restartTutorialFailure({
                        response: {
                            status: 403,
                            statusText: 'Invalid file fetch',
                        },
                    }));
                }
            })
            .catch(error => {
                dispatch(restartTutorialFailure({
                    response: {
                        status: 403,
                        statusText: 'Invalid file fetch',
                    },
                }));
            });
    };
}
