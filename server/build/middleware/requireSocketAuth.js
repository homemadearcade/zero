"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function requireSocketAuth(req, res, next) {
  const socketSessions = req.app.get('socketSessions');
  const socket = socketSessions.findSession(req.user.id);
  req.socket = socket;
  req.io = req.app.get('socketio');
  next();
}

var _default = requireSocketAuth;
exports.default = _default;
//# sourceMappingURL=requireSocketAuth.js.map