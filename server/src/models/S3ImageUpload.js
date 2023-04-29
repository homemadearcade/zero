import mongoose from 'mongoose';
const { Schema } = mongoose;

const s3ImageUploadSchema = new Schema(
  {
    data: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true },
);

s3ImageUploadSchema.methods.toJSON = function () {
  return {
    id: this._id,
    data: this.data,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const S3ImageUpload = mongoose.model('S3ImageUpload', s3ImageUploadSchema);

export default S3ImageUpload;
