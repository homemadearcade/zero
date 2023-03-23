import mongoose from 'mongoose';

const { Schema } = mongoose;

const canvasImage = new Schema(
  {
    visualTags: {
      type: Array,
      default: [],
      required: true,
    },
    textureId: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl : {
      type: String,
      required: true,
      unique: true,
    },
    imageType: {
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

canvasImage.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    textureId: this.textureId,
    imageType: this.imageType,
    strokeHistory: this.strokeHistory,
    visualTags: this.visualTags,
    owner: this.owner?.toJSON(),
    arcadeGame: this.arcadeGame?.toJSON(),
    experience: this.experience?.toJSON(),
  };
};

const CanvasImage = mongoose.model('CanvasImage', canvasImage);

export default CanvasImage;
