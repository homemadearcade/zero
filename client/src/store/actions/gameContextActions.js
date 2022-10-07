import { getCurrentGameScene } from '../../utils/editorUtils';
import { 
  CHANGE_GAME_STATE,
  CLOSE_CUTSCENE,
  COMPLETE_CLOSE_CONSTELLATION,
  OPEN_CONSTELLATION,
  OPEN_CUTSCENE,
  PROGRESS_CUTSCENE,
  START_CLOSE_CONSTELLATION,
} from '../types';
import { editLobby } from './lobbyActions';

export const changeGameState = (gameState) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CHANGE_GAME_STATE,
    payload: {
      gameState
    }
  })
};

export const openCutscene = (classId, cutsceneId) => (dispatch, getState) => {
  // const cutscene = getState().game.gameModel.cutscenes[cutsceneId]
  // if(cutscene.pauseGame) {
    if(getState().lobby.lobby?.id) {
      dispatch(editLobby(getState().lobby.lobby?.id, {
        isGamePaused: true
      }))
    } else {
      const scene = getCurrentGameScene(getState().webPage.gameInstance)
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
  const cutsceneId = getState().gameContext.cutsceneId
  const cutsceneIndex = getState().gameContext.cutsceneIndex
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
  // const cutsceneId = getState().gameContext.cutsceneId
  // const cutscene = getState().game.gameModel.cutscenes[cutsceneId]
  // if(cutscene.pauseGame) {
    if(getState().lobby.lobby?.id) {
      dispatch(editLobby(getState().lobby.lobby?.id, {
        isGamePaused: false
      }))
    } else {
      const scene = getCurrentGameScene(getState().webPage.gameInstance)
      scene.isPaused = false
    }
  // }

  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CUTSCENE,
    payload: {}
  });
}


export const openConstellation = () => async (dispatch, getState) => {
  const gameInstance = getState().webPage.gameInstance

  if(gameInstance) {
    const scene = getCurrentGameScene(gameInstance)
    const { imgCanvas } = await scene.getImageFromGame('constellation')
  
    dispatch({
      updateCobrowsing: true,
      type: OPEN_CONSTELLATION,
      payload: {
        imageBase64: imgCanvas.toDataURL()
      }
    });
  } else {
    dispatch({
      updateCobrowsing: true,
      type: OPEN_CONSTELLATION,
      payload: {}
    });
  }
}

export const startCloseConstellation = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: START_CLOSE_CONSTELLATION,
    payload: {}
  });
}

export const completeCloseConstellation = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: COMPLETE_CLOSE_CONSTELLATION,
    payload: {}
  });
}