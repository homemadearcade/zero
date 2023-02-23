import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const arcadeGameSchema = new Schema(
  {
    stages: {
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

     defaults: {
      type: Object,
      required: true,
      default: {}
    },

    // THESE ARE GLOBAL, perhaps player -> initialScene
    player: {
      type: Object,
      required: true,
      default: {}
    },
    classes: {
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
    relations: {
      type: Object,
      required: true,
      default: {}
    },
    awsImages: {
      type: Object,
      required: true,
      default: {}
    },
    tags: {
      type: Object,
      required: true,
      default: {}
    },
    isRemoved: {
      required: false,
      default: false,
      type: Boolean,
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
    defaults: Joi.object({

    }),
    nodeSize: Joi.number(),
    stages: Joi.object(),
    classes: Joi.object(),
    brushes: Joi.object(),
    colors: Joi.object(),
    relations: Joi.object(),
    cutscenes: Joi.object(),
    awsImages: Joi.object(),
    isRemoved: Joi.bool(),
  };
  return Joi.validate(game, schema, { allowUnknown: true });
};

arcadeGameSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    metadata: this.metadata,
    defaults: this.defaults,
    stages: this.stages,
    nodeSize: this.nodeSize,
    player: this.player,
    classes: this.classes,
    brushes: this.brushes,
    colors: this.colors,
    relations: this.relations,
    cutscenes: this.cutscenes,
    awsImages: this.awsImages,
    owner: this.owner?.toJSON(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    isRemoved: this.isRemoved,
  };
};

const ArcadeGame = mongoose.model('ArcadeGame', arcadeGameSchema);

export default ArcadeGame;
