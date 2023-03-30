import mongoose from 'mongoose';

const { Schema } = mongoose;

const effect = new Schema({
    dataSource: {
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
    spawnEntityClassId: {
      type: String,
      default: null,
    },
    entityClassId: {
      type: String,
      default: null,
    },
    arcadeGameMongoId: {
      type: String,
      default: null,
    },
    zoneEntityClassId: {
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

effect.methods.toJSON = function () {
  return {
    id: this._id,
    dataSource: this.dataSource,
    effectBehavior: this.effectBehavior,
    effectId: this.effectId,
    remoteEffectedRelationTagIds: this.remoteEffectedRelationTagIds,
    stageId: this.stageId,
    spawnEntityClassId: this.spawnEntityClassId,
    entityClassId: this.entityClassId,
    arcadeGameMongoId: this.arcadeGameMongoId,
    zoneEntityClassId: this.zoneEntityClassId,
    cutsceneId: this.cutsceneId,
    text: this.text,
    customSelectorCategory: this.customSelectorCategory,
    isLocked: this.isLocked,
    isRemoved: this.isRemoved,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    owner: this.owner?.toJSON(),
  };
};

const Effect = mongoose.model('Effect', effect);

export default Effect;
