// import { BACKGROUND_LAYER_CANVAS_ID } from "../constants";
import { DEFAULT_THEME_COLOR } from "../../../constants";
import { defaultZoneClass } from "./class";
import { nodeSize } from "./general";
import { directionalClass, directionalPlayerClassId, jumperClass, jumperPlayerClassId, vehicleClass, vehiclePlayerClassId } from "./players";
import { initialSpawnZoneClassId, initialStage, initialStageId } from "./stage";

export const defaultGameModel = {
  "metadata": {
    "title": "",
    "description": "",
    "authorPseudonym": "",
    "imageUrl": "",
    isArchived: false,
    isFeatured: false,
    isPublished: false,
    interfaceColor: DEFAULT_THEME_COLOR
  },
  "stages": {
     [initialStageId]: {
      ...initialStage
    }
  },
  "nodeSize": nodeSize,
  colors: {

  },
  defaults: {
    playerClass: '',
    boundaryRelation: '',
    uiThemeColor: ''
  },
  cutscenes: {

  },
  relations: {

  },
  tags: {},
  effects: {},
  events: {},
  "canvasImages": {
    // "url": "xxx",
    // "name": 'name'
    // "type": "layer"
  },
  "player": {
    "lives": 1,
    'startingStageId': initialStageId
  },
  "collisions": {

  },
  "entityClasses": {
    [vehiclePlayerClassId]: vehicleClass,
    [jumperPlayerClassId]: jumperClass,
    [directionalPlayerClassId]: directionalClass,
    [initialSpawnZoneClassId]: {
      name: 'Player Spawn Zone',
      ...defaultZoneClass,
      entityClassId: initialSpawnZoneClassId,
      graphics: {
        ...defaultZoneClass.graphics,
        textureTint: '#FFFFFF'
      }
    },
  },
  isRemoved: false
}