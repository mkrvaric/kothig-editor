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
  name: "fontSize",
  display: "submenu",
  add: function add(core, targetElement) {
    var icons = core.icons;
    var context = core.context;
    context.fontSize = {
      targetText: targetElement.querySelector(".txt"),
      _sizeList: null,
      currentSize: "",
      icon: icons.font_size
    };
    /** set submenu */

    var listDiv = this.setSubmenu.call(core);
    var listUl = listDiv.querySelector("ul");
    /** add event listeners */

    listUl.addEventListener("click", this.pickup.bind(core));
    context.fontSize._sizeList = listUl.querySelectorAll("li button");
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
    listDiv.className = "ke-submenu ke-list-layer ke-list-font-size";
    var sizeList = !option.fontSize ? [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72] : option.fontSize;
    var list = "<div class=\"ke-list-inner\">\n      <ul class=\"ke-list-basic\">\n      <li>\n        <button type=\"button\" class=\"default_value ke-btn-list\" title=\"".concat(lang.toolbar.default, "\">\n        (").concat(lang.toolbar.default, ")\n        </button>\n      </li>");

    for (var i = 0, unit = option.fontSizeUnit, len = sizeList.length, size; i < len; i++) {
      size = sizeList[i];
      list += "<li>\n        <button type=\"button\" class=\"ke-btn-list\" data-value=\"".concat(size).concat(unit, "\" title=\"").concat(size).concat(unit, "\" style=\"font-size:").concat(size).concat(unit, ";\">").concat(size, "</button>\n      </li>");
    }

    list += "</ul></div>";
    listDiv.innerHTML = list;
    return listDiv;
  },

  /**
   * @Override core
   */
  active: function active(element) {
    var target = this.context.fontSize.targetText.firstElementChild;
    var icon = this.context.fontSize.icon;

    if (!element) {
      this.util.changeElement(target, icon);
    } else if (element.style && element.style.fontSize.length > 0) {
      this.util.changeElement(target, "<span>".concat(element.style.fontSize, "</span>"));
      return true;
    }

    return false;
  },

  /**
   * @Override submenu
   */
  on: function on() {
    var fontSizeContext = this.context.fontSize;
    var sizeList = fontSizeContext._sizeList;
    var currentSize = fontSizeContext.targetText.textContent;

    if (currentSize !== fontSizeContext.currentSize) {
      for (var i = 0, len = sizeList.length; i < len; i++) {
        if (currentSize === sizeList[i].getAttribute("data-value")) {
          this.util.addClass(sizeList[i], "active");
        } else {
          this.util.removeClass(sizeList[i], "active");
        }
      }

      fontSizeContext.currentSize = currentSize;
    }
  },
  pickup: function pickup(e) {
    if (!/^BUTTON$/i.test(e.target.tagName)) {
      return false;
    }

    e.preventDefault();
    e.stopPropagation();
    var value = e.target.getAttribute("data-value");

    if (value) {
      var newNode = this.util.createElement("SPAN");
      newNode.style.fontSize = value;
      this.nodeChange(newNode, ["font-size"], null, null);
    } else {
      this.nodeChange(null, ["font-size"], ["span"], true);
    }

    this.submenuOff();
  }
};
exports.default = _default;