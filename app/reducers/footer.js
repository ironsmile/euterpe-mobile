const initialState = {
  shown: true,
};

export const footerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_FOOTER:
      console.log('SHOW_FOOTER', action.val ?? initialState.shown);
      return { ...state, shown: action.val ?? initialState.shown };
    default:
      return state;
  }
};

export const SHOW_FOOTER = 'Footer/Show';
