"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _util2 = _interopRequireDefault(require("../../lib/util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Rich Text Editor
 *
 * kothing-ditor.js
 * Copyright Kothing.
 * MIT license.
 */
var _default = {
  name: "dialog",

  /**
   * @description Constructor
   * @param {Object} core Core object
   */
  util: _util2.default,
  add: function add(core) {
    var context = core.context;
    context.dialog = {
      kind: "",
      updateModal: false,
      _closeSignal: false
    };
    /** dialog */

    var dialog_div = core.util.createElement("DIV");
    dialog_div.className = "ke-dialog kothing-editor-common";
    var dialog_back = core.util.createElement("DIV");
    dialog_back.className = "ke-dialog-back";
    dialog_back.style.display = "none";
    var dialog_area = core.util.createElement("DIV");
    dialog_area.className = "ke-dialog-inner";
    dialog_area.style.display = "none";
    dialog_div.appendChild(dialog_back);
    dialog_div.appendChild(dialog_area);
    context.dialog.modalArea = dialog_div;
    context.dialog.back = dialog_back;
    context.dialog.modal = dialog_area;
    /** add event listeners */

    context.dialog.modal.addEventListener("mousedown", this._onMouseDown_dialog.bind(core));
    context.dialog.modal.addEventListener("click", this._onClick_dialog.bind(core));
    /** append html */

    context.element.relative.appendChild(dialog_div);
    /** empty memory */

    dialog_div = null, dialog_back = null, dialog_area = null;
  },

  /**
   * @description Event to control the behavior of closing the dialog
   * @param {MouseEvent} e Event object
   * @private
   */
  _onMouseDown_dialog: function _onMouseDown_dialog(e) {
    if (/ke-dialog-inner/.test(e.target.className)) {
      this.context.dialog._closeSignal = true;
    } else {
      this.context.dialog._closeSignal = false;
    }
  },

  /**
   * @description Event to close the window when the outside area of the dialog or close button is click
   * @param {MouseEvent} e Event object
   * @private
   */
  _onClick_dialog: function _onClick_dialog(e) {
    e.stopPropagation();

    if (/close/.test(e.target.getAttribute("data-command")) || this.context.dialog._closeSignal) {
      this.plugins.dialog.close.call(this);
    }
  },

  /**
   * @description Open a Dialog plugin
   * @param {String} kind Dialog plugin name
   * @param {Boolean} update Whether it will open for update ('image' === this.currentControllerName)
   */
  open: function open(kind, update) {
    if (this.modalForm) {
      return false;
    }

    if (this.plugins.dialog._bindClose) {
      this._d.removeEventListener("keydown", this.plugins.dialog._bindClose);

      this.plugins.dialog._bindClose = null;
    }

    this.plugins.dialog._bindClose = function (e) {
      if (!/27/.test(e.keyCode)) {
        return;
      }

      this.plugins.dialog.close.call(this);
    }.bind(this);

    this._d.addEventListener("keydown", this.plugins.dialog._bindClose);

    this.context.dialog.updateModal = update;

    if (this.context.option.popupDisplay === "full") {
      this.context.dialog.modalArea.style.position = "fixed";
    } else {
      this.context.dialog.modalArea.style.position = "absolute";
    }

    this.context.dialog.kind = kind;
    this.modalForm = this.context[kind].modal;
    var focusElement = this.context[kind].focusElement;

    if (typeof this.plugins[kind].on === "function") {
      this.plugins[kind].on.call(this, update);
    }

    _util2.default.addClass(this.context.dialog.modalArea, "dialog--open");

    this.context.dialog.modalArea.style.display = "block";
    this.context.dialog.back.style.display = "block";
    this.context.dialog.modal.style.display = "block";
    this.modalForm.style.display = "block";

    if (focusElement) {
      focusElement.focus();
    }
  },
  _bindClose: null,

  /**
   * @description Close a Dialog plugin
   * The plugin's "init" method is called.
   */
  close: function close() {
    var _this = this;

    if (this.plugins.dialog._bindClose) {
      this._d.removeEventListener("keydown", this.plugins.dialog._bindClose);

      this.plugins.dialog._bindClose = null;
    }

    var contextDialog = this.context.dialog;
    var kind = this.context.dialog.kind;

    _util2.default.removeClass(contextDialog.modalArea, "dialog--open");

    _util2.default.addClass(contextDialog.modalArea, "dialog--close");

    setTimeout(function () {
      _util2.default.removeClass(contextDialog.modalArea, "dialog--close");

      contextDialog.back.style.display = "none";
      contextDialog.modalArea.style.display = "none";
      _this.modalForm.style.display = "none";
      contextDialog.updateModal = false;
      contextDialog.kind = "";
      _this.modalForm = null;

      _this.focus();
    }, 200);

    if (typeof this.plugins[kind].init === "function") {
      this.plugins[kind].init.call(this);
    }
  }
};
exports.default = _default;