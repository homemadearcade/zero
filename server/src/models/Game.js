import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const gameSchema = new Schema(
  {
    objects: {
      type: Object,
      required: true,
      default: {}
    },
    metadata: {
      type: Object,
      required: true,
      default: {
        title: 'Unknown',
      }
    },
    hero: {
      type: Object,
      required: true,
      default: {}
    },
    world: {
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
    awsImages: {
      type: Object,
      required: true,
      default: {}
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const validateGame = (game) => {
  //Joi.object().pattern(/^/, Joi.date().iso())
  const schema = {
    hero: Joi.object({
      // spawnX: Joi.number().required(),
      // spawnY: Joi.number().required()
    }),
    world: Joi.object({

    }),
    metadata: Joi.object({

    }),
    objects: Joi.object(),
    classes: Joi.object(),
    brushes: Joi.object(),
    colors: Joi.object(),
    awsImages: Joi.object(),
  };
  return Joi.validate(game, schema, { allowUnknown: true });
};

gameSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    metadata: this.metadata,
    objects: this.objects,
    hero: this.hero,
    classes: this.classes,
    brushes: this.brushes,
    colors: this.colors,
    world: this.world,
    awsImages: this.awsImages,
    user: this.user.toJSON(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Game = mongoose.model('Game', gameSchema);

export default Game;
