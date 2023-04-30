import mongoose from 'mongoose';

const { Schema } = mongoose;

const canvasImage = new Schema(
  {
    visualTags: {
      type: Array,
      default: [],
      required: true,
    },
    imageData: {
      type: Object,
      required: true,
    },
    textureId: {
      type: String,
      required: true,
      unique: true,
      index: true,
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
    appLocation: {
      type: Object,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

canvasImage.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    textureId: this.textureId,
    imageType: this.imageType,
    strokeHistory: this.strokeHistory,
    appLocation: this.appLocation,
    visualTags: this.visualTags,
    owner: this.owner?.toJSON(),
  };
};

const CanvasImage = mongoose.model('CanvasImage', canvasImage);

export default CanvasImage;
