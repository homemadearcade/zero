import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const lobbySchema = new Schema(
  {
    invitedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    participantId: {
      type: String,
      // required: true,
    },
    guideId: {
      type: String,
      // required: true,
    },
    gameRoomId: {
      type: String
    },
    editingGameId: {
      type: String
    },
    experienceInstanceId: {
      type: String,
      required: true,
    },
    experienceModel: { type: mongoose.Schema.Types.ObjectId, ref: 'ExperienceModel' },
    activitys: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
    // guideId: {
    //   type: String,
    //   required: true,
    // },
    startTime: {
      type: String,
      // required: true,
    },
    lobbyShortId: {
      immuteable: true,
      type: String,
      unique: true,
      required: true,
    },
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

lobbySchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    startTime: this.startTime,
    invitedUsers: this.invitedUsers ? this.invitedUsers.map((user) => {
      return user?.toJSON()
    }) : [],
    activitys: this.activitys ? this.activitys.map((activity) => {
      return activity?.toJSON()
    }) : [],
    editingGameId: this.editingGameId,
    participantId: this.participantId,
    experienceModel: this.experienceModel?.toJSON(),
    gameRoomId: this.gameRoomId,
    lobbyShortId: this.lobbyShortId,
    // guideId: this.guideId
  };
};

const Lobby = mongoose.model('Lobby', lobbySchema);

export default Lobby;
