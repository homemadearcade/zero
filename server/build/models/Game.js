"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateGame = exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Schema
} = _mongoose.default;
const gameSchema = new Schema({
  objects: {
    type: Object,
    required: true,
    default: {}
  },
  metadata: {
    type: Object,
    required: true,
    default: {
      title: 'Unknown'
    }
  },
  hero: {
    type: Object,
    required: true,
    default: {
      spawnX: 0,
      spawnY: 0
    }
  },
  world: {
    type: Object,
    required: true,
    default: {}
  },
  classes: {
    type: Object,
    required: true,
    default: {}
  },
  brushes: {
    type: Object,
    required: true,
    default: {}
  },
  colors: {
    type: Object,
    required: true,
    default: {}
  },
  awsImages: {
    type: Object,
    required: true,
    default: {}
  },
  user: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const validateGame = game => {
  //Joi.object().pattern(/^/, Joi.date().iso())
  const schema = {
    hero: _joi.default.object({// spawnX: Joi.number().required(),
      // spawnY: Joi.number().required()
    }),
    world: _joi.default.object({}),
    metadata: _joi.default.object({}),
    objects: _joi.default.object(),
    classes: _joi.default.object(),
    brushes: _joi.default.object(),
    colors: _joi.default.object(),
    awsImages: _joi.default.object()
  };
  return _joi.default.validate(game, schema, {
    allowUnknown: true
  });
};

exports.validateGame = validateGame;

gameSchema.methods.toJSON = function () {
  return {
    id: this._id.toString(),
    metadata: this.metadata,
    objects: this.objects,
    hero: this.hero,
    classes: this.classes,
    brushes: this.brushes,
    colors: this.colors,
    world: this.world,
    awsImages: this.awsImages,
    user: this.user.toJSON(),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

const Game = _mongoose.default.model('Game', gameSchema);

var _default = Game;
exports.default = _default;
//# sourceMappingURL=Game.js.map