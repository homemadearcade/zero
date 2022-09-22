import { getCurrentGameScene } from '../../utils/editorUtils';
import { 
  CLOSE_CUTSCENE,
  OPEN_CUTSCENE,
  PROGRESS_CUTSCENE,
} from '../types';
import { editLobby } from './lobbyActions';

export const openCutscene = (classId, cutsceneId) => (dispatch, getState) => {
  // const cutscene = getState().game.gameModel.cutscenes[cutsceneId]
  // if(cutscene.pauseGame) {
    if(getState().lobby.lobby?.id) {
      dispatch(editLobby(getState().lobby.lobby?.id, {
        isGamePaused: true
      }))
    } else {
      const scene = getCurrentGameScene(getState().game.gameInstance)
      scene.isPaused = true
    }
  // }

  dispatch({
    updateCobrowsing: true,
    type: OPEN_CUTSCENE,
    payload: {
      cutsceneId: cutsceneId,
      classId: classId,
    }
  });
}

export const progressActiveCutscene = () => (dispatch, getState) => {
  const cutsceneId = getState().narrative.cutsceneId
  const cutsceneIndex = getState().narrative.cutsceneIndex
  const cutscene = getState().game.gameModel.cutscenes[cutsceneId]

  if(cutscene.scenes.length <= cutsceneIndex + 1) {
    dispatch(closeActiveCutscene())
    return
  }

  dispatch({
    updateCobrowsing: true,
    type: PROGRESS_CUTSCENE,
    payload: {}
  });
}

export const closeActiveCutscene = () => (dispatch, getState) => {
  // const cutsceneId = getState().narrative.cutsceneId
  // const cutscene = getState().game.gameModel.cutscenes[cutsceneId]
  // if(cutscene.pauseGame) {
    if(getState().lobby.lobby?.id) {
      dispatch(editLobby(getState().lobby.lobby?.id, {
        isGamePaused: false
      }))
    } else {
      const scene = getCurrentGameScene(getState().game.gameInstance)
      scene.isPaused = false
    }
  // }

  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CUTSCENE,
    payload: {}
  });
}