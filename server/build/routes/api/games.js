"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _requireJwtAuth = _interopRequireDefault(require("../../middleware/requireJwtAuth"));

var _requireSocketAuth = _interopRequireDefault(require("../../middleware/requireSocketAuth"));

var _Game = _interopRequireWildcard(require("../../models/Game"));

var _utils = require("../../utils/utils");

var _constants = require("../../constants");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
router.get('/', async (req, res) => {
  try {
    const games = await _Game.default.find().sort({
      createdAt: 'desc'
    }).select('user createdAt updatedAt metadata').populate('user');
    res.json({
      games: games.map(m => {
        return m.toJSON();
      })
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Something went wrong.'
    });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const game = await _Game.default.findById(req.params.id).populate('user');
    if (!game) return res.status(404).json({
      message: 'No game found.'
    });
    res.json({
      game: game.toJSON()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Something went wrong.'
    });
  }
});
router.post('/', _requireJwtAuth.default, async (req, res) => {
  const {
    error
  } = (0, _Game.validateGame)(req.body);
  if (error) return res.status(400).json({
    message: error.details[0].message
  });

  if (!(req.body.userId === req.user.id || req.user.role === 'ADMIN')) {
    return res.status(400).json({
      message: 'Not created by the game owner or admin.'
    });
  }

  try {
    let game = await _Game.default.create({
      objects: req.body.objects,
      metadata: req.body.metadata,
      hero: req.body.hero,
      classes: req.body.classes,
      brushes: req.body.brushes,
      colors: req.body.colors,
      awsImages: req.body.awsImages,
      world: req.body.world,
      user: req.body.userId
    });
    game = await game.populate('user').execPopulate();
    res.status(200).json({
      game: game.toJSON()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Something went wrong.'
    });
  }
}); // router.delete('/:id', requireJwtAuth, async (req, res) => {
//   try {
//     const tempGame = await Game.findById(req.params.id).populate('user');
//     if (!(tempGame.user.id === req.user.id || req.user.role === 'ADMIN'))
//       return res.status(400).json({ game: 'Not the game owner or admin.' });
//     const game = await Game.findByIdAndRemove(req.params.id).populate('user');
//     if (!game) return res.status(404).json({ game: 'No game found.' });
//     res.status(200).json({ game });
//   } catch (err) {
// console.error(err)
//     res.status(500).json({ game: 'Something went wrong.' });
//   }
// });

router.put('/:id', _requireJwtAuth.default, _requireSocketAuth.default, async (req, res) => {
  try {
    const tempGame = await _Game.default.findById(req.params.id).populate('user');
    if (!tempGame) return res.status(404).json({
      message: 'No game found.'
    });
    if (!(tempGame.user.id === req.user.id || req.user.role === 'ADMIN')) return res.status(400).json({
      message: 'Not updated by the game owner or admin.'
    });
    const updatedGame = (0, _utils.mergeDeep)(tempGame, req.body.gameUpdate);
    Object.keys(updatedGame.objects).forEach(key => {
      if (updatedGame.objects[key] === null || updatedGame.objects[key] === undefined) {
        console.log('deleting object', key);
        delete updatedGame.objects[key];
      }
    });
    Object.keys(updatedGame.classes).forEach(key => {
      if (updatedGame.classes[key] === null || updatedGame.classes[key] === undefined) {
        console.log('deleting class', key);
        delete updatedGame.classes[key];
      }
    });
    const {
      error
    } = (0, _Game.validateGame)(updatedGame);
    if (error) return res.status(400).json({
      message: error.details[0].message
    });
    await _Game.default.findByIdAndUpdate(req.params.id, {
      objects: updatedGame.objects,
      metadata: updatedGame.metadata,
      hero: updatedGame.hero,
      classes: updatedGame.classes,
      brushes: updatedGame.brushes,
      colors: updatedGame.colors,
      awsImages: updatedGame.awsImages,
      world: updatedGame.world,
      user: tempGame.user.id
    }, {
      new: true
    });

    if (req.body.lobbyId) {
      req.io.to(req.body.lobbyId).emit(_constants.ON_GAME_MODEL_UPDATE, req.body.gameUpdate);
    } else {
      //local edit mode
      req.socket.emit(_constants.ON_GAME_MODEL_UPDATE, req.body.gameUpdate);
    }

    res.status(200).json({
      game: updatedGame
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Something went wrong.'
    });
  }
});
var _default = router;
exports.default = _default;
//# sourceMappingURL=games.js.map