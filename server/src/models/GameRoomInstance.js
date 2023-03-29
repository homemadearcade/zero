import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const gameRoomInstanceSchema = new Schema(
  {
    gameRoomInstanceShortId: {
      immuteable: true,
      type: String,
      unique: true,
      index: true,
    },
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


gameRoomInstanceSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    hostUserId: this.hostUserId,
    isEdit: this.isEdit,
    isNetworked: this.isNetworked,
    isAutosaveDisabled: this.isAutosaveDisabled,
    invitedUsers: this.invitedUsers ? this.invitedUsers.map((user) => {
      return user?.toJSON()
    }) : [],
    gameId: this.gameId,
    gameRoomInstanceShortId: this.gameRoomInstanceShortId,
  };
};

const GameRoomInstance = mongoose.model('GameRoomInstance', gameRoomInstanceSchema);

export default GameRoomInstance;
