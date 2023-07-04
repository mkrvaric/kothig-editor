"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dialog = _interopRequireDefault(require("../modules/dialog"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: "math",
  display: "dialog",
  add: function add(core) {
    core.addModule([_dialog.default]);
    var context = core.context;
    context.math = {
      focusElement: null,
      previewElement: null,
      fontSizeElement: null,
      _mathExp: null
    };
    /** math dialog */

    var math_dialog = this.setDialog.call(core);
    context.math.modal = math_dialog;
    context.math.focusElement = math_dialog.querySelector(".ke-math-exp");
    context.math.previewElement = math_dialog.querySelector(".ke-math-preview");
    context.math.fontSizeElement = math_dialog.querySelector(".ke-math-size");
    context.math.focusElement.addEventListener("keyup", this._renderMathExp.bind(core, context.math), false);
    context.math.focusElement.addEventListener("change", this._renderMathExp.bind(core, context.math), false);
    context.math.fontSizeElement.addEventListener("change", function (e) {
      this.fontSize = e.target.value;
    }.bind(context.math.previewElement.style), false);
    /** math controller */

    var math_controller = this.setController_MathButton.call(core);
    context.math.mathController = math_controller;
    context.math._mathExp = null;
    math_controller.addEventListener("mousedown", core.eventStop);
    /** add event listeners */

    math_dialog.querySelector(".ke-btn-primary").addEventListener("click", this.submit.bind(core), false);
    math_controller.addEventListener("click", this.onClick_mathController.bind(core));
    /** append html */

    context.dialog.modal.appendChild(math_dialog);
    context.element.relative.appendChild(math_controller);
    /** empty memory */

    math_dialog = null;
    math_controller = null;
  },

  /** dialog */
  setDialog: function setDialog() {
    var lang = this.lang;
    var dialog = this.util.createElement("DIV");
    dialog.className = "ke-dialog-content";
    dialog.style.display = "none";
    dialog.innerHTML = "\n      <form>\n        <div class=\"ke-dialog-header\">\n          <button type=\"button\" data-command=\"close\" class=\"ke-btn ke-dialog-close\" aria-label=\"Close\" title=\"".concat(lang.dialogBox.close, "\">").concat(this.icons.cancel, "</button>\n          <span class=\"ke-modal-title\">").concat(lang.dialogBox.mathBox.title, "</span>\n        </div>\n        <div class=\"ke-dialog-body\">\n          <div class=\"ke-dialog-form\">\n            <label>").concat(lang.dialogBox.mathBox.inputLabel, "(<a href=\"https://katex.org/docs/supported.html\" target=\"_blank\">KaTeX</a>)</label>\n            <textarea class=\"ke-input-form ke-math-exp\" type=\"text\"></textarea>\n          </div>\n          <div class=\"ke-dialog-form\">\n            <label>").concat(lang.dialogBox.mathBox.fontSizeLabel, "</label>\n            <select class=\"ke-input-select ke-math-size\">\n              <option value=\"1em\">1</option>\n              <option value=\"1.5em\">1.5</option>\n              <option value=\"2em\">2</option>\n              <option value=\"2.5em\">2.5</option>\n            </select>\n          </div>\n          <div class=\"ke-dialog-form\">\n            <label>").concat(lang.dialogBox.mathBox.previewLabel, "</label>\n            <p class=\"ke-math-preview\"></p>\n          </div>\n        </div>\n        <div class=\"ke-dialog-footer\">\n          <button type=\"submit\" class=\"ke-btn-primary\" title=\"").concat(lang.dialogBox.submitButton, "\">").concat(lang.dialogBox.submitButton, "</button>\n        </div>\n      </form>");
    return dialog;
  },

  /** modify controller button */
  setController_MathButton: function setController_MathButton() {
    var lang = this.lang;
    var math_btn = this.util.createElement("DIV");
    math_btn.className = "ke-controller ke-controller-link";
    math_btn.innerHTML = "\n      <div class=\"ke-arrow ke-arrow-up\"></div>\n      <div class=\"link-content\">\n        <div class=\"ke-btn-group\">\n          <button type=\"button\" data-command=\"update\" data-tooltip=\"".concat(lang.controller.edit, "\" tabindex=\"-1\" class=\"ke-btn\">\n            ").concat(this.icons.edit, "\n          </button>\n          <button type=\"button\" data-command=\"delete\" data-tooltip=\"").concat(lang.controller.remove, "\" tabindex=\"-1\" class=\"ke-btn\">\n            ").concat(this.icons.delete, "\n          </button>\n        </div>\n      </div>");
    return math_btn;
  },

  /**
   * @Required @Override dialog
   */
  open: function open() {
    this.plugins.dialog.open.call(this, "math", this.currentControllerName === "math");
  },

  /**
   * @Override core - managedTagsInfo
   */
  managedTags: function managedTags() {
    return {
      className: "katex",
      method: function method(element) {
        if (!element.getAttribute("data-exp")) {
          return;
        }

        var dom = this._d.createRange().createContextualFragment(this.plugins.math._renderer.call(this, this.util.HTMLDecoder(element.getAttribute("data-exp"))));

        element.innerHTML = dom.querySelector(".katex").innerHTML;
      }
    };
  },
  _renderer: function _renderer(exp) {
    var katex = this.context.option.katex;
    return katex.src.renderToString(exp, katex.options);
  },
  _renderMathExp: function _renderMathExp(contextMath, e) {
    contextMath.previewElement.innerHTML = this.plugins.math._renderer.call(this, e.target.value);
  },
  submit: function submit(e) {
    this.showLoading();
    e.preventDefault();
    e.stopPropagation();

    var submitAction = function () {
      if (this.context.math.focusElement.value.trim().length === 0) {
        return false;
      }

      var contextMath = this.context.math;
      var mathExp = contextMath.focusElement.value;
      var katexEl = contextMath.previewElement.querySelector(".katex");

      if (!katexEl) {
        return false;
      }

      katexEl.className = "__ke__katex " + katexEl.className;
      katexEl.setAttribute("contenteditable", false);
      katexEl.setAttribute("data-exp", this.util.HTMLEncoder(mathExp));
      katexEl.setAttribute("data-font-size", contextMath.fontSizeElement.value);
      katexEl.style.fontSize = contextMath.fontSizeElement.value;

      if (!this.context.dialog.updateModal) {
        var selectedFormats = this.getSelectedElements();

        if (selectedFormats.length > 1) {
          var oFormat = this.util.createElement(selectedFormats[0].nodeName);
          oFormat.appendChild(katexEl);

          if (!this.insertNode(oFormat, null, true)) {
            return false;
          }
        } else {
          if (!this.insertNode(katexEl, null, true)) {
            return false;
          }
        }

        var empty = this.util.createTextNode(this.util.zeroWidthSpace);
        katexEl.parentNode.insertBefore(empty, katexEl.nextSibling);
        this.setRange(katexEl, 0, katexEl, 1);
      } else {
        var containerEl = this.util.getParentElement(contextMath._mathExp, ".katex");
        containerEl.parentNode.replaceChild(katexEl, containerEl);
        this.setRange(katexEl, 0, katexEl, 1);
      }

      contextMath.focusElement.value = "";
      contextMath.fontSizeElement.value = "1em";
      contextMath.previewElement.style.fontSize = "1em";
      contextMath.previewElement.innerHTML = "";
      return true;
    }.bind(this);

    try {
      if (submitAction()) {
        this.plugins.dialog.close.call(this); // history stack

        this.history.push(false);
      }
    } catch (e) {
      this.plugins.dialog.close.call(this);
    } finally {
      this.closeLoading();
    }

    return false;
  },
  active: function active(element) {
    if (!element) {
      if (this.controllerArray.indexOf(this.context.math.mathController) > -1) {
        this.controllersOff();
      }
    } else if (element.getAttribute("data-exp")) {
      if (this.controllerArray.indexOf(this.context.math.mathController) < 0) {
        this.setRange(element, 0, element, 1);
        this.plugins.math.call_controller.call(this, element);
      }

      return true;
    }

    return false;
  },
  on: function on(update) {
    if (!update) {
      this.plugins.math.init.call(this);
    } else {
      var contextMath = this.context.math;

      if (contextMath._mathExp) {
        var exp = this.util.HTMLDecoder(contextMath._mathExp.getAttribute("data-exp"));
        var fontSize = contextMath._mathExp.getAttribute("data-font-size") || "1em";
        this.context.dialog.updateModal = true;
        contextMath.focusElement.value = exp;
        contextMath.fontSizeElement.value = fontSize;
        contextMath.previewElement.innerHTML = this.plugins.math._renderer.call(this, exp);
        contextMath.previewElement.style.fontSize = fontSize;
      }
    }
  },
  call_controller: function call_controller(mathTag) {
    this.context.math._mathExp = mathTag;
    var mathBtn = this.context.math.mathController;
    var offset = this.util.getOffset(mathTag, this.context.element.wysiwygFrame);
    mathBtn.style.top = offset.top + mathTag.offsetHeight + 10 + "px";
    mathBtn.style.left = offset.left - this.context.element.wysiwygFrame.scrollLeft + "px";
    mathBtn.style.display = "block";
    var overLeft = this.context.element.wysiwygFrame.offsetWidth - (mathBtn.offsetLeft + mathBtn.offsetWidth);

    if (overLeft < 0) {
      mathBtn.style.left = mathBtn.offsetLeft + overLeft + "px";
      mathBtn.firstElementChild.style.left = 20 - overLeft + "px";
    } else {
      mathBtn.firstElementChild.style.left = "20px";
    }

    this.controllersOn(mathBtn, mathTag, "math");
  },
  onClick_mathController: function onClick_mathController(e) {
    e.stopPropagation();
    var command = e.target.getAttribute("data-command") || e.target.parentNode.getAttribute("data-command");

    if (!command) {
      return;
    }

    e.preventDefault();

    if (/update/.test(command)) {
      this.context.math.focusElement.value = this.util.HTMLDecoder(this.context.math._mathExp.getAttribute("data-exp"));
      this.plugins.dialog.open.call(this, "math", true);
    } else {
      /** delete */
      this.util.removeItem(this.context.math._mathExp);
      this.context.math._mathExp = null;
      this.focus(); // history stack

      this.history.push(false);
    }

    this.controllersOff();
  },
  init: function init() {
    var contextMath = this.context.math;
    contextMath.mathController.style.display = "none";
    contextMath._mathExp = null;
    contextMath.focusElement.value = "";
    contextMath.previewElement.innerHTML = "";
  }
};
exports.default = _default;