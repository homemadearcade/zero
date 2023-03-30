import mongoose from 'mongoose';

const { Schema } = mongoose;

const interfacePreset = new Schema(
  {
    dataSource: {
      type: String,
      required: true
    },
    interfacePresetId: {
      immuteable: true,
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: 'New Interface'
    },
    description: {
      type: String,
    },
    interfaceIds: {
      type: Object,
      default: {}
    },
    isLocked: Boolean,
    isRemoved: Boolean,
  },
  { timestamps: true },
);

interfacePreset.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    dataSource: this.dataSource,
    description: this.description,
    interfaceIds: this.interfaceIds,
    name: this.name,
    isRemoved: this.isRemoved,
    isLocked: this.isLocked,
    interfacePresetId: this.interfacePresetId,
  };
};

const InterfacePreset = mongoose.model('InterfacePreset', interfacePreset);

export default InterfacePreset;
