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
  name: "lineHeight",
  display: "submenu",
  add: function add(core, targetElement) {
    var context = core.context;
    context.lineHeight = {
      _sizeList: null,
      currentSize: -1
    };
    /** set submenu */

    var listDiv = this.setSubmenu.call(core);
    var listUl = listDiv.querySelector("ul");
    /** add event listeners */

    listUl.addEventListener("click", this.pickup.bind(core));
    context.lineHeight._sizeList = listUl.querySelectorAll("li button");
    /** append target button menu */

    core.initMenuTarget(this.name, targetElement, listDiv);
    /** empty memory */

    listDiv = null;
    listUl = null;
  },
  setSubmenu: function setSubmenu() {
    var option = this.context.option;
    var lang = this.lang;
    var listDiv = this.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-list-layer";
    var sizeList = !option.lineHeights ? [{
      text: "1",
      value: 1
    }, {
      text: "1.15",
      value: 1.15
    }, {
      text: "1.5",
      value: 1.5
    }, {
      text: "2",
      value: 2
    }] : option.lineHeights;
    var list = '<div class="ke-list-inner">' + '<ul class="ke-list-basic">' + '<li><button type="button" class="default_value ke-btn-list" title="' + lang.toolbar.default + '">(' + lang.toolbar.default + ")</button></li>";

    for (var i = 0, len = sizeList.length, size; i < len; i++) {
      size = sizeList[i];
      list += '<li><button type="button" class="ke-btn-list" data-value="' + size.value + '" title="' + size.text + '">' + size.text + "</button></li>";
    }

    list += "</ul></div>";
    listDiv.innerHTML = list;
    return listDiv;
  },

  /**
   * @Override submenu
   */
  on: function on() {
    var lineHeightContext = this.context.lineHeight;
    var sizeList = lineHeightContext._sizeList;
    var format = this.util.getFormatElement(this.getSelectionNode());
    var currentSize = !format ? "" : format.style.lineHeight + "";

    if (currentSize !== lineHeightContext.currentSize) {
      for (var i = 0, len = sizeList.length; i < len; i++) {
        if (currentSize === sizeList[i].getAttribute("data-value")) {
          this.util.addClass(sizeList[i], "active");
        } else {
          this.util.removeClass(sizeList[i], "active");
        }
      }

      lineHeightContext.currentSize = currentSize;
    }
  },
  pickup: function pickup(e) {
    if (!/^BUTTON$/i.test(e.target.tagName)) {
      return false;
    }

    e.preventDefault();
    e.stopPropagation();
    var value = e.target.getAttribute("data-value") || "";
    var formats = this.getSelectedElements();

    for (var i = 0, len = formats.length; i < len; i++) {
      formats[i].style.lineHeight = value;
    }

    this.submenuOff(); // history stack

    this.history.push(false);
  }
};
exports.default = _default;