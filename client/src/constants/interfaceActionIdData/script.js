import { SCRIPT_CUTSCENE_AID, SCRIPT_CUTSCENE_NEW_AID, SCRIPT_DIALOGUE_AID, SCRIPT_DIALOGUE_NEW_AID } from "../interfaceActionIds/script";
import { INTERFACE_ACTION_SCRIPT } from "../interfaceActions";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [SCRIPT_CUTSCENE_AID]: {
    name: 'Script Cutscene',
    getName: (gameModel, [cutsceneId]) => {
      return 'Script Cutscene ' + gameModel.cutscenes[cutsceneId].name
    },
    arguments: ['cutsceneId'],
    actionType: INTERFACE_ACTION_SCRIPT
  },
  [SCRIPT_CUTSCENE_NEW_AID]: {
    name: 'Script New Cutscene',
    actionType: INTERFACE_ACTION_SCRIPT,
    higherPriority: true
  },
  [SCRIPT_DIALOGUE_AID]: {
    name: 'Script Dialogue',
    arguments: ['dialogueId'],
    getName: (gameModel, [dialogueId]) => {
      return 'Script Dialogue ' + gameModel.cutscenes[dialogueId].name
    },
    actionType: INTERFACE_ACTION_SCRIPT
  },
  [SCRIPT_DIALOGUE_NEW_AID]: {
    name: 'Script New Dialogue',
    actionType: INTERFACE_ACTION_SCRIPT,
    higherPriority: true
  },

}