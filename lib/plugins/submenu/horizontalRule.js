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
  name: "horizontalRule",
  display: "submenu",
  add: function add(core, targetElement) {
    /** set submenu */
    var listDiv = this.setSubmenu.call(core);
    /** add event listeners */

    listDiv.querySelector("ul").addEventListener("click", this.horizontalRulePick.bind(core));
    /** append target button menu */

    core.initMenuTarget(this.name, targetElement, listDiv);
    /** empty memory */

    listDiv = null;
  },
  setSubmenu: function setSubmenu() {
    var lang = this.lang;
    var listDiv = this.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-list-layer ke-list-line";
    listDiv.innerHTML = "" + '<div class="ke-list-inner">' + '<ul class="ke-list-basic">' + "<li>" + '<button type="button" class="ke-btn-list btn_line" data-command="horizontalRule" data-value="solid" title="' + lang.toolbar.hr_solid + '">' + '<hr style="border-width: 1px 0 0; border-style: solid none none; border-color: black; border-image: initial; height: 1px;" />' + "</button>" + "</li>" + "<li>" + '<button type="button" class="ke-btn-list btn_line" data-command="horizontalRule" data-value="dotted" title="' + lang.toolbar.hr_dotted + '">' + '<hr style="border-width: 1px 0 0; border-style: dotted none none; border-color: black; border-image: initial; height: 1px;" />' + "</button>" + "</li>" + "<li>" + '<button type="button" class="ke-btn-list btn_line" data-command="horizontalRule" data-value="dashed" title="' + lang.toolbar.hr_dashed + '">' + '<hr style="border-width: 1px 0 0; border-style: dashed none none; border-color: black; border-image: initial; height: 1px;" />' + "</button>" + "</li>" + "</ul>" + "</div>";
    return listDiv;
  },
  appendHr: function appendHr(className) {
    var oHr = this.util.createElement("HR");
    oHr.className = className;
    this.focus();
    return this.insertComponent(oHr, false, true, false);
  },
  horizontalRulePick: function horizontalRulePick(e) {
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

    var oNode = this.plugins.horizontalRule.appendHr.call(this, "__ke__" + value);

    if (oNode) {
      this.setRange(oNode, 0, oNode, 0);
      this.submenuOff();
    }
  }
};
exports.default = _default;