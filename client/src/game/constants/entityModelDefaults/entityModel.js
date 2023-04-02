import { BOUNDARY_COLLIDE } from "../core"
import { nodeSize } from "../core"
import { PLAYGROUND_LAYER_ID } from "../core"
import { LAYER_ID_PREFIX } from "../core"
import { DATA_SOURCE_GAME_MODEL } from "../core"
import { defaultCollisionResponse, defaultJump, defaultMovement, defaultProjectile } from "../entityModelPropertyDefaults"
import { defaultAutogeneration } from "../entityModelPropertyDefaults/autogeneration"
import { defaultEditorInterface } from "../entityModelPropertyDefaults/editorInterface"

export const defaultEntity = {
  dataSource: DATA_SOURCE_GAME_MODEL,
  // lastSelectedDate: 0,
  lastEditedDate: 0,
  isRemoved: false,
  isImported: false,
  boundaryRelation: BOUNDARY_COLLIDE,
  entityModelId: null,
  movement: {
    ...defaultMovement
  },
  collisionResponse: {
    ...defaultCollisionResponse
  },
  jump: {
    ...defaultJump
  },
  graphics: {
    textureId: null,
    width: nodeSize * 2,
    height: nodeSize * 2,
    textureTint: null,
    invisible: false,
    glowing: false,
    layerId: LAYER_ID_PREFIX+PLAYGROUND_LAYER_ID,
    depthOverride: 0,
    depthModifier: 0,
  },
  editorInterface: {
    ...defaultEditorInterface
  },
  autogeneration: {
    ...defaultAutogeneration
  },
  projectile: {
    ...defaultProjectile
  },
  camera: {
    zoom: 3,
    lerpX: 0.09,
    lerpY: 0.09,
  },
  relationTags: {},
  visualTags: []
}
