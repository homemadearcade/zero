import { PLAY_CUTSCENE_AID, PLAY_TEST_GAME_AID } from "../interfaceActionIds/play"
import { INTERFACE_ACTION_PLAY } from "../interfaceActions"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [PLAY_CUTSCENE_AID]: {
    arguments: ['cutsceneId'],
    getName: (gameModel, [cutsceneId]) => {
      return 'Play ' + gameModel.cutscenes[cutsceneId].name
    },
    actionType: INTERFACE_ACTION_PLAY
  },
  [PLAY_TEST_GAME_AID]: {
    name: 'Playtest Game in new window',
    actionType: INTERFACE_ACTION_PLAY,
  },
}