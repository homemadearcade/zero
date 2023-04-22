import mongoose from 'mongoose';

const { Schema } = mongoose;

const interfacePreset = new Schema(
  {
    dataSourceIID: {
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
    unlockedInterfaceIds: {
      type: Object,
      default: {}
    },
    isReadOnly: Boolean,
    isRemoved: Boolean,
  },
  { timestamps: true },
);

interfacePreset.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    dataSourceIID: this.dataSourceIID,
    description: this.description,
    unlockedInterfaceIds: this.unlockedInterfaceIds,
    name: this.name,
    isRemoved: this.isRemoved,
    isReadOnly: this.isReadOnly,
    interfacePresetId: this.interfacePresetId,
  };
};

const InterfacePreset = mongoose.model('InterfacePreset', interfacePreset);

export default InterfacePreset;
