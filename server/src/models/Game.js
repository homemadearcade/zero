import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const gameSchema = new Schema(
  {
    objects: {
      type: [Object],
      required: true,
    },
    metadata: {
      type: Object,
      required: true,
      default: {}
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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export const validateGame = (game) => {
  // const schema = {
  //   // text: Joi.string().min(5).max(300).required(),
  // };
  // return Joi.validate(game, schema);

  return true
};

gameSchema.methods.toJSON = function () {
  return {
    id: this._id,
    metadata: this.metadata,
    objects: this.objects,
    hero: this.hero,
    classes: this.classes,
    world: this.world,
    user: this.user.toJSON(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Game = mongoose.model('Game', gameSchema);

export default Game;
