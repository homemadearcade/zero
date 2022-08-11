"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _requireJwtAuth = _interopRequireDefault(require("../../middleware/requireJwtAuth"));

var _requireSocketAuth = _interopRequireDefault(require("../../middleware/requireSocketAuth"));

var _constants = require("../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
router.post('/:id', _requireJwtAuth.default, _requireSocketAuth.default, async (req, res) => {
  try {
    req.socket.join('codrawing@' + req.params.id);
    req.io.to('codrawing@' + req.params.id).emit(_constants.ON_CODRAWING_SUBSCRIBED, {
      userId: req.user.id,
      canvasId: req.params.id
    });
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong. ' + err
    });
  }
});
router.post('/stop/:id', _requireJwtAuth.default, _requireSocketAuth.default, async (req, res) => {
  try {
    req.socket.leave('codrawing@' + req.params.id);
    res.status(200).send();
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong. ' + err
    });
  }
});
router.put('/stroke/:id', _requireJwtAuth.default, _requireSocketAuth.default, async (req, res) => {
  try {
    req.io.to('codrawing@' + req.params.id).emit(_constants.ON_CODRAWING_STROKE, {
      userId: req.user.id,
      canvasId: req.params.id,
      brushId: req.body.brushId,
      stroke: req.body.stroke
    });
    res.status(200).send();
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong. ' + err
    });
  }
});
var _default = router;
exports.default = _default;
//# sourceMappingURL=codrawing.js.map