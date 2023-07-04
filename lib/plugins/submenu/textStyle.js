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
  name: "textStyle",
  display: "submenu",
  add: function add(core, targetElement) {
    var context = core.context;
    context.textStyle = {
      _styleList: null
    };
    /** set submenu */

    var listDiv = this.setSubmenu.call(core);
    var listUl = listDiv.querySelector("ul");
    /** add event listeners */

    listUl.addEventListener("click", this.pickup.bind(core));
    context.textStyle._styleList = listDiv.querySelectorAll("li button");
    /** append target button menu */

    core.initMenuTarget(this.name, targetElement, listDiv);
    /** empty memory */

    listDiv = null;
    listUl = null;
  },
  setSubmenu: function setSubmenu() {
    var option = this.context.option;
    var listDiv = this.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-list-layer ke-list-format";
    var defaultList = {
      code: {
        name: this.lang.menu.code,
        class: "__ke__t-code",
        tag: "code"
      },
      translucent: {
        name: this.lang.menu.translucent,
        style: "opacity: 0.5;",
        tag: "span"
      },
      shadow: {
        name: this.lang.menu.shadow,
        class: "__ke__t-shadow",
        tag: "span"
      }
    };
    var styleList = !option.textStyles ? this._w.Object.keys(defaultList) : option.textStyles;
    var list = '<div class="ke-list-inner"><ul class="ke-list-basic">';

    for (var i = 0, len = styleList.length, t, tag, name, attrs, command, value, _class; i < len; i++) {
      t = styleList[i];
      attrs = "";
      value = "";
      command = [];

      if (typeof t === "string") {
        var defaultStyle = defaultList[t.toLowerCase()];

        if (!defaultStyle) {
          continue;
        }

        t = defaultStyle;
      }

      name = t.name;
      tag = t.tag || "span";
      _class = t._class;

      if (t.style) {
        attrs += ' style="' + t.style + '"';
        value += t.style.replace(/:[^;]+(;|$)\s*/g, ",");
        command.push("style");
      }

      if (t.class) {
        attrs += ' class="' + t.class + '"';
        value += "." + t.class.trim().replace(/\s+/g, ",.");
        command.push("class");
      }

      value = value.replace(/,$/, "");
      list += "<li>" + '<button type="button" class="ke-btn-list' + (_class ? " " + _class : "") + '" data-command="' + tag + '" data-value="' + value + '" title="' + name + '">' + "<" + tag + attrs + ">" + name + "</" + tag + ">" + "</button></li>";
    }

    list += "</ul></div>";
    listDiv.innerHTML = list;
    return listDiv;
  },

  /**
   * @Override submenu
   */
  on: function on() {
    var util = this.util;
    var textStyleContext = this.context.textStyle;
    var styleToolbarItem = textStyleContext._styleList;
    var selectionNode = this.getSelectionNode();

    for (var i = 0, len = styleToolbarItem.length, btn, data, active; i < len; i++) {
      btn = styleToolbarItem[i];
      data = btn.getAttribute("data-value").split(",");

      for (var v = 0, node, value; v < data.length; v++) {
        node = selectionNode;
        active = false;

        while (node && !util.isFormatElement(node) && !util.isComponent(node)) {
          if (node.nodeName.toLowerCase() === btn.getAttribute("data-command").toLowerCase()) {
            value = data[v];

            if (/^\./.test(value) ? util.hasClass(node, value.replace(/^\./, "")) : !!node.style[value]) {
              active = true;
              break;
            }
          }

          node = node.parentNode;
        }

        if (!active) {
          break;
        }
      }

      active ? util.addClass(btn, "active") : util.removeClass(btn, "active");
    }
  },
  pickup: function pickup(e) {
    e.preventDefault();
    e.stopPropagation();
    var target = e.target;
    var command = null,
        tag = null;

    while (!command && !/UL/i.test(target.tagName)) {
      command = target.getAttribute("data-command");

      if (command) {
        tag = target.firstChild;
        break;
      }

      target = target.parentNode;
    }

    if (!command) {
      return;
    }

    var checkStyles = tag.style.cssText.replace(/:.+(;|$)/g, ",").split(",");
    checkStyles.pop();
    var classes = tag.classList;

    for (var i = 0, len = classes.length; i < len; i++) {
      checkStyles.push("." + classes[i]);
    }

    var newNode = this.util.hasClass(target, "active") ? null : tag.cloneNode(false);
    var removeNodes = newNode ? null : [tag.nodeName];
    this.nodeChange(newNode, checkStyles, removeNodes, true);
    this.submenuOff();
  }
};
exports.default = _default;