// import { BACKGROUND_CANVAS_ID } from "../constants";
import { defaultZoneClass } from "./class";
import { nodeSize } from "./general";
import { directionalClass, jumperClass, vehicleClass } from "./players";
import { initialStage } from "./stage";

export const defaultGameModel = {
  "metadata": {
    "title": "",
    "description": "",
    "authorPseudonym": "",
    "imageUrl": "",
    isArchival: false,
    isFeatured: false,
    isPublished: false
  },
  "stages": {
    'stage-default': {
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
  "awsImages": {
    // "url": "xxx",
    // "name": 'name'
    // "type": "layer"
  },
  "player": {
    "lives": 1,
    'initialStageId': 'stage-default'
  },
  "classes": {
    "oc-pl-vehicle": vehicleClass,
    "oc-pl-jumper": jumperClass,
    "oc-pl-directional": directionalClass,
    'oc-z-playerspawnzone': {
      name: 'Player Spawn Zone',
      ...defaultZoneClass,
      classId: 'oc-z-playerspawnzone',
      graphics: {
        ...defaultZoneClass.graphics,
        tint: '#FFFFFF'
      }
    },
    // LEGACY this is in here for legacy...
    'oc/z/playerspawnzone': {
      name: 'Legacy Player Spawn Zone',
      ...defaultZoneClass,
      classId: 'oc-z-playerspawnzone',
      graphics: {
        ...defaultZoneClass.graphics,
        tint: '#FFFFFF'
      },
      isRemoved: true
    }
  },
  isRemoved: false
}