import mongoose from 'mongoose';

const { Schema } = mongoose;

// prompt = {
// promptId,
// text,
// style, 
// suffix
// prefix
// textureId
// visualTags?
// }
const dallESession = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    prompts: {
      type: Object,
      required: true,
      default: {}
    },
    textureIds: {
      type: Object,
      required: true,
      default: {}
    },
    currentPromptId: {
      type: String,
    },
    dallESessionId: {
      immuteable: true,
      type: String,
      unique: true,
      index: true,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

dallESession.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    owner: this.owner?.toJSON(),
  };
};

const DallESession = mongoose.model('DallESession', dallEImageSession);

export default DallESession;
