
const initialState = {
    errors: [],
};

export const errorsReducer = (state = initialState, action) => {
    switch (action.type) {
        case ERRORS_ADD:
            return {
                ...state,
                errors: [action.error, ...state.errors],
            };
        
        case ERRORS_CLEANUP:
            return {
                ...state,
                errors: [],
            }

        default:
            return state;
    }
}

export const ERRORS_ADD = 'Errors/Add';
export const ERRORS_CLEANUP = 'Errors/Cleanup';
