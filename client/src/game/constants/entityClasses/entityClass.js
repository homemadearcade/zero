import { BOUNDARY_COLLIDE } from "../core"
import { nodeSize } from "../core"
import { PLAYGROUND_LAYER_ID } from "../core"
import { LAYER_ID_PREFIX } from "../core"
import { DATA_SOURCE_GAME_MODEL } from "../core"
import { defaultCollisionResponse, defaultJump, defaultMovement, defaultProjectile } from "../entityClassProperties"

export const defaultClass = {
  dataSource: DATA_SOURCE_GAME_MODEL,
  // lastSelectedDate: 0,
  lastEditedDate: 0,
  isRemoved: false,
  boundaryRelation: BOUNDARY_COLLIDE,
  entityClassId: null,
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
    isSelectorObscured: false,
    fixedAspectRatio: false,
    notVisibleInSelector: false,
    notSelectableInStage: false,
    noTeleportEffect: false,
    noPlayerTeleportRelation: false,
    noPlayerTransformRelation: false,
    noDestroyAllEffect: false,
    noTransformEffect: false,
    noSpawnAnywhereEffect: false
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
console.log(defaultClass)
