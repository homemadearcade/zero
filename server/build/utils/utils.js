"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteAllAvatars = void 0;
exports.isObject = isObject;
exports.isValidUrl = void 0;
exports.mergeDeep = mergeDeep;

var _fs = _interopRequireDefault(require("fs"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readdir = (0, _util.promisify)(_fs.default.readdir);
const unlink = (0, _util.promisify)(_fs.default.unlink);

const deleteAllAvatars = async absoluteFolderPath => {
  try {
    const files = await readdir(absoluteFolderPath);
    const unlinkPromises = files.map(filename => {
      if (!['avatar0.jpg', 'avatar1.jpg', 'avatar2.jpg'].includes(filename)) {
        console.log('Deleting avatar: ', filename);
        unlink(`${absoluteFolderPath}/${filename}`);
      }
    });
    return Promise.all(unlinkPromises);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteAllAvatars = deleteAllAvatars;

const isValidUrl = str => {
  var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  var url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
};
/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */


exports.isValidUrl = isValidUrl;

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}
/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */


function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, {
          [key]: {}
        });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {
          [key]: source[key]
        });
      }
    }
  }

  return mergeDeep(target, ...sources);
}
//# sourceMappingURL=utils.js.map