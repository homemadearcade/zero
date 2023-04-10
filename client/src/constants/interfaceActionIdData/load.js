import { delay } from "lodash";
import { loadArcadeGameByMongoId, unloadArcadeGame } from "../../store/actions/game/arcadeGameActions";
import { LOAD_GAME_AID } from "../interfaceActionIds/load";
import { INTERFACE_ACTION_LOAD } from "../interfaceActions";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [LOAD_GAME_AID]: {
    title: 'Load Game',
    subTitle: 'This will stop the current gamme and load the new game',
    arguments: ['arcadeGameId'],
    actionType: INTERFACE_ACTION_LOAD,
    onClick: ([arcadeGameId]) => async (dispatch, gameModel) => {
      await unloadArcadeGame()
      await delay(1000)
      loadArcadeGameByMongoId(arcadeGameId)
    }
  },
}