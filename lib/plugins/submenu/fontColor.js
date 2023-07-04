"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _colorPicker = _interopRequireDefault(require("../modules/_colorPicker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Rich Text Editor
 *
 * kothing-ditor.js
 * Copyright Kothing.
 * MIT license.
 */
var _default = {
  name: "fontColor",
  display: "submenu",
  add: function add(core, targetElement) {
    core.addModule([_colorPicker.default]);
    var context = core.context;
    context.fontColor = {
      previewEl: null,
      colorInput: null,
      colorList: null
    };
    /** set submenu */

    var listDiv = this.setSubmenu.call(core);
    context.fontColor.colorInput = listDiv.querySelector("._ke_color_picker_input");
    /** add event listeners */

    context.fontColor.colorInput.addEventListener("keyup", this.onChangeInput.bind(core));
    listDiv.querySelector("._ke_color_picker_submit").addEventListener("click", this.submit.bind(core));
    listDiv.querySelector("._ke_color_picker_remove").addEventListener("click", this.remove.bind(core));
    listDiv.addEventListener("click", this.pickup.bind(core));
    context.fontColor.colorList = listDiv.querySelectorAll("li button");
    /** append target button menu */

    core.initMenuTarget(this.name, targetElement, listDiv);
    /** empty memory */

    listDiv = null;
  },
  setSubmenu: function setSubmenu() {
    var colorArea = this.context.colorPicker.colorListHTML;
    var listDiv = this.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-list-layer";
    listDiv.innerHTML = colorArea;
    return listDiv;
  },

  /**
   * @Override submenu
   */
  on: function on() {
    var contextPicker = this.context.colorPicker;
    var contextFontColor = this.context.fontColor;
    contextPicker._colorInput = contextFontColor.colorInput;
    contextPicker._defaultColor = "#333333";
    contextPicker._styleProperty = "color";
    contextPicker._colorList = contextFontColor.colorList;
    this.plugins.colorPicker.init.call(this, this.getSelectionNode(), null);
  },

  /**
   * @Override _colorPicker
   */
  onChangeInput: function onChangeInput(e) {
    this.plugins.colorPicker.setCurrentColor.call(this, e.target.value);
  },
  submit: function submit() {
    this.plugins.fontColor.applyColor.call(this, this.context.colorPicker._currentColor);
  },
  pickup: function pickup(e) {
    e.preventDefault();
    e.stopPropagation();
    this.plugins.fontColor.applyColor.call(this, e.target.getAttribute("data-value"));
  },
  remove: function remove() {
    this.nodeChange(null, ["color"], ["span"], true);
    this.submenuOff();
  },
  applyColor: function applyColor(color) {
    if (!color) {
      return;
    }

    var newNode = this.util.createElement("SPAN");
    newNode.style.color = color;
    this.nodeChange(newNode, ["color"], null, null);
    this.submenuOff();
  }
};
exports.default = _default;