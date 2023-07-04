"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fileBrowser = _interopRequireDefault(require("../modules/fileBrowser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Rich Text Editor
 *
 * kothing-ditor.js
 * Copyright Kothing.
 * MIT license.
 */
var _default = {
  name: "imageGallery",

  /**
   * @description Constructor
   * @param {Object} core Core object
   */
  add: function add(core) {
    core.addModule([_fileBrowser.default]);
    var context = core.context;
    context.imageGallery = {
      title: core.lang.toolbar.imageGallery,
      // @Required @Override fileBrowser - File browser window title.
      url: context.options.imageGalleryUrl,
      // @Required @Override fileBrowser - File server url.
      listClass: "ke-image-list",
      // @Required @Override fileBrowser - Class name of list div.
      itemTemplateHandler: this.drawItems,
      // @Required @Override fileBrowser - Function that defines the HTML of an file item.
      selectorHandler: this.setImage.bind(core),
      // @Required @Override fileBrowser - Function that action when item click.
      columnSize: 4 // @Option @Override fileBrowser - Number of "div.ke-file-item-column" to be created (default: 4)

    };
  },

  /**
   * @Required @Override fileBrowser
   * @description Open a file browser.
   * @param {Function|null} selectorHandler When the function comes as an argument value, it substitutes "context.selectorHandler".
   */
  open: function open(selectorHandler) {
    this.plugins.fileBrowser.open.call(this, "imageGallery", selectorHandler);
  },

  /**
   * @Required @Override fileBrowser
   * @description Define the HTML of the item to be put in "div.ke-file-item-column".
   * Format: [
   *      { src: "image src", name: "name(@option)", alt: "image alt(@option)", tag: "tag name(@option)" }
   * ]
   * @param {Object} item Item of the response data's array
   */
  drawItems: function drawItems(item) {
    var srcName = item.src.split("/").pop();
    return '<div class="ke-file-item-img"><img src="' + item.src + '" alt="' + (item.alt || srcName) + '" data-command="pick">' + '<div class="ke-file-img-name ke-file-name-back"></div>' + '<div class="ke-file-img-name __ke__img_name">' + (item.name || srcName) + "</div>" + "</div>";
  },
  setImage: function setImage(target) {
    this.callPlugin("image", function () {
      var file = {
        name: target.parentNode.querySelector(".__ke__img_name").textContent,
        size: 0
      };
      this.context.image._altText = target.alt;
      this.plugins.image.create_image.call(this, target.src, "", false, this.context.image._origin_w, this.context.image._origin_h, "none", file);
    }.bind(this), null);
  }
};
exports.default = _default;