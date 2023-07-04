"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/* eslint-disable no-unused-vars */

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @description Tooltip
 * @param {selector} element dom object
 * @param {animation} animation: 'toTop' | 'rotate' | 'scale' | 'skew', css3 animation
 * @param {direction} direction: 'top' | 'right' | 'bottom' | 'left'
 * @param {enterCallback} mouseenter events callback
 * @param {outCallback} mouseleave events callback
 */
var Tooltip = /*#__PURE__*/function () {
  _createClass(Tooltip, null, [{
    key: "bind",
    value: function bind(selector) {
      var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "top";
      var animation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "toBottom";
      var enterCallback = arguments.length > 3 ? arguments[3] : undefined;
      var outCallback = arguments.length > 4 ? arguments[4] : undefined;
      var tooltips = document.querySelectorAll(selector);

      for (var i = tooltips.length - 1; i >= 0; i--) {
        new Tooltip(tooltips[i], direction, animation, enterCallback, outCallback);
      }
    }
  }]);

  function Tooltip(element, direction, animation, enterCallback, outCallback) {
    var _this = this;

    _classCallCheck(this, Tooltip);

    this.element = element;

    if (animation !== null) {
      this.animation = animation.split(" ");
    } // direction


    this.direction = direction; // transition time

    this.transTime = 300; // timer

    this.timer = null; // target

    this.tipTitle = element.getAttribute("data-tooltip"); // callback

    this.enterCallback = enterCallback;
    this.outCallback = outCallback;
    this.tooltip = null;
    this.element.addEventListener("mouseover", // this.mouseOver.bind(this),
    function (e) {
      if (_this.checkHover(e, _this.element)) {
        _this.mouseOver();
      }
    }, false);
    this.element.addEventListener("mouseout", // this.mouseOut.bind(this),
    function (e) {
      if (_this.checkHover(e, _this.element)) {
        _this.mouseOut();
      }
    }, false);
  }

  _createClass(Tooltip, [{
    key: "checkHover",
    value: function checkHover(e, target) {
      if (this.getEvent(e).type === "mouseover") {
        return !this.nodeContains(target, this.getEvent(e).relatedTarget || this.getEvent(e).fromElement) && !((this.getEvent(e).relatedTarget || this.getEvent(e).fromElement) === target);
      } else {
        return !this.nodeContains(target, this.getEvent(e).relatedTarget || this.getEvent(e).toElement) && !((this.getEvent(e).relatedTarget || this.getEvent(e).toElement) === target);
      }
    }
  }, {
    key: "nodeContains",
    value: function nodeContains(parentNode, childNode) {
      if (parentNode.contains) {
        return parentNode !== childNode && parentNode.contains(childNode);
      } else {
        return !!(parentNode.compareDocumentPosition(childNode) & 16);
      }
    }
  }, {
    key: "getEvent",
    value: function getEvent(e) {
      return e || window.event;
    }
  }, {
    key: "mouseOver",
    value: function mouseOver() {
      this.timer && clearTimeout(this.timer);
      var tooltip = this.createTooltip();
      var width = tooltip.offsetWidth;
      var height = tooltip.offsetHeight;
      var left = 0;
      var top = 0;

      switch (this.direction) {
        case "top":
          left = this.element.offsetWidth / 2 - width / 2 + this.element.getBoundingClientRect().left + document.documentElement.scrollLeft;
          top = this.element.getBoundingClientRect().top - height - 15 + document.documentElement.scrollTop;
          break;

        case "bottom":
          left = (this.element.offsetWidth - width) / 2 + this.element.getBoundingClientRect().left + document.documentElement.scrollLeft;
          top = this.element.getBoundingClientRect().bottom + document.documentElement.scrollTop;
          break;

        case "left":
          left = this.element.getBoundingClientRect().left - width - 15 + document.documentElement.scrollLeft;
          top = this.element.getBoundingClientRect().top - (this.element.offsetHeight - height) / 2 + document.documentElement.scrollTop;
          break;

        case "right":
          left = this.element.getBoundingClientRect().right + 15 + document.documentElement.scrollLeft;
          top = this.element.getBoundingClientRect().top - (this.element.offsetHeight - height) / 2 + document.documentElement.scrollTop;
          break;

        default:
          left = (this.element.offsetWidth - width) / 2 + this.element.getBoundingClientRect().left + document.documentElement.scrollLeft;
          top = this.element.getBoundingClientRect().bottom + 15 + document.documentElement.scrollTop;
      }

      if (top < 20) {
        top = this.element.getBoundingClientRect().top + height + 15 + document.documentElement.scrollTop;
        tooltip.classList.add("trans__bottom");
      }

      tooltip.style.left = left + "px";
      tooltip.style.top = top + "px";
      tooltip.classList.add("tooltip__visible");

      if (typeof this.enterCallback === "function") {
        this.enterCallback();
      }
    }
  }, {
    key: "mouseOut",
    value: function mouseOut() {
      var _this2 = this;

      if (this.tooltip !== null) {
        this.timer && clearTimeout(this.timer);
        this.tooltip.classList.remove("tooltip__visible");
        this.timer = setTimeout(function () {
          try {
            document.body.removeChild(_this2.tooltip);
            _this2.tooltip = null;

            if (typeof _this2.outCallback === "function") {
              _this2.outCallback();
            }
          } catch (e) {
            console.error(e);
          }
        }, this.transTime);
      }
    }
  }, {
    key: "newId",
    value: function newId() {
      return (new Date().getTime() + Math.floor(Math.random() * 10000 + 1)).toString(16);
    }
  }, {
    key: "createTooltip",
    value: function createTooltip() {
      if (this.tooltip === null) {
        var tooltip = document.createElement("div");
        tooltip.innerHTML = this.tipTitle;
        tooltip.classList.add("ke_tooltip");
        this.id = this.newId();
        tooltip.setAttribute("data-tooltip", this.newId());
        document.body.appendChild(tooltip);
        this.tooltip = tooltip;
        tooltip.classList.add("direction__".concat(this.direction));

        if (this.animation !== null) {
          this.animation.forEach(function (element) {
            tooltip.classList.add("trans__".concat(element));
          });
        }
      }

      return this.tooltip;
    }
  }]);

  return Tooltip;
}();

exports.default = Tooltip;