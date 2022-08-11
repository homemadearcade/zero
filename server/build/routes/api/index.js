"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _users = _interopRequireDefault(require("./users"));

var _messages = _interopRequireDefault(require("./messages"));

var _cobrowsing = _interopRequireDefault(require("./cobrowsing"));

var _lobbys = _interopRequireDefault(require("./lobbys"));

var _games = _interopRequireDefault(require("./games"));

var _aws = _interopRequireDefault(require("./aws"));

var _codrawing = _interopRequireDefault(require("./codrawing"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
router.use('/users', _users.default);
router.use('/messages', _messages.default);
router.use('/lobbys', _lobbys.default);
router.use('/cobrowsing', _cobrowsing.default);
router.use('/codrawing', _codrawing.default);
router.use('/games', _games.default);
router.use('/aws', _aws.default);
'routes register', router.stack.map(router => {
  // console.log(router.regexp)
  return router.handle.stack.map(route => {// console.log(route.route.path)
  });
});
var _default = router;
exports.default = _default;
//# sourceMappingURL=index.js.map