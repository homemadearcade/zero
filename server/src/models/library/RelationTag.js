import mongoose from 'mongoose';

const { Schema } = mongoose;

const relationTag = new Schema({
    dataSourceIID: {
      type: String,
    },
    relationTagIID: {
      type: String,
      required: true,
    },
    relationTagId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    textureTint: {
      type: String,
    },
    textureId: {
      type: String,
    },
    editorInterface: {
      type: Object,
      default: {},
    },
    isReadOnly: {
      type: Boolean,
      default: false,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

relationTag.methods.toJSON = function () {
  return {
    id: this._id,
    dataSourceIID: this.dataSourceIID,
    relationTagIID: this.relationTagIID,
    relationTagId: this.relationTagId,
    name: this.name,
    textureTint: this.textureTint,
    textureId: this.textureId,
    editorInterface: this.editorInterface,
    isReadOnly: this.isReadOnly,
    isRemoved: this.isRemoved,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    owner: this.owner?.toJSON(),
  };
};


const RelationTag = mongoose.model('RelationTag', relationTag);

export default RelationTag;
