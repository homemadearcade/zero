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
    isAutosaveDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    gameId: {
      type: String,
      required: false,
    },
    hostUserId: {
      type: String,
      required: true,
    },
    invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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
  //   entityInstance: Joi.object(),
  //   entityClasses: Joi.object(),
  //   brushes: Joi.object(),
  //   textures: Joi.object(),
  // };
  // return Joi.validate(game, schema, { allowUnknown: true });
};

gameRoomSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    hostUserId: this.hostUserId,
    isEdit: this.isEdit,
    isNetworked: this.isNetworked,
    isAutosaveDisabled: this.isAutosaveDisabled,
    invitedUsers: this.invitedUsers ? this.invitedUsers.map((user) => {
      return user?.toJSON()
    }) : [],
    gameId: this.gameId
  };
};

const GameRoom = mongoose.model('GameRoom', gameRoomSchema);

export default GameRoom;
