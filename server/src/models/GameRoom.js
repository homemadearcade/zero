import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const gameRoomSchema = new Schema(
  {
    isNetworked: {
      type: Boolean,
      required: false,
      default: false
    },
    isEdit: {
      type: Boolean,
      required: false,
      default: false
    },
    isSaveDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    gameId: {
      type: String,
      required: true,
    },
    hostUserId: {
      type: String,
      required: true,
    },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
);

export const validateLobby = (lobby) => {

  return true
  //Joi.object().pattern(/^/, Joi.date().iso())
  // const schema = {
  //   player: Joi.object({
  //     // spawnX: Joi.number().required(),
  //     // spawnY: Joi.number().required()
  //   }),
  //   world: Joi.object({

  //   }),
  //   metadata: Joi.object({

  //   }),
  //   objects: Joi.object(),
  //   classes: Joi.object(),
  //   brushes: Joi.object(),
  //   awsImages: Joi.object(),
  // };
  // return Joi.validate(game, schema, { allowUnknown: true });
};

gameRoomSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    hostUserId: this.hostUserId,
    isEdit: this.isEdit,
    isNetworked: this.isNetworked,
    isSaveDisabled: this.isSaveDisabled,
    players: this.players ? this.players.map((user) => {
      return user?.toJSON()
    }) : [],
    gameId: this.gameId
  };
};

const GameRoom = mongoose.model('GameRoom', gameRoomSchema);

export default GameRoom;
