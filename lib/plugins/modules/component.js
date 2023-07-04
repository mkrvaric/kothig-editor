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
  name: "component",

  /**
   * @description Create a container for the resizing component and insert the element.
   * @param {Element} cover Cover element (FIGURE)
   * @param {String} className Class name of container (fixed: ke-component)
   * @returns {Element} Created container element
   */
  set_container: function set_container(cover, className) {
    var container = this.util.createElement("DIV");
    container.className = "ke-component " + className;
    container.setAttribute("contenteditable", false);
    container.appendChild(cover);
    return container;
  },

  /**
   * @description Cover the target element with a FIGURE element.
   * @param {Element} element Target element
   */
  set_cover: function set_cover(element) {
    var cover = this.util.createElement("FIGURE");
    cover.appendChild(element);
    return cover;
  },

  /**
   * @description Return HTML string of caption(FIGCAPTION) element
   * @returns {String}
   */
  create_caption: function create_caption() {
    var caption = this.util.createElement("FIGCAPTION");
    caption.setAttribute("contenteditable", true);
    caption.innerHTML = "<div>" + this.lang.dialogBox.caption + "</div>";
    return caption;
  }
};
exports.default = _default;