import store from '..';
import { GAME_EDITOR_UI } from '../../constants';
import { PAUSED_STATE, PLAYTHROUGH_PAUSED_STATE, PLAY_STATE } from '../../game/constants';
import { getCurrentGameScene } from '../../utils/editorUtils';
import { changeGameState } from '../actions/gameContextActions';
import {
  CHANGE_CURRENT_STAGE,
  CHANGE_GAME_STATE,
  CHANGE_PLAYER_STATE,
  CLEAR_CUTSCENES,
  CLOSE_CUTSCENE,
  COMPLETE_CLOSE_CONSTELLATION,
  START_OPEN_CONSTELLATION,
  OPEN_CUTSCENE, 
  PROGRESS_CUTSCENE,
  START_CLOSE_CONSTELLATION,
  OPEN_CONSTELLATION,
} from '../types';

const initialState = {
  cutsceneId: null,
  cutsceneClassId: null,
  cutsceneIndex: 0,
  gameState: PLAY_STATE,
  gameStateMessage: null,
  isConstellationClosing: false,
  isConstellationOpen: false,
  constellationZoomImageFile: null,
  player: {
    classId: null,
  }
};

export const initialGameContextState = initialState

export default function gameContextReducer(state = initialState, { type, payload }) {
  if(type === START_OPEN_CONSTELLATION) {
    async function attemptConstellation() {
      const state = store.getState()

      if(state.lobby.lobby?.experienceState === GAME_EDITOR_UI && state.lobby.lobby?.isGamePoweredOn) {
        const gameInstance = store.getState().webPage.gameInstance
        const scene = getCurrentGameScene(gameInstance)

        // if(scene) {
        //   if(scene.isPlaythrough) {
        //     store.dispatch(changeGameState(PLAYTHROUGH_PAUSED_STATE))
        //   } else {
        //     store.dispatch(changeGameState(PAUSED_STATE))
        //   }
        // }
      
        const { imgCanvas } = await scene.getImageFromGame('constellation')

        store.dispatch({
          updateCobrowsing: true,
          type: OPEN_CONSTELLATION,
          payload: {
            imageBase64: imgCanvas.toDataURL()
          }
        })
      } else {
        console.log('not in correct state, redoing attemptConstellation')
        setTimeout(attemptConstellation, 1000)
      }

    }

    setTimeout(() => {attemptConstellation()}, 0)

    return state 
  }

  switch (type) {
    case START_CLOSE_CONSTELLATION:
      return {
        ...state,
        isConstellationClosing: true
      }
    case COMPLETE_CLOSE_CONSTELLATION:
      return {
        ...state,
        isConstellationClosing: false,
        isConstellationOpen: false
      }
    case START_OPEN_CONSTELLATION:
      return {
        ...state,
      }
    case OPEN_CONSTELLATION:
      return {
        ...state,
        isConstellationOpen: true,
        constellationZoomImageFile: payload.imageBase64
      }
    case OPEN_CUTSCENE:
      return {
        ...state,
        cutsceneId: payload.cutsceneId,
        cutsceneClassId: payload.classId,
        cutsceneIndex: 0
      };
    case PROGRESS_CUTSCENE:
      return {
        ...state,
        cutsceneIndex: state.cutsceneIndex + 1
      };
    case CLEAR_CUTSCENES: 
      return {
        ...state,
        cutsceneId: null,
        cutsceneClassId: null,
        cutsceneIndex: 0,
      }
    case CHANGE_GAME_STATE: 
      return {
        ...state,
        gameState: payload.gameState,
        gameStateMessage: payload.gameStateMessage
      }
    case CLOSE_CUTSCENE:
      return {
        ...state,
        cutsceneId: null,
        cutsceneClassId: null,
        cutsceneIndex: 0
      };
    case CHANGE_PLAYER_STATE: 
      return {
        ...state,
        player: {
          ...state.player,
          ...payload.player
        }
      }
    default:
      return state;
  }
}
