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
  name: "paragraphStyle",
  display: "submenu",
  add: function add(core, targetElement) {
    var context = core.context;
    context.paragraphStyle = {
      _classList: null
    };
    /** set submenu */

    var listDiv = this.setSubmenu.call(core);
    /** add event listeners */

    listDiv.querySelector("ul").addEventListener("click", this.pickUp.bind(core));
    context.paragraphStyle._classList = listDiv.querySelectorAll("li button");
    /** append target button menu */

    core.initMenuTarget(this.name, targetElement, listDiv);
    /** empty memory */

    listDiv = null;
  },
  setSubmenu: function setSubmenu() {
    var option = this.context.option;
    var listDiv = this.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-list-layer ke-list-format";
    var menuLang = this.lang.menu;
    var defaultList = {
      spaced: {
        name: menuLang.spaced,
        class: "__ke__p-spaced",
        _class: ""
      },
      bordered: {
        name: menuLang.bordered,
        class: "__ke__p-bordered",
        _class: ""
      },
      neon: {
        name: menuLang.neon,
        class: "__ke__p-neon",
        _class: ""
      }
    };
    var paragraphStyles = !option.paragraphStyles || option.paragraphStyles.length === 0 ? ["spaced", "bordered", "neon"] : option.paragraphStyles;
    var list = '<div class="ke-list-inner"><ul class="ke-list-basic">';

    for (var i = 0, len = paragraphStyles.length, p, name, attrs, _class; i < len; i++) {
      p = paragraphStyles[i];

      if (typeof p === "string") {
        var defaultStyle = defaultList[p.toLowerCase()];

        if (!defaultStyle) {
          continue;
        }

        p = defaultStyle;
      }

      name = p.name;
      attrs = p.class ? ' class="' + p.class + '"' : "";
      _class = p._class;
      list += "<li>" + '<button type="button" class="ke-btn-list' + (_class ? " " + _class : "") + '" data-value="' + p.class + '" title="' + name + '">' + "<div" + attrs + ">" + name + "</div>" + "</button></li>";
    }

    list += "</ul></div>";
    listDiv.innerHTML = list;
    return listDiv;
  },

  /**
   * @Override submenu
   */
  on: function on() {
    var paragraphContext = this.context.paragraphStyle;
    var paragraphList = paragraphContext._classList;
    var currentFormat = this.util.getFormatElement(this.getSelectionNode());

    for (var i = 0, len = paragraphList.length; i < len; i++) {
      if (this.util.hasClass(currentFormat, paragraphList[i].getAttribute("data-value"))) {
        this.util.addClass(paragraphList[i], "active");
      } else {
        this.util.removeClass(paragraphList[i], "active");
      }
    }
  },
  pickUp: function pickUp(e) {
    e.preventDefault();
    e.stopPropagation();
    var target = e.target;
    var value = null;

    while (!/^UL$/i.test(target.tagName)) {
      value = target.getAttribute("data-value");

      if (value) {
        break;
      }

      target = target.parentNode;
    }

    if (!value) {
      return;
    }

    var selectedFormsts = this.getSelectedElements();

    if (selectedFormsts.length === 0) {
      this.getRange_addLine(this.getRange());
      selectedFormsts = this.getSelectedElements();

      if (selectedFormsts.length === 0) {
        return;
      }
    } // change format class


    var toggleClass = this.util.hasClass(target, "active") ? this.util.removeClass.bind(this.util) : this.util.addClass.bind(this.util);

    for (var i = 0, len = selectedFormsts.length; i < len; i++) {
      toggleClass(selectedFormsts[i], value);
    }

    this.submenuOff(); // history stack

    this.history.push(false);
  }
};
exports.default = _default;