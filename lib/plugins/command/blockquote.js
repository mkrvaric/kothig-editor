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
  name: "blockquote",
  display: "command",
  add: function add(core, targetElement) {
    var context = core.context;
    context.blockquote = {
      targetButton: targetElement,
      tag: core.util.createElement("BLOCKQUOTE")
    };
  },

  /**
   * @Override core
   */
  active: function active(element) {
    if (!element) {
      this.util.removeClass(this.context.blockquote.targetButton, "active");
    } else if (/blockquote/i.test(element.nodeName)) {
      this.util.addClass(this.context.blockquote.targetButton, "active");
      return true;
    }

    return false;
  },

  /**
   * @Override core
   */
  action: function action() {
    var currentBlockquote = this.util.getParentElement(this.getSelectionNode(), "blockquote");

    if (currentBlockquote) {
      this.detachRangeFormatElement(currentBlockquote, null, null, false, false);
    } else {
      this.applyRangeFormatElement(this.context.blockquote.tag.cloneNode(false));
    }
  }
};
exports.default = _default;