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
  name: "template",
  display: "submenu",
  add: function add(core, targetElement) {
    var context = core.context;
    context.template = {};
    /** set submenu */

    var templateDiv = this.setSubmenu.call(core);
    /** add event listeners */

    templateDiv.querySelector("ul").addEventListener("click", this.pickup.bind(core));
    /** append target button menu */

    core.initMenuTarget(this.name, targetElement, templateDiv);
    /** empty memory */

    templateDiv = null;
  },
  setSubmenu: function setSubmenu() {
    var templateList = this.context.option.templates;

    if (!templateList || templateList.length === 0) {
      throw Error('[KothingEditor.plugins.template.fail] To use the "template" plugin, please define the "templates" option.');
    }

    var listDiv = this.util.createElement("DIV");
    listDiv.className = "ke-list-layer";
    var list = '<div class="ke-submenu ke-list-inner">' + '<ul class="ke-list-basic">';

    for (var i = 0, len = templateList.length, t; i < len; i++) {
      t = templateList[i];
      list += '<li><button type="button" class="ke-btn-list" data-value="' + i + '" title="' + t.name + '">' + t.name + "</button></li>";
    }

    list += "</ul></div>";
    listDiv.innerHTML = list;
    return listDiv;
  },
  pickup: function pickup(e) {
    if (!/^BUTTON$/i.test(e.target.tagName)) {
      return false;
    }

    e.preventDefault();
    e.stopPropagation();
    var temp = this.context.option.templates[e.target.getAttribute("data-value")];

    if (temp.html) {
      this.setContents(temp.html);
    } else {
      this.submenuOff();
      throw Error('[KothingEditor.template.fail] cause : "templates[i].html not found"');
    }

    this.submenuOff();
  }
};
exports.default = _default;