import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const experienceModel = new Schema(
  {
    metadata: {
      type: Object,
      required: true,
      default: {
        title: 'New Experience',
      }
    },
    roles: {
      type: Object,
      required: true,
      default: {}
    },
    canvasRooms: {
      type: Object,
      required: true,
      default: {}
    },
    gameRooms: {
      type: Object,
      required: true,
      default: {}
    },
    lobbys: {
      type: Object,
      required: true,
      default: {}
    },
    activitys: {
      type: Object,
      required: true,
      default: {}
    },
    instructions: {
      type: Object,
      required: true,
      default: {}
    },
    experienceModelShortId: {
      required: true,
      immuteable: true,
      type: String,
      unique: true,
      index: true,
    },
    isRemoved: Boolean,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

experienceModel.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    metadata: this.metadata,
    owner: this.owner?.toJSON(),
    activitys: this.activitys,
    gameRooms: this.gameRooms,
    instructions: this.instructions,
    canvasRooms: this.canvasRooms,
    lobbys: this.lobbys,
    roles: this.roles,
    isRemoved: this.isRemoved,
    experienceModelShortId: this.experienceModelShortId,
  };
};

const ExperienceModel = mongoose.model('ExperienceModel', experienceModel);

export default ExperienceModel;
