import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const arcadeGameSchema = new Schema(
  {
    version: { 
      type: String,
      default: '0.0.1',
    },
    stages: {
      type: Object,
      required: true,
      default: {}
    },
    layers: {
      type: Object,
      required: true,
      default: {}
    },
    metadata: {
      type: Object,
      required: true,
      default: {
        title: 'New Game',
      }
    },
    playScope: {
      type: String,
    },
    editScope: {
      type: String,
    },
    size: {
      type: Object,
      default : {}
    },
    theme: {
      type: Object,
      required: true,
      default: {}
    },  
    player: {
      type: Object,
      required: true,
      default: {}
    },
    entityModels: {
      type: Object,
      required: true,
      default: {}
    },
    brushes: {
      type: Object,
      required: true,
      default: {}
    },
    colors: {
      type: Object,
      required: true,
      default: {}
    },
    cutscenes: {
      type: Object,
      required: true,
      default: {}
    },
    interfacePresets: {
      type: Object,
      required: true,
      default: {}
    },
    collisions: {
      type: Object,
      required: true,
      default: {}
    },
    relations: {
      type: Object,
      required: true,
      default: {}
    },
    events: {
      type: Object,
      required: true,
      default: {}
    },
    effects: {
      type: Object,
      required: true,
      default: {}
    },
    importedArcadeGames : [{
      type: mongoose.Schema.Types.ObjectId, ref: 'ArcadeGame',
      default: []
    }],
    relationTags: {
      type: Object,
      required: true,
      default: {}
    },
    textures: {
      type: Object,
      required: true,
      default: {}
    },
    isRemoved: {
      required: false,
      default: false,
      type: Boolean,
    },
    gameModelId: {
      required: true,
      immuteable: true,
      type: String,
      unique: true,
      index: true,
    },
    appLocation: {
      type: Object,
      default: {}
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const validateArcadeGame = (game) => {
  //Joi.object().pattern(/^/, Joi.date().iso())
  const schema = {
    player: Joi.object({
      // spawnX: Joi.number().required(),
      // spawnY: Joi.number().required()
    }),
    metadata: Joi.object({

    }),
    gameModelId: Joi.string(),
    size: Joi.object(),
    stages: Joi.object(),
    layers: Joi.object(),
    entityModels: Joi.object(),
    brushes: Joi.object(),
    colors: Joi.object(),
    relations: Joi.object(),
    importedArcadeGames: Joi.array(),
    collisions: Joi.object(),
    interfacePresets: Joi.object(),
    events: Joi.object(),
    effects: Joi.object(),
    cutscenes: Joi.object(),
    textures: Joi.object(),
    isRemoved: Joi.bool(),
    relationTags: Joi.object(),
    version: Joi.string(),
    // playScope: Joi.string(),
    // editScope: Joi.string(),
  };
  return Joi.validate(game, schema, { allowUnknown: true });
};

arcadeGameSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    metadata: this.metadata,
    stages: this.stages,
    layers: this.layers,
    size: this.size,
    player: this.player,
    entityModels: this.entityModels,
    brushes: this.brushes,
    colors: this.colors,
    importedArcadeGames: this.importedArcadeGames?.map((arcadeGame) => {
      return arcadeGame?.toJSON()
    }).filter((arcadeGame) => !!arcadeGame),
    relations: this.relations,
    collisions: this.collisions,
    interfacePresets: this.interfacePresets,
    events: this.events,
    effects: this.effects,
    cutscenes: this.cutscenes,
    textures: this.textures,
    owner: this.owner?.toJSON(),
    gameModelId: this.gameModelId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isRemoved: this.isRemoved,
    theme: this.theme,
    relationTags: this.relationTags ? this.relationTags : {},
    version: this.version,
    playScope: this.playScope,
    editScope: this.editScope,
    appLocation: this.appLocation,
  };
};

const ArcadeGame = mongoose.model('ArcadeGame', arcadeGameSchema);

export default ArcadeGame;
