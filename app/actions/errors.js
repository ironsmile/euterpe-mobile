import {
    ERRORS_ADD,
    ERRORS_CLEANUP
} from '@reducers/errors';

export const dismissErrors = () => ({
    type: ERRORS_CLEANUP,
});

export const appendError = (error) => ({
    type: ERRORS_ADD,
    error,
});
