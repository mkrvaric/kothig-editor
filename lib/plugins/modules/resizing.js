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
  name: "resizing",

  /**
       * @description Constructor
       * Require context properties when resizing module
          inputX: Element,
          inputY: Element,
          _container: null,
          _cover: null,
          _element: null,
          _element_w: 1,
          _element_h: 1,
          _element_l: 0,
          _element_t: 0,
          _defaultSizeX: 'auto',
          _defaultSizeY: 'auto',
          _origin_w: context.option.imageWidth === 'auto' ? '' : context.option.imageWidth,
          _origin_h: context.option.imageHeight === 'auto' ? '' : context.option.imageHeight,
          _proportionChecked: true,
          // -- select function --
          _resizing: context.option.imageResizing,
          _resizeDotHide: !context.option.imageHeightShow,
          _rotation: context.option.imageRotation,
          _onlyPercentage: context.option.imageSizeOnlyPercentage,
          _ratio: false,
          _ratioX: 1,
          _ratioY: 1
          _captionShow: true,
          // -- when used caption (_captionShow: true) --
          _caption: null,
          _captionChecked: false,
          captionCheckEl: null,
       * @param {Object} core Core object 
       */
  add: function add(core) {
    var icons = core.icons;
    var context = core.context;
    context.resizing = {
      _resizeClientX: 0,
      _resizeClientY: 0,
      _resize_plugin: "",
      _resize_w: 0,
      _resize_h: 0,
      _origin_w: 0,
      _origin_h: 0,
      _rotateVertical: false,
      _resize_direction: "",
      _move_path: null,
      _isChange: false,
      alignIcons: {
        basic: icons.align_justify,
        left: icons.align_left,
        right: icons.align_right,
        center: icons.align_center
      }
    };
    /** resize controller, button */

    var resize_div_container = this.setController_resize.call(core);
    context.resizing.resizeContainer = resize_div_container;
    context.resizing.resizeDiv = resize_div_container.querySelector(".ke-modal-resize");
    context.resizing.resizeDot = resize_div_container.querySelector(".ke-resize-dot");
    context.resizing.resizeDisplay = resize_div_container.querySelector(".ke-resize-display");
    var resize_button = this.setController_button.call(core);
    context.resizing.resizeButton = resize_button;
    var resize_handles = context.resizing.resizeDot.querySelectorAll("span");
    context.resizing.resizeHandles = context.resizing.resizeDot.querySelectorAll("span");
    context.resizing.resizeButtonGroup = resize_button.querySelector("._ke_resizing_btn_group");
    context.resizing.rotationButtons = resize_button.querySelectorAll("._ke_resizing_btn_group ._ke_rotation");
    context.resizing.percentageButtons = resize_button.querySelectorAll("._ke_resizing_btn_group ._ke_percentage");
    context.resizing.alignMenu = resize_button.querySelector(".ke-resizing-align-list");
    context.resizing.alignMenuList = context.resizing.alignMenu.querySelectorAll("button");
    context.resizing.alignButton = resize_button.querySelector("._ke_resizing_align_button");
    context.resizing.autoSizeButton = resize_button.querySelector("._ke_resizing_btn_group ._ke_auto_size");
    context.resizing.captionButton = resize_button.querySelector("._ke_resizing_caption_button");
    /** add event listeners */

    resize_div_container.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });
    resize_button.addEventListener("mousedown", core.eventStop);
    resize_handles[0].addEventListener("mousedown", this.onMouseDown_resize_handle.bind(core));
    resize_handles[1].addEventListener("mousedown", this.onMouseDown_resize_handle.bind(core));
    resize_handles[2].addEventListener("mousedown", this.onMouseDown_resize_handle.bind(core));
    resize_handles[3].addEventListener("mousedown", this.onMouseDown_resize_handle.bind(core));
    resize_handles[4].addEventListener("mousedown", this.onMouseDown_resize_handle.bind(core));
    resize_handles[5].addEventListener("mousedown", this.onMouseDown_resize_handle.bind(core));
    resize_handles[6].addEventListener("mousedown", this.onMouseDown_resize_handle.bind(core));
    resize_handles[7].addEventListener("mousedown", this.onMouseDown_resize_handle.bind(core));
    resize_button.addEventListener("click", this.onClick_resizeButton.bind(core));
    /** append html */

    context.element.relative.appendChild(resize_div_container);
    context.element.relative.appendChild(resize_button);
    /** empty memory */

    resize_div_container = null, resize_button = null, resize_handles = null;
  },

  /** resize controller, button (image, iframe, video) */
  setController_resize: function setController_resize() {
    var resize_container = this.util.createElement("DIV");
    resize_container.className = "ke-controller ke-resizing-container";
    resize_container.style.display = "none";
    resize_container.innerHTML = "\n      <div class=\"ke-modal-resize\"></div>\n      <div class=\"ke-resize-dot\">\n      <span class=\"tl\"></span>\n      <span class=\"tr\"></span>\n      <span class=\"bl\"></span>\n      <span class=\"br\"></span>\n      <span class=\"lw\"></span>\n      <span class=\"th\"></span>\n      <span class=\"rw\"></span>\n      <span class=\"bh\"></span>\n      <div class=\"ke-resize-display\"></div>\n      </div>";
    return resize_container;
  },
  setController_button: function setController_button() {
    var lang = this.lang;
    var icons = this.icons;
    var resize_button = this.util.createElement("DIV");
    resize_button.className = "ke-controller ke-controller-resizing";
    resize_button.innerHTML = "\n      <div class=\"ke-arrow ke-arrow-up\"></div>\n      <div class=\"ke-btn-group _ke_resizing_btn_group\">\n        <button type=\"button\" data-command=\"percent\" data-value=\"1\" data-tooltip=\"".concat(lang.controller.resize100, "\" class=\"_ke_percentage\">\n          <span>100%</span>\n        </button>\n        <button type=\"button\" data-command=\"percent\" data-value=\"0.75\" data-tooltip=\"").concat(lang.controller.resize75, "\" class=\"_ke_percentage\">\n          <span>75%</span>\n        </button>\n        <button type=\"button\" data-command=\"percent\" data-value=\"0.5\" data-tooltip=\"").concat(lang.controller.resize50, "\" class=\"_ke_percentage\">\n          <span>50%</span>\n        </button>\n        <button type=\"button\" data-command=\"auto\" data-tooltip=\"").concat(lang.controller.autoSize, "\" class=\"ke-btn _ke_auto_size\">\n          ").concat(icons.auto_size, "\n        </button>\n        <button type=\"button\" data-command=\"rotate\" data-value=\"-90\" data-tooltip=\"").concat(lang.controller.rotateLeft, "\" class=\"ke-btn _ke_rotation\">\n          ").concat(icons.rotate_left, "\n        </button>\n        <button type=\"button\" data-command=\"rotate\" data-value=\"90\" data-tooltip=\"").concat(lang.controller.rotateRight, "\" class=\"ke-btn _ke_rotation\">\n          ").concat(icons.rotate_right, "\n        </button>\n      </div>\n      <div class=\"ke-btn-group\" style=\"padding-top: 0;\">\n        <button type=\"button\" data-command=\"mirror\" data-value=\"h\" data-tooltip=\"").concat(lang.controller.mirrorHorizontal, "\" class=\"ke-btn\">\n          ").concat(icons.mirror_horizontal, "\n        </button>\n        <button type=\"button\" data-command=\"mirror\" data-value=\"v\" data-tooltip=\"").concat(lang.controller.mirrorVertical, "\" class=\"ke-btn\">\n          ").concat(icons.mirror_vertical, "\n        </button>\n        <button type=\"button\" data-command=\"onalign\" data-tooltip=\"").concat(lang.toolbar.align, "\" class=\"ke-btn _ke_resizing_align_button\">\n          ").concat(icons.align_justify, "\n        </button>\n        <div class=\"ke-btn-group-sub kothing-editor-common ke-list-layer ke-resizing-align-list\">\n          <div class=\"ke-list-inner\">\n            <ul class=\"ke-list-basic\">\n              <li>\n                <button type=\"button\" class=\"ke-btn-list\" data-command=\"align\" data-value=\"basic\" data-tooltip=\"").concat(lang.dialogBox.basic, "\">\n                  ").concat(icons.align_justify, "\n                </button>\n              </li>\n              <li>\n                <button type=\"button\" class=\"ke-btn-list\" data-command=\"align\" data-value=\"left\" data-tooltip=\"").concat(lang.dialogBox.left, "\">\n                  ").concat(icons.align_left, "\n                </button>\n              </li>\n              <li>\n                <button type=\"button\" class=\"ke-btn-list\" data-command=\"align\" data-value=\"center\" data-tooltip=\"").concat(lang.dialogBox.center, "\">\n                  ").concat(icons.align_center, "\n                </button>\n              </li>\n              <li>\n                <button type=\"button\" class=\"ke-btn-list\" data-command=\"align\" data-value=\"right\" data-tooltip=\"").concat(lang.dialogBox.right, "\">\n                  ").concat(icons.align_right, "\n                </button>\n              </li>\n            </ul>\n          </div>\n        </div>\n        <button type=\"button\" data-command=\"caption\" data-tooltip=\"").concat(lang.dialogBox.caption, "\" class=\"ke-btn _ke_resizing_caption_button\">\n          ").concat(icons.caption, "\n        </button>\n        <button type=\"button\" data-command=\"revert\" data-tooltip=\"").concat(lang.dialogBox.revertButton, "\" class=\"ke-btn\">\n          ").concat(icons.revert, "\n        </button>\n        <button type=\"button\" data-command=\"update\" data-tooltip=\"").concat(lang.controller.edit, "\" class=\"ke-btn\">\n          ").concat(icons.modify, "\n        </button>\n        <button type=\"button\" data-command=\"delete\" data-tooltip=\"").concat(lang.controller.remove, "\" class=\"ke-btn\">\n          ").concat(icons.delete, "\n        </button>\n      </div>");
    return resize_button;
  },

  /**
   * @description Gets the width size
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   * @param {Element} element Target element
   * @param {Element} cover Cover element (FIGURE)
   * @param {Element} container Container element (DIV.ke-component)
   * @returns {String}
   */
  _module_getSizeX: function _module_getSizeX(contextPlugin, element, cover, container) {
    if (!element) {
      element = contextPlugin._element;
    }

    if (!cover) {
      cover = contextPlugin._cover;
    }

    if (!container) {
      container = contextPlugin._container;
    }

    if (!element) {
      return "";
    }

    return !/%$/.test(element.style.width) ? element.style.width : (container && this.util.getNumber(container.style.width, 2) || 100) + "%";
  },

  /**
   * @description Gets the height size
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   * @param {Element} element Target element
   * @param {Element} cover Cover element (FIGURE)
   * @param {Element} container Container element (DIV.ke-component)
   * @returns {String}
   */
  _module_getSizeY: function _module_getSizeY(contextPlugin, element, cover, container) {
    if (!element) {
      element = contextPlugin._element;
    }

    if (!cover) {
      cover = contextPlugin._cover;
    }

    if (!container) {
      container = contextPlugin._container;
    }

    if (!container || !cover) {
      return element && element.style.height || "";
    }

    return this.util.getNumber(cover.style.paddingBottom, 0) > 0 && !this.context.resizing._rotateVertical ? cover.style.height : !/%$/.test(element.style.height) || !/%$/.test(element.style.width) ? element.style.height : (container && this.util.getNumber(container.style.height, 2) || 100) + "%";
  },

  /**
   * @description Called at the "openModify" to put the size of the current target into the size input element.
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   * @param {Object} pluginObj Plugin object
   */
  _module_setModifyInputSize: function _module_setModifyInputSize(contextPlugin, pluginObj) {
    var percentageRotation = contextPlugin._onlyPercentage && this.context.resizing._rotateVertical;
    contextPlugin.proportion.checked = contextPlugin._proportionChecked = contextPlugin._element.getAttribute("data-proportion") !== "false";
    var x = percentageRotation ? "" : this.plugins.resizing._module_getSizeX.call(this, contextPlugin);

    if (x === contextPlugin._defaultSizeX) {
      x = "";
    }

    if (contextPlugin._onlyPercentage) {
      x = this.util.getNumber(x, 2);
    }

    contextPlugin.inputX.value = x;
    pluginObj.setInputSize.call(this, "x");

    if (!contextPlugin._onlyPercentage) {
      var y = percentageRotation ? "" : this.plugins.resizing._module_getSizeY.call(this, contextPlugin);

      if (y === contextPlugin._defaultSizeY) {
        y = "";
      }

      if (contextPlugin._onlyPercentage) {
        y = this.util.getNumber(y, 2);
      }

      contextPlugin.inputY.value = y;
    }

    contextPlugin.inputX.disabled = percentageRotation ? true : false;
    contextPlugin.inputY.disabled = percentageRotation ? true : false;
    contextPlugin.proportion.disabled = percentageRotation ? true : false;
    pluginObj.setRatio.call(this);
  },

  /**
   * @description It is called in "setInputSize" (input tag keyupEvent),
   * checks the value entered in the input tag,
   * calculates the ratio, and sets the calculated value in the input tag of the opposite size.
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   * @param {String} xy 'x': width, 'y': height
   */
  _module_setInputSize: function _module_setInputSize(contextPlugin, xy) {
    if (contextPlugin._onlyPercentage) {
      if (xy === "x" && contextPlugin.inputX.value > 100) {
        contextPlugin.inputX.value = 100;
      }

      return;
    }

    if (contextPlugin.proportion.checked && contextPlugin._ratio && /\d/.test(contextPlugin.inputX.value) && /\d/.test(contextPlugin.inputY.value)) {
      var xUnit = contextPlugin.inputX.value.replace(/\d+|\./g, "") || contextPlugin.sizeUnit;
      var yUnit = contextPlugin.inputY.value.replace(/\d+|\./g, "") || contextPlugin.sizeUnit;

      if (xUnit !== yUnit) {
        return;
      }

      var dec = xUnit === "%" ? 2 : 0;

      if (xy === "x") {
        contextPlugin.inputY.value = this.util.getNumber(contextPlugin._ratioY * this.util.getNumber(contextPlugin.inputX.value, dec), dec) + yUnit;
      } else {
        contextPlugin.inputX.value = this.util.getNumber(contextPlugin._ratioX * this.util.getNumber(contextPlugin.inputY.value, dec), dec) + xUnit;
      }
    }
  },

  /**
   * @description It is called in "setRatio" (input and proportionCheck tags changeEvent),
   * checks the value of the input tag, calculates the ratio, and resets it in the input tag.
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   */
  _module_setRatio: function _module_setRatio(contextPlugin) {
    var xValue = contextPlugin.inputX.value;
    var yValue = contextPlugin.inputY.value;

    if (contextPlugin.proportion.checked && /\d+/.test(xValue) && /\d+/.test(yValue)) {
      var xUnit = xValue.replace(/\d+|\./g, "") || contextPlugin.sizeUnit;
      var yUnit = yValue.replace(/\d+|\./g, "") || contextPlugin.sizeUnit;

      if (xUnit !== yUnit) {
        contextPlugin._ratio = false;
      } else if (!contextPlugin._ratio) {
        var x = this.util.getNumber(xValue, 0);
        var y = this.util.getNumber(yValue, 0);
        contextPlugin._ratio = true;
        contextPlugin._ratioX = x / y;
        contextPlugin._ratioY = y / x;
      }
    } else {
      contextPlugin._ratio = false;
    }
  },

  /**
   * @description Revert size of element to origin size (plugin._origin_w, plugin._origin_h)
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   */
  _module_sizeRevert: function _module_sizeRevert(contextPlugin) {
    if (contextPlugin._onlyPercentage) {
      contextPlugin.inputX.value = contextPlugin._origin_w > 100 ? 100 : contextPlugin._origin_w;
    } else {
      contextPlugin.inputX.value = contextPlugin._origin_w;
      contextPlugin.inputY.value = contextPlugin._origin_h;
    }
  },

  /**
   * @description Save the size data (element.setAttribute("data-size"))
   * Used at the "setSize" method
   * @param {Object} contextPlugin context object of plugin (core.context[plugin])
   */
  _module_saveCurrentSize: function _module_saveCurrentSize(contextPlugin) {
    var x = this.plugins.resizing._module_getSizeX.call(this, contextPlugin);

    var y = this.plugins.resizing._module_getSizeY.call(this, contextPlugin);

    contextPlugin._element.setAttribute("data-size", x + "," + y);

    if (contextPlugin._videoRatio) {
      contextPlugin._videoRatio = y;
    }
  },

  /**
   * @description Call the resizing module
   * @param {Element} targetElement Resizing target element
   * @param {string} plugin Plugin name
   * @returns {Object} Size of resizing div {w, h, t, l}
   */
  call_controller_resize: function call_controller_resize(targetElement, plugin) {
    var contextResizing = this.context.resizing;
    var contextPlugin = this.context[plugin];
    contextResizing._resize_plugin = plugin;
    var resizeContainer = contextResizing.resizeContainer;
    var resizeDiv = contextResizing.resizeDiv;
    var offset = this.util.getOffset(targetElement, this.context.element.wysiwygFrame);
    var isVertical = /^(90|270)$/.test(Math.abs(targetElement.getAttribute("data-rotate")).toString());
    contextResizing._rotateVertical = /^(90|270)$/.test(Math.abs(targetElement.getAttribute("data-rotate")).toString());
    var w = isVertical ? targetElement.offsetHeight : targetElement.offsetWidth;
    var h = isVertical ? targetElement.offsetWidth : targetElement.offsetHeight;
    var t = offset.top;
    var l = offset.left - this.context.element.wysiwygFrame.scrollLeft;
    resizeContainer.style.top = t + "px";
    resizeContainer.style.left = l + "px";
    resizeContainer.style.width = w + "px";
    resizeContainer.style.height = h + "px";
    resizeDiv.style.top = "0px";
    resizeDiv.style.left = "0px";
    resizeDiv.style.width = w + "px";
    resizeDiv.style.height = h + "px";
    var align = targetElement.getAttribute("data-align") || "basic";
    align = align === "none" ? "basic" : align; // text

    var container = this.util.getParentElement(targetElement, this.util.isComponent);
    var cover = this.util.getParentElement(targetElement, "FIGURE");
    var displayX = this.plugins.resizing._module_getSizeX.call(this, contextPlugin, targetElement, cover, container) || "auto";
    var displayY = contextPlugin._onlyPercentage && plugin === "image" ? "" : ", " + (this.plugins.resizing._module_getSizeY.call(this, contextPlugin, targetElement, cover, container) || "auto");
    this.util.changeTxt(contextResizing.resizeDisplay, this.lang.dialogBox[align] + " (" + displayX + displayY + ")"); // resizing display

    contextResizing.resizeButtonGroup.style.display = contextPlugin._resizing ? "" : "none";
    var resizeDotShow = contextPlugin._resizing && !contextPlugin._resizeDotHide && !contextPlugin._onlyPercentage ? "flex" : "none";
    var resizeHandles = contextResizing.resizeHandles;

    for (var i = 0, len = resizeHandles.length; i < len; i++) {
      resizeHandles[i].style.display = resizeDotShow;
    }

    if (contextPlugin._resizing) {
      var rotations = contextResizing.rotationButtons;
      rotations[0].style.display = contextPlugin._rotation ? "" : "none";
      rotations[1].style.display = contextPlugin._rotation ? "" : "none";
    } // align icon


    var alignList = contextResizing.alignMenuList;
    this.util.changeElement(contextResizing.alignButton.firstElementChild, contextResizing.alignIcons[align]);

    for (var _i = 0, _len = alignList.length; _i < _len; _i++) {
      if (alignList[_i].getAttribute("data-value") === align) {
        this.util.addClass(alignList[_i], "on");
      } else {
        this.util.removeClass(alignList[_i], "on");
      }
    } // percentage active


    var pButtons = contextResizing.percentageButtons;
    var value = /%$/.test(targetElement.style.width) && /%$/.test(container.style.width) ? this.util.getNumber(container.style.width, 0) / 100 + "" : "";

    for (var _i2 = 0, _len2 = pButtons.length; _i2 < _len2; _i2++) {
      if (pButtons[_i2].getAttribute("data-value") === value) {
        this.util.addClass(pButtons[_i2], "active");
      } else {
        this.util.removeClass(pButtons[_i2], "active");
      }
    } // caption display, active


    if (!contextPlugin._captionShow) {
      contextResizing.captionButton.style.display = "none";
    } else {
      contextResizing.captionButton.style.display = "";

      if (this.util.getChildElement(targetElement.parentNode, "figcaption")) {
        this.util.addClass(contextResizing.captionButton, "active");
        contextPlugin._captionChecked = true;
      } else {
        this.util.removeClass(contextResizing.captionButton, "active");
        contextPlugin._captionChecked = false;
      }
    }

    if (this.currentControllerName !== plugin) {
      this.util.setDisabledButtons(true, this.resizingDisabledButtons);
      this.controllersOn(contextResizing.resizeContainer, contextResizing.resizeButton, this.util.setDisabledButtons.bind(this, false, this.resizingDisabledButtons), targetElement, plugin);
    } // button group


    var overLeft = this.context.element.wysiwygFrame.offsetWidth - l - contextResizing.resizeButton.offsetWidth;
    contextResizing.resizeButton.style.top = h + t + 60 + "px";
    contextResizing.resizeButton.style.left = l + (overLeft < 0 ? overLeft : 0) + "px";

    if (overLeft < 0) {
      contextResizing.resizeButton.firstElementChild.style.left = 20 - overLeft + "px";
    } else {
      contextResizing.resizeButton.firstElementChild.style.left = "20px";
    }

    contextResizing._resize_w = w;
    contextResizing._resize_h = h;
    var originSize = (targetElement.getAttribute("origin-size") || "").split(",");
    contextResizing._origin_w = originSize[0] || targetElement.naturalWidth;
    contextResizing._origin_h = originSize[1] || targetElement.naturalHeight;
    return {
      w: w,
      h: h,
      t: t,
      l: l
    };
  },
  _closeAlignMenu: null,

  /**
   * @description Open align submenu of module
   */
  openAlignMenu: function openAlignMenu() {
    this.util.addClass(this.context.resizing.alignButton, "on");
    this.context.resizing.alignMenu.style.display = "block";

    this.plugins.resizing._closeAlignMenu = function () {
      this.util.removeClass(this.context.resizing.alignButton, "on");
      this.context.resizing.alignMenu.style.display = "none";
      this.removeDocEvent("mousedown", this.plugins.resizing._closeAlignMenu);
      this.plugins.resizing._closeAlignMenu = null;
    }.bind(this);

    this.addDocEvent("mousedown", this.plugins.resizing._closeAlignMenu);
  },

  /**
   * @description Click event of resizing toolbar
   * Performs the action of the clicked toolbar button.
   * @param {MouseEvent} e Event object
   */
  onClick_resizeButton: function onClick_resizeButton(e) {
    e.stopPropagation();
    var target = e.target;
    var command = target.getAttribute("data-command") || target.parentNode.getAttribute("data-command");

    if (!command) {
      return;
    }

    var value = target.getAttribute("data-value") || target.parentNode.getAttribute("data-value");
    var pluginName = this.context.resizing._resize_plugin;
    var currentContext = this.context[pluginName];
    var contextEl = currentContext._element;
    var currentModule = this.plugins[pluginName];
    e.preventDefault();

    if (typeof this.plugins.resizing._closeAlignMenu === "function") {
      this.plugins.resizing._closeAlignMenu();

      if (command === "onalign") {
        return;
      }
    }

    switch (command) {
      case "auto":
        this.plugins.resizing.resetTransform.call(this, contextEl);
        currentModule.setAutoSize.call(this);
        this.selectComponent(contextEl, pluginName);
        break;

      case "percent":
        {
          var percentY = this.plugins.resizing._module_getSizeY.call(this, currentContext);

          if (this.context.resizing._rotateVertical) {
            var percentage = contextEl.getAttribute("data-percentage");

            if (percentage) {
              percentY = percentage.split(",")[1];
            }
          }

          this.plugins.resizing.resetTransform.call(this, contextEl);
          currentModule.setPercentSize.call(this, value * 100, this.util.getNumber(percentY, 0) === null || !/%$/.test(percentY) ? "" : percentY);
          this.selectComponent(contextEl, pluginName);
          break;
        }

      case "mirror":
        {
          var r = contextEl.getAttribute("data-rotate") || "0";
          var x = contextEl.getAttribute("data-rotateX") || "";
          var y = contextEl.getAttribute("data-rotateY") || "";

          if (value === "h" && !this.context.resizing._rotateVertical || value === "v" && this.context.resizing._rotateVertical) {
            y = y ? "" : "180";
          } else {
            x = x ? "" : "180";
          }

          contextEl.setAttribute("data-rotateX", x);
          contextEl.setAttribute("data-rotateY", y);

          this.plugins.resizing._setTransForm(contextEl, r, x, y);

          break;
        }

      case "rotate":
        {
          var contextResizing = this.context.resizing;
          var slope = contextEl.getAttribute("data-rotate") * 1 + value * 1;
          var deg = this._w.Math.abs(slope) >= 360 ? 0 : slope;
          contextEl.setAttribute("data-rotate", deg);
          contextResizing._rotateVertical = /^(90|270)$/.test(this._w.Math.abs(deg).toString());
          this.plugins.resizing.setTransformSize.call(this, contextEl, null, null);
          this.selectComponent(contextEl, pluginName);
          break;
        }

      case "onalign":
        this.plugins.resizing.openAlignMenu.call(this);
        return;

      case "align":
        {
          var alignValue = value === "basic" ? "none" : value;
          currentModule.setAlign.call(this, alignValue, null, null, null);
          this.selectComponent(contextEl, pluginName);
          break;
        }

      case "caption":
        {
          var caption = !currentContext._captionChecked;
          currentModule.openModify.call(this, true);
          currentContext._captionChecked = caption;
          currentContext.captionCheckEl.checked = caption;
          currentModule.update_image.call(this, false, false, false);

          if (caption) {
            var captionText = this.util.getChildElement(currentContext._caption, function (current) {
              return current.nodeType === 3;
            });

            if (!captionText) {
              currentContext._caption.focus();
            } else {
              this.setRange(captionText, 0, captionText, captionText.textContent.length);
            }

            this.controllersOff();
          } else {
            this.selectComponent(contextEl, pluginName);
            currentModule.openModify.call(this, true);
          }

          break;
        }

      case "revert":
        currentModule.setOriginSize.call(this);
        this.selectComponent(contextEl, pluginName);
        break;

      case "update":
        currentModule.openModify.call(this);
        this.controllersOff();
        break;

      case "delete":
        currentModule.destroy.call(this);
        break;
    } // history stack


    this.history.push(false);
  },

  /**
   * @description Initialize the transform style (rotation) of the element.
   * @param {Element} element Target element
   */
  resetTransform: function resetTransform(element) {
    var size = (element.getAttribute("data-size") || element.getAttribute("data-origin") || "").split(",");
    this.context.resizing._rotateVertical = false;
    element.style.maxWidth = "";
    element.style.transform = "";
    element.style.transformOrigin = "";
    element.setAttribute("data-rotate", "");
    element.setAttribute("data-rotateX", "");
    element.setAttribute("data-rotateY", "");

    this.plugins[this.context.resizing._resize_plugin].setSize.call(this, size[0] ? size[0] : "auto", size[1] ? size[1] : "", true);
  },

  /**
   * @description Set the transform style (rotation) of the element.
   * @param {Element} element Target element
   * @param {Number|null} width Element's width size
   * @param {Number|null} height Element's height size
   */
  setTransformSize: function setTransformSize(element, width, height) {
    var percentage = element.getAttribute("data-percentage");
    var isVertical = this.context.resizing._rotateVertical;
    var deg = element.getAttribute("data-rotate") * 1;
    var transOrigin = "";

    if (percentage && !isVertical) {
      percentage = percentage.split(",");

      if (percentage[0] === "auto" && percentage[1] === "auto") {
        this.plugins[this.context.resizing._resize_plugin].setAutoSize.call(this);
      } else {
        this.plugins[this.context.resizing._resize_plugin].setPercentSize.call(this, percentage[0], percentage[1]);
      }
    } else {
      var cover = this.util.getParentElement(element, "FIGURE");
      var offsetW = width || element.offsetWidth;
      var offsetH = height || element.offsetHeight;
      var w = (isVertical ? offsetH : offsetW) + "px";
      var h = (isVertical ? offsetW : offsetH) + "px";

      this.plugins[this.context.resizing._resize_plugin].cancelPercentAttr.call(this);

      this.plugins[this.context.resizing._resize_plugin].setSize.call(this, offsetW + "px", offsetH + "px", true);

      cover.style.width = w;
      cover.style.height = this.context[this.context.resizing._resize_plugin]._caption ? "" : h;

      if (isVertical) {
        var transW = offsetW / 2 + "px " + offsetW / 2 + "px 0";
        var transH = offsetH / 2 + "px " + offsetH / 2 + "px 0";
        transOrigin = deg === 90 || deg === -270 ? transH : transW;
      }
    }

    element.style.transformOrigin = transOrigin;

    this.plugins.resizing._setTransForm(element, deg.toString(), element.getAttribute("data-rotateX") || "", element.getAttribute("data-rotateY") || "");

    if (isVertical) {
      element.style.maxWidth = "none";
    } else {
      element.style.maxWidth = "";
    }

    this.plugins.resizing.setCaptionPosition.call(this, element);
  },
  _setTransForm: function _setTransForm(element, r, x, y) {
    var width = (element.offsetWidth - element.offsetHeight) * (/-/.test(r) ? 1 : -1);
    var translate = "";

    if (/[1-9]/.test(r) && (x || y)) {
      translate = x ? "Y" : "X";

      switch (r) {
        case "90":
          translate = x && y ? "X" : y ? translate : "";
          break;

        case "270":
          width *= -1;
          translate = x && y ? "Y" : x ? translate : "";
          break;

        case "-90":
          translate = x && y ? "Y" : x ? translate : "";
          break;

        case "-270":
          width *= -1;
          translate = x && y ? "X" : y ? translate : "";
          break;

        default:
          translate = "";
      }
    }

    if (r % 180 === 0) {
      element.style.maxWidth = "";
    }

    element.style.transform = "rotate(" + r + "deg)" + (x ? " rotateX(" + x + "deg)" : "") + (y ? " rotateY(" + y + "deg)" : "") + (translate ? " translate" + translate + "(" + width + "px)" : "");
  },

  /**
   * @description The position of the caption is set automatically.
   * @param {Element} element Target element (not caption element)
   */
  setCaptionPosition: function setCaptionPosition(element) {
    var figcaption = this.util.getChildElement(this.util.getParentElement(element, "FIGURE"), "FIGCAPTION");

    if (figcaption) {
      figcaption.style.marginTop = (this.context.resizing._rotateVertical ? element.offsetWidth - element.offsetHeight : 0) + "px";
    }
  },

  /**
   * @description Mouse down event of resize handles
   * @param {MouseEvent} e Event object
   */
  onMouseDown_resize_handle: function onMouseDown_resize_handle(e) {
    e.stopPropagation();
    e.preventDefault();
    var contextResizing = this.context.resizing;
    var direction = contextResizing._resize_direction = e.target.classList[0];
    contextResizing._resizeClientX = e.clientX;
    contextResizing._resizeClientY = e.clientY;
    this.context.element.resizeBackground.style.display = "block";
    contextResizing.resizeButton.style.display = "none";
    contextResizing.resizeDiv.style.float = /l/.test(direction) ? "right" : /r/.test(direction) ? "left" : "none";
    var resizing_element_bind = this.plugins.resizing.resizing_element.bind(this, contextResizing, direction, this.context[contextResizing._resize_plugin]);

    var closureFunc_bind = function closureFunc(e) {
      if (e.type === "keydown" && e.keyCode !== 27) {
        return;
      }

      var change = contextResizing._isChange;
      contextResizing._isChange = false;
      this.removeDocEvent("mousemove", resizing_element_bind);
      this.removeDocEvent("mouseup", closureFunc_bind);
      this.removeDocEvent("keydown", closureFunc_bind);

      if (e.type === "keydown") {
        this.controllersOff();
        this.context.element.resizeBackground.style.display = "none";

        this.plugins[this.context.resizing._resize_plugin].init.call(this);
      } else {
        // element resize
        this.plugins.resizing.cancel_controller_resize.call(this, direction); // history stack

        if (change) {
          this.history.push(false);
        }
      }
    }.bind(this);

    this.addDocEvent("mousemove", resizing_element_bind);
    this.addDocEvent("mouseup", closureFunc_bind);
    this.addDocEvent("keydown", closureFunc_bind);
  },

  /**
   * @description Mouse move event after call "onMouseDown_resize_handle" of resize handles
   * The size of the module's "div" is adjusted according to the mouse move event.
   * @param {Object} contextResizing "core.context.resizing" object (binding argument)
   * @param {String} direction Direction ("tl", "tr", "bl", "br", "lw", "th", "rw", "bh") (binding argument)
   * @param {Object} plugin "core.context[currentPlugin]" object (binding argument)
   * @param {MouseEvent} e Event object
   */
  resizing_element: function resizing_element(contextResizing, direction, plugin, e) {
    var clientX = e.clientX;
    var clientY = e.clientY;
    var resultW = plugin._element_w;
    var resultH = plugin._element_h;
    var w = plugin._element_w + (/r/.test(direction) ? clientX - contextResizing._resizeClientX : contextResizing._resizeClientX - clientX);
    var h = plugin._element_h + (/b/.test(direction) ? clientY - contextResizing._resizeClientY : contextResizing._resizeClientY - clientY);
    var wh = plugin._element_h / plugin._element_w * w;

    if (/t/.test(direction)) {
      contextResizing.resizeDiv.style.top = plugin._element_h - (/h/.test(direction) ? h : wh) + "px";
    }

    if (/l/.test(direction)) {
      contextResizing.resizeDiv.style.left = plugin._element_w - w + "px";
    }

    if (/r|l/.test(direction)) {
      contextResizing.resizeDiv.style.width = w + "px";
      resultW = w;
    }

    if (/^(t|b)[^h]$/.test(direction)) {
      contextResizing.resizeDiv.style.height = wh + "px";
      resultH = wh;
    } else if (/^(t|b)h$/.test(direction)) {
      contextResizing.resizeDiv.style.height = h + "px";
      resultH = h;
    }

    contextResizing._resize_w = resultW;
    contextResizing._resize_h = resultH;
    this.util.changeTxt(contextResizing.resizeDisplay, this._w.Math.round(resultW) + " x " + this._w.Math.round(resultH));
    contextResizing._isChange = true;
  },

  /**
   * @description Resize the element to the size of the "div" adjusted in the "resizing_element" method.
   * Called at the mouse-up event registered in "onMouseDown_resize_handle".
   * @param {String} direction Direction ("tl", "tr", "bl", "br", "lw", "th", "rw", "bh")
   */
  cancel_controller_resize: function cancel_controller_resize(direction) {
    var isVertical = this.context.resizing._rotateVertical;
    this.controllersOff();
    this.context.element.resizeBackground.style.display = "none";

    var w = this._w.Math.round(isVertical ? this.context.resizing._resize_h : this.context.resizing._resize_w);

    var h = this._w.Math.round(isVertical ? this.context.resizing._resize_w : this.context.resizing._resize_h);

    if (!isVertical && !/%$/.test(w)) {
      var padding = 16;
      var limit = this.context.element.wysiwygFrame.clientWidth - padding * 2 - 2;

      if (this.util.getNumber(w, 0) > limit) {
        h = this._w.Math.round(h / w * limit);
        w = limit;
      }
    }

    var pluginName = this.context.resizing._resize_plugin;
    this.plugins[pluginName].setSize.call(this, w, h, false, direction);
    this.selectComponent(this.context[pluginName]._element, pluginName);
  }
};
exports.default = _default;