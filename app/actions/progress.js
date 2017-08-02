import {
    SET_PROGRESS,
    INCREASE_PROGRESS,
} from '../reducers/progress';

export const setProgress = (value) => ({
    type: SET_PROGRESS,
    progress: value,
});

export const increaseProgress = (value) => ({
    type: INCREASE_PROGRESS,
    delta: value,
});

