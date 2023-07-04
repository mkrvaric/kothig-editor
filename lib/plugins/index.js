"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "blockquote", {
  enumerable: true,
  get: function get() {
    return _blockquote.default;
  }
});
Object.defineProperty(exports, "align", {
  enumerable: true,
  get: function get() {
    return _align.default;
  }
});
Object.defineProperty(exports, "font", {
  enumerable: true,
  get: function get() {
    return _font.default;
  }
});
Object.defineProperty(exports, "fontSize", {
  enumerable: true,
  get: function get() {
    return _fontSize.default;
  }
});
Object.defineProperty(exports, "fontColor", {
  enumerable: true,
  get: function get() {
    return _fontColor.default;
  }
});
Object.defineProperty(exports, "hiliteColor", {
  enumerable: true,
  get: function get() {
    return _hiliteColor.default;
  }
});
Object.defineProperty(exports, "horizontalRule", {
  enumerable: true,
  get: function get() {
    return _horizontalRule.default;
  }
});
Object.defineProperty(exports, "list", {
  enumerable: true,
  get: function get() {
    return _list.default;
  }
});
Object.defineProperty(exports, "table", {
  enumerable: true,
  get: function get() {
    return _table.default;
  }
});
Object.defineProperty(exports, "formatBlock", {
  enumerable: true,
  get: function get() {
    return _formatBlock.default;
  }
});
Object.defineProperty(exports, "lineHeight", {
  enumerable: true,
  get: function get() {
    return _lineHeight.default;
  }
});
Object.defineProperty(exports, "template", {
  enumerable: true,
  get: function get() {
    return _template.default;
  }
});
Object.defineProperty(exports, "paragraphStyle", {
  enumerable: true,
  get: function get() {
    return _paragraphStyle.default;
  }
});
Object.defineProperty(exports, "textStyle", {
  enumerable: true,
  get: function get() {
    return _textStyle.default;
  }
});
Object.defineProperty(exports, "link", {
  enumerable: true,
  get: function get() {
    return _link.default;
  }
});
Object.defineProperty(exports, "image", {
  enumerable: true,
  get: function get() {
    return _image.default;
  }
});
Object.defineProperty(exports, "video", {
  enumerable: true,
  get: function get() {
    return _video.default;
  }
});
Object.defineProperty(exports, "audio", {
  enumerable: true,
  get: function get() {
    return _audio.default;
  }
});
Object.defineProperty(exports, "math", {
  enumerable: true,
  get: function get() {
    return _math.default;
  }
});
Object.defineProperty(exports, "imageGallery", {
  enumerable: true,
  get: function get() {
    return _imageGallery.default;
  }
});
exports.default = void 0;

var _blockquote = _interopRequireDefault(require("./command/blockquote"));

var _align = _interopRequireDefault(require("./submenu/align"));

var _font = _interopRequireDefault(require("./submenu/font"));

var _fontSize = _interopRequireDefault(require("./submenu/fontSize"));

var _fontColor = _interopRequireDefault(require("./submenu/fontColor"));

var _hiliteColor = _interopRequireDefault(require("./submenu/hiliteColor"));

var _horizontalRule = _interopRequireDefault(require("./submenu/horizontalRule"));

var _list = _interopRequireDefault(require("./submenu/list"));

var _table = _interopRequireDefault(require("./submenu/table"));

var _formatBlock = _interopRequireDefault(require("./submenu/formatBlock"));

var _lineHeight = _interopRequireDefault(require("./submenu/lineHeight"));

var _template = _interopRequireDefault(require("./submenu/template"));

var _paragraphStyle = _interopRequireDefault(require("./submenu/paragraphStyle"));

var _textStyle = _interopRequireDefault(require("./submenu/textStyle"));

var _link = _interopRequireDefault(require("./dialog/link"));

var _image = _interopRequireDefault(require("./dialog/image"));

var _video = _interopRequireDefault(require("./dialog/video"));

var _audio = _interopRequireDefault(require("./dialog/audio"));

var _math = _interopRequireDefault(require("./dialog/math"));

var _imageGallery = _interopRequireDefault(require("./fileBrowser/imageGallery"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// command
// submenu
// dialog
// file browser
var _default = {
  blockquote: _blockquote.default,
  align: _align.default,
  font: _font.default,
  fontSize: _fontSize.default,
  fontColor: _fontColor.default,
  hiliteColor: _hiliteColor.default,
  horizontalRule: _horizontalRule.default,
  list: _list.default,
  table: _table.default,
  formatBlock: _formatBlock.default,
  lineHeight: _lineHeight.default,
  template: _template.default,
  paragraphStyle: _paragraphStyle.default,
  textStyle: _textStyle.default,
  link: _link.default,
  image: _image.default,
  video: _video.default,
  audio: _audio.default,
  math: _math.default,
  imageGallery: _imageGallery.default
};
exports.default = _default;