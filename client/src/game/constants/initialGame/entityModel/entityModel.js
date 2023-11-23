import { NOT_DERIVED_IID, PLAYGROUND_LAYER_GROUP_IID } from "../../../../constants/interfaceIds"
import { BOUNDARY_COLLIDE } from "../../core"
import { nodeSize } from "../../core"
import { defaultCollisionResponse, defaultJump, defaultMovement, defaultProjectile } from "../entityModelBehavior"
import { defaultAutogeneration } from "../entityModelBehavior/autogeneration"
import { defaultEditorInterface } from "../entityModelBehavior/editorInterface"

export const defaultEntity = {
  dataSourceIID: NOT_DERIVED_IID,
  // lastSelectedDate: 0,
  lastEditedDate: 0,
  isRemoved: false,
  importedStageIds: {},
  boundaryRelation: BOUNDARY_COLLIDE,
  entityModelId: null,
  spawnZoneEntityModelIds: [],
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
    layerGroupIID: PLAYGROUND_LAYER_GROUP_IID,
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
    width: nodeSize * 30,
    height: nodeSize * 30,
    lerpX: 0.09,
    lerpY: 0.09,
  },
  relationTags: {},
  visualTags: []
}
