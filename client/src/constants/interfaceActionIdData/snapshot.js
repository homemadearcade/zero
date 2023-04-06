import { INTERFACE_ACTION_CAMERA } from "../interfaceActions";
import { 
  SNAPSHOT_GAME_AREA_AID,
} from "../interfaceActionIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [SNAPSHOT_GAME_AREA_AID]: {
    name: 'Snapshot Game Area',
    actionType: INTERFACE_ACTION_CAMERA,
  },
}
