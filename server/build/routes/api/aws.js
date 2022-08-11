"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _aws = _interopRequireDefault(require("../../services/aws"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
router.get('/generate-put-url', (req, res) => {
  // Both Key and ContentType are defined in the client side.
  // Key refers to the remote name of the file.
  // ContentType refers to the MIME content type, in this case image/jpeg
  const {
    Key,
    ContentType
  } = req.query; // console.log(Key, ContentType)

  _aws.default.generatePutUrl(Key, ContentType).then(url => {
    res.send({
      url
    });
  }).catch(err => {
    res.send(err);
  });
});
var _default = router;
exports.default = _default;
//# sourceMappingURL=aws.js.map