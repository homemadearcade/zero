import { INTERFACE_ACTION_CAMERA } from "../interfaceActions";
import { 
  SNAPSHOT_GAME_AREA_AID, SNAPSHOT_PLAYER_CAMERA_ZONE_AID, SNAPSHOT_STAGE_ZONE_AID,
} from "../interfaceActionIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [SNAPSHOT_GAME_AREA_AID]: {
    name: 'Snapshot Custom Game Area',
    actionType: INTERFACE_ACTION_CAMERA,
  },
  [SNAPSHOT_STAGE_ZONE_AID]: {
    name: 'Snapshot Entire Game',
    actionType: INTERFACE_ACTION_CAMERA,
  },
  [SNAPSHOT_PLAYER_CAMERA_ZONE_AID]: {
    name: 'Snapshot Player Camera Zone',
    actionType: INTERFACE_ACTION_CAMERA,
  },
}
