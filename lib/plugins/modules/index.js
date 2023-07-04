"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "dialog", {
  enumerable: true,
  get: function get() {
    return _dialog.default;
  }
});
Object.defineProperty(exports, "component", {
  enumerable: true,
  get: function get() {
    return _component.default;
  }
});
Object.defineProperty(exports, "fileManager", {
  enumerable: true,
  get: function get() {
    return _fileManager.default;
  }
});
Object.defineProperty(exports, "resizing", {
  enumerable: true,
  get: function get() {
    return _resizing.default;
  }
});
exports.default = void 0;

var _dialog = _interopRequireDefault(require("./dialog"));

var _component = _interopRequireDefault(require("./component"));

var _fileManager = _interopRequireDefault(require("./fileManager"));

var _resizing = _interopRequireDefault(require("./resizing"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  dialog: _dialog.default,
  component: _component.default,
  fileManager: _fileManager.default,
  resizing: _resizing.default
};
exports.default = _default;