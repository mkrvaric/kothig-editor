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
  name: "align",
  display: "submenu",
  add: function add(core, targetElement) {
    var icons = core.icons;
    var context = core.context;
    context.align = {
      targetButton: targetElement,
      _alignList: null,
      currentAlign: "",
      icons: {
        justify: icons.align_justify,
        left: icons.align_left,
        right: icons.align_right,
        center: icons.align_center
      }
    };
    /** set submenu */

    var listDiv = this.setSubmenu.call(core);
    var listUl = listDiv.querySelector("ul");
    /** add event listeners */

    listUl.addEventListener("click", this.pickup.bind(core));
    context.align._alignList = listUl.querySelectorAll("li button");
    /** append target button menu */

    core.initMenuTarget(this.name, targetElement, listDiv);
    /** empty memory */

    listDiv = null;
    listUl = null;
  },
  setSubmenu: function setSubmenu() {
    var lang = this.lang;
    var icons = this.icons;
    var listDiv = this.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-list-layer ke-list-align";
    listDiv.innerHTML = "<div class=\"ke-list-inner\">\n      <ul class=\"ke-list-basic\">\n        <li>\n          <button type=\"button\" class=\"ke-btn-list ke-btn-align\" data-command=\"justifyleft\" data-value=\"left\" title=\"".concat(lang.toolbar.alignLeft, "\">\n            <span class=\"ke-list-icon\">\n              ").concat(icons.align_left, "\n            </span>\n            ").concat(lang.toolbar.alignLeft, "\n          </button>\n        </li>\n        <li>\n          <button type=\"button\" class=\"ke-btn-list ke-btn-align\" data-command=\"justifycenter\" data-value=\"center\" title=\"").concat(lang.toolbar.alignCenter, "\">\n            <span class=\"ke-list-icon\">\n              ").concat(icons.align_center, "\n            </span>\n            ").concat(lang.toolbar.alignCenter, "\n          </button>\n        </li>\n        <li>\n          <button type=\"button\" class=\"ke-btn-list ke-btn-align\" data-command=\"justifyright\" data-value=\"right\" title=\"").concat(lang.toolbar.alignRight, "\">\n            <span class=\"ke-list-icon\">\n              ").concat(icons.align_right, "\n            </span>\n            ").concat(lang.toolbar.alignRight, "\n          </button>\n        </li>\n        <li>\n          <button type=\"button\" class=\"ke-btn-list ke-btn-align\" data-command=\"justifyfull\" data-value=\"justify\" title=\"").concat(lang.toolbar.alignJustify, "\">\n            <span class=\"ke-list-icon\">\n              ").concat(icons.align_justify, "\n            </span>\n            ").concat(lang.toolbar.alignJustify, "\n          </button>\n        </li>\n      </ul>\n    </div>");
    return listDiv;
  },

  /**
   * @Override core
   */
  active: function active(element) {
    var targetButton = this.context.align.targetButton;
    var target = targetButton.firstElementChild;

    if (!element) {
      this.util.changeElement(target, this.context.align.icons.left);
      targetButton.removeAttribute("data-focus");
    } else if (this.util.isFormatElement(element)) {
      var textAlign = element.style.textAlign;

      if (textAlign) {
        this.util.changeElement(target, this.context.align.icons[textAlign]);
        targetButton.setAttribute("data-focus", textAlign);
        return true;
      }
    }

    return false;
  },

  /**
   * @Override submenu
   */
  on: function on() {
    var alignContext = this.context.align;
    var alignList = alignContext._alignList;
    var currentAlign = alignContext.targetButton.getAttribute("data-focus") || "left";

    if (currentAlign !== alignContext.currentAlign) {
      for (var i = 0, len = alignList.length; i < len; i++) {
        if (currentAlign === alignList[i].getAttribute("data-value")) {
          this.util.addClass(alignList[i], "active");
        } else {
          this.util.removeClass(alignList[i], "active");
        }
      }

      alignContext.currentAlign = currentAlign;
    }
  },
  pickup: function pickup(e) {
    e.preventDefault();
    e.stopPropagation();
    var target = e.target;
    var value = null;

    while (!value && !/UL/i.test(target.tagName)) {
      value = target.getAttribute("data-value");
      target = target.parentNode;
    }

    if (!value) {
      return;
    }

    var selectedFormsts = this.getSelectedElements();

    for (var i = 0, len = selectedFormsts.length; i < len; i++) {
      this.util.setStyle(selectedFormsts[i], "textAlign", value === "left" ? "" : value);
    }

    this.effectNode = null;
    this.submenuOff();
    this.focus(); // history stack

    this.history.push(false);
  }
};
exports.default = _default;