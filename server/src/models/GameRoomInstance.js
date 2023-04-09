import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const gameRoomInstanceSchema = new Schema(
  {
    gameRoomInstanceId: {
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
    arcadeGameMongoId: {
      type: String,
      required: false,
    },
    hostUserMongoId: {
      type: String,
      required: true,
    },
    experienceInstanceId: {
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
    hostUserMongoId: this.hostUserMongoId,
    isEdit: this.isEdit,
    isNetworked: this.isNetworked,
    isAutosaveDisabled: this.isAutosaveDisabled,
    invitedUsers: this.invitedUsers ? this.invitedUsers.map((user) => {
      return user?.toJSON()
    }) : [],
    experienceInstanceId: this.experienceInstanceId,
    arcadeGameMongoId: this.arcadeGameMongoId,
    gameRoomInstanceId: this.gameRoomInstanceId,
  };
};

const GameRoomInstance = mongoose.model('GameRoomInstance', gameRoomInstanceSchema);

export default GameRoomInstance;
