import { openCutscene } from "../../store/actions/game/playerInterfaceActions"
import { PLAY_CUTSCENE_AID, PLAY_TEST_GAME_AID, TOGGLE_PAUSE_PLAY_AID } from "../interfaceActionIds/play"
import { INTERFACE_ACTION_PLAY } from "../interfaceActionIdGroups"
import store from "../../store"
import { PAUSED_STATE, PLAY_STATE } from "../../game/constants"
import { changeGameState } from "../../store/actions/game/gameRoomInstanceActions"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [PLAY_CUTSCENE_AID]: {
    arguments: ['cutsceneId'],
    getTitle: ([cutsceneId], gameModel) => {
      return 'Play ' + gameModel.cutscenes[cutsceneId].name
    },
    getSubtitle: ([cutsceneId], gameModel) => {
      return gameModel.cutscenes[cutsceneId].name
    },
    interfaceActionGroupId: INTERFACE_ACTION_PLAY,
    onClick: ([cutsceneId]) => (dispatch, gameModel) => {
      dispatch(openCutscene(null, cutsceneId))
    }
  },
  [PLAY_TEST_GAME_AID]: {
    title: 'Playtest Game',
    interfaceActionGroupId: INTERFACE_ACTION_PLAY,
    icon: 'faCirclePlay',
    subTitle: 'This will open a new window',
    onClick: () => (dispatch, gameModel) => {
      window.open(window.location.origin + '/play/' + gameModel.id, '_blank');
    }
  },
  [TOGGLE_PAUSE_PLAY_AID]: {
    title: 'Pause/Resume Game',
    subtitle: 'This will pause or resume the game',
    icon: 'faPause',
    isActive: (state) => {
      return state.gameRoomInstance.gameRoomInstance.gameState === PAUSED_STATE
    },
    interfaceActionGroupId: INTERFACE_ACTION_PLAY,
    onClick: () => (dispatch, gameModel) => {
      const gameState = store.getState().gameRoomInstance.gameRoomInstance.gameState 
      if(gameState === PAUSED_STATE) {
        dispatch(changeGameState(PLAY_STATE))
      } else if(gameState === PLAY_STATE) {
        dispatch(changeGameState(PAUSED_STATE))
      }
    }
  }

}