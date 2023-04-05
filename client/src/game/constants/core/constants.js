export const DEFAULT_TEXTURE_ID = 'square10x10'
export const DEFAULT_CLEAR_TEXTURE_ID = 'eraser10x10'

export const CAMERA_PREVIEW_BORDER_SIZE = 4

export const UNDO_MEMORY_MAX = 10

export const gameInstanceDisconnectedDelta = 15000
export const noPhaserUpdateDelta = 15000
export const noCodrawingStrokeUpdateDelta = 15000


/////////////////////////////////////
/////////////////////////////////////
// GAME
export const PRELOADER_SCENE = 'Preloader';
export const POPUP_SCENE = 'PopupScene';


/////////////////////////////////////
/////////////////////////////////////
// SIDES
export const SIDE_UP = 'SIDE_UP'
export const SIDE_DOWN = 'SIDE_DOWN'
export const SIDE_LEFT = 'SIDE_LEFT'
export const SIDE_RIGHT = 'SIDE_RIGHT'



/////////////////////////////////////
/////////////////////////////////////
// DIRECTIONS
export const DIRECTION_LEFT = 'DIRECTION_LEFT'
export const DIRECTION_RIGHT = 'DIRECTION_RIGHT'
export const DIRECTION_DOWN = 'DIRECTION_DOWN'
export const DIRECTION_UP = 'DIRECTION_UP'



/////////////////////////////////////
/////////////////////////////////////
// GAME STATE
export const START_STATE = 'START_STATE'

export const PAUSED_STATE = 'PAUSED_STATE'
export const PLAYTHROUGH_PAUSED_STATE = 'PLAYTHROUGH_PAUSED_STATE'

export const EDIT_STATE = 'EDIT_STATE'
export const PLAY_STATE = 'PLAY_STATE'
export const PLAYTHROUGH_PLAY_STATE = 'PLAYTHROUGH_PLAY_STATE'

export const GAME_OVER_STATE = 'GAME_OVER_STATE'
export const WIN_GAME_STATE = 'WIN_GAME_STATE'

////----

export const PROJECTILE_INSTANCE_ID_PREFIX = 'oi-pr-'
export const SPAWNED_INSTANCE_ID_PREFIX = 'oi-s-'
export const PLAYER_INSTANCE_ID_PREFIX = 'oi-pl-'
export const ENTITY_INSTANCE_ID_PREFIX = 'oi-'

export const PLAYER_ENTITY_TYPE_PREFIX = 'pl-'
export const BASIC_ENTITY_TYPE_PREFIX = 'o-'
export const NPC_ENTITY_TYPE_PREFIX = 'n-'
export const ZONE_ENTITY_TYPE_PREFIX = 'z-'
export const POWERUP_ENTITY_TYPE_PREFIX = 'pw-'

export const CUTSCENE_ID_PREFIX = 'cutscene-'
export const RELATION_ID_PREFIX = 'relation-'
export const COLLISION_ID_PREFIX = 'collision-'
export const STROKE_ID_PREFIX = 'stroke-'
export const BRUSH_ID_PREFIX = 'brush-'
export const DATE_ID_PREFIX = 'date-'
export const SNAPSHOT_ID_PREFIX = 'snapshot-'
export const SCENE_ID_PREFIX = 'scene-'
export const CANVAS_IMAGE_ID_PREFIX = 'sprite-'
export const STAGE_ID_PREFIX = 'stage-'
export const GAME_INSTANCE_ID_PREFIX = 'gi-'
export const ENTITY_MODEL_ID_PREFIX = 'oc-'
export const RELATION_TAG_ID_PREFIX = 'relationTag-'
export const EVENT_ID_PREFIX = 'event-'
export const EFFECT_ID_PREFIX = 'effect-'
export const LAYER_ID_PREFIX = 'layer-'

export const vehiclePlayerEntityId = ENTITY_MODEL_ID_PREFIX+PLAYER_ENTITY_TYPE_PREFIX+'vehicle'
export const jumperPlayerEntityId = ENTITY_MODEL_ID_PREFIX+PLAYER_ENTITY_TYPE_PREFIX+'jumper'
export const directionalPlayerEntityId = ENTITY_MODEL_ID_PREFIX+PLAYER_ENTITY_TYPE_PREFIX+'directional'
export const swimmerPlayerEntityId = ENTITY_MODEL_ID_PREFIX+PLAYER_ENTITY_TYPE_PREFIX+'swimmer'

export const initialStageId =  STAGE_ID_PREFIX+'default'
export const initialPlayerSpawnZoneEntityId = ENTITY_MODEL_ID_PREFIX+ZONE_ENTITY_TYPE_PREFIX+'playerspawnzone'
export const initialPlayerSpawnZoneInstanceId = ENTITY_MODEL_ID_PREFIX+ENTITY_INSTANCE_ID_PREFIX+'playerspawnzone'
export const initialCameraZoneEntityId = ENTITY_MODEL_ID_PREFIX+ZONE_ENTITY_TYPE_PREFIX+'playercamerazone'
export const initialCameraZoneInstanceId = ENTITY_MODEL_ID_PREFIX+ENTITY_INSTANCE_ID_PREFIX+'playercamerazone'
export const initialStageZoneEntityId = ENTITY_MODEL_ID_PREFIX+ZONE_ENTITY_TYPE_PREFIX+'stagezone'
export const initialStageZoneInstanceId = ENTITY_MODEL_ID_PREFIX+ENTITY_INSTANCE_ID_PREFIX+'stagezone'

export const initialPlayerEntityId = directionalPlayerEntityId



