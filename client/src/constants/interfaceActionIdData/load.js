import { LOAD_GAME_AID } from "../interfaceActionIds/load";
import { INTERFACE_ACTION_LOAD } from "../interfaceActions";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [LOAD_GAME_AID]: {
    title: 'Load Game',
    subTitle: 'This will stop the current gamme and load the new game',
    arguments: ['arcadeGameId'],
    actionType: INTERFACE_ACTION_LOAD
  },
}