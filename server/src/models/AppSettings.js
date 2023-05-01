import mongoose from 'mongoose';
const { Schema } = mongoose;

const appSettingsSchema = new Schema(
  {
    userEditorExperienceMongoId: {
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
    userEditorExperienceMongoId: this.userEditorExperienceMongoId,
    importedArcadeGameMongoIds: this.importedArcadeGameMongoIds,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const AppSettings = mongoose.model('AppSettings', appSettingsSchema);

export default AppSettings;
