import mongoose from 'mongoose';

const { Schema } = mongoose;

const relationTag = new Schema({
    dataSource: {
      type: String,
    },
    relationTagInterfaceType: {
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
    isSelectorObscured: {
      type: Boolean,
      default: false,
    },
    isLocked: {
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
    dataSource: this.dataSource,
    relationTagInterfaceType: this.relationTagInterfaceType,
    relationTagId: this.relationTagId,
    name: this.name,
    textureTint: this.textureTint,
    textureId: this.textureId,
    isSelectorObscured: this.isSelectorObscured,
    isLocked: this.isLocked,
    isRemoved: this.isRemoved,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    owner: this.owner?.toJSON(),
  };
};


const RelationTag = mongoose.model('RelationTag', relationTag);

export default RelationTag;
