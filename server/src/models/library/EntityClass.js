import mongoose from 'mongoose';

const { Schema } = mongoose;

const entityClass = new Schema({
    dataSource: {
      type: String,
    },
    boundaryRelation: {
      type: String,
    },
    classInterfaceCategory: {
      type: String,
    },
    name: {
      type: String,
      required: true
    },
    entityClassId: {
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

entityClass.methods.toJSON = function () {
  return {
    id: this._id,
    name: this.name,  
    boundaryRelation: this.boundaryRelation,
    entityClassId: this.entityClassId,
    dataSource: this.dataSource,
    classInterfaceCategory: this.classInterfaceCategory,
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
    isLocked: this.isLocked,
    isRemoved: this.isRemoved,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    owner: this.owner?.toJSON(),
  };
};


const EntityClass = mongoose.model('EntityClass', entityClass);

export default EntityClass;
