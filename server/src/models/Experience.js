import mongoose from 'mongoose';
import Joi from 'joi';

const { Schema } = mongoose;

const experience = new Schema(
  {
    metadata: {
      type: Object,
      required: true,
      default: {
        title: 'New Experience',
      }
    },
    isRemoved: Boolean,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

experience.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    metadata: this.metadata,
    owner: this.owner?.toJSON(),
    isRemoved: this.isRemoved,
  };
};

const Experience = mongoose.model('Experience', experience);

export default Experience;
