export const GOOGLE_AUTH_LINK = 'https://homemadearcade.herokuapp.com/auth/google';

export const ON_MY_VIDEO_QUALITY_STATUS_UPDATE = 'ON_MY_VIDEO_QUALITY_STATUS_UPDATE'

export const DEFAULT_TEXTURE_ID = 'square10x10'
export const DEFAULT_CLEAR_TEXTURE_ID = 'eraser10x10'
export const UNSPAWNED_TEXTURE_ID = 'spawn'

export const ADMIN_ROLE = 'ADMIN'

export const CAMERA_PREVIEW_BORDER_SIZE = 4

export const UNDO_MEMORY_MAX = 10

/////////////////////////////////////
/////////////////////////////////////
// GAME
export const PRELOADER_SCENE = 'Preloader';
export const GAME_SCENE = 'Game';
export const PLAY_GAME_SCENE = 'PLAY_GAME_SCENE'
export const POPUP_SCENE = 'PopupScene';
export const PROLOGUE_SCENE_1 = 'Prologue 1';
export const PROLOGUE_SCENE_2 = 'Prologue 2';
export const PROLOGUE_SCENE_3 = 'Prologue 3';

/////////////////////////////////////
/////////////////////////////////////
// BOUNDARIES
export const GAME_BOUNDARY_WALL_ID = 'GAME_BOUNDARY'
export const GAME_BOUNDARY_LEFT_WALL_ID = 'GAME_BOUNDARY_LEFT'
export const GAME_BOUNDARY_RIGHT_WALL_ID = 'GAME_BOUNDARY_RIGHT'
export const GAME_BOUNDARY_UP_WALL_ID = 'GAME_BOUNDARY_UP'
export const GAME_BOUNDARY_DOWN_WALL_ID = 'GAME_BOUNDARY_DOWN'

/////////////////////////////////////
/////////////////////////////////////
// INSTANCES
export const HERO_INSTANCE_ID = 'HERO_INSTANCE'
export const ERASER_BRUSH_ID = 'ERASER_BRUSH'
export const COLOR_BRUSH_ID = 'COLOR_BRUSH'

/////////////////////////////////////
/////////////////////////////////////
// LAYERS
export const WORLD_BACKGROUND_CANVAS_DEPTH = 0;
export const BACKGROUND_CANVAS_DEPTH = 5;
export const SPRITE_EDITOR_CANVAS_DEPTH = 19;
export const PLAYGROUND_CANVAS_DEPTH = 20;
export const OBJECT_INSTANCE_CANVAS_DEPTH = 40;
export const HERO_INSTANCE_CANVAS_DEPTH = 50;
export const ZONE_INSTANCE_CANVAS_DEPTH = 60;
export const FOREGROUND_CANVAS_DEPTH = 70;
export const UI_CANVAS_DEPTH = 100;

export const WORLD_BACKGROUND_CANVAS_ID = 'WORLD_BACKGROUND_CANVAS';
export const BACKGROUND_CANVAS_ID = 'BACKGROUND_CANVAS';
export const SPRITE_EDITOR_CANVAS_ID = 'SPRITE_EDITOR_CANVAS';
export const PLAYGROUND_CANVAS_ID = 'PLAYGROUND_CANVAS';
export const OBJECT_INSTANCE_CANVAS_ID = 'OBJECT_INSTANCE_CANVAS';
export const HERO_INSTANCE_CANVAS_ID = 'HERO_INSTANCE_CANVAS';
export const ZONE_INSTANCE_CANVAS_ID = 'ZONE_INSTANCE_CANVAS';
export const FOREGROUND_CANVAS_ID = 'FOREGROUND_CANVAS';
export const UI_CANVAS_ID = 'UI_CANVAS';

/////////////////////////////////////
/////////////////////////////////////
// CLASSES
export const HERO_CLASS = 'HERO_CLASS'
export const OBJECT_CLASS = 'OBJECT_CLASS'
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
// EVENTS
export const ON_COLLIDE = 'ON_COLLIDE'
export const ON_COLLIDE_START = 'ON_COLLIDE_START'
export const ON_COLLIDE_END = 'ON_COLLIDE_END'
export const ON_COLLIDE_ACTIVE = 'ON_COLLIDE_ACTIVE'
export const ON_SPAWN = 'ON_SPAWN'
export const ON_DESTROY = 'ON_DESTROY'
export const ON_INTERACT = 'ON_INTERACT'

/////////////////////////////////////
/////////////////////////////////////
// EFFECTS
export const EFFECT_TELEPORT = 'EFFECT_TELEPORT'
export const EFFECT_FOLLOW_START = 'EFFECT_FOLLOW_START'
export const EFFECT_FOLLOW_END = 'EFFECT_FOLLOW_END'

export const EFFECT_COLLIDE = 'EFFECT_COLLIDE'
export const EFFECT_IGNORE_GRAVITY = 'EFFECT_IGNORE_GRAVITY'
export const EFFECT_STICK_TO = 'EFFECT_STICK_TO'

export const EFFECT_RECLASS = 'EFFECT_RECLASS'
export const EFFECT_SPAWN = 'EFFECT_SPAWN'
export const EFFECT_DESTROY = 'EFFECT_DESTROY'

export const EFFECT_CUTSCENE = 'EFFECT_CUTSCENE'

export const EFFECT_CAMERA_SHAKE = 'EFFECT_CAMERA_SHAKE'
export const EFFECT_INVISIBLE = 'EFFECT_INVISIBLE'

export const EFFECT_GAME_OVER = 'EFFECT_GAME_OVER'
export const EFFECT_YOU_WIN = 'EFFECT_YOU_WIN'

/////////////////////////////////////
/////////////////////////////////////
// MOVEMENT PATTERNS
export const MOVEMENT_SIDE_TO_SIDE = 'MOVEMENT_SIDE_TO_SIDE'
export const MOVEMENT_UP_AND_DOWN = 'MOVEMENT_UP_AND_DOWN'
export const MOVEMENT_JUMP = 'MOVEMENT_JUMP'
export const MOVEMENT_TURN_ON_COLLIDE = 'MOVEMENT_TURN_ON_COLLIDE'
export const MOVEMENT_FOLLOW_PLAYER = 'MOVEMENT_FOLLOW_PLAYER'
export const MOVEMENT_NONE = 'MOVEMENT_NONE'

/////////////////////////////////////
/////////////////////////////////////
// WORLD BOUNDARY RELATIONSHIP
export const WORLD_WRAP = 'WORLD_WRAP'
export const WORLD_COLLIDE = 'WORLD_COLLIDE'
export const WORLD_DESTROY = 'WORLD_DESTROY'

/////////////////////////////////////
/////////////////////////////////////
// PHYSICS TYPES
export const MATTER_PHYSICS = 'MATTER_PHYSICS'
export const ARCADE_PHYSICS = 'ARCADE_PHYSICS'

/////////////////////////////////////
/////////////////////////////////////
// CONTROL TYPES
export const CAR_CONTROLS = 'CAR_CONTROLS'
export const SPACESHIP_CONTROLS = 'SPACESHIP_CONTROLS'
export const PLATFORMER_CONTROLS = 'PLATFORMER_CONTROLS'
export const FLOATER_CONTROLS = 'FLOATER_CONTROLS'
export const ADVENTURER_CONTROLS = 'ADVENTURER_CONTROLS'