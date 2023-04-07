import { SCRIPT_CUTSCENE_AID, SCRIPT_CUTSCENE_NEW_AID, SCRIPT_DIALOGUE_NEW_AID } from "../interfaceActionIds/script";
import { INTERFACE_ACTION_SCRIPT } from "../interfaceActions";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [SCRIPT_CUTSCENE_AID]: {
    getTitle: ([cutsceneId], gameModel) => {
      return 'Script ' + gameModel.cutscenes[cutsceneId].name
    },
    getSubtitle: ([cutsceneId], gameModel) => {
      return gameModel.cutscenes[cutsceneId].name
    },
    arguments: ['cutsceneId'],
    actionType: INTERFACE_ACTION_SCRIPT
  },
  [SCRIPT_CUTSCENE_NEW_AID]: {
    title: 'Script New Cutscene',
    subTitle: 'This will open a popup to write your cutscene',
    actionType: INTERFACE_ACTION_SCRIPT,
    higherPriority: true
  },
  [SCRIPT_DIALOGUE_NEW_AID]: {
    title: 'Script New Dialogue',
    subTitle: 'This will open a popup to write your dialogue',
    actionType: INTERFACE_ACTION_SCRIPT,
    higherPriority: true
  },

}