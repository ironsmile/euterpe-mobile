import {
    SET_PROGRESS,
    SET_DURATION,
    INCREASE_PROGRESS,
} from '../reducers/progress';

export const setProgress = (value) => ({
    type: SET_PROGRESS,
    progress: value,
});

export const setDuration = (value) => ({
    type: SET_DURATION,
    duration: value,
});

export const increaseProgress = (value) => ({
    type: INCREASE_PROGRESS,
    delta: value,
});

