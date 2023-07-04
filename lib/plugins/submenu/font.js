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
  name: "font",
  display: "submenu",
  add: function add(core, targetElement) {
    var icons = core.icons;
    var context = core.context;
    context.font = {
      targetText: targetElement.querySelector(".txt"),
      _fontList: null,
      currentFont: "",
      icon: icons.font
    };
    /** set submenu */

    var listDiv = this.setSubmenu.call(core);
    /** add event listeners */

    listDiv.querySelector(".ke-list-inner").addEventListener("click", this.pickup.bind(core));
    context.font._fontList = listDiv.querySelectorAll("ul li button");
    /** append target button menu */

    core.initMenuTarget(this.name, targetElement, listDiv);
    /** empty memory */

    listDiv = null;
  },
  setSubmenu: function setSubmenu() {
    var option = this.context.option;
    var lang = this.lang;
    var listDiv = this.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-list-layer ke-list-font-family";
    var font, text, i, len;
    var fontList = !option.font ? ["Arial", "Comic Sans MS", "Courier New", "Impact", "Georgia", "tahoma", "Trebuchet MS", "Verdana"] : option.font;
    var list = '<div class="ke-list-inner">' + '<ul class="ke-list-basic">' + '<li><button type="button" class="default_value ke-btn-list" title="' + lang.toolbar.default + '">(' + lang.toolbar.default + ")</button></li>";

    for (i = 0, len = fontList.length; i < len; i++) {
      font = fontList[i];
      text = font.split(",")[0];
      list += '<li><button type="button" class="ke-btn-list" data-value="' + font + '" data-txt="' + text + '" title="' + text + '" style="font-family:' + font + ';">' + text + "</button></li>";
    }

    list += "</ul></div>";
    listDiv.innerHTML = list;
    return listDiv;
  },

  /**
   * @Override core
   */
  active: function active(element) {
    var target = this.context.font.targetText.firstElementChild;
    var icon = this.context.font.icon;

    if (!element) {
      this.util.changeElement(target, icon);
    } else if (element.style && element.style.fontFamily.length > 0) {
      var selectFont = element.style.fontFamily.replace(/["']/g, "");
      this.util.changeElement(target, "<span>".concat(selectFont, "</span>"));
      return true;
    }

    return false;
  },

  /**
   * @Override submenu
   */
  on: function on() {
    var fontContext = this.context.font;
    var fontList = fontContext._fontList;
    var currentFont = fontContext.targetText.textContent;

    if (currentFont !== fontContext.currentFont) {
      for (var i = 0, len = fontList.length; i < len; i++) {
        if (currentFont === fontList[i].getAttribute("data-value")) {
          this.util.addClass(fontList[i], "active");
        } else {
          this.util.removeClass(fontList[i], "active");
        }
      }

      fontContext.currentFont = currentFont;
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
      newNode.style.fontFamily = value;
      this.nodeChange(newNode, ["font-family"], null, null);
    } else {
      this.nodeChange(null, ["font-family"], ["span"], true);
    }

    this.submenuOff();
  }
};
exports.default = _default;