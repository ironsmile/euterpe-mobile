const initialState = {
  value: 0,
  duration: null,
};

export const progressReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PROGRESS:
      return {
        ...state,
        value: action.progress,
      };

    case SET_DURATION:
      return {
        ...state,
        duration: action.duration,
      };

    case INCREASE_PROGRESS:
      return {
        ...state,
        value: state.value + action.delta,
      };

    default:
      return state;
  }
};
export const SET_PROGRESS = 'Progress/SetProgress';
export const SET_DURATION = 'Progress/SetDuration';
export const INCREASE_PROGRESS = 'Progress/IncreaseProgress';
