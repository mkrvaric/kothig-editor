"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _core = _interopRequireDefault(require("./lib/core"));

var _util = _interopRequireDefault(require("./lib/util"));

var _constructor = _interopRequireDefault(require("./lib/constructor"));

var _context = _interopRequireDefault(require("./lib/context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = {
  /**
   * @description Returns the create function with preset options.
   * If the options overlap, the options of the 'create' function take precedence.
   * @param {Json} options Initialization options
   * @returns {Object}
   */
  init: function init(init_options) {
    return {
      create: function (idOrElement, options) {
        return this.create(idOrElement, options, init_options);
      }.bind(this)
    };
  },

  /**
   * @description Create the KothingEditor
   * @param {String|Element} idOrElement textarea Id or textarea element
   * @param {JSON|Object} options user options
   * @returns {Object}
   */
  create: function create(idOrElement, options, _init_options) {
    _util.default._propertiesInit();

    if (_typeof(options) !== "object") {
      options = {};
    }

    if (_init_options) {
      options = [_init_options, options].reduce(function (init, option) {
        for (var key in option) {
          if (!_util.default.hasOwn(option, key)) {
            continue;
          }

          if (key === "plugins" && option[key] && init[key]) {
            (function () {
              var i = init[key],
                  o = option[key];
              i = i.length ? i : Object.keys(i).map(function (name) {
                return i[name];
              });
              o = o.length ? o : Object.keys(o).map(function (name) {
                return o[name];
              });
              init[key] = o.filter(function (val) {
                return i.indexOf(val) === -1;
              }).concat(i);
            })();
          } else {
            init[key] = option[key];
          }
        }

        return init;
      }, {});
    }

    var element = typeof idOrElement === "string" ? document.getElementById(idOrElement) : idOrElement;

    if (!element) {
      if (typeof idOrElement === "string") {
        throw Error('[KothingEditor.create.fail] The element for that id was not found (ID:"' + idOrElement + '")');
      }

      throw Error("[KothingEditor.create.fail] KothingEditor requires textarea's element or id value");
    }

    var cons = _constructor.default.init(element, options);

    if (cons.constructed._top.id && document.getElementById(cons.constructed._top.id)) {
      throw Error('[KothingEditor.create.fail] The ID of the KothingEditor you are trying to create already exists (ID:"' + cons.constructed._top.id + '")');
    }

    return (0, _core.default)((0, _context.default)(element, cons.constructed, cons.options), cons.pluginCallButtons, cons.plugins, cons.options.lang, options, cons._responsiveButtons);
  }
};
exports.default = _default;