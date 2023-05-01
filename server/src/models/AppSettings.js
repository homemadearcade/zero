import mongoose from 'mongoose';
const { Schema } = mongoose;

const appSettingsSchema = new Schema(
  {
    editorExperienceModelMongoId: {
      type: String,
    },
    importedArcadeGameMongoIds: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true },
);

appSettingsSchema.methods.toJSON = function () {
  return {
    id: this._id,
    editorExperienceModelMongoId: this.editorExperienceModelMongoId,
    importedArcadeGameMongoIds: this.importedArcadeGameMongoIds,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const AppSettings = mongoose.model('AppSettings', appSettingsSchema);

export default AppSettings;
