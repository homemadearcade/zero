import { openCreateCutscene } from "../../store/actions/game/gameFormEditorActions";
import { WRITE_CUTSCENE_AID, WRITE_CUTSCENE_NEW_AID, WRITE_TEXT_SCENE_NEW_AID } from "../interfaceActionIds/write";
import { INTERFACE_ACTION_WRITE } from "../interfaceActionIdGroups";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [WRITE_CUTSCENE_AID]: {
    getTitle: ([cutsceneId], gameModel) => {
      return 'Write ' + gameModel.cutscenes[cutsceneId].name
    },
    getSubtitle: ([cutsceneId], gameModel) => {
      return gameModel.cutscenes[cutsceneId].name
    },
    arguments: ['cutsceneId'],
    interfaceActionGroupId: INTERFACE_ACTION_WRITE,
    onClick: ([cutsceneId]) => (dispatch, gameModel) => {
      const cutscene = gameModel.cutscenes[cutsceneId]
      dispatch(openCreateCutscene(cutscene))
    }
  },
  [WRITE_CUTSCENE_NEW_AID]: {
    title: 'Write New Cutscene',
    subIcon: 'faPlus',
    subTitle: 'This will open a popup to write your cutscene',
    interfaceActionGroupId: INTERFACE_ACTION_WRITE,
    higherPriority: true,
    onClick: () => (dispatch, gameModel) => {
      dispatch(openCreateCutscene({
        name: 'Cutscene #' + (Object.keys(gameModel.cutscenes).length + 1).toString()
      }))
    }
  },
  [WRITE_TEXT_SCENE_NEW_AID]: {
    title: 'Write New Text Scene',
    subIcon: 'faPlus',
    subTitle: 'This will open a popup to write your text scene',
    interfaceActionGroupId: INTERFACE_ACTION_WRITE,
    higherPriority: true,
    onClick: () => (dispatch, gameModel) => {
      dispatch(openCreateCutscene({
        name: 'Text Scene #' + (Object.keys(gameModel.cutscenes).length + 1).toString()
      }))
    }
  },

}