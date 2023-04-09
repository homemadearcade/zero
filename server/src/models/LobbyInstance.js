import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const lobbyInstanceSchema = new Schema(
  {
    cobrowsingUserMongoId: {
      type: String,
    },
    invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    experienceInstanceId: {
      type: String,
      required: true,
    },
    instructions: {
      type: Object,
      default: {},
      required: true,
    },
    roles: {
      type: Object,
      required: true,
      default: {}
    },
    roleIdToUserMongoIds: {
      type: Object,
      required: true,
      default: {}
    },
    hostUserMongoId: {
      type: 'String',
      required: true,
    },
    activitys: {
      type: Object,
      required: true,
      default: {}
    },
    currentActivityId: {
      type: String,
    },
    instructionsByRoleId: {
      type: Object,
      required: true,
      default: {}
    },
    instructionCurrentSteps: {
      type: Object,
      required: true,
      default: {}
    },
    gameRoomInstances: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GameRoomInstance'  }],
    experienceModel: { type: mongoose.Schema.Types.ObjectId, ref: 'ExperienceModel' },
    startTime: {
      type: String,
      // required: true,
    },
    lobbyInstanceId: {
      immuteable: true,
      type: String,
      unique: true,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export const validateLobbyInstance = (lobby) => {

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
  //   entityModels: Joi.object(),
  //   brushes: Joi.object(),
  //   textures: Joi.object(),
  // };
  // return Joi.validate(game, schema, { allowUnknown: true });
};

lobbyInstanceSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    startTime: this.startTime,
    invitedUsers: this.invitedUsers ? this.invitedUsers.map((user) => {
      return user?.toJSON()
    }) : [],
    gameRoomInstances: this.gameRoomInstances ? this.gameRoomInstances.map((gameRoomInstance) => {
      return gameRoomInstance?.toJSON()
    }) : [],
    activitys: this.activitys,
    currentActivityId: this.currentActivityId,
    cobrowsingUserMongoId: this.cobrowsingUserMongoId,
    roleIdToUserMongoIds: this.roleIdToUserMongoIds,
    roles: this.roles,
    hostUserMongoId: this.hostUserMongoId,
    instructions: this.instructions,
    instructionsByRoleId: this.instructionsByRoleId,
    instructionCurrentSteps: this.instructionCurrentSteps,
    experienceInstanceId: this.experienceInstanceId,
    experienceModel: this.experienceModel?.toJSON(),
    lobbyInstanceId: this.lobbyInstanceId,
    // guideId: this.guideId
  };
};

const LobbyInstance = mongoose.model('LobbyInstance', lobbyInstanceSchema);

export default LobbyInstance;
