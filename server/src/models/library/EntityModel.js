import mongoose from 'mongoose';

const { Schema } = mongoose;

const entityModel = new Schema({
    dataSourceIID: {
      type: String,
    },
    boundaryRelation: {
      type: String,
    },
    entityIID: {
      type: String,
    },
    name: {
      type: String,
      required: true
    },
    entityModelId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    movement: {
      type: Object,
      default: {}
    },
    collisionResponse: {
      type: Object,
      default: {}
    },
    jump: {
      type: Object,
      default: {}
    },
    graphics: {
      type: Object,
      default: {}
    },
    editorInterface: {
      type: Object,
      default: {}
    },
    autogeneration: {
      type: Object,
      default: {}
    },
    projectile: {
      type: Object,
      default: {}
    },
    camera: {
      type: Object,
      default: {}
    },
    relationTags: {
      type: Object,
      required: true,
      default: {}
    },
    visualTags: {
      type: Array,
      default: [],
      required: true,
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

entityModel.methods.toJSON = function () {
  return {
    entityModelMongoId: this._id,
    name: this.name,  
    boundaryRelation: this.boundaryRelation,
    entityModelId: this.entityModelId,
    dataSourceIID: this.dataSourceIID,
    entityIID: this.entityIID,
    movement: this.movement,
    collisionResponse: this.collisionResponse,
    jump: this.jump,
    graphics: this.graphics,
    editorInterface: this.editorInterface,
    autogeneration: this.autogeneration,
    projectile: this.projectile,
    camera: this.camera,
    relationTags: this.relationTags,
    visualTags: this.visualTags,
    isReadOnly: this.isReadOnly,
    isRemoved: this.isRemoved,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    owner: this.owner?.toJSON(),
  };
};


const EntityModel = mongoose.model('EntityModel', entityModel);

export default EntityModel;
