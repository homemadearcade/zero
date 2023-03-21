import mongoose from 'mongoose';

const { Schema } = mongoose;

const interfacePreset = new Schema(
  {
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
    isRemoved: Boolean,
  },
  { timestamps: true },
);

interfacePreset.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    description: this.description,
    interfaceIds: this.interfaceIds,
    name: this.name,
    isRemoved: this.isRemoved
  };
};

const InterfacePreset = mongoose.model('InterfacePreset', interfacePreset);

export default InterfacePreset;
