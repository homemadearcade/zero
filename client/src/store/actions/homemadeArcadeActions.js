import { getCurrentGameScene } from '../../utils/editorUtils';
import { 
  COMPLETE_CLOSE_CONSTELLATION,
  OPEN_CONSTELLATION,
  START_CLOSE_CONSTELLATION,
} from '../types';

export const openConstellation = () => async (dispatch, getState) => {
  const gameInstance = getState().page.gameInstance

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