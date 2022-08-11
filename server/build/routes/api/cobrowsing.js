"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _requireJwtAuth = _interopRequireDefault(require("../../middleware/requireJwtAuth"));

var _requireSocketAuth = _interopRequireDefault(require("../../middleware/requireSocketAuth"));

var _User = _interopRequireDefault(require("../../models/User"));

var _constants = require("../../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
router.post('/:id', _requireJwtAuth.default, _requireSocketAuth.default, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(400).json({
        message: 'You do not have privileges to register cobrowse.'
      });
    }

    req.socket.join('cobrowsing@' + req.params.id);
    const socketSession = req.app.get('socketSessions').findSession(req.params.id);

    if (socketSession) {
      socketSession.emit(_constants.ON_COBROWSING_SUBSCRIBED);
    }

    const user = await _User.default.findById(req.params.id);
    res.status(200).json({
      cobrowsingUser: user
    });
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong. ' + err
    });
  }
});
router.post('/stop/:id', _requireJwtAuth.default, _requireSocketAuth.default, async (req, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(400).json({
        message: 'You do not have privileges to unregister this cobrowse.'
      });
    }

    req.socket.leave('cobrowsing@' + req.params.id);
    res.status(200).send();
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong. ' + err
    });
  }
});
router.put('/:id', _requireJwtAuth.default, _requireSocketAuth.default, async (req, res) => {
  try {
    if (!(req.params.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({
        message: 'You do not have privileges to update this users cobrowse state.'
      });
    }

    req.io.to('cobrowsing@' + req.params.id).emit(_constants.ON_COBROWSING_UPDATE, {
      userId: req.params.id,
      remoteState: req.body.remoteState
    });
    res.status(200).send();
  } catch (err) {
    res.status(500).json({
      message: 'Something went wrong. ' + err
    });
  }
});
router.put('/dispatch/:id', _requireJwtAuth.default, _requireSocketAuth.default, async (req, res) => {
  try {
    if (!(req.params.id === req.user.id || req.user.role === 'ADMIN')) {
      return res.status(400).json({
        message: 'You do not have privileges to update this users cobrowse state.'
      });
    }

    const socketSession = req.app.get('socketSessions').findSession(req.params.id);
    socketSession.emit(_constants.ON_COBROWSING_REMOTE_DISPATCH, {
      dispatchData: req.body.dispatchData
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
//# sourceMappingURL=cobrowsing.js.map