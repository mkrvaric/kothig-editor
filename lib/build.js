"use strict";

require("./assets/css/editor.css");

require("./assets/css/editor-contents.css");

var _plugins = _interopRequireDefault(require("./plugins"));

var _editor2 = _interopRequireDefault(require("./editor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Rich Text Editor
 *
 * kothing-ditor.js
 * Copyright Kothing.
 * MIT license.
 */
Object.defineProperty(window, "KothingEditor", {
  enumerable: true,
  writable: false,
  configurable: false,
  value: _editor2.default.init({
    plugins: _plugins.default
  })
});