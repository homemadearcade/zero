import mongoose from 'mongoose';

const { Schema } = mongoose;

const texture = new Schema(
  {
    textureId: {
      type: String,
      required: true,
      unique: true,
    },
    textureType: {
      type: String,
      required: true,
    },
    strokeHistory: {
      type: Array,
      default: []
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    arcadeGame: { type: mongoose.Schema.Types.ObjectId, ref: 'ArcadeGame' },
    experience: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience' },
  },
  { timestamps: true },
);

texture.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    textureId: this.textureId,
    textureType: this.textureType,
    strokeHistory: this.strokeHistory,
    owner: this.owner?.toJSON(),
    arcadeGame: this.arcadeGame?.toJSON(),
    experience: this.experience?.toJSON(),
  };
};

const Texture = mongoose.model('Texture', texture);

export default Texture;
