import { ACTION_OPEN } from "../action";
import { GAME_INTERFACE_COLOR_IID, GAME_OPEN_METADATA_IID } from "../interfaceIds/gameModelIds";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  [GAME_OPEN_METADATA_IID]: {
    name: 'Edit Game Metadata',
    clickType: ACTION_OPEN
  },
  [GAME_INTERFACE_COLOR_IID]: {}
}