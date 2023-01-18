import { PAUSED_STATE, PLAYTHROUGH_PAUSED_STATE, PLAYTHROUGH_PLAY_STATE, PLAY_STATE } from '../../game/constants';
import { getCurrentGameScene } from '../../utils/editorUtils';
import { 
  CHANGE_GAME_STATE,
  CLEAR_GAME_CONTEXT,
  CLOSE_CUTSCENE,
  COMPLETE_CLOSE_CONSTELLATION,
  OPEN_CONSTELLATION,
  OPEN_CUTSCENE,
  PROGRESS_CUTSCENE,
  START_CLOSE_CONSTELLATION,
} from '../types';

export const changeGameState = (gameState, message) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    forceCobrowsingUpdate: true,
    type: CHANGE_GAME_STATE,
    payload: {
      gameState,
      gameStateMessage: message
    }
  })
};

export const openCutscene = (classId, cutsceneId) => (dispatch, getState) => {
  dispatch(changeGameState(PAUSED_STATE))

  const scene = getCurrentGameScene(getState().webPage.gameInstance)
  if(scene.isPlaythrough) {
    dispatch(changeGameState(PLAYTHROUGH_PAUSED_STATE))
  } else {
    dispatch(changeGameState(PAUSED_STATE))
  }

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
  const cutscene = getState().gameModel.gameModel.cutscenes[cutsceneId]

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
  // const cutscene = getState().gameModel.gameModel.cutscenes[cutsceneId]
  // if(cutscene.pauseGame) {

  const scene = getCurrentGameScene(getState().webPage.gameInstance)
  if(scene.isPlaythrough) {
    dispatch(changeGameState(PLAYTHROUGH_PLAY_STATE))
  } else {
    dispatch(changeGameState(PLAY_STATE))
  }
  // }

  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CUTSCENE,
    payload: {}
  });
}


export const openConstellation = ({ externalForceCobrowsingUpdateUserId }) => async (dispatch, getState) => {
  async function attemptConstellation() {
    const gameInstance = getState().webPage.gameInstance

    if(!gameInstance) setTimeout(() => attemptConstellation(), 1000)
    const scene = getCurrentGameScene(gameInstance)

    if(!scene) setTimeout(() => attemptConstellation(), 1000)

    const { imgCanvas } = await scene.getImageFromGame('constellation')

    if(scene.isPlaythrough) {
      dispatch(changeGameState(PLAYTHROUGH_PAUSED_STATE))
    } else {
      dispatch(changeGameState(PAUSED_STATE))
    }
    
    dispatch({
      externalForceCobrowsingUpdateUserId: externalForceCobrowsingUpdateUserId ? externalForceCobrowsingUpdateUserId : null,
      updateCobrowsing: true,
      type: OPEN_CONSTELLATION,
      payload: {
        imageBase64: imgCanvas.toDataURL()
      }
    });
  }

  attemptConstellation()
}

export const startCloseConstellation = ({ externalForceCobrowsingUpdateUserId }) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    externalForceCobrowsingUpdateUserId: externalForceCobrowsingUpdateUserId ? externalForceCobrowsingUpdateUserId : null,
    type: START_CLOSE_CONSTELLATION,
    payload: {}
  });
}

export const completeCloseConstellation = ({ externalForceCobrowsingUpdateUserId }) => (dispatch, getState) => {
  const scene = getCurrentGameScene(getState().webPage.gameInstance)
  if(scene.isPlaythrough) {
    dispatch(changeGameState(PLAYTHROUGH_PLAY_STATE))
  } else {
    dispatch(changeGameState(PLAY_STATE))
  }
  
  dispatch({
    updateCobrowsing: true,
    externalForceCobrowsingUpdateUserId: externalForceCobrowsingUpdateUserId ? externalForceCobrowsingUpdateUserId : null,
    type: COMPLETE_CLOSE_CONSTELLATION,
    payload: {}
  });
}

export const clearGameContext = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_GAME_CONTEXT,
    payload: {}
  });
}