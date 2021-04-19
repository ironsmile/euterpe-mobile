const initialState = {
  playerFullScreen: false,
};

export const footerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_PLAYER_FULLSCREEN:
      return { ...state, playerFullScreen: action.val ?? initialState.playerFullScreen };
    default:
      return state;
  }
};

export const SHOW_PLAYER_FULLSCREEN = 'Footer/ShowPlayerFullscreen';
