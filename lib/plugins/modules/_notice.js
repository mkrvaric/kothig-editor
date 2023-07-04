"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
 * Rich Text Editor
 *
 * kothing-ditor.js
 * Copyright Kothing.
 * MIT license.
 */
var _default = {
  name: "notice",

  /**
   * @description Constructor
   * @param {Object} core Core object
   */
  add: function add(core) {
    var context = core.context;
    context.notice = {};
    /** dialog */

    var notice_div = core.util.createElement("DIV");
    var notice_span = core.util.createElement("SPAN");
    var notice_button = core.util.createElement("BUTTON");
    notice_div.className = "ke-notice";
    notice_button.className = "close";
    notice_button.setAttribute("aria-label", "Close");
    notice_button.setAttribute("title", core.lang.dialogBox.close);
    notice_button.innerHTML = core.icons.cancel;
    notice_div.appendChild(notice_span);
    notice_div.appendChild(notice_button);
    context.notice.modal = notice_div;
    context.notice.message = notice_span;
    /** add event listeners */

    notice_button.addEventListener("click", this.onClick_cancel.bind(core));
    /** append html */

    context.element.editorArea.appendChild(notice_div);
    /** empty memory */

    notice_div = null;
  },

  /**
   * @description Event when clicking the cancel button
   * @param {MouseEvent} e Event object
   */
  onClick_cancel: function onClick_cancel(e) {
    e.preventDefault();
    e.stopPropagation();
    this.plugins.notice.close.call(this);
  },

  /**
   * @description  Open the notice panel
   * @param {String} text Notice message
   */
  open: function open(text) {
    this.context.notice.message.textContent = text;
    this.context.notice.modal.style.display = "block";
  },

  /**
   * @description  Open the notice panel
   */
  close: function close() {
    this.context.notice.modal.style.display = "none";
  }
};
exports.default = _default;