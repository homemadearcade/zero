import { PAUSED_STATE, PLAYTHROUGH_PAUSED_STATE, PLAYTHROUGH_PLAY_STATE, PLAY_STATE } from '../../../game/constants';
import { getCobrowsingState } from '../../../utils/cobrowsingUtils';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import { 
  CLEAR_CUTSCENES,
  CLOSE_CUTSCENE,
  OPEN_CUTSCENE,
  PROGRESS_CUTSCENE,
  CHANGE_CONTROL_POPUP,
  CHANGE_PLAYER_CLASS,
} from '../../types';
import { changeGameState } from './gameRoomInstanceActions';

export const changePlayerEntity = ({entityModelId}) => (dispatch, getState) => {
  dispatch({
    type: CHANGE_PLAYER_CLASS,
    payload: {
      playerEntityModelId: entityModelId
    }
  })
};

export const changeControlPopup = (controlsToPress) => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CHANGE_CONTROL_POPUP,
    payload: {
        controlsToPress
    }
  })
};

export const openCutscene = (entityModelId, cutsceneId) => (dispatch, getState) => {
  dispatch(changeGameState(PAUSED_STATE))

  const scene = getCurrentGameScene(getState().webPage.gameInstance)
  if(scene) {
    if(scene.isPlaythrough) {
      dispatch(changeGameState(PLAYTHROUGH_PAUSED_STATE))
    } else {
      dispatch(changeGameState(PAUSED_STATE))
    }
  }


  dispatch({
    updateCobrowsing: true,
    type: OPEN_CUTSCENE,
    payload: {
      cutsceneId: cutsceneId,
      entityModelId: entityModelId,
    }
  });
}

export const progressActiveCutscene = () => (dispatch, getState) => {
  const cutsceneId = getCobrowsingState().playerInterface.cutsceneId
  const cutsceneIndex = getCobrowsingState().playerInterface.cutsceneIndex
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
  // const cutsceneId = getState().playerInterface.cutsceneId
  // const cutscene = getState().gameModel.gameModel.cutscenes[cutsceneId]
  // if(cutscene.pauseGame) {

  const scene = getCurrentGameScene(getState().webPage.gameInstance)
  if(scene) {
    if(scene.isPlaythrough) {
      dispatch(changeGameState(PLAYTHROUGH_PLAY_STATE))
    } else {
      dispatch(changeGameState(PLAY_STATE))
    }
  }

  dispatch({
    updateCobrowsing: true,
    type: CLOSE_CUTSCENE,
    payload: {}
  });
}

export const clearCutscenes = () => (dispatch, getState) => {
  dispatch({
    updateCobrowsing: true,
    type: CLEAR_CUTSCENES,
    payload: {}
  });
}