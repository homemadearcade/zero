import mongoose from 'mongoose';

const { Schema } = mongoose;

const relation = new Schema({
    dataSource: {
      type: String,
    },
    event: {
      type: Object,
      default: {},
      required: true
    },
    effects: {
      type: Object,
      default: {},
      required: true
    },
    effectIds: {
      type: Array,
      default: [],
      required: true
    },
    relationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
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

relation.methods.toJSON = function () {
  return {
    id: this._id,
    dataSource: this.dataSource,
    event: this.event,
    effects: this.effects,
    effectIds: this.effectIds,
    relationId: this.relationId,
    isLocked: this.isLocked,
    isRemoved: this.isRemoved,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    owner: this.owner?.toJSON(),
  };
};


const Relation = mongoose.model('Relation', relation);

export default Relation;
