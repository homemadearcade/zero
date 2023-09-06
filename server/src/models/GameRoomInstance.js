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
    isOnlineMultiplayer: {
      type: Boolean,
      required: false,
      default: false
    },
    gameState: {
      type: Object,
    },
    gameInstanceIds: {
      type: Object, 
      required: false,
      default: {}
    },
    isEdit: {
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
    gameResetVersion: {
      type: Number,
      required: false,
      default: 1
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
    isOnlineMultiplayer: this.isOnlineMultiplayer,
    isAutosaveDisabled: this.isAutosaveDisabled,
    invitedUsers: this.invitedUsers ? this.invitedUsers.map((user) => {
      return user?.toJSON()
    }) : [],
    gameResetVersion: this.gameResetVersion,
    experienceInstanceId: this.experienceInstanceId,
    arcadeGameMongoId: this.arcadeGameMongoId,
    gameRoomInstanceId: this.gameRoomInstanceId,
    gameInstanceIds: this.gameInstanceIds,
    gameState: this.gameState,
  };
};

const GameRoomInstance = mongoose.model('GameRoomInstance', gameRoomInstanceSchema);

export default GameRoomInstance;
