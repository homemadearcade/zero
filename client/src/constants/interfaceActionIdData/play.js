import { openCutscene } from "../../store/actions/game/playerInterfaceActions"
import { PLAY_CUTSCENE_AID, PLAY_TEST_GAME_AID, TOGGLE_PAUSE_PLAY_AID } from "../interfaceActionIds/play"
import { INTERFACE_ACTION_GAME, INTERFACE_ACTION_PLAY } from "../interfaceActionIdGroups"
import store from "../../store"
import { PAUSED_STATE, PLAY_STATE } from "../../game/constants"
import { changeGameStatus } from "../../store/actions/game/gameRoomInstanceActions"

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
    interfaceActionGroupId: INTERFACE_ACTION_GAME,
    icon: 'faCirclePlay',
    subTitle: 'This will open a new window to play the game in',
    onClick: () => (dispatch, gameModel) => {
      window.open(window.location.origin + '/play/' + gameModel.id, '_blank');
    },
    isCommonlyUsed: true
  },
  [TOGGLE_PAUSE_PLAY_AID]: {
    isCommonlyUsed: true,
    title: 'Toggle Pause Game',
    subtitle: 'This will pause or resume the game',
    icon: 'faPause',
    isActive: (state) => {
      return state.gameRoomInstance.gameRoomInstance.gameStatus === PAUSED_STATE
    },
    interfaceActionGroupId: INTERFACE_ACTION_GAME,
    onClick: () => (dispatch, gameModel) => {
      const gameStatus = store.getState().gameRoomInstance.gameRoomInstance.gameStatus 
      if(gameStatus === PAUSED_STATE) {
        dispatch(changeGameStatus(PLAY_STATE))
      } else if(gameStatus === PLAY_STATE) {
        dispatch(changeGameStatus(PAUSED_STATE))
      }
    }
  }

}