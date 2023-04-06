import mongoose from 'mongoose';

const { Schema } = mongoose;

const effect = new Schema({
    dataSourceIID: {
      type: String,
    },
    effectBehavior: {
      type: String,
      default: null,
      required: true
    },
    effectId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    remoteEffectedRelationTagIds: {
      type: Array,
      default: [],
    },
    stageId: {
      type: String,
      default: null,
    },
    spawnEntityModelId: {
      type: String,
      default: null,
    },
    entityModelId: {
      type: String,
      default: null,
    },
    arcadeGameMongoId: {
      type: String,
      default: null,
    },
    zoneEntityModelId: {
      type: String,
      default: null
    },
    cutsceneId: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    customSelectorCategory: {
      type: String,
      default: null,
    },
    isReadOnly: {
      type: Boolean,
      default: false,
    },
    dataSourceIID: {
      type: String,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

effect.methods.toJSON = function () {
  return {
    id: this._id,
    dataSourceIID: this.dataSourceIID,
    effectBehavior: this.effectBehavior,
    effectId: this.effectId,
    remoteEffectedRelationTagIds: this.remoteEffectedRelationTagIds,
    stageId: this.stageId,
    spawnEntityModelId: this.spawnEntityModelId,
    entityModelId: this.entityModelId,
    arcadeGameMongoId: this.arcadeGameMongoId,
    zoneEntityModelId: this.zoneEntityModelId,
    cutsceneId: this.cutsceneId,
    text: this.text,
    customSelectorCategory: this.customSelectorCategory,
    dataSourceIID: this.dataSourceIID,
    isReadOnly: this.isReadOnly,
    isRemoved: this.isRemoved,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    owner: this.owner?.toJSON(),
  };
};

const Effect = mongoose.model('Effect', effect);

export default Effect;
