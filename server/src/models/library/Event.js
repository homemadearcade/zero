import mongoose from 'mongoose';

const { Schema } = mongoose;

const event = new Schema({
    dataSourceIID: {
      type: String,
    },
    eventType: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    relationTagIdA: {
      type: String,
      default: null,
    },
    relationTagIdB: {
      type: String,
      default: null,
    },
    sidesA: {
      type: Array,
      default: [],
    },
    sidesB: {
      type: Array,
      default: [],
    },
    onlyOnce: {
      type: Boolean,
      default: false,
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

event.methods.toJSON = function () {
  return {
    id: this._id,
    dataSourceIID: this.dataSourceIID,
    event: this.event,
    effects: this.effects,
    effectIds: this.effectIds,
    eventId: this.eventId,
    isReadOnly: this.isReadOnly,
    isRemoved: this.isRemoved,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    owner: this.owner?.toJSON(),
  };
};


const Event = mongoose.model('Event', event);

export default Event;
