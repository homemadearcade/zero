import { openCutscene } from "../../store/actions/game/playerInterfaceActions"
import { PLAY_CUTSCENE_AID, PLAY_TEST_GAME_AID } from "../interfaceActionIds/play"
import { INTERFACE_ACTION_PLAY } from "../interfaceActions"

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
    actionType: INTERFACE_ACTION_PLAY,
    onClick: ([cutsceneId]) => (dispatch, gameModel) => {
      dispatch(openCutscene(null, cutsceneId))
    }
  },
  [PLAY_TEST_GAME_AID]: {
    title: 'Playtest Game',
    actionType: INTERFACE_ACTION_PLAY,
    subTitle: 'This will open a new window',
    onClick: () => (dispatch, gameModel) => {
      window.open(window.location.origin + '/play/' + gameModel.id, '_blank');
    }
  },
}