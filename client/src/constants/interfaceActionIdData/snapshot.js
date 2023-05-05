import { INTERFACE_ACTION_CAMERA } from "../interfaceActionIdGroups";
import { 
  SNAPSHOT_GAME_AREA_AID, SNAPSHOT_PLAYER_CAMERA_ZONE_AID, SNAPSHOT_STAGE_ZONE_AID,
} from "../interfaceActionIds";
import { openSnapshotTaker } from "../../store/actions/game/gameViewEditorActions";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [SNAPSHOT_GAME_AREA_AID]: {
    title: 'Snapshot Custom Game Area',
    subTitle: 'This will open a tool for you to select which area of the game to Snapshot',
    interfaceActionGroupId: INTERFACE_ACTION_CAMERA,
    onClick: () => (dispatch, gameModel) => {
      dispatch(openSnapshotTaker())
    },
    isActive: (state) => {
      return state.gameViewEditor.isSnapshotTakerOpen
    },
    isCommonlyUsed: true
  },
  // [SNAPSHOT_STAGE_ZONE_AID]: {
  //   title: 'Snapshot Game',
  //   subTitle: 'This will take a photo of the entire game',
  //   interfaceActionGroupId: INTERFACE_ACTION_CAMERA,
  // },
  // [SNAPSHOT_PLAYER_CAMERA_ZONE_AID]: {
  //   title: 'Snapshot Player Camera Zone',
  //   subTitle: 'This will take a photo of the area the player can see',
  //   interfaceActionGroupId: INTERFACE_ACTION_CAMERA,
  // },
}
