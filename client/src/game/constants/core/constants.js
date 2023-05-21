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
export const PLAYTHROUGH_START_STATE = 'PLAYTHROUGH_START_STATE'

export const PAUSED_STATE = 'PAUSED_STATE'
export const PLAYTHROUGH_PAUSED_STATE = 'PLAYTHROUGH_PAUSED_STATE'

export const EDIT_STATE = 'EDIT_STATE'
export const PLAY_STATE = 'PLAY_STATE'
export const PLAYTHROUGH_PLAY_STATE = 'PLAYTHROUGH_PLAY_STATE'

export const GAME_END_STATE = 'GAME_END_STATE'

////----

export const PROJECTILE_INSTANCE_DID = 'oi-pr-'
export const SPAWNED_INSTANCE_DID = 'oi-s-'
export const PLAYER_INSTANCE_DID = 'oi-pl-'
export const ENTITY_INSTANCE_DID = 'oi-'

export const PLAYER_ENTITY_TYPE_PREFIX = 'pl-'
export const BASIC_ENTITY_TYPE_PREFIX = 'o-'
export const NPC_ENTITY_TYPE_PREFIX = 'n-'
export const ZONE_ENTITY_TYPE_PREFIX = 'z-'
export const POWERUP_ENTITY_TYPE_PREFIX = 'pw-'
export const PROJECTILE_ENTITY_TYPE_PREFIX = 'pr-'

export const CUTSCENE_DID = 'cutscene-'
export const RELATION_DID = 'relation-'
export const COLLISION_DID = 'collision-'
export const STROKE_DID = 'stroke-'
export const BRUSH_DID = 'brush-'
export const DATE_DID = 'date-'
export const SNAPSHOT_DID = 'snapshot-'
export const SCENE_DID = 'scene-'
export const CANVAS_IMAGE_DID = 'sprite-'
export const STAGE_DID = 'stage-'
export const GAME_INSTANCE_DID = 'gi-'
export const ENTITY_MODEL_DID = 'oc-'
export const RELATION_TAG_DID = 'relationTag-'
export const EVENT_DID = 'event-'
export const EFFECT_DID = 'effect-'
export const LAYER_DID = 'layer-'
export const TEXTURE_DID = 'texture-'

export const vehiclePlayerEntityId = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'vehicle'
export const jumperPlayerEntityId = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'jumper'
export const directionalPlayerEntityId = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'directional'
export const swimmerPlayerEntityId = ENTITY_MODEL_DID+PLAYER_ENTITY_TYPE_PREFIX+'swimmer'

export const initialStageId =  STAGE_DID+'default'
export const initialPlayerSpawnZoneEntityId = ENTITY_MODEL_DID+ZONE_ENTITY_TYPE_PREFIX+'playerspawnzone'
export const initialPlayerSpawnZoneInstanceId = ENTITY_MODEL_DID+ENTITY_INSTANCE_DID+'playerspawnzone'
export const initialCameraZoneEntityId = ENTITY_MODEL_DID+ZONE_ENTITY_TYPE_PREFIX+'playercamerazone2'
export const initialCameraZoneInstanceId = ENTITY_MODEL_DID+ENTITY_INSTANCE_DID+'playercamerazone'
export const initialStageZoneEntityId = ENTITY_MODEL_DID+ZONE_ENTITY_TYPE_PREFIX+'stagezone'
export const initialStageZoneInstanceId = ENTITY_MODEL_DID+ENTITY_INSTANCE_DID+'stagezone'

export const initialPlayerEntityId = directionalPlayerEntityId

export const playthroughStartCutsceneId = CUTSCENE_DID+'start'
export const endGameCutsceneId = CUTSCENE_DID+'end'



