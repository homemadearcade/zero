export const DEFAULT_TEXTURE_ID = 'square10x10'
export const DEFAULT_CLEAR_TEXTURE_ID = 'eraser10x10'

export const CAMERA_PREVIEW_BORDER_SIZE = 4

export const UNDO_MEMORY_MAX = 10

export const gameInstanceDisconnectedDelta = 15000
export const noPhaserUpdateDelta = 15000
export const noCodrawingStrokeUpdateDelta = 15000

export const ANIMATION_CAMERA_SHAKE = 'ANIMATION_CAMERA_SHAKE'
export const ANIMATION_CONFETTI = 'ANIMATION_CONFETTI'
export const EVENT_SPAWN_CLASS_IN_CAMERA = 'EVENT_SPAWN_CLASS_IN_CAMERA'
export const EVENT_SPAWN_CLASS_DRAG_FINISH = 'EVENT_SPAWN_CLASS_DRAG_FINISH'

/////////////////////////////////////
/////////////////////////////////////
// GAME
export const PRELOADER_SCENE = 'Preloader';
export const POPUP_SCENE = 'PopupScene';

/////////////////////////////////////
/////////////////////////////////////
// BOUNDARIES
export const BOUNDARY_WALL_ID = 'BOUNDARY'
export const BOUNDARY_LEFT_WALL_ID = 'BOUNDARY_LEFT'
export const BOUNDARY_RIGHT_WALL_ID = 'BOUNDARY_RIGHT'
export const BOUNDARY_UP_WALL_ID = 'BOUNDARY_UP'
export const BOUNDARY_DOWN_WALL_ID = 'BOUNDARY_DOWN'

/////////////////////////////////////
/////////////////////////////////////
// INSTANCES
export const ERASER_BRUSH_ID = 'ERASER_BRUSH'
export const COLOR_BRUSH_ID = 'COLOR_BRUSH'

/////////////////////////////////////
/////////////////////////////////////
// LAYERS
export const STAGE_BACKGROUND_LAYER_CANVAS_DEPTH = 0;
export const BACKGROUND_LAYER_CANVAS_DEPTH = 5;
export const SPRITE_EDITOR_CANVAS_DEPTH = 19;
export const PLAYGROUND_LAYER_CANVAS_DEPTH = 20;
export const PLAYER_INSTANCE_CANVAS_DEPTH = 50;
export const FOREGROUND_LAYER_CANVAS_DEPTH = 70;
export const ZONE_INSTANCE_CANVAS_DEPTH = 80;
export const UI_CANVAS_DEPTH = 100;

export const STAGE_BACKGROUND_LAYER_CANVAS_ID = 'STAGE_BACKGROUND_LAYER_CANVAS';
export const BACKGROUND_LAYER_CANVAS_ID = 'BACKGROUND_LAYER_CANVAS';
export const SPRITE_EDITOR_CANVAS_ID = 'SPRITE_EDITOR_CANVAS';
export const PLAYGROUND_LAYER_CANVAS_ID = 'PLAYGROUND_LAYER_CANVAS';
export const PLAYER_INSTANCE_CANVAS_ID = 'PLAYER_INSTANCE_CANVAS';
export const FOREGROUND_LAYER_CANVAS_ID = 'FOREGROUND_LAYER_CANVAS';
export const ZONE_INSTANCE_CANVAS_ID = 'ZONE_INSTANCE_CANVAS';
export const UI_CANVAS_ID = 'UI_CANVAS';

/////////////////////////////////////
/////////////////////////////////////
// CLASSES
export const PLAYER_CLASS = 'PLAYER_CLASS'
export const BASIC_CLASS = 'BASIC_CLASS'
export const NPC_CLASS = 'NPC_CLASS'
export const ZONE_CLASS = 'ZONE_CLASS'

/////////////////////////////////////
/////////////////////////////////////
// SIDES
export const SIDE_UP = 'SIDE_UP'
export const SIDE_DOWN = 'SIDE_DOWN'
export const SIDE_LEFT = 'SIDE_LEFT'
export const SIDE_RIGHT = 'SIDE_RIGHT'

/////////////////////////////////////
/////////////////////////////////////
// MOVEMENT PATTERNS
export const MOVEMENT_SIDE_TO_SIDE = 'MOVEMENT_SIDE_TO_SIDE'
export const MOVEMENT_UP_AND_DOWN = 'MOVEMENT_UP_AND_DOWN'
export const MOVEMENT_JUMP = 'MOVEMENT_JUMP'
export const MOVEMENT_TURN_ON_COLLIDE = 'MOVEMENT_TURN_ON_COLLIDE'
export const MOVEMENT_TURN_RANDOMLY = 'MOVEMENT_TURN_RANDOMLY'
export const MOVEMENT_FOLLOW_PLAYER = 'MOVEMENT_FOLLOW_PLAYER'
export const MOVEMENT_FOLLOW_CLASS = 'MOVEMENT_FOLLOW_CLASS'
export const MOVEMENT_NONE = 'MOVEMENT_NONE'

/////////////////////////////////////
/////////////////////////////////////
// PROJECTILE TYPES
export const PROJECTILE_RANDOM_DIRECTION = 'PROJECTILE_RANDOM_DIRECTION'
export const PROJECTILE_RANDOM_ANGLE = 'PROJECTILE_RANDOM_ANGLE'
export const PROJECTILE_TARGET_PLAYER = 'PROJECTILE_TARGET_PLAYER'
export const PROJECTILE_TARGET_CLASS = 'PROJECTILE_TARGET_CLASS'
export const PROJECTILE_LEFT = 'PROJECTILE_LEFT'
export const PROJECTILE_RIGHT = 'PROJECTILE_RIGHT'
export const PROJECTILE_DOWN = 'PROJECTILE_DOWN'
export const PROJECTILE_UP = 'PROJECTILE_UP'
export const PROJECTILE_NONE = 'PROJECTILE_NONE'

/////////////////////////////////////
/////////////////////////////////////
// DIRECTIONS
export const DIRECTION_LEFT = 'DIRECTION_LEFT'
export const DIRECTION_RIGHT = 'DIRECTION_RIGHT'
export const DIRECTION_DOWN = 'DIRECTION_DOWN'
export const DIRECTION_UP = 'DIRECTION_UP'

/////////////////////////////////////
/////////////////////////////////////
// STAGE BOUNDARY RELATIONSHIP
export const BOUNDARY_WRAP = 'BOUNDARY_WRAP'
export const BOUNDARY_COLLIDE = 'BOUNDARY_COLLIDE'
export const BOUNDARY_DESTROY = 'BOUNDARY_DESTROY'

export const SELECTOR_MAP_LIST = 'SELECTOR_MAP_LIST'
export const SELECTOR_ABSTRACT_LIST = 'SELECTOR_ABSTRACT_LIST'
export const SELECTOR_CLASS_LIST = 'SELECTOR_CLASS_LIST'

/////////////////////////////////////
/////////////////////////////////////
// PHYSICS TYPES
export const MATTER_PHYSICS = 'MATTER_PHYSICS'
export const ARCADE_PHYSICS = 'ARCADE_PHYSICS'

/////////////////////////////////////
/////////////////////////////////////
// CONTROL TYPES
export const CAR_CONTROLS = 'CAR_CONTROLS'
export const VEHICLE_CONTROLS = 'VEHICLE_CONTROLS'
export const JUMP_GROUND = 'JUMP_GROUND'
export const JUMP_COMBO = 'JUMP_COMBO'
export const DIRECTIONAL_CONTROLS = 'DIRECTIONAL_CONTROLS'
export const JUMP_CONSTANT = 'JUMP_CONSTANT'
export const ADVANCED_DIRECTIONAL_CONTROLS = 'ADVANCED_DIRECTIONAL_CONTROLS'
export const JUMP_NONE = 'JUMP_NONE'
export const JUMP_AIR = 'JUMP_AIR'

/////////////////////////////////////
/////////////////////////////////////
// CUTSCENES
export const TEXT_CUTSCENE = 'TEXT_CUTSCENE'
export const IMAGE_CUTSCENE = 'IMAGE_CUTSCENE'
export const IMAGE_AND_TEXT_CUTSCENE = 'IMAGE_AND_TEXT_CUTSCENE'

/////////////////////////////////////
/////////////////////////////////////
// LIVE EDITORS
export const PHYSICS_EDITOR = 'PHYSICS_EDITOR'
export const MOVEMENT_EDITOR = 'MOVEMENT_EDITOR'
export const JUMP_EDITOR = 'JUMP_EDITOR'
export const CAMERA_EDITOR = 'CAMERA_EDITOR'
export const STAGE_EDITOR = 'STAGE_EDITOR'
export const PROJECTILE_EDITOR = 'PROJECTILE_EDITOR'

/////////////////////////////////////
/////////////////////////////////////
// GAME STATE
export const START_STATE = 'START_STATE'

export const STOPPED_STATE = 'STOPPED_STATE'
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
export const OBJECT_INSTANCE_ID_PREFIX = 'oi-'
export const CUTSCENE_ID_PREFIX = 'cutscene-'
export const RELATION_ID_PREFIX = 'relation-'
export const COLLISION_ID_PREFIX = 'collision-'
export const STROKE_ID_PREFIX = 'stroke-'
export const BRUSH_ID_PREFIX = 'brush-'
export const DATE_ID_PREFIX = 'date-'
export const SNAPSHOT_ID_PREFIX = 'snapshot-'
export const SCENE_ID_PREFIX = 'scene-'
export const SPRITE_EDITOR_ID_PREFIX = 'sprite-'
export const STAGE_ID_PREFIX = 'stage-'
export const GAME_INSTANCE_ID_PREFIX = 'gi-'
export const OBJECT_CLASS_ID_PREFIX = 'oc-'
export const TAG_ID_PREFIX = 'tag-'
export const EVENT_ID_PREFIX = 'event-'
export const EFFECT_ID_PREFIX = 'effect-'

export const PLAYER_CLASS_TYPE_PREFIX = 'pl-'
export const BASIC_CLASS_TYPE_PREFIX = 'o-'
export const NPC_CLASS_TYPE_PREFIX = 'n-'
export const ZONE_CLASS_TYPE_PREFIX = 'z-'

export const NON_LAYER_COLOR_ID = 'NON_LAYER_COLOR_ID';
export const NON_LAYER_BRUSH_ID = 'NON_LAYER_BRUSH_ID'
export const NON_LAYER_BRUSH_DEPTH = 71

export const classTypeToPrefix = {
  [ZONE_CLASS]: ZONE_CLASS_TYPE_PREFIX,
  [PLAYER_CLASS]: PLAYER_CLASS_TYPE_PREFIX,
  [BASIC_CLASS]: BASIC_CLASS_TYPE_PREFIX,
  [NPC_CLASS]: NPC_CLASS_TYPE_PREFIX
}

export const layerToDisplayName = {
  [BACKGROUND_LAYER_CANVAS_ID]: 'Background',
  [PLAYGROUND_LAYER_CANVAS_ID]: 'Playground',
  [FOREGROUND_LAYER_CANVAS_ID]: 'Foreground',
}