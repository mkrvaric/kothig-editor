"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _constructor = _interopRequireDefault(require("./constructor"));

var _context = _interopRequireDefault(require("./context"));

var _history2 = _interopRequireDefault(require("./history"));

var _util2 = _interopRequireDefault(require("./util"));

var _notice2 = _interopRequireDefault(require("../plugins/modules/_notice"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @description KothingEditor constuctor function.
 * create core object and event registration.
 * core, event, functions
 * @param {Object} context
 * @param {Object} pluginCallButtons
 * @param {Object} plugins
 * @param {Object} lang
 * @param {Object} options
 * @param {Object} _responsiveButtons
 * @returns {Object} functions Object
 */
function _default(context, pluginCallButtons, plugins, lang, options, _responsiveButtons) {
  var _d = context.element.originElement.ownerDocument || document;

  var _w = _d.defaultView || window;

  var util = _util2.default;
  var icons = options.icons;
  /**
   * @description editor core object
   * should always bind this object when registering an event in the plug-in.
   */

  var core = {
    _d: _d,
    _w: _w,
    _parser: new _w.DOMParser(),

    /**
     * @description Document object of the iframe if created as an iframe || _d
     * @private
     */
    _wd: null,

    /**
     * @description Window object of the iframe if created as an iframe || _w
     * @private
     */
    _ww: null,

    /**
     * @description Closest ShadowRoot to editor if found
     * @private
     */
    _shadowRoot: null,

    /**
     * @description Util object
     */
    util: util,

    /**
     * @description Functions object
     */
    functions: null,

    /**
     * @description Notice object
     */
    notice: _notice2.default,

    /**
     * @description Default icons object
     */
    icons: icons,

    /**
     * @description History object for undo, redo
     */
    history: null,

    /**
     * @description Elements and user options parameters of the KothingEditor
     */
    context: context,

    /**
     * @description Plugin buttons
     */
    pluginCallButtons: pluginCallButtons,

    /**
     * @description Loaded plugins
     */
    plugins: plugins || {},

    /**
     * @description Whether the plugin is initialized
     */
    initPlugins: {},

    /**
     * @description Object for managing submenu elements
     * @private
     */
    _targetPlugins: {},

    /**
     * @description Save rendered submenus and containers
     * @private
     */
    _menuTray: {},

    /**
     * @description loaded language
     */
    lang: lang,

    /**
     * @description The selection node (core.getSelectionNode()) to which the effect was last applied
     */
    effectNode: null,

    /**
     * @description submenu element
     */
    submenu: null,

    /**
     * @description container element
     */
    container: null,

    /**
     * @description current subment name
     * @private
     */
    _submenuName: "",

    /**
     * @description binded submenuOff method
     * @private
     */
    _bindedSubmenuOff: null,

    /**
     * @description binded containerOff method
     * @private
     */
    _bindedContainerOff: null,

    /**
     * @description active button element in submenu
     */
    submenuActiveButton: null,

    /**
     * @description active button element in container
     */
    containerActiveButton: null,

    /**
     * @description The elements array to be processed unvisible when the controllersOff function is executed (resizing, link modified button, table controller)
     */
    controllerArray: [],

    /**
     * @description The name of the plugin that called the currently active controller
     */
    currentControllerName: "",

    /**
     * @description The target element of current controller
     */
    currentControllerTarget: null,

    /**
     * @description The file component object of current selected file tag (getFileComponent)
     */
    currentFileComponentInfo: null,

    /**
     * @description An array of buttons whose class name is not "ke-code-view-enabled"
     */
    codeViewDisabledButtons: null,

    /**
     * @description An array of buttons whose class name is not "ke-resizing-enabled"
     */
    resizingDisabledButtons: null,

    /**
     * @description active more layer element in submenu
     * @private
     */
    _moreLayerActiveButton: null,

    /**
     * @description Tag whitelist RegExp object used in "_consistencyCheckOfHTML" method
     * ^(options._editorTagsWhitelist)$
     * @private
     */
    _htmlCheckWhitelistRegExp: null,

    /**
     * @description RegExp when using check disallowd tags. (b, i, ins, strike, s)
     * @private
     */
    _disallowedTextTagsRegExp: null,

    /**
     * @description Editor tags whitelist (RegExp object)
     * util.createTagsWhitelist(options._editorTagsWhitelist)
     */
    editorTagsWhitelistRegExp: null,

    /**
     * @description Tag whitelist when pasting (RegExp object)
     * util.createTagsWhitelist(options.pasteTagsWhitelist)
     */
    pasteTagsWhitelistRegExp: null,

    /**
     * @description Boolean value of whether the editor has focus
     */
    hasFocus: false,

    /**
     * @description Boolean value of whether the editor is disabled
     */
    isDisabled: false,

    /**
     * @description Attributes whitelist used by the cleanHTML method
     * @private
     */
    _attributesWhitelistRegExp: null,

    /**
     * @description Attributes of tags whitelist used by the cleanHTML method
     * @private
     */
    _attributesTagsWhitelist: null,

    /**
     * @description binded controllersOff method
     * @private
     */
    _bindControllersOff: null,

    /**
     * @description Is inline mode?
     * @private
     */
    _isInline: null,

    /**
     * @description Is balloon|balloon-always mode?
     * @private
     */
    _isBalloon: null,

    /**
     * @description Is balloon-always mode?
     * @private
     */
    _isBalloonAlways: null,

    /**
     * @description Required value when using inline mode to sticky toolbar
     * @private
     */
    _inlineToolbarAttr: {
      top: "",
      width: "",
      isShow: false
    },

    /**
     * @description Variable that controls the "blur" event in the editor of inline or balloon mode when the focus is moved to submenu
     * @private
     */
    _notHideToolbar: false,

    /**
     * @description Variable value that sticky toolbar mode
     * @private
     */
    _sticky: false,

    /**
     * @description Variables for controlling focus and blur events
     * @private
     */
    _antiBlur: false,

    /**
     * @description Component line breaker element
     * @private
     */
    _lineBreaker: null,
    _lineBreakerButton: null,

    /**
     * @description If true, (initialize, reset) all indexes of image, video information
     * @private
     */
    _componentsInfoInit: true,
    _componentsInfoReset: false,

    /**
     * @description Plugins array with "active" method.
     * "activePlugins" runs the "add" method when creating the editor.
     */
    activePlugins: null,

    /**
     * @description Information of tags that should maintain HTML structure, style, class name, etc. (In use by "math" plugin)
     * When inserting "html" such as paste, it is executed on the "html" to be inserted. (core.cleanHTML)
     * Basic Editor Actions:
     * 1. All classes not starting with "__ke__" or "ke-" in the editor are removed.
     * 2. The style of all tags except the "span" tag is removed from the editor.
     * "managedTagsInfo" structure ex:
     * managedTagsInfo: {
     *   query: '.__ke__xxx, ke-xxx'
     *   map: {
     *     '__ke__xxx': method.bind(core),
     *     'ke-xxx': method.bind(core),
     *   }
     * }
     * @example
     * Define in the following return format in the "managedTagInfo" function of the plugin.
     * managedTagInfo() => {
     *  return {
     *    className: 'string', // Class name to identify the tag. ("__ke__xxx", "ke-xxx")
     *    // Change the html of the "element". ("element" is the element found with "className".)
     *    // "method" is executed by binding "core".
     *    method: function (element) {
     *      // this === core
     *      element.innerHTML = // (rendered html);
     *    }
     *  }
     * }
     */
    managedTagsInfo: null,

    /**
     * @description cashing: options.charCounterType === 'byte-html'
     * @private
     */
    _charTypeHTML: false,

    /**
     * @description Array of "checkFileInfo" functions with the core bound
     * (Plugins with "checkFileInfo" and "resetFileInfo" methods)
     * "fileInfoPlugins" runs the "add" method when creating the editor.
     * "checkFileInfo" method is always call just before the "change" event.
     * @private
     */
    _fileInfoPluginsCheck: null,

    /**
     * @description Array of "resetFileInfo" functions with the core bound
     * (Plugins with "checkFileInfo" and "resetFileInfo" methods)
     * "checkFileInfo" method is always call just before the "functions.setOptions" method.
     * @private
     */
    _fileInfoPluginsReset: null,

    /**
     * @description Variables for file component management
     * @private
     */
    _fileManager: {
      tags: null,
      regExp: null,
      queryString: null,
      pluginRegExp: null,
      pluginMap: null
    },

    /**
     * @description Elements that need to change text or className for each selection change
     * After creating the editor, "activePlugins" are added.
     * @property {Element} STRONG bold button
     * @property {Element} U underline button
     * @property {Element} EM italic button
     * @property {Element} DEL strike button
     * @property {Element} SUB subscript button
     * @property {Element} SUP superscript button
     * @property {Element} OUTDENT outdent button
     * @property {Element} INDENT indent button
     */
    commandMap: null,

    /**
     * @description Style button related to edit area
     * @property {Element} fullScreen fullScreen button element
     * @property {Element} showBlocks showBlocks button element
     * @property {Element} codeView codeView button element
     * @private
     */
    _styleCommandMap: null,

    /**
     * @description Map of default command
     * @private
     */
    _defaultCommand: {
      bold: "STRONG",
      underline: "U",
      italic: "EM",
      strike: "DEL",
      subscript: "SUB",
      superscript: "SUP"
    },

    /**
     * @description Variables used internally in editor operation
     * @property {Boolean} isCodeView State of code view
     * @property {Boolean} isFullScreen State of full screen
     * @property {Number} innerHeight_fullScreen InnerHeight in editor when in full screen
     * @property {Number} resizeClientY Remember the vertical size of the editor before resizing the editor (Used when calculating during resize operation)
     * @property {Number} tabSize Indent size of tab (4)
     * @property {Number} codeIndent Indent size of Code view mode (4)
     * @property {Number} minResizingSize Minimum size of editing area when resized {Number} (.ke-wrapper-inner {min-height: 65px;} || 65)
     * @property {Array} currentNodes  An array of the current cursor's node structure
     * @private
     */
    _variable: {
      isCodeView: false,
      isFullScreen: false,
      innerHeight_fullScreen: 0,
      resizeClientY: 0,
      tabSize: 4,
      codeIndent: 4,
      minResizingSize: util.getNumber(context.element.wysiwygFrame.style.minHeight || "65", 0),
      currentNodes: [],
      currentNodesMap: [],
      _range: null,
      _selectionNode: null,
      _originCssText: context.element.topArea.style.cssText,
      _bodyOverflow: "",
      _editorAreaOriginCssText: "",
      _wysiwygOriginCssText: "",
      _codeOriginCssText: "",
      _fullScreenAttrs: {
        sticky: false,
        balloon: false,
        inline: false
      },
      _lineBreakComp: null,
      _lineBreakDir: ""
    },

    /**
     * @description If the plugin is not added, add the plugin and call the 'add' function.
     * If the plugin is added call callBack function.
     * @param {String} pluginName The name of the plugin to call
     * @param {function} callBackFunction Function to be executed immediately after module call
     * @param {Element|null} _target Plugin target button (This is not necessary if you have a button list when creating the editor)
     */
    callPlugin: function callPlugin(pluginName, callBackFunction, _target) {
      _target = _target || pluginCallButtons[pluginName];

      if (!this.plugins[pluginName]) {
        throw Error('[KothingEditor.core.callPlugin.fail] The called plugin does not exist or is in an invalid format. (pluginName:"' + pluginName + '")');
      } else if (!this.initPlugins[pluginName]) {
        this.plugins[pluginName].add(this, _target);
        this.initPlugins[pluginName] = true;
      } else if (_typeof(this._targetPlugins[pluginName]) === "object" && !!_target) {
        this.initMenuTarget(pluginName, _target, this._targetPlugins[pluginName]);
      }

      if (this.plugins[pluginName].active && !this.commandMap[pluginName] && !!_target) {
        this.commandMap[pluginName] = _target;
        this.activePlugins.push(pluginName);
      }

      if (typeof callBackFunction === "function") {
        callBackFunction();
      }
    },

    /**
     * @description If the module is not added, add the module and call the 'add' function
     * @param {Array} moduleArray module object's Array [dialog, resizing]
     */
    addModule: function addModule(moduleArray) {
      for (var i = 0, len = moduleArray.length, moduleName; i < len; i++) {
        moduleName = moduleArray[i].name;

        if (!this.plugins[moduleName]) {
          this.plugins[moduleName] = moduleArray[i];
        }

        if (!this.initPlugins[moduleName]) {
          this.initPlugins[moduleName] = true;
          if (typeof this.plugins[moduleName].add === "function") this.plugins[moduleName].add(this);
        }
      }
    },

    /**
     * @description Method for managing submenu element.
     * You must add the "submenu" element using the this method at custom plugin.
     * @param {String} pluginName Plugin name
     * @param {Element|null} target Target button
     * @param {Element} menu Submenu element
     */
    initMenuTarget: function initMenuTarget(pluginName, target, menu) {
      if (!target) {
        this._targetPlugins[pluginName] = menu;
      } else {
        context.element._menuTray.appendChild(menu);

        this._targetPlugins[pluginName] = true;
        this._menuTray[target.getAttribute("data-command")] = menu;
      }
    },

    /**
     * @description Enabled submenu
     * @param {Element} element Submenu's button element to call
     */
    submenuOn: function submenuOn(element) {
      if (this._bindedSubmenuOff) this._bindedSubmenuOff();
      if (this._bindControllersOff) this.controllersOff();
      var submenuName = element.getAttribute("data-command");
      this._submenuName = element.getAttribute("data-command");
      var menu = this._menuTray[submenuName];
      this.submenu = this._menuTray[submenuName];
      this.submenuActiveButton = element;

      this._setMenuPosition(element, menu);

      this._bindedSubmenuOff = this.submenuOff.bind(this);
      this.addDocEvent("mousedown", this._bindedSubmenuOff, false);

      if (this.plugins[submenuName].on) {
        this.plugins[submenuName].on.call(this);
      }

      this._antiBlur = true;
    },

    /**
     * @description Disable submenu
     */
    submenuOff: function submenuOff() {
      this.removeDocEvent("mousedown", this._bindedSubmenuOff);
      this._bindedSubmenuOff = null;

      if (this.submenu) {
        this._submenuName = "";
        this.submenu.style.display = "none";
        this.submenu = null;
        util.removeClass(this.submenuActiveButton, "on");
        this.submenuActiveButton = null;
        this._notHideToolbar = false;
      }

      this._antiBlur = false;
    },

    /**
     * @description Enabled container
     * @param {Element} element Container's button element to call
     */
    containerOn: function containerOn(element) {
      if (this._bindedContainerOff) this._bindedContainerOff();
      var containerName = element.getAttribute("data-command");
      this._containerName = element.getAttribute("data-command");
      var menu = this._menuTray[containerName];
      this.container = this._menuTray[containerName];
      this.containerActiveButton = element;

      this._setMenuPosition(element, menu);

      this._bindedContainerOff = this.containerOff.bind(this);
      this.addDocEvent("mousedown", this._bindedContainerOff, false);

      if (this.plugins[containerName].on) {
        this.plugins[containerName].on.call(this);
      }

      this._antiBlur = true;
    },

    /**
     * @description Disable container
     */
    containerOff: function containerOff() {
      this.removeDocEvent("mousedown", this._bindedContainerOff);
      this._bindedContainerOff = null;

      if (this.container) {
        this._containerName = "";
        this.container.style.display = "none";
        this.container = null;
        util.removeClass(this.containerActiveButton, "on");
        this.containerActiveButton = null;
        this._notHideToolbar = false;
      }

      this._antiBlur = false;
    },

    /**
     * @description Set the menu position. (submenu, container)
     * @param {*} element Button element
     * @param {*} menu Menu element
     * @private
     */
    _setMenuPosition: function _setMenuPosition(element, menu) {
      menu.style.top = "-10000px";
      menu.style.visibility = "hidden";
      menu.style.display = "block";
      menu.style.height = "";
      util.addClass(element, "on");
      var toolbar = this.context.element.toolbar;
      var toolbarW = toolbar.offsetWidth;
      var menuW = menu.offsetWidth;
      var l = element.parentElement.offsetLeft + 3;
      var overLeft = toolbarW <= menuW ? 0 : toolbarW - (l + menuW);
      if (overLeft < 0) menu.style.left = l + overLeft + "px";else menu.style.left = l + "px"; // get element top

      var t = 0;
      var offsetEl = element;

      while (offsetEl && offsetEl !== toolbar) {
        t += offsetEl.offsetTop;
        offsetEl = offsetEl.offsetParent;
      }

      var bt = t;

      if (this._isBalloon) {
        t += toolbar.offsetTop + element.offsetHeight;
      } else {
        t -= element.offsetHeight;
      } // set menu position


      var toolbarTop = event._getEditorOffsets(context.element.toolbar).top;

      var menuHeight = menu.offsetHeight;
      var el = context.element.topArea;
      var scrollTop = 0;

      while (!!el) {
        scrollTop += el.scrollTop;
        el = el.parentElement;
      }

      var menuHeight_bottom = _w.innerHeight - (toolbarTop - scrollTop + bt + element.parentElement.offsetHeight);

      if (menuHeight_bottom < menuHeight) {
        var menuTop = -1 * (menuHeight - bt + 3);
        var insTop = toolbarTop - scrollTop + menuTop;
        var menuHeight_top = menuHeight + (insTop < 0 ? insTop : 0);

        if (menuHeight_top > menuHeight_bottom) {
          menu.style.height = menuHeight_top + "px";
          menuTop = -1 * (menuHeight_top - bt + 3);
        } else {
          menu.style.height = menuHeight_bottom + "px";
          menuTop = bt + element.parentElement.offsetHeight;
        }

        menu.style.top = menuTop + "px";
      } else {
        menu.style.top = bt + element.parentElement.offsetHeight + "px";
      }

      menu.style.visibility = "";
    },

    /**
     * @description Show controller at editor area (controller elements, function, "controller target element(@Required)", "controller name(@Required)", etc..)
     * @param {*} arguments controller elements, functions..
     */
    controllersOn: function controllersOn() {
      if (this._bindControllersOff) this._bindControllersOff();
      this.controllerArray = [];

      for (var i = 0, arg; i < arguments.length; i++) {
        arg = arguments[i];
        if (!arg) continue;

        if (typeof arg === "string") {
          this.currentControllerName = arg;
          continue;
        }

        if (typeof arg === "function") {
          this.controllerArray.push(arg);
          continue;
        }

        if (!util.hasClass(arg, "ke-controller")) {
          this.currentControllerTarget = arg;
          this.currentFileComponentInfo = this.getFileComponent(arg);
          continue;
        }

        if (arg.style) arg.style.display = "block";
        this.controllerArray.push(arg);
      }

      this._bindControllersOff = this.controllersOff.bind(this);
      this.addDocEvent("mousedown", this._bindControllersOff, false);
      this.addDocEvent("keydown", this._bindControllersOff, false);
      this._antiBlur = true;
      if (typeof functions.showController === "function") functions.showController(this.currentControllerName, this.controllerArray, this);
    },

    /**
     * @description Hide controller at editor area (link button, image resize button..)
     * @param {KeyboardEvent|MouseEvent|null} e Event object when called from mousedown and keydown events registered in "core.controllersOn"
     */
    controllersOff: function controllersOff(e) {
      if (this._fileManager.pluginRegExp.test(this.currentControllerName) && e && e.type === "keydown" && e.keyCode !== 27) {
        return;
      }

      context.element.lineBreaker_t.style.display = "none";
      context.element.lineBreaker_b.style.display = "none";
      this._variable._lineBreakComp = null;
      this.currentControllerName = "";
      this.currentControllerTarget = null;
      this.currentFileComponentInfo = null;
      this.effectNode = null;

      if (!this._bindControllersOff) {
        return;
      }

      this.removeDocEvent("mousedown", this._bindControllersOff);
      this.removeDocEvent("keydown", this._bindControllersOff);
      this._bindControllersOff = null;
      var len = this.controllerArray.length;

      if (len > 0) {
        for (var i = 0; i < len; i++) {
          if (typeof this.controllerArray[i] === "function") this.controllerArray[i]();else this.controllerArray[i].style.display = "none";
        }

        this.controllerArray = [];
      }

      this._antiBlur = false;
    },

    /**
     * @description Run event.stopPropagation and event.preventDefault.
     * @param {Object} e Event Object
     */
    eventStop: function eventStop(e) {
      e.stopPropagation();
      e.preventDefault();
    },

    /**
     * @description javascript execCommand
     * @param {String} command javascript execCommand function property
     * @param {Boolean} showDefaultUI javascript execCommand function property
     * @param {String} value javascript execCommand function property
     */
    execCommand: function execCommand(command, showDefaultUI, value) {
      this._wd.execCommand(command, showDefaultUI, command === "formatBlock" ? "<" + value + ">" : value); // history stack


      this.history.push(true);
    },

    /**
     * @description Focus to wysiwyg area using "native focus function"
     */
    nativeFocus: function nativeFocus() {
      var caption = util.getParentElement(this.getSelectionNode(), "figcaption");

      if (caption) {
        caption.focus();
      } else {
        context.element.wysiwyg.focus();
      }

      this._editorRange();
    },

    /**
     * @description Focus to wysiwyg area
     */
    focus: function focus() {
      if (context.element.wysiwygFrame.style.display === "none") return;

      if (options.iframe) {
        this.nativeFocus();
      } else {
        try {
          var range = this.getRange();

          if (range.startContainer === range.endContainer && util.isWysiwygDiv(range.startContainer)) {
            var format = util.createElement("P");
            var br = util.createElement("BR");
            format.appendChild(br);
            context.element.wysiwyg.appendChild(format);
            this.setRange(br, 0, br, 0);
          } else {
            this.setRange(range.startContainer, range.startOffset, range.endContainer, range.endOffset);
          }
        } catch (e) {
          this.nativeFocus();
        }
      }

      event._applyTagEffects();

      if (this._isBalloon) event._toggleToolbarBalloon();
    },

    /**
     * @description If "focusEl" is a component, then that component is selected; if it is a format element, the last text is selected
     * If "focusEdge" is null, then selected last element
     * @param {Element|null} focusEl Focus element
     */
    focusEdge: function focusEdge(focusEl) {
      if (!focusEl) focusEl = context.element.wysiwyg.lastElementChild;
      var fileComponentInfo = this.getFileComponent(focusEl);

      if (fileComponentInfo) {
        this.selectComponent(fileComponentInfo.target, fileComponentInfo.pluginName);
      } else if (focusEl) {
        focusEl = util.getChildElement(focusEl, function (current) {
          return current.childNodes.length === 0 || current.nodeType === 3;
        }, true);
        if (!focusEl) this.nativeFocus();else this.setRange(focusEl, focusEl.textContent.length, focusEl, focusEl.textContent.length);
      } else {
        this.focus();
      }
    },

    /**
     * @description Set current editor's range object and return.
     * @param {Node} startCon The startContainer property of the selection object.
     * @param {Number} startOff The startOffset property of the selection object.
     * @param {Node} endCon The endContainer property of the selection object.
     * @param {Number} endOff The endOffset property of the selection object.
     * @returns {Object} Range object.
     */
    setRange: function setRange(startCon, startOff, endCon, endOff) {
      if (!startCon || !endCon) return;
      if (startOff > startCon.textContent.length) startOff = startCon.textContent.length;
      if (endOff > endCon.textContent.length) endOff = endCon.textContent.length;

      var range = this._wd.createRange();

      try {
        range.setStart(startCon, startOff);
        range.setEnd(endCon, endOff);
      } catch (error) {
        console.warn("[KothingEditor.core.focus.error] " + error);
        this.nativeFocus();
        return;
      }

      var selection = this.getSelection();

      if (selection.removeAllRanges) {
        selection.removeAllRanges();
      }

      selection.addRange(range);

      this._editorRange();

      if (options.iframe) this.nativeFocus();
      return range;
    },

    /**
     * @description Remove range object and button effect
     */
    removeRange: function removeRange() {
      this._variable._range = null;
      this._variable._selectionNode = null;
      this.getSelection().removeAllRanges();
      var commandMap = this.commandMap;
      var activePlugins = this.activePlugins;

      for (var key in commandMap) {
        if (!util.hasOwn(commandMap, key)) continue;

        if (activePlugins.indexOf(key) > -1) {
          plugins[key].active.call(this, null);
        } else if (commandMap.OUTDENT && /^OUTDENT$/i.test(key)) {
          commandMap.OUTDENT.setAttribute("disabled", true);
        } else if (commandMap.INDENT && /^INDENT$/i.test(key)) {
          commandMap.INDENT.removeAttribute("disabled");
        } else {
          util.removeClass(commandMap[key], "active");
        }
      }
    },

    /**
     * @description Get current editor's range object
     * @returns {Object}
     */
    getRange: function getRange() {
      var range = this._variable._range || this._createDefaultRange();

      var selection = this.getSelection();
      if (range.collapsed === selection.isCollapsed || !context.element.wysiwyg.contains(selection.focusNode)) return range;

      if (selection.rangeCount > 0) {
        this._variable._range = selection.getRangeAt(0);
        return this._variable._range;
      } else {
        var sc = selection.anchorNode;
        var ec = selection.focusNode;
        var so = selection.anchorOffset;
        var eo = selection.focusOffset;
        var compareValue = util.compareElements(sc, ec);
        var rightDir = compareValue.ancestor && (compareValue.result === 0 ? so <= eo : compareValue.result > 1 ? true : false);
        return this.setRange(rightDir ? sc : ec, rightDir ? so : eo, rightDir ? ec : sc, rightDir ? eo : so);
      }
    },

    /**
     * @description If the "range" object is a non-editable area, add a line at the top of the editor and update the "range" object.
     * Returns a new "range" or argument "range".
     * @param {Object} range core.getRange()
     * @returns {Object} range
     */
    getRange_addLine: function getRange_addLine(range) {
      if (this._selectionVoid(range)) {
        var wysiwyg = context.element.wysiwyg;
        var op = util.createElement("P");
        op.innerHTML = "<br>";
        wysiwyg.insertBefore(op, wysiwyg.firstElementChild);
        this.setRange(op.firstElementChild, 0, op.firstElementChild, 1);
        range = this._variable._range;
      }

      return range;
    },

    /**
     * @description Get window selection obejct
     * @returns {Object}
     */
    getSelection: function getSelection() {
      return this._shadowRoot && this._shadowRoot.getSelection ? this._shadowRoot.getSelection() : this._ww.getSelection();
    },

    /**
     * @description Get current select node
     * @returns {Node}
     */
    getSelectionNode: function getSelectionNode() {
      if (util.isWysiwygDiv(this._variable._selectionNode)) this._editorRange();

      if (!this._variable._selectionNode) {
        var selectionNode = util.getChildElement(context.element.wysiwyg.firstChild, function (current) {
          return current.childNodes.length === 0 || current.nodeType === 3;
        }, false);

        if (!selectionNode) {
          this._editorRange();
        } else {
          this._variable._selectionNode = selectionNode;
          return selectionNode;
        }
      }

      return this._variable._selectionNode;
    },

    /**
     * @description Saving the range object and the currently selected node of editor
     * @private
     */
    _editorRange: function _editorRange() {
      var selection = this.getSelection();
      if (!selection) return null;
      var range = null;
      var selectionNode = null;

      if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
      } else {
        range = this._createDefaultRange();
      }

      this._variable._range = range;

      if (range.collapsed) {
        selectionNode = range.commonAncestorContainer;
      } else {
        selectionNode = selection.extentNode || selection.anchorNode;
      }

      this._variable._selectionNode = selectionNode;
    },

    /**
     * @description Return the range object of editor's first child node
     * @returns {Object}
     * @private
     */
    _createDefaultRange: function _createDefaultRange() {
      var wysiwyg = context.element.wysiwyg;
      wysiwyg.focus();

      var range = this._wd.createRange();

      var focusEl = wysiwyg.firstElementChild;

      if (!focusEl) {
        focusEl = util.createElement("P");
        focusEl.innerHTML = "<br>";
        wysiwyg.appendChild(focusEl);
      }

      range.setStart(focusEl, 0);
      range.setEnd(focusEl, 0);
      return range;
    },

    /**
     * @description Returns true if there is no valid "selection".
     * @param {Object} range core.getRange()
     * @returns {Object} range
     * @private
     */
    _selectionVoid: function _selectionVoid(range) {
      var comm = range.commonAncestorContainer;
      return util.isWysiwygDiv(range.startContainer) && util.isWysiwygDiv(range.endContainer) || /FIGURE/i.test(comm.nodeName) || this._fileManager.regExp.test(comm.nodeName) || util.isMediaComponent(comm);
    },

    /**
     * @description Reset range object to text node selected status.
     * @returns {Boolean} Returns false if there is no valid selection.
     * @private
     */
    _resetRangeToTextNode: function _resetRangeToTextNode() {
      var range = this.getRange();
      if (this._selectionVoid(range)) return false;
      var startCon = range.startContainer;
      var startOff = range.startOffset;
      var endCon = range.endContainer;
      var endOff = range.endOffset;
      var tempCon, tempOffset, tempChild;

      if (util.isFormatElement(startCon)) {
        startCon = startCon.childNodes[startOff] || startCon.lastChild;
        startOff = startCon.textContent.length;
      }

      if (util.isFormatElement(endCon)) {
        endCon = endCon.childNodes[endOff] || endCon.lastChild;
        endOff = endCon.textContent.length;
      } // startContainer


      tempCon = util.isWysiwygDiv(startCon) ? context.element.wysiwyg.firstChild : startCon;
      tempOffset = startOff;

      if (util.isBreak(tempCon) || tempCon.nodeType === 1 && tempCon.childNodes.length > 0) {
        var onlyBreak = util.isBreak(tempCon);

        if (!onlyBreak) {
          while (tempCon && !util.isBreak(tempCon) && tempCon.nodeType === 1) {
            tempCon = tempCon.childNodes[tempOffset] || tempCon.nextElementSibling || tempCon.nextSibling;
            tempOffset = 0;
          }

          var format = util.getFormatElement(tempCon, null);

          if (format === util.getRangeFormatElement(format, null)) {
            format = util.createElement(util.getParentElement(tempCon, util.isCell) ? "DIV" : "P");
            tempCon.parentNode.insertBefore(format, tempCon);
            format.appendChild(tempCon);
          }
        }

        if (util.isBreak(tempCon)) {
          var emptyText = util.createTextNode(util.zeroWidthSpace);
          tempCon.parentNode.insertBefore(emptyText, tempCon);
          tempCon = emptyText;

          if (onlyBreak) {
            if (startCon === endCon) {
              endCon = tempCon;
              endOff = 1;
            }
          }
        }
      } // set startContainer


      startCon = tempCon;
      startOff = tempOffset; // endContainer

      tempCon = util.isWysiwygDiv(endCon) ? context.element.wysiwyg.lastChild : endCon;
      tempOffset = endOff;

      if (util.isBreak(tempCon) || tempCon.nodeType === 1 && tempCon.childNodes.length > 0) {
        var _onlyBreak = util.isBreak(tempCon);

        if (!_onlyBreak) {
          while (tempCon && !util.isBreak(tempCon) && tempCon.nodeType === 1) {
            tempChild = tempCon.childNodes;
            if (tempChild.length === 0) break;
            tempCon = tempChild[tempOffset > 0 ? tempOffset - 1 : tempOffset] || !/FIGURE/i.test(tempChild[0].nodeName) ? tempChild[0] : tempCon.previousElementSibling || tempCon.previousSibling || startCon;
            tempOffset = tempOffset > 0 ? tempCon.textContent.length : tempOffset;
          }

          var _format = util.getFormatElement(tempCon, null);

          if (_format === util.getRangeFormatElement(_format, null)) {
            _format = util.createElement(util.isCell(_format) ? "DIV" : "P");
            tempCon.parentNode.insertBefore(_format, tempCon);

            _format.appendChild(tempCon);
          }
        }

        if (util.isBreak(tempCon)) {
          var _emptyText = util.createTextNode(util.zeroWidthSpace);

          tempCon.parentNode.insertBefore(_emptyText, tempCon);
          tempCon = _emptyText;
          tempOffset = 1;

          if (_onlyBreak && !tempCon.previousSibling) {
            util.removeItem(endCon);
          }
        }
      } // set endContainer


      endCon = tempCon;
      endOff = tempOffset; // set Range

      this.setRange(startCon, startOff, endCon, endOff);
      return true;
    },

    /**
     * @description Returns a "formatElement"(util.isFormatElement) array from the currently selected range.
     * @param {Function|null} validation The validation function. (Replaces the default validation function-util.isFormatElement(current))
     * @returns {Array}
     */
    getSelectedElements: function getSelectedElements(validation) {
      if (!this._resetRangeToTextNode()) return [];
      var range = this.getRange();

      if (util.isWysiwygDiv(range.startContainer)) {
        var children = context.element.wysiwyg.children;
        if (children.length === 0) return [];
        this.setRange(children[0], 0, children[children.length - 1], children[children.length - 1].textContent.trim().length);
        range = this.getRange();
      }

      var startCon = range.startContainer;
      var endCon = range.endContainer;
      var commonCon = range.commonAncestorContainer; // get line nodes

      var lineNodes = util.getListChildren(commonCon, function (current) {
        return validation ? validation(current) : util.isFormatElement(current);
      });
      if (!util.isWysiwygDiv(commonCon) && !util.isRangeFormatElement(commonCon)) lineNodes.unshift(util.getFormatElement(commonCon, null));
      if (startCon === endCon || lineNodes.length === 1) return lineNodes;
      var startLine = util.getFormatElement(startCon, null);
      var endLine = util.getFormatElement(endCon, null);
      var startIdx = null;
      var endIdx = null;

      var onlyTable = function onlyTable(current) {
        return util.isTable(current) ? /^TABLE$/i.test(current.nodeName) : true;
      };

      var startRangeEl = util.getRangeFormatElement(startLine, onlyTable);
      var endRangeEl = util.getRangeFormatElement(endLine, onlyTable);
      if (util.isTable(startRangeEl) && util.isListCell(startRangeEl.parentNode)) startRangeEl = startRangeEl.parentNode;
      if (util.isTable(endRangeEl) && util.isListCell(endRangeEl.parentNode)) endRangeEl = endRangeEl.parentNode;
      var sameRange = startRangeEl === endRangeEl;

      for (var i = 0, len = lineNodes.length, line; i < len; i++) {
        line = lineNodes[i];

        if (startLine === line || !sameRange && line === startRangeEl) {
          startIdx = i;
          continue;
        }

        if (endLine === line || !sameRange && line === endRangeEl) {
          endIdx = i;
          break;
        }
      }

      if (startIdx === null) startIdx = 0;
      if (endIdx === null) endIdx = lineNodes.length - 1;
      return lineNodes.slice(startIdx, endIdx + 1);
    },

    /**
     * @description Get format elements and components from the selected area. (P, DIV, H[1-6], OL, UL, TABLE..)
     * If some of the component are included in the selection, get the entire that component.
     * @param {Boolean} removeDuplicate If true, if there is a parent and child tag among the selected elements, the child tag is excluded.
     * @returns {Array}
     */
    getSelectedElementsAndComponents: function getSelectedElementsAndComponents(removeDuplicate) {
      var commonCon = this.getRange().commonAncestorContainer;
      var myComponent = util.getParentElement(commonCon, util.isComponent);
      var selectedLines = util.isTable(commonCon) ? this.getSelectedElements(null) : this.getSelectedElements(function (current) {
        var component = this.getParentElement(current, this.isComponent);
        return this.isFormatElement(current) && (!component || component === myComponent) || this.isComponent(current) && !this.getFormatElement(current);
      }.bind(util));

      if (removeDuplicate) {
        for (var i = 0, len = selectedLines.length; i < len; i++) {
          for (var j = i - 1; j >= 0; j--) {
            if (selectedLines[j].contains(selectedLines[i])) {
              selectedLines.splice(i, 1);
              i--;
              len--;
              break;
            }
          }
        }
      }

      return selectedLines;
    },

    /**
     * @description Determine if this offset is the edge offset of container
     * @param {Node} container The node of the selection object. (range.startContainer..)
     * @param {Number} offset The offset of the selection object. (core.getRange().startOffset...)
     * @returns {Boolean}
     */
    isEdgePoint: function isEdgePoint(container, offset) {
      return offset === 0 || !container.nodeValue && offset === 1 || offset === container.nodeValue.length;
    },

    /**
     * @description Show loading box
     */
    showLoading: function showLoading() {
      context.element.loading.style.display = "block";
    },

    /**
     * @description Close loading box
     */
    closeLoading: function closeLoading() {
      context.element.loading.style.display = "none";
    },

    /**
     * @description Append format element to sibling node of argument element.
     * If the "formatNodeName" argument value is present, the tag of that argument value is inserted,
     * If not, the currently selected format tag is inserted.
     * @param {Element} element Insert as siblings of that element
     * @param {String|Element|null} formatNode Node name or node obejct to be inserted
     * @returns {Element}
     */
    appendFormatTag: function appendFormatTag(element, formatNode) {
      var currentFormatEl = util.getFormatElement(this.getSelectionNode(), null);
      var oFormatName = formatNode ? typeof formatNode === "string" ? formatNode : formatNode.nodeName : util.isFormatElement(currentFormatEl) && !util.isFreeFormatElement(currentFormatEl) ? currentFormatEl.nodeName : "P";
      var oFormat = util.createElement(oFormatName);
      oFormat.innerHTML = "<br>";

      if (formatNode && typeof formatNode !== "string" || !formatNode && util.isFormatElement(currentFormatEl)) {
        util.copyTagAttributes(oFormat, formatNode || currentFormatEl);
      }

      if (util.isCell(element)) element.insertBefore(oFormat, element.nextElementSibling);else element.parentNode.insertBefore(oFormat, element.nextElementSibling);
      return oFormat;
    },

    /**
     * @description The method to insert a element and return. (used elements : table, hr, image, video)
     * If "element" is "HR", insert and return the new line.
     * @param {Element} element Element to be inserted
     * @param {Boolean} notHistoryPush When true, it does not update the history stack and the selection object and return EdgeNodes (util.getEdgeChildNodes)
     * @param {Boolean} checkCharCount If true, if "options.maxCharCount" is exceeded when "element" is added, null is returned without addition.
     * @param {Boolean} notSelect If true, Do not automatically select the inserted component.
     * @returns {Element}
     */
    insertComponent: function insertComponent(element, notHistoryPush, checkCharCount, notSelect) {
      if (checkCharCount && !this.checkCharCount(element, null)) {
        return null;
      }

      var r = this.removeNode();
      this.getRange_addLine(this.getRange());
      var oNode = null;
      var selectionNode = this.getSelectionNode();
      var formatEl = util.getFormatElement(selectionNode, null);

      if (util.isListCell(formatEl)) {
        this.insertNode(element, selectionNode === formatEl ? null : r.container.nextSibling, false);
        if (!element.nextSibling) element.parentNode.appendChild(util.createElement("BR"));
      } else {
        if (this.getRange().collapsed && (r.container.nodeType === 3 || util.isBreak(r.container))) {
          var depthFormat = util.getParentElement(r.container, function (current) {
            return this.isRangeFormatElement(current);
          }.bind(util));
          oNode = util.splitElement(r.container, r.offset, !depthFormat ? 0 : util.getElementDepth(depthFormat) + 1);
          if (oNode) formatEl = oNode.previousSibling;
        }

        this.insertNode(element, formatEl, false);
        if (formatEl && util.onlyZeroWidthSpace(formatEl)) util.removeItem(formatEl);
      }

      if (!notSelect) {
        var fileComponentInfo = this.getFileComponent(element);

        if (fileComponentInfo) {
          this.selectComponent(fileComponentInfo.target, fileComponentInfo.pluginName);
        } else if (oNode) {
          oNode = util.getEdgeChildNodes(oNode, null).sc || oNode;
          this.setRange(oNode, 0, oNode, 0);
        }
      } // history stack


      if (!notHistoryPush) this.history.push(1);
      return oNode || element;
    },

    /**
     * @description Gets the file component and that plugin name
     * return: {target, component, pluginName} | null
     * @param {Element} element Target element (figure tag, component div, file tag)
     * @returns {Object|null}
     */
    getFileComponent: function getFileComponent(element) {
      if (!this._fileManager.queryString || !element) return null;
      var target, pluginName;

      if (/^FIGURE$/i.test(element.nodeName) || /ke-component/.test(element.className)) {
        target = element.querySelector(this._fileManager.queryString);
      }

      if (!target && element.nodeName && this._fileManager.regExp.test(element.nodeName)) {
        target = element;
      }

      if (target) {
        pluginName = this._fileManager.pluginMap[target.nodeName.toLowerCase()];

        if (pluginName) {
          return {
            target: target,
            component: util.getParentElement(target, util.isComponent),
            pluginName: pluginName
          };
        }
      }

      return null;
    },

    /**
     * @description The component(image, video) is selected and the resizing module is called.
     * @param {Element} element Element tag (img, iframe, video)
     * @param {String} pluginName Plugin name (image, video)
     */
    selectComponent: function selectComponent(element, pluginName) {
      if (!this.hasFocus) this.focus();
      var plugin = this.plugins[pluginName];
      if (!plugin) return;

      _w.setTimeout(function () {
        if (typeof plugin.select === "function") this.callPlugin(pluginName, plugin.select.bind(this, element), null);

        this._setComponentLineBreaker(element);
      }.bind(this));
    },

    /**
     * @description Set line breaker of component
     * @param {Element} element Element tag (img, iframe, video)
     * @private
     */
    _setComponentLineBreaker: function _setComponentLineBreaker(element) {
      // line breaker
      this._lineBreaker.style.display = "none";
      var container = util.getParentElement(element, util.isComponent);
      var t_style = context.element.lineBreaker_t.style;
      var b_style = context.element.lineBreaker_b.style;
      var target = this.context.resizing.resizeContainer.style.display === "block" ? this.context.resizing.resizeContainer : element;
      var isList = util.isListCell(container.parentNode);
      var componentTop, wScroll, w; // top

      if (isList ? !container.previousSibling : !util.isFormatElement(container.previousElementSibling)) {
        this._variable._lineBreakComp = container;
        wScroll = context.element.wysiwyg.scrollTop;
        componentTop = util.getOffset(element, context.element.wysiwygFrame).top + wScroll;
        w = target.offsetWidth / 2 / 2;
        t_style.top = componentTop - wScroll - 12 + "px";
        t_style.left = util.getOffset(target).left + w + "px";
        t_style.display = "block";
      } else {
        t_style.display = "none";
      } // bottom


      if (isList ? !container.nextSibling : !util.isFormatElement(container.nextElementSibling)) {
        if (!componentTop) {
          this._variable._lineBreakComp = container;
          wScroll = context.element.wysiwyg.scrollTop;
          componentTop = util.getOffset(element, context.element.wysiwygFrame).top + wScroll;
          w = target.offsetWidth / 2 / 2;
        }

        b_style.top = componentTop + target.offsetHeight - wScroll - 12 + "px";
        b_style.left = util.getOffset(target).left + target.offsetWidth - w - 24 + "px";
        b_style.display = "block";
      } else {
        b_style.display = "none";
      }
    },

    /**
     * @description Delete selected node and insert argument value node and return.
     * If the "afterNode" exists, it is inserted after the "afterNode"
     * Inserting a text node merges with both text nodes on both sides and returns a new "{ container, startOffset, endOffset }".
     * @param {Node} oNode Element to be inserted
     * @param {Node|null} afterNode If the node exists, it is inserted after the node
     * @param {Boolean} checkCharCount If true, if "options.maxCharCount" is exceeded when "element" is added, null is returned without addition.
     * @returns {Object|Node|null}
     */
    insertNode: function insertNode(oNode, afterNode, checkCharCount) {
      if (checkCharCount && !this.checkCharCount(oNode, null)) {
        return null;
      }

      var freeFormat = util.getFreeFormatElement(this.getSelectionNode(), null);
      var isFormats = !freeFormat && (util.isFormatElement(oNode) || util.isRangeFormatElement(oNode)) || util.isComponent(oNode);

      if (!afterNode && isFormats) {
        var r = this.removeNode();

        if (r.container.nodeType === 3 || util.isBreak(r.container)) {
          var depthFormat = util.getParentElement(r.container, function (current) {
            return this.isRangeFormatElement(current) || this.isListCell(current);
          }.bind(util));
          afterNode = util.splitElement(r.container, r.offset, !depthFormat ? 0 : util.getElementDepth(depthFormat) + 1);
          if (afterNode) afterNode = afterNode.previousSibling;
        }
      }

      var range = !afterNode && !isFormats ? this.getRange_addLine(this.getRange()) : this.getRange();
      var commonCon = range.commonAncestorContainer;
      var startOff = range.startOffset;
      var endOff = range.endOffset;
      var formatRange = range.startContainer === commonCon && util.isFormatElement(commonCon);
      var startCon = formatRange ? commonCon.childNodes[startOff] : range.startContainer;
      var endCon = formatRange ? commonCon.childNodes[endOff] : range.endContainer;
      var parentNode,
          originAfter = null;

      if (!afterNode) {
        parentNode = startCon;

        if (startCon.nodeType === 3) {
          parentNode = startCon.parentNode;
        }
        /** No Select range node */


        if (range.collapsed) {
          if (commonCon.nodeType === 3) {
            if (commonCon.textContent.length > endOff) afterNode = commonCon.splitText(endOff);else afterNode = commonCon.nextSibling;
          } else {
            if (!util.isBreak(parentNode)) {
              var c = parentNode.childNodes[startOff];
              var focusNode = c && c.nodeType === 3 && util.onlyZeroWidthSpace(c) && util.isBreak(c.nextSibling) ? c.nextSibling : c;

              if (focusNode) {
                if (!focusNode.nextSibling) {
                  parentNode.removeChild(focusNode);
                  afterNode = null;
                } else {
                  afterNode = util.isBreak(focusNode) && !util.isBreak(oNode) ? focusNode : focusNode.nextSibling;
                }
              } else {
                afterNode = null;
              }
            } else {
              afterNode = parentNode;
              parentNode = parentNode.parentNode;
            }
          }
        } else {
          /** Select range nodes */
          var isSameContainer = startCon === endCon;

          if (isSameContainer) {
            if (this.isEdgePoint(endCon, endOff)) afterNode = endCon.nextSibling;else afterNode = endCon.splitText(endOff);
            var removeNode = startCon;
            if (!this.isEdgePoint(startCon, startOff)) removeNode = startCon.splitText(startOff);
            parentNode.removeChild(removeNode);

            if (parentNode.childNodes.length === 0 && isFormats) {
              parentNode.innerHTML = "<br>";
            }
          } else {
            var removedTag = this.removeNode();
            var container = removedTag.container;
            var prevContainer = removedTag.prevContainer;

            if (container && container.childNodes.length === 0 && isFormats) {
              if (util.isFormatElement(container)) {
                container.innerHTML = "<br>";
              } else if (util.isRangeFormatElement(container)) {
                container.innerHTML = "<p><br></p>";
              }
            }

            if (!isFormats && prevContainer) {
              parentNode = prevContainer.nodeType === 3 ? prevContainer.parentNode : prevContainer;

              if (parentNode.contains(container)) {
                afterNode = container;

                while (afterNode.parentNode === parentNode) {
                  afterNode = afterNode.parentNode;
                }
              } else {
                afterNode = null;
              }
            } else {
              parentNode = isFormats ? commonCon : container;
              afterNode = isFormats ? endCon : null;
            }

            while (afterNode && !util.isFormatElement(afterNode) && afterNode.parentNode !== commonCon) {
              afterNode = afterNode.parentNode;
            }
          }
        }
      } // has afterNode
      else {
          parentNode = afterNode.parentNode;
          afterNode = afterNode.nextSibling;
          originAfter = true;
        } // --- insert node ---


      try {
        if (util.isFormatElement(oNode) || util.isRangeFormatElement(oNode) || !util.isListCell(parentNode) && util.isComponent(oNode)) {
          var oldParent = parentNode;

          if (util.isList(afterNode)) {
            parentNode = afterNode;
            afterNode = null;
          } else if (util.isListCell(afterNode)) {
            parentNode = afterNode.previousElementSibling || afterNode;
          } else if (!originAfter && !afterNode) {
            var _r = this.removeNode();

            var _container = _r.container.nodeType === 3 ? util.isListCell(util.getFormatElement(_r.container, null)) ? _r.container : util.getFormatElement(_r.container, null) || _r.container.parentNode : _r.container;

            var rangeCon = util.isWysiwygDiv(_container) || util.isRangeFormatElement(_container);
            parentNode = rangeCon ? _container : _container.parentNode;
            afterNode = rangeCon ? null : _container.nextSibling;
          }

          if (oldParent.childNodes.length === 0 && parentNode !== oldParent) util.removeItem(oldParent);
        }

        if (isFormats && !freeFormat && !util.isRangeFormatElement(parentNode) && !util.isListCell(parentNode) && !util.isWysiwygDiv(parentNode)) {
          afterNode = parentNode.nextElementSibling;
          parentNode = parentNode.parentNode;
        }

        parentNode.insertBefore(oNode, parentNode === afterNode ? parentNode.lastChild : afterNode);
      } catch (e) {
        parentNode.appendChild(oNode);
      } finally {
        if (freeFormat && (util.isFormatElement(oNode) || util.isRangeFormatElement(oNode))) {
          oNode = this._setIntoFreeFormat(oNode);
        }

        if (!util.isComponent(oNode)) {
          var offset = 1;

          if (oNode.nodeType === 3) {
            var previous = oNode.previousSibling;
            var next = oNode.nextSibling;
            var previousText = !previous || previous.nodeType === 1 || util.onlyZeroWidthSpace(previous) ? "" : previous.textContent;
            var nextText = !next || next.nodeType === 1 || util.onlyZeroWidthSpace(next) ? "" : next.textContent;

            if (previous && previousText.length > 0) {
              oNode.textContent = previousText + oNode.textContent;
              util.removeItem(previous);
            }

            if (next && next.length > 0) {
              oNode.textContent += nextText;
              util.removeItem(next);
            }

            var newRange = {
              container: oNode,
              startOffset: previousText.length,
              endOffset: oNode.textContent.length - nextText.length
            };
            this.setRange(oNode, newRange.startOffset, oNode, newRange.endOffset);
            return newRange;
          } else if (!util.isBreak(oNode) && util.isFormatElement(parentNode)) {
            var zeroWidth = null;

            if (!oNode.previousSibling) {
              zeroWidth = util.createTextNode(util.zeroWidthSpace);
              oNode.parentNode.insertBefore(zeroWidth, oNode);
            }

            if (!oNode.nextSibling) {
              zeroWidth = util.createTextNode(util.zeroWidthSpace);
              oNode.parentNode.appendChild(zeroWidth);
            }

            if (util._isIgnoreNodeChange(oNode)) {
              oNode = oNode.nextSibling;
              offset = 0;
            }
          }

          this.setRange(oNode, offset, oNode, offset);
        } // history stack


        this.history.push(true);
        return oNode;
      }
    },
    _setIntoFreeFormat: function _setIntoFreeFormat(oNode) {
      var parentNode = oNode.parentNode;
      var oNodeChildren, lastONode;

      while (util.isFormatElement(oNode) || util.isRangeFormatElement(oNode)) {
        oNodeChildren = oNode.childNodes;
        lastONode = null;

        while (oNodeChildren[0]) {
          lastONode = oNodeChildren[0];

          if (util.isFormatElement(lastONode) || util.isRangeFormatElement(lastONode)) {
            this._setIntoFreeFormat(lastONode);

            if (!oNode.parentNode) break;
            oNodeChildren = oNode.childNodes;
            continue;
          }

          parentNode.insertBefore(lastONode, oNode);
        }

        if (oNode.childNodes.length === 0) util.removeItem(oNode);
        oNode = util.createElement("BR");
        parentNode.insertBefore(oNode, lastONode.nextSibling);
      }

      return oNode;
    },

    /**
     * @description Delete the currently selected nodes and reset selection range
     * Returns {container: "the last element after deletion", offset: "offset", prevContainer: "previousElementSibling Of the deleted area"}
     * @returns {Object}
     */
    removeNode: function removeNode() {
      if (!this._resetRangeToTextNode()) console.warn('[KothingEditor.core.removeNode.exception] An exception occurred while resetting the "Range" object.');
      var range = this.getRange();
      var container,
          offset = 0;
      var startCon = range.startContainer;
      var endCon = range.endContainer;
      var startOff = range.startOffset;
      var endOff = range.endOffset;
      var commonCon = range.commonAncestorContainer;
      var beforeNode = null;
      var afterNode = null;
      var childNodes = util.getListChildNodes(commonCon, null);
      var startIndex = util.getArrayIndex(childNodes, startCon);
      var endIndex = util.getArrayIndex(childNodes, endCon);

      if (childNodes.length > 0 && startIndex > -1 && endIndex > -1) {
        for (var i = startIndex + 1, startNode = startCon; i >= 0; i--) {
          if (childNodes[i] === startNode.parentNode && childNodes[i].firstChild === startNode && startOff === 0) {
            startIndex = i;
            startNode = startNode.parentNode;
          }
        }

        for (var _i = endIndex - 1, endNode = endCon; _i > startIndex; _i--) {
          if (childNodes[_i] === endNode.parentNode && childNodes[_i].nodeType === 1) {
            childNodes.splice(_i, 1);
            endNode = endNode.parentNode;
            --endIndex;
          }
        }
      } else {
        if (childNodes.length === 0) {
          if (util.isFormatElement(commonCon) || util.isRangeFormatElement(commonCon) || util.isWysiwygDiv(commonCon) || util.isBreak(commonCon) || util.isMedia(commonCon)) {
            return {
              container: commonCon,
              offset: 0
            };
          }

          childNodes.push(commonCon);
          startCon = commonCon;
          endCon = commonCon;
        } else {
          startCon = childNodes[0];
          endCon = childNodes[0];

          if (util.isBreak(startCon) || util.onlyZeroWidthSpace(startCon)) {
            return {
              container: startCon,
              offset: 0
            };
          }
        }

        startIndex = 0;
        endIndex = 0;
      }

      function remove(item) {
        var format = util.getFormatElement(item, null);
        util.removeItem(item);

        if (util.isListCell(format)) {
          var list = util.getArrayItem(format.children, util.isList, false);

          if (list) {
            var child = list.firstElementChild;
            var children = child.childNodes;

            while (children[0]) {
              format.insertBefore(children[0], list);
            }

            util.removeItemAllParents(child, null, null);
          }
        }
      }

      for (var _i2 = startIndex; _i2 <= endIndex; _i2++) {
        var item = childNodes[_i2];

        if (item.length === 0 || item.nodeType === 3 && item.data === undefined) {
          remove(item);
          continue;
        }

        if (item === startCon) {
          if (startCon.nodeType === 1) {
            beforeNode = util.createTextNode(startCon.textContent);
          } else {
            if (item === endCon) {
              beforeNode = util.createTextNode(startCon.substringData(0, startOff) + endCon.substringData(endOff, endCon.length - endOff));
              offset = startOff;
            } else {
              beforeNode = util.createTextNode(startCon.substringData(0, startOff));
            }
          }

          if (beforeNode.length > 0) {
            startCon.data = beforeNode.data;
          } else {
            remove(startCon);
          }

          if (item === endCon) break;
          continue;
        }

        if (item === endCon) {
          if (endCon.nodeType === 1) {
            afterNode = util.createTextNode(endCon.textContent);
          } else {
            afterNode = util.createTextNode(endCon.substringData(endOff, endCon.length - endOff));
          }

          if (afterNode.length > 0) {
            endCon.data = afterNode.data;
          } else {
            remove(endCon);
          }

          continue;
        }

        remove(item);
      }

      container = endCon && endCon.parentNode ? endCon : startCon && startCon.parentNode ? startCon : range.endContainer || range.startContainer;

      if (!util.isWysiwygDiv(container)) {
        var rc = util.removeItemAllParents(container, function (current) {
          if (this.isComponent(current)) return false;
          var text = current.textContent;
          return text.length === 0 || /^(\n|\u200B)+$/.test(text);
        }.bind(util), null);
        if (rc) container = rc.sc || rc.ec || context.element.wysiwyg;
      } // set range


      this.setRange(container, offset, container, offset); // history stack

      this.history.push(true);
      return {
        container: container,
        offset: offset,
        prevContainer: startCon && startCon.parentNode ? startCon : null
      };
    },

    /**
     * @description Appended all selected format Element to the argument element and insert
     * @param {Element} rangeElement Element of wrap the arguments (BLOCKQUOTE...)
     */
    applyRangeFormatElement: function applyRangeFormatElement(rangeElement) {
      this.getRange_addLine(this.getRange());
      var rangeLines = this.getSelectedElementsAndComponents(false);
      if (!rangeLines || rangeLines.length === 0) return;

      linesLoop: for (var i = 0, len = rangeLines.length, line, nested, fEl, lEl, f, l; i < len; i++) {
        line = rangeLines[i];
        if (!util.isListCell(line)) continue;
        nested = line.lastElementChild;

        if (nested && util.isListCell(line.nextElementSibling) && rangeLines.indexOf(line.nextElementSibling) > -1) {
          lEl = nested.lastElementChild;

          if (rangeLines.indexOf(lEl) > -1) {
            var list = null;

            while (list = lEl.lastElementChild) {
              if (util.isList(list)) {
                if (rangeLines.indexOf(list.lastElementChild) > -1) {
                  lEl = list.lastElementChild;
                } else {
                  continue linesLoop;
                }
              }
            }

            fEl = nested.firstElementChild;
            f = rangeLines.indexOf(fEl);
            l = rangeLines.indexOf(lEl);
            rangeLines.splice(f, l - f + 1);
            len = rangeLines.length;
            continue;
          }
        }
      }

      var last = rangeLines[rangeLines.length - 1];
      var standTag, beforeTag, pElement;

      if (util.isRangeFormatElement(last) || util.isFormatElement(last)) {
        standTag = last;
      } else {
        standTag = util.getRangeFormatElement(last, null) || util.getFormatElement(last, null);
      }

      if (util.isCell(standTag)) {
        beforeTag = null;
        pElement = standTag;
      } else {
        beforeTag = standTag.nextSibling;
        pElement = standTag.parentNode;
      }

      var parentDepth = util.getElementDepth(standTag);
      var listParent = null;
      var lineArr = [];

      var removeItems = function removeItems(parent, origin, before) {
        var cc = null;

        if (parent !== origin && !util.isTable(origin)) {
          if (origin && util.getElementDepth(parent) === util.getElementDepth(origin)) return before;
          cc = util.removeItemAllParents(origin, null, parent);
        }

        return cc ? cc.ec : before;
      };

      for (var _i3 = 0, _len = rangeLines.length, _line, originParent, depth, before, nextLine, nextList, _nested; _i3 < _len; _i3++) {
        _line = rangeLines[_i3];
        originParent = _line.parentNode;
        if (!originParent || rangeElement.contains(originParent)) continue;
        depth = util.getElementDepth(_line);

        if (util.isList(originParent)) {
          if (listParent === null) {
            if (nextList) {
              listParent = nextList;
              _nested = true;
              nextList = null;
            } else {
              listParent = originParent.cloneNode(false);
            }
          }

          lineArr.push(_line);
          nextLine = rangeLines[_i3 + 1];

          if (_i3 === _len - 1 || nextLine && nextLine.parentNode !== originParent) {
            // nested list
            if (nextLine && _line.contains(nextLine.parentNode)) {
              nextList = nextLine.parentNode.cloneNode(false);
            }

            var _list = originParent.parentNode,
                p = void 0;

            while (util.isList(_list)) {
              p = util.createElement(_list.nodeName);
              p.appendChild(listParent);
              listParent = p;
              _list = _list.parentNode;
            }

            var _edge = this.detachRangeFormatElement(originParent, lineArr, null, true, true);

            if (parentDepth >= depth) {
              parentDepth = depth;
              pElement = _edge.cc;
              beforeTag = removeItems(pElement, originParent, _edge.ec);
              if (beforeTag) pElement = beforeTag.parentNode;
            } else if (pElement === _edge.cc) {
              beforeTag = _edge.ec;
            }

            if (pElement !== _edge.cc) {
              before = removeItems(pElement, _edge.cc, before);
              if (before !== undefined) beforeTag = before;else beforeTag = _edge.cc;
            }

            for (var c = 0, cLen = _edge.removeArray.length; c < cLen; c++) {
              listParent.appendChild(_edge.removeArray[c]);
            }

            if (!_nested) rangeElement.appendChild(listParent);
            if (nextList) _edge.removeArray[_edge.removeArray.length - 1].appendChild(nextList);
            listParent = null;
            _nested = false;
          }
        } else {
          if (parentDepth >= depth) {
            parentDepth = depth;
            pElement = originParent;
            beforeTag = _line.nextSibling;
          }

          rangeElement.appendChild(_line);

          if (pElement !== originParent) {
            before = removeItems(pElement, originParent);
            if (before !== undefined) beforeTag = before;
          }
        }
      }

      this.effectNode = null;
      util.mergeSameTags(rangeElement, null, false);
      util.mergeNestedTags(rangeElement, function (current) {
        return this.isList(current);
      }.bind(util)); // Nested list

      if (beforeTag && util.getElementDepth(beforeTag) > 0 && (util.isList(beforeTag.parentNode) || util.isList(beforeTag.parentNode.parentNode))) {
        var depthFormat = util.getParentElement(beforeTag, function (current) {
          return this.isRangeFormatElement(current) && !this.isList(current);
        }.bind(util));
        var splitRange = util.splitElement(beforeTag, null, !depthFormat ? 0 : util.getElementDepth(depthFormat) + 1);
        splitRange.parentNode.insertBefore(rangeElement, splitRange);
      } else {
        // basic
        pElement.insertBefore(rangeElement, beforeTag);
        removeItems(rangeElement, beforeTag);
      }

      var edge = util.getEdgeChildNodes(rangeElement.firstElementChild, rangeElement.lastElementChild);

      if (rangeLines.length > 1) {
        this.setRange(edge.sc, 0, edge.ec, edge.ec.textContent.length);
      } else {
        this.setRange(edge.ec, edge.ec.textContent.length, edge.ec, edge.ec.textContent.length);
      } // history stack


      this.history.push(false);
    },

    /**
     * @description The elements of the "selectedFormats" array are detached from the "rangeElement" element. ("LI" tags are converted to "P" tags)
     * When "selectedFormats" is null, all elements are detached and return {cc: parentNode, sc: nextSibling, ec: previousSibling, removeArray: [Array of removed elements]}.
     * @param {Element} rangeElement Range format element (PRE, BLOCKQUOTE, OL, UL...)
     * @param {Array|null} selectedFormats Array of format elements (P, DIV, LI...) to remove.
     * If null, Applies to all elements and return {cc: parentNode, sc: nextSibling, ec: previousSibling}
     * @param {Element|null} newRangeElement The node(rangeElement) to replace the currently wrapped node.
     * @param {Boolean} remove If true, deleted without detached.
     * @param {Boolean} notHistoryPush When true, it does not update the history stack and the selection object and return EdgeNodes (util.getEdgeChildNodes)
     * @returns {Object}
     */
    detachRangeFormatElement: function detachRangeFormatElement(rangeElement, selectedFormats, newRangeElement, remove, notHistoryPush) {
      var range = this.getRange();
      var so = range.startOffset;
      var eo = range.endOffset;
      var children = util.getListChildNodes(rangeElement, function (current) {
        return current.parentNode === rangeElement;
      });
      var parent = rangeElement.parentNode;
      var firstNode = null;
      var lastNode = null;
      var rangeEl = rangeElement.cloneNode(false);
      var removeArray = [];
      var newList = util.isList(newRangeElement);
      var insertedNew = false;
      var reset = false;
      var moveComplete = false;

      function appendNode(parent, insNode, sibling, originNode) {
        if (util.onlyZeroWidthSpace(insNode)) insNode.innerHTML = util.zeroWidthSpace;

        if (insNode.nodeType === 3) {
          parent.insertBefore(insNode, sibling);
          return insNode;
        }

        var insChildren = (moveComplete ? insNode : originNode).childNodes;
        var format = insNode.cloneNode(false);
        var first = null;
        var c = null;

        while (insChildren[0]) {
          c = insChildren[0];

          if (util._notTextNode(c) && !util.isBreak(c) && !util.isListCell(format)) {
            if (format.childNodes.length > 0) {
              if (!first) first = format;
              parent.insertBefore(format, sibling);
              format = insNode.cloneNode(false);
            }

            parent.insertBefore(c, sibling);
            if (!first) first = c;
          } else {
            format.appendChild(c);
          }
        }

        if (format.childNodes.length > 0) {
          if (util.isListCell(parent) && util.isListCell(format) && util.isList(sibling)) {
            if (newList) {
              first = sibling;

              while (sibling) {
                format.appendChild(sibling);
                sibling = sibling.nextSibling;
              }

              parent.parentNode.insertBefore(format, parent.nextElementSibling);
            } else {
              var originNext = originNode.nextElementSibling;
              var detachRange = util.detachNestedList(originNode, false);

              if (rangeElement !== detachRange || originNext !== originNode.nextElementSibling) {
                var fChildren = format.childNodes;

                while (fChildren[0]) {
                  originNode.appendChild(fChildren[0]);
                }

                rangeElement = detachRange;
                reset = true;
              }
            }
          } else {
            parent.insertBefore(format, sibling);
          }

          if (!first) first = format;
        }

        return first;
      } // detach loop


      for (var i = 0, len = children.length, insNode, lineIndex, next; i < len; i++) {
        insNode = children[i];
        if (insNode.nodeType === 3 && util.isList(rangeEl)) continue;
        moveComplete = false;

        if (remove && i === 0) {
          if (!selectedFormats || selectedFormats.length === len || selectedFormats[0] === insNode) {
            firstNode = rangeElement.previousSibling;
          } else {
            firstNode = rangeEl;
          }
        }

        if (selectedFormats) lineIndex = selectedFormats.indexOf(insNode);

        if (selectedFormats && lineIndex === -1) {
          if (!rangeEl) rangeEl = rangeElement.cloneNode(false);
          rangeEl.appendChild(insNode);
        } else {
          if (selectedFormats) next = selectedFormats[lineIndex + 1];

          if (rangeEl && rangeEl.children.length > 0) {
            parent.insertBefore(rangeEl, rangeElement);
            rangeEl = null;
          }

          if (!newList && util.isListCell(insNode)) {
            if (next && util.getElementDepth(insNode) !== util.getElementDepth(next) && (util.isListCell(parent) || util.getArrayItem(insNode.children, util.isList, false))) {
              var insNext = insNode.nextElementSibling;
              var detachRange = util.detachNestedList(insNode, false);

              if (rangeElement !== detachRange || insNext !== insNode.nextElementSibling) {
                rangeElement = detachRange;
                reset = true;
              }
            } else {
              var inner = insNode;
              insNode = util.createElement(remove ? inner.nodeName : util.isList(rangeElement.parentNode) || util.isListCell(rangeElement.parentNode) ? "LI" : util.isCell(rangeElement.parentNode) ? "DIV" : "P");
              var isCell = util.isListCell(insNode);
              var innerChildren = inner.childNodes;

              while (innerChildren[0]) {
                if (util.isList(innerChildren[0]) && !isCell) break;
                insNode.appendChild(innerChildren[0]);
              }

              util.copyFormatAttributes(insNode, inner);
              moveComplete = true;
            }
          } else {
            insNode = insNode.cloneNode(false);
          }

          if (!reset) {
            if (!remove) {
              if (newRangeElement) {
                if (!insertedNew) {
                  parent.insertBefore(newRangeElement, rangeElement);
                  insertedNew = true;
                }

                insNode = appendNode(newRangeElement, insNode, null, children[i]);
              } else {
                insNode = appendNode(parent, insNode, rangeElement, children[i]);
              }

              if (!reset) {
                if (selectedFormats) {
                  lastNode = insNode;

                  if (!firstNode) {
                    firstNode = insNode;
                  }
                } else if (!firstNode) {
                  firstNode = insNode;
                  lastNode = insNode;
                }
              }
            } else {
              removeArray.push(insNode);
              util.removeItem(children[i]);
            }

            if (reset) {
              reset = false;
              moveComplete = false;
              children = util.getListChildNodes(rangeElement, function (current) {
                return current.parentNode === rangeElement;
              });
              rangeEl = rangeElement.cloneNode(false);
              parent = rangeElement.parentNode;
              i = -1;
              len = children.length;
              continue;
            }
          }
        }
      }

      var rangeParent = rangeElement.parentNode;
      var rangeRight = rangeElement.nextSibling;

      if (rangeEl && rangeEl.children.length > 0) {
        rangeParent.insertBefore(rangeEl, rangeRight);
      }

      if (newRangeElement) firstNode = newRangeElement.previousSibling;else if (!firstNode) firstNode = rangeElement.previousSibling;
      rangeRight = rangeElement.nextSibling;

      if (rangeElement.children.length === 0 || rangeElement.textContent.length === 0) {
        util.removeItem(rangeElement);
      } else {
        util.removeEmptyNode(rangeElement, null);
      }

      var edge = null;

      if (remove) {
        edge = {
          cc: rangeParent,
          sc: firstNode,
          ec: rangeRight,
          removeArray: removeArray
        };
      } else {
        if (!firstNode) firstNode = lastNode;
        if (!lastNode) lastNode = firstNode;
        var childEdge = util.getEdgeChildNodes(firstNode, lastNode.parentNode ? firstNode : lastNode);
        edge = {
          cc: (childEdge.sc || childEdge.ec).parentNode,
          sc: childEdge.sc,
          ec: childEdge.ec
        };
      }

      this.effectNode = null;
      if (notHistoryPush) return edge;

      if (!remove && edge) {
        if (!selectedFormats) {
          this.setRange(edge.sc, 0, edge.sc, 0);
        } else {
          this.setRange(edge.sc, so, edge.ec, eo);
        }
      } // history stack


      this.history.push(false);
    },

    /**
     * @description "selectedFormats" array are detached from the list element.
     * The return value is applied when the first and last lines of "selectedFormats" are "LI" respectively.
     * @param {Array} selectedFormats Array of format elements (LI, P...) to remove.
     * @param {Boolean} remove If true, deleted without detached.
     * @returns {Object} {sc: <LI>, ec: <LI>}.
     */
    detachList: function detachList(selectedFormats, remove) {
      var rangeArr = {};
      var listFirst = false;
      var listLast = false;
      var first = null;
      var last = null;

      var passComponent = function (current) {
        return !this.isComponent(current);
      }.bind(util);

      for (var i = 0, len = selectedFormats.length, r, o, lastIndex, isList; i < len; i++) {
        lastIndex = i === len - 1;
        o = util.getRangeFormatElement(selectedFormats[i], passComponent);
        isList = util.isList(o);

        if (!r && isList) {
          r = o;
          rangeArr = {
            r: r,
            f: [util.getParentElement(selectedFormats[i], "LI")]
          };
          if (i === 0) listFirst = true;
        } else if (r && isList) {
          if (r !== o) {
            var edge = this.detachRangeFormatElement(rangeArr.f[0].parentNode, rangeArr.f, null, remove, true);
            o = selectedFormats[i].parentNode;

            if (listFirst) {
              first = edge.sc;
              listFirst = false;
            }

            if (lastIndex) last = edge.ec;

            if (isList) {
              r = o;
              rangeArr = {
                r: r,
                f: [util.getParentElement(selectedFormats[i], "LI")]
              };
              if (lastIndex) listLast = true;
            } else {
              r = null;
            }
          } else {
            rangeArr.f.push(util.getParentElement(selectedFormats[i], "LI"));
            if (lastIndex) listLast = true;
          }
        }

        if (lastIndex && util.isList(r)) {
          var _edge2 = this.detachRangeFormatElement(rangeArr.f[0].parentNode, rangeArr.f, null, remove, true);

          if (listLast || len === 1) last = _edge2.ec;
          if (listFirst) first = _edge2.sc || last;
        }
      }

      return {
        sc: first,
        ec: last
      };
    },

    /**
     * @description Add, update, and delete nodes from selected text.
     * 1. If there is a node in the "appendNode" argument, a node with the same tags and attributes as "appendNode" is added to the selection text.
     * 2. If it is in the same tag, only the tag's attributes are changed without adding a tag.
     * 3. If the "appendNode" argument is null, the node of the selection is update or remove without adding a new node.
     * 4. The same style as the style attribute of the "styleArray" argument is deleted.
     *    (Styles should be put with attribute names from css. ["background-color"])
     * 5. The same class name as the class attribute of the "styleArray" argument is deleted.
     *    (The class name is preceded by "." [".className"])
     * 6. Use a list of styles and classes of "appendNode" in "styleArray" to avoid duplicate property values.
     * 7. If a node with all styles and classes removed has the same tag name as "appendNode" or "removeNodeArray", or "appendNode" is null, that node is deleted.
     * 8. Regardless of the style and class of the node, the tag with the same name as the "removeNodeArray" argument value is deleted.
     * 9. If the "strictRemove" argument is true, only nodes with all styles and classes removed from the nodes of "removeNodeArray" are removed.
     *10. It won't work if the parent node has the same class and same value style.
     *    However, if there is a value in "removeNodeArray", it works and the text node is separated even if there is no node to replace.
     * @param {Element|null} appendNode The element to be added to the selection. If it is null, only delete the node.
     * @param {Array|null} styleArray The style or className attribute name Array to check (['font-size'], ['.className'], ['font-family', 'color', '.className']...])
     * @param {Array|null} removeNodeArray An array of node names to remove types from, remove all formats when "appendNode" is null and there is an empty array or null value. (['span'], ['strong', 'em'] ...])
     * @param {Boolean|null} strictRemove If true, only nodes with all styles and classes removed from the nodes of "removeNodeArray" are removed.
     */
    nodeChange: function nodeChange(appendNode, styleArray, removeNodeArray, strictRemove) {
      this._resetRangeToTextNode();

      var range = this.getRange_addLine(this.getRange());
      styleArray = styleArray && styleArray.length > 0 ? styleArray : false;
      removeNodeArray = removeNodeArray && removeNodeArray.length > 0 ? removeNodeArray : false;
      var isRemoveNode = !appendNode;
      var isRemoveFormat = isRemoveNode && !removeNodeArray && !styleArray;
      var startCon = range.startContainer;
      var startOff = range.startOffset;
      var endCon = range.endContainer;
      var endOff = range.endOffset;

      if (isRemoveFormat && range.collapsed && util.isFormatElement(startCon.parentNode) && util.isFormatElement(endCon.parentNode) || startCon === endCon && startCon.nodeType === 1 && util.isNonEditable(startCon)) {
        return;
      }

      if (range.collapsed && !isRemoveFormat) {
        if (startCon.nodeType === 1 && !util.isBreak(startCon) && !util.isComponent(startCon)) {
          var afterNode = null;
          var focusNode = startCon.childNodes[startOff];

          if (focusNode) {
            if (!focusNode.nextSibling) {
              afterNode = null;
            } else {
              afterNode = util.isBreak(focusNode) ? focusNode : focusNode.nextSibling;
            }
          }

          var zeroWidth = util.createTextNode(util.zeroWidthSpace);
          startCon.insertBefore(zeroWidth, afterNode);
          this.setRange(zeroWidth, 1, zeroWidth, 1);
          range = this.getRange();
          startCon = range.startContainer;
          startOff = range.startOffset;
          endCon = range.endContainer;
          endOff = range.endOffset;
        }
      }

      if (util.isFormatElement(startCon)) {
        startCon = startCon.childNodes[startOff] || startCon.firstChild;
        startOff = 0;
      }

      if (util.isFormatElement(endCon)) {
        endCon = endCon.childNodes[endOff] || endCon.lastChild;
        endOff = endCon.textContent.length;
      }

      if (isRemoveNode) {
        appendNode = util.createElement("DIV");
      }

      var wRegExp = _w.RegExp;
      var newNodeName = appendNode.nodeName;
      /* checked same style property */

      if (!isRemoveFormat && startCon === endCon && !removeNodeArray && appendNode) {
        var sNode = startCon;
        var checkCnt = 0;
        var checkAttrs = [];
        var checkStyles = appendNode.style;

        for (var i = 0, len = checkStyles.length; i < len; i++) {
          checkAttrs.push(checkStyles[i]);
        }

        var ckeckClasses = appendNode.classList;

        for (var _i4 = 0, _len2 = ckeckClasses.length; _i4 < _len2; _i4++) {
          checkAttrs.push("." + ckeckClasses[_i4]);
        }

        if (checkAttrs.length > 0) {
          while (!util.isFormatElement(sNode) && !util.isWysiwygDiv(sNode)) {
            for (var _i5 = 0; _i5 < checkAttrs.length; _i5++) {
              if (sNode.nodeType === 1) {
                var s = checkAttrs[_i5];
                var classReg = /^\./.test(s) ? new wRegExp("\\s*" + s.replace(/^\./, "") + "(\\s+|$)", "ig") : false;
                var styleCheck = isRemoveNode ? !!sNode.style[s] : !!sNode.style[s] && !!appendNode.style[s] && sNode.style[s] === appendNode.style[s];
                var classCheck = classReg === false ? false : isRemoveNode ? !!sNode.className.match(classReg) : !!sNode.className.match(classReg) && !!appendNode.className.match(classReg);

                if (styleCheck || classCheck) {
                  checkCnt++;
                }
              }
            }

            sNode = sNode.parentNode;
          }

          if (checkCnt >= checkAttrs.length) return;
        }
      }

      var start = {};
      var end = {};
      var newNode;
      var styleRegExp = "";
      var classRegExp = "";
      var removeNodeRegExp = "";

      if (styleArray) {
        for (var _i6 = 0, _len3 = styleArray.length, _s; _i6 < _len3; _i6++) {
          _s = styleArray[_i6];

          if (/^\./.test(_s)) {
            classRegExp += (classRegExp ? "|" : "\\s*(?:") + _s.replace(/^\./, "");
          } else {
            styleRegExp += (styleRegExp ? "|" : "(?:;|^|\\s)(?:") + _s;
          }
        }

        if (styleRegExp) {
          styleRegExp += ")\\s*:[^;]*\\s*(?:;|$)";
          styleRegExp = new wRegExp(styleRegExp, "ig");
        }

        if (classRegExp) {
          classRegExp += ")(?=\\s+|$)";
          classRegExp = new wRegExp(classRegExp, "ig");
        }
      }

      if (removeNodeArray) {
        removeNodeRegExp = "^(?:" + removeNodeArray[0];

        for (var _i7 = 1; _i7 < removeNodeArray.length; _i7++) {
          removeNodeRegExp += "|" + removeNodeArray[_i7];
        }

        removeNodeRegExp += ")$";
        removeNodeRegExp = new wRegExp(removeNodeRegExp, "i");
      }
      /** validation check function*/


      var wBoolean = _w.Boolean;
      var _removeCheck = {
        v: false
      };

      var validation = function validation(checkNode) {
        var vNode = checkNode.cloneNode(false); // all path

        if (vNode.nodeType === 3 || util.isBreak(vNode)) return vNode; // all remove

        if (isRemoveFormat) return null; // remove node check

        var tagRemove = !removeNodeRegExp && isRemoveNode || removeNodeRegExp && removeNodeRegExp.test(vNode.nodeName); // tag remove

        if (tagRemove && !strictRemove) {
          _removeCheck.v = true;
          return null;
        } // style regexp


        var originStyle = vNode.style.cssText;
        var style = "";

        if (styleRegExp && originStyle.length > 0) {
          style = originStyle.replace(styleRegExp, "").trim();
          if (style !== originStyle) _removeCheck.v = true;
        } // class check


        var originClasses = vNode.className;
        var classes = "";

        if (classRegExp && originClasses.length > 0) {
          classes = originClasses.replace(classRegExp, "").trim();
          if (classes !== originClasses) _removeCheck.v = true;
        } // remove only


        if (isRemoveNode) {
          if ((classRegExp || !originClasses) && (styleRegExp || !originStyle) && !style && !classes && tagRemove) {
            _removeCheck.v = true;
            return null;
          }
        } // change


        if (style || classes || vNode.nodeName !== newNodeName || wBoolean(styleRegExp) !== wBoolean(originStyle) || wBoolean(classRegExp) !== wBoolean(originClasses)) {
          if (styleRegExp && originStyle.length > 0) vNode.style.cssText = style;

          if (!vNode.style.cssText) {
            vNode.removeAttribute("style");
          }

          if (classRegExp && originClasses.length > 0) vNode.className = classes.trim();

          if (!vNode.className.trim()) {
            vNode.removeAttribute("class");
          }

          if (!vNode.style.cssText && !vNode.className && (vNode.nodeName === newNodeName || tagRemove)) {
            _removeCheck.v = true;
            return null;
          }

          return vNode;
        }

        _removeCheck.v = true;
        return null;
      }; // get line nodes


      var lineNodes = this.getSelectedElements(null);
      range = this.getRange();
      startCon = range.startContainer;
      startOff = range.startOffset;
      endCon = range.endContainer;
      endOff = range.endOffset;

      if (!util.getFormatElement(startCon, null)) {
        startCon = util.getChildElement(lineNodes[0], function (current) {
          return current.nodeType === 3;
        }, false);
        startOff = 0;
      }

      if (!util.getFormatElement(endCon, null)) {
        endCon = util.getChildElement(lineNodes[lineNodes.length - 1], function (current) {
          return current.nodeType === 3;
        }, false);
        endOff = endCon.textContent.length;
      }

      var oneLine = util.getFormatElement(startCon, null) === util.getFormatElement(endCon, null);
      var endLength = lineNodes.length - (oneLine ? 0 : 1); // node Changes

      newNode = appendNode.cloneNode(false);

      var isRemoveAnchor = isRemoveFormat || isRemoveNode && function (arr) {
        for (var n = 0, _len4 = arr.length; n < _len4; n++) {
          if (util._isMaintainedNode(arr[n]) || util._isSizeNode(arr[n])) return true;
        }

        return false;
      }(removeNodeArray);

      var isSizeNode = util._isSizeNode(newNode);

      var _getMaintainedNode = this._util_getMaintainedNode.bind(util, isRemoveAnchor, isSizeNode);

      var _isMaintainedNode = this._util_isMaintainedNode.bind(util, isRemoveAnchor, isSizeNode); // one line


      if (oneLine) {
        var newRange = this._nodeChange_oneLine(lineNodes[0], newNode, validation, startCon, startOff, endCon, endOff, isRemoveFormat, isRemoveNode, range.collapsed, _removeCheck, _getMaintainedNode, _isMaintainedNode);

        start.container = newRange.startContainer;
        start.offset = newRange.startOffset;
        end.container = newRange.endContainer;
        end.offset = newRange.endOffset;

        if (start.container === end.container && util.onlyZeroWidthSpace(start.container)) {
          start.offset = 1;
          end.offset = 1;
        }

        this._setCommonListStyle(newRange.ancestor, null);
      } else {
        // multi line
        // end
        if (endLength > 0) {
          newNode = appendNode.cloneNode(false);
          end = this._nodeChange_endLine(lineNodes[endLength], newNode, validation, endCon, endOff, isRemoveFormat, isRemoveNode, _removeCheck, _getMaintainedNode, _isMaintainedNode);
        } // mid


        for (var _i8 = endLength - 1, _newRange; _i8 > 0; _i8--) {
          newNode = appendNode.cloneNode(false);
          _newRange = this._nodeChange_middleLine(lineNodes[_i8], newNode, validation, isRemoveFormat, isRemoveNode, _removeCheck, end.container);

          if (_newRange.endContainer) {
            end.ancestor = null;
            end.container = _newRange.endContainer;
          }

          this._setCommonListStyle(_newRange.ancestor, null);
        } // start


        newNode = appendNode.cloneNode(false);
        start = this._nodeChange_startLine(lineNodes[0], newNode, validation, startCon, startOff, isRemoveFormat, isRemoveNode, _removeCheck, _getMaintainedNode, _isMaintainedNode, end.container);

        if (start.endContainer) {
          end.ancestor = null;
          end.container = start.endContainer;
        }

        if (endLength <= 0) {
          end = start;
        } else if (!end.container) {
          end.ancestor = null;
          end.container = start.container;
          end.offset = start.container.textContent.length;
        }

        this._setCommonListStyle(start.ancestor, null);

        this._setCommonListStyle(end.ancestor || util.getFormatElement(end.container), null);
      } // set range


      this.controllersOff();
      this.setRange(start.container, start.offset, end.container, end.offset); // history stack

      this.history.push(false);
    },

    /**
     * @description If certain styles are applied to all child nodes of the list cell, the style of the list cell is also changed. (bold, color, size)
     * @param {Element} el List cell element. <li>
     * @param {Element|null} child Variable for recursive call. ("null" on the first call)
     * @private
     */
    _setCommonListStyle: function _setCommonListStyle(el, child) {
      if (!util.isListCell(el)) return;
      if (!child) el.removeAttribute("style");
      var children = util.getArrayItem((child || el).childNodes, function (current) {
        return !util.isBreak(current) && !util.onlyZeroWidthSpace(current.textContent.trim());
      }, true);

      if (children[0] && children.length === 1) {
        child = children[0];
        if (!child || child.nodeType !== 1) return;
        var childStyle = child.style;
        var elStyle = el.style; // bold

        if (/STRONG/i.test(child.nodeName)) elStyle.fontWeight = "bold"; // bold
        else if (childStyle.fontWeight) elStyle.fontWeight = childStyle.fontWeight; // styles

        if (childStyle.color) elStyle.color = childStyle.color; // color

        if (childStyle.fontSize) elStyle.fontSize = childStyle.fontSize; // size

        this._setCommonListStyle(el, child);
      }
    },

    /**
     * @description Strip remove node
     * @param {Node} removeNode The remove node
     * @private
     */
    _stripRemoveNode: function _stripRemoveNode(removeNode) {
      var element = removeNode.parentNode;
      if (!removeNode || removeNode.nodeType === 3 || !element) return;
      var children = removeNode.childNodes;

      while (children[0]) {
        element.insertBefore(children[0], removeNode);
      }

      element.removeChild(removeNode);
    },

    /**
     * @description Return the parent maintained tag. (bind and use a util object)
     * @param {Element} element Element
     * @returns {Element}
     * @private
     */
    _util_getMaintainedNode: function _util_getMaintainedNode(_isRemove, _isSizeNode, element) {
      if (!element || _isRemove) return null;
      return this.getParentElement(element, this._isMaintainedNode.bind(this)) || (!_isSizeNode ? this.getParentElement(element, this._isSizeNode.bind(this)) : null);
    },

    /**
     * @description Check if element is a tag that should be persisted. (bind and use a util object)
     * @param {Element} element Element
     * @returns {Element}
     * @private
     */
    _util_isMaintainedNode: function _util_isMaintainedNode(_isRemove, _isSizeNode, element) {
      if (!element || _isRemove || element.nodeType !== 1) return false;

      var anchor = this._isMaintainedNode(element);

      return this.getParentElement(element, this._isMaintainedNode.bind(this)) ? anchor : anchor || (!_isSizeNode ? this._isSizeNode(element) : false);
    },

    /**
     * @description wraps text nodes of line selected text.
     * @param {Element} element The node of the line that contains the selected text node.
     * @param {Element} newInnerNode The dom that will wrap the selected text area
     * @param {Function} validation Check if the node should be stripped.
     * @param {Node} startCon The startContainer property of the selection object.
     * @param {Number} startOff The startOffset property of the selection object.
     * @param {Node} endCon The endContainer property of the selection object.
     * @param {Number} endOff The endOffset property of the selection object.
     * @param {Boolean} isRemoveFormat Is the remove all formats command?
     * @param {Boolean} isRemoveNode "newInnerNode" is remove node?
     * @param {Boolean} collapsed range.collapsed
     * @returns {{ancestor: *, startContainer: *, startOffset: *, endContainer: *, endOffset: *}}
     * @private
     */
    _nodeChange_oneLine: function _nodeChange_oneLine(element, newInnerNode, validation, startCon, startOff, endCon, endOff, isRemoveFormat, isRemoveNode, collapsed, _removeCheck, _getMaintainedNode, _isMaintainedNode) {
      // not add tag
      var parentCon = startCon.parentNode;

      while (!parentCon.nextSibling && !parentCon.previousSibling && !util.isFormatElement(parentCon.parentNode) && !util.isWysiwygDiv(parentCon.parentNode)) {
        if (parentCon.nodeName === newInnerNode.nodeName) break;
        parentCon = parentCon.parentNode;
      }

      if (!isRemoveNode && parentCon === endCon.parentNode && parentCon.nodeName === newInnerNode.nodeName) {
        if (util.onlyZeroWidthSpace(startCon.textContent.slice(0, startOff)) && util.onlyZeroWidthSpace(endCon.textContent.slice(endOff))) {
          var children = parentCon.childNodes;
          var sameTag = true;

          for (var i = 0, len = children.length, c, s, e, z; i < len; i++) {
            c = children[i];
            z = !util.onlyZeroWidthSpace(c);

            if (c === startCon) {
              s = true;
              continue;
            }

            if (c === endCon) {
              e = true;
              continue;
            }

            if (!s && z || s && e && z) {
              sameTag = false;
              break;
            }
          }

          if (sameTag) {
            util.copyTagAttributes(parentCon, newInnerNode);
            return {
              startContainer: startCon,
              startOffset: startOff,
              endContainer: endCon,
              endOffset: endOff
            };
          }
        }
      } // add tag


      _removeCheck.v = false;
      var el = element;
      var nNodeArray = [newInnerNode];
      var pNode = element.cloneNode(false);
      var isSameNode = startCon === endCon;
      var startContainer = startCon;
      var startOffset = startOff;
      var endContainer = endCon;
      var endOffset = endOff;
      var startPass = false;
      var endPass = false;
      var pCurrent, newNode, appendNode, cssText, anchorNode;
      var wRegExp = _w.RegExp;

      function checkCss(vNode) {
        var regExp = new wRegExp("(?:;|^|\\s)(?:" + cssText + "null)\\s*:[^;]*\\s*(?:;|$)", "ig");
        var style = "";

        if (regExp && vNode.style.cssText.length > 0) {
          style = regExp.test(vNode.style.cssText);
        }

        return !style;
      }

      (function recursionFunc(current, ancestor) {
        var childNodes = current.childNodes;

        for (var _i9 = 0, _len5 = childNodes.length, vNode; _i9 < _len5; _i9++) {
          var child = childNodes[_i9];
          if (!child) continue;
          var coverNode = ancestor;
          var cloneNode = void 0; // startContainer

          if (!startPass && child === startContainer) {
            var line = pNode;
            anchorNode = _getMaintainedNode(child);
            var prevNode = util.createTextNode(startContainer.nodeType === 1 ? "" : startContainer.substringData(0, startOffset));
            var textNode = util.createTextNode(startContainer.nodeType === 1 ? "" : startContainer.substringData(startOffset, isSameNode ? endOffset >= startOffset ? endOffset - startOffset : startContainer.data.length - startOffset : startContainer.data.length - startOffset));

            if (anchorNode) {
              var a = _getMaintainedNode(ancestor);

              if (a && a.parentNode !== line) {
                var m = a;
                var p = null;

                while (m.parentNode !== line) {
                  ancestor = m.parentNode.cloneNode(false);
                  p = m.parentNode.cloneNode(false);

                  while (m.childNodes[0]) {
                    p.appendChild(m.childNodes[0]);
                  }

                  m.appendChild(p);
                  m = m.parentNode;
                }

                m.parentNode.appendChild(a);
              }

              anchorNode = anchorNode.cloneNode(false);
            }

            if (!util.onlyZeroWidthSpace(prevNode)) {
              ancestor.appendChild(prevNode);
            }

            var prevAnchorNode = _getMaintainedNode(ancestor);

            if (!!prevAnchorNode) anchorNode = prevAnchorNode;
            if (anchorNode) line = anchorNode;
            newNode = child;
            pCurrent = [];
            cssText = "";

            while (newNode !== line && newNode !== el && newNode !== null) {
              vNode = _isMaintainedNode(newNode) ? null : validation(newNode);

              if (vNode && newNode.nodeType === 1 && checkCss(newNode)) {
                pCurrent.push(vNode);
                cssText += newNode.style.cssText.substr(0, newNode.style.cssText.indexOf(":")) + "|";
              }

              newNode = newNode.parentNode;
            }

            var childNode = pCurrent.pop() || textNode;
            appendNode = childNode;
            newNode = childNode;

            while (pCurrent.length > 0) {
              newNode = pCurrent.pop();
              appendNode.appendChild(newNode);
              appendNode = newNode;
            }

            newInnerNode.appendChild(childNode);
            line.appendChild(newInnerNode);

            if (anchorNode && !_getMaintainedNode(endContainer)) {
              newInnerNode = newInnerNode.cloneNode(false);
              pNode.appendChild(newInnerNode);
              nNodeArray.push(newInnerNode);
            }

            startContainer = textNode;
            startOffset = 0;
            startPass = true;
            if (newNode !== textNode) newNode.appendChild(startContainer);
            if (!isSameNode) continue;
          } // endContainer


          if (!endPass && child === endContainer) {
            anchorNode = _getMaintainedNode(child);
            var afterNode = util.createTextNode(endContainer.nodeType === 1 ? "" : endContainer.substringData(endOffset, endContainer.length - endOffset));

            var _textNode = util.createTextNode(isSameNode || endContainer.nodeType === 1 ? "" : endContainer.substringData(0, endOffset));

            if (anchorNode) {
              anchorNode = anchorNode.cloneNode(false);
            } else if (_isMaintainedNode(newInnerNode.parentNode) && !anchorNode) {
              newInnerNode = newInnerNode.cloneNode(false);
              pNode.appendChild(newInnerNode);
              nNodeArray.push(newInnerNode);
            }

            if (!util.onlyZeroWidthSpace(afterNode)) {
              newNode = child;
              cssText = "";
              pCurrent = [];
              var anchors = [];

              while (newNode !== pNode && newNode !== el && newNode !== null) {
                if (newNode.nodeType === 1 && checkCss(newNode)) {
                  if (_isMaintainedNode(newNode)) anchors.push(newNode.cloneNode(false));else pCurrent.push(newNode.cloneNode(false));
                  cssText += newNode.style.cssText.substr(0, newNode.style.cssText.indexOf(":")) + "|";
                }

                newNode = newNode.parentNode;
              }

              pCurrent = pCurrent.concat(anchors);
              cloneNode = pCurrent.pop() || afterNode;
              appendNode = pCurrent.pop() || afterNode;
              newNode = pCurrent.pop() || afterNode;

              while (pCurrent.length > 0) {
                newNode = pCurrent.pop();
                appendNode.appendChild(newNode);
                appendNode = newNode;
              }

              pNode.appendChild(cloneNode);
              newNode.textContent = afterNode.data;
            }

            if (anchorNode && cloneNode) {
              var afterAnchorNode = _getMaintainedNode(cloneNode);

              if (afterAnchorNode) {
                anchorNode = afterAnchorNode;
              }
            }

            newNode = child;
            pCurrent = [];
            cssText = "";

            while (newNode !== pNode && newNode !== el && newNode !== null) {
              vNode = _isMaintainedNode(newNode) ? null : validation(newNode);

              if (vNode && newNode.nodeType === 1 && checkCss(newNode)) {
                pCurrent.push(vNode);
                cssText += newNode.style.cssText.substr(0, newNode.style.cssText.indexOf(":")) + "|";
              }

              newNode = newNode.parentNode;
            }

            var _childNode = pCurrent.pop() || _textNode;

            appendNode = _childNode;
            newNode = _childNode;

            while (pCurrent.length > 0) {
              newNode = pCurrent.pop();
              appendNode.appendChild(newNode);
              appendNode = newNode;
            }

            if (anchorNode) {
              newInnerNode = newInnerNode.cloneNode(false);
              newInnerNode.appendChild(_childNode);
              anchorNode.insertBefore(newInnerNode, anchorNode.firstChild);
              pNode.appendChild(anchorNode);
              nNodeArray.push(newInnerNode);
              anchorNode = null;
            } else {
              newInnerNode.appendChild(_childNode);
            }

            endContainer = _textNode;
            endOffset = _textNode.data.length;
            endPass = true;

            if (!isRemoveFormat && collapsed) {
              newInnerNode = _textNode;
              _textNode.textContent = util.zeroWidthSpace;
            }

            if (newNode !== _textNode) newNode.appendChild(endContainer);
            continue;
          } // other


          if (startPass) {
            if (child.nodeType === 1 && !util.isBreak(child)) {
              if (util._isIgnoreNodeChange(child)) {
                pNode.appendChild(child.cloneNode(true));

                if (!collapsed) {
                  newInnerNode = newInnerNode.cloneNode(false);
                  pNode.appendChild(newInnerNode);
                  nNodeArray.push(newInnerNode);
                }
              } else {
                recursionFunc(child, child);
              }

              continue;
            }

            newNode = child;
            pCurrent = [];
            cssText = "";
            var _anchors = [];

            while (newNode.parentNode !== null && newNode !== el && newNode !== newInnerNode) {
              vNode = endPass ? newNode.cloneNode(false) : validation(newNode);

              if (newNode.nodeType === 1 && !util.isBreak(child) && vNode && checkCss(newNode)) {
                if (_isMaintainedNode(newNode)) {
                  if (!anchorNode) _anchors.push(vNode);
                } else {
                  pCurrent.push(vNode);
                }

                cssText += newNode.style.cssText.substr(0, newNode.style.cssText.indexOf(":")) + "|";
              }

              newNode = newNode.parentNode;
            }

            pCurrent = pCurrent.concat(_anchors);

            var _childNode2 = pCurrent.pop() || child;

            appendNode = _childNode2;
            newNode = _childNode2;

            while (pCurrent.length > 0) {
              newNode = pCurrent.pop();
              appendNode.appendChild(newNode);
              appendNode = newNode;
            }

            if (_isMaintainedNode(newInnerNode.parentNode) && !_isMaintainedNode(_childNode2)) {
              newInnerNode = newInnerNode.cloneNode(false);
              pNode.appendChild(newInnerNode);
              nNodeArray.push(newInnerNode);
            }

            if (!endPass && !anchorNode && _isMaintainedNode(_childNode2)) {
              newInnerNode = newInnerNode.cloneNode(false);
              var aChildren = _childNode2.childNodes;

              for (var _a = 0, aLen = aChildren.length; _a < aLen; _a++) {
                newInnerNode.appendChild(aChildren[_a]);
              }

              _childNode2.appendChild(newInnerNode);

              pNode.appendChild(_childNode2);
              nNodeArray.push(newInnerNode);
              if (newInnerNode.children.length > 0) ancestor = newNode;else ancestor = newInnerNode;
            } else if (_childNode2 === child) {
              if (!endPass) ancestor = newInnerNode;else ancestor = pNode;
            } else if (endPass) {
              pNode.appendChild(_childNode2);
              ancestor = newNode;
            } else {
              newInnerNode.appendChild(_childNode2);
              ancestor = newNode;
            }

            if (anchorNode && child.nodeType === 3) {
              if (_getMaintainedNode(child)) {
                var ancestorAnchorNode = util.getParentElement(ancestor, function (current) {
                  return this._isMaintainedNode(current.parentNode) || current.parentNode === pNode;
                }.bind(util));
                anchorNode.appendChild(ancestorAnchorNode);
                newInnerNode = ancestorAnchorNode.cloneNode(false);
                nNodeArray.push(newInnerNode);
                pNode.appendChild(newInnerNode);
              } else {
                anchorNode = null;
              }
            }
          }

          cloneNode = child.cloneNode(false);
          ancestor.appendChild(cloneNode);
          if (child.nodeType === 1 && !util.isBreak(child)) coverNode = cloneNode;
          recursionFunc(child, coverNode);
        }
      })(element, pNode); // not remove tag


      if (isRemoveNode && !isRemoveFormat && !_removeCheck.v) {
        return {
          ancestor: element,
          startContainer: startCon,
          startOffset: startOff,
          endContainer: endCon,
          endOffset: endOff
        };
      }

      isRemoveFormat = isRemoveFormat && isRemoveNode;

      if (isRemoveFormat) {
        for (var _i10 = 0; _i10 < nNodeArray.length; _i10++) {
          var removeNode = nNodeArray[_i10];
          var textNode = void 0,
              textNode_s = void 0,
              textNode_e = void 0;

          if (collapsed) {
            textNode = util.createTextNode(util.zeroWidthSpace);
            pNode.replaceChild(textNode, removeNode);
          } else {
            var rChildren = removeNode.childNodes;
            textNode_s = rChildren[0];

            while (rChildren[0]) {
              textNode_e = rChildren[0];
              pNode.insertBefore(textNode_e, removeNode);
            }

            util.removeItem(removeNode);
          }

          if (_i10 === 0) {
            if (collapsed) {
              startContainer = textNode;
              endContainer = textNode;
            } else {
              startContainer = textNode_s;
              endContainer = textNode_e;
            }
          }
        }
      } else {
        if (isRemoveNode) {
          for (var _i11 = 0; _i11 < nNodeArray.length; _i11++) {
            this._stripRemoveNode(nNodeArray[_i11]);
          }
        }

        if (collapsed) {
          startContainer = newInnerNode;
          endContainer = newInnerNode;
        }
      }

      util.removeEmptyNode(pNode, newInnerNode);

      if (collapsed) {
        startOffset = startContainer.textContent.length;
        endOffset = endContainer.textContent.length;
      } // endContainer reset


      var endConReset = isRemoveFormat || endContainer.textContent.length === 0;

      if (!util.isBreak(endContainer) && endContainer.textContent.length === 0) {
        util.removeItem(endContainer);
        endContainer = startContainer;
      }

      endOffset = endConReset ? endContainer.textContent.length : endOffset; // node change

      var newStartOffset = {
        s: 0,
        e: 0
      };
      var startPath = util.getNodePath(startContainer, pNode, newStartOffset);
      var mergeEndCon = !endContainer.parentNode;
      if (mergeEndCon) endContainer = startContainer;
      var newEndOffset = {
        s: 0,
        e: 0
      };
      var endPath = util.getNodePath(endContainer, pNode, !mergeEndCon && !endConReset ? newEndOffset : null);
      startOffset += newStartOffset.s;
      endOffset = collapsed ? startOffset : mergeEndCon ? startContainer.textContent.length : endConReset ? endOffset + newStartOffset.s : endOffset + newEndOffset.s; // tag merge

      var newOffsets = util.mergeSameTags(pNode, [startPath, endPath], true);
      element.parentNode.replaceChild(pNode, element);
      startContainer = util.getNodeFromPath(startPath, pNode);
      endContainer = util.getNodeFromPath(endPath, pNode);
      return {
        ancestor: pNode,
        startContainer: startContainer,
        startOffset: startOffset + newOffsets[0],
        endContainer: endContainer,
        endOffset: endOffset + newOffsets[1]
      };
    },

    /**
     * @description wraps first line selected text.
     * @param {Element} element The node of the line that contains the selected text node.
     * @param {Element} newInnerNode The dom that will wrap the selected text area
     * @param {Function} validation Check if the node should be stripped.
     * @param {Node} startCon The startContainer property of the selection object.
     * @param {Number} startOff The startOffset property of the selection object.
     * @param {Boolean} isRemoveFormat Is the remove all formats command?
     * @param {Boolean} isRemoveNode "newInnerNode" is remove node?
     * @returns {null|Node} If end container is renewed, returned renewed node
     * @returns {Object} { ancestor, container, offset, endContainer }
     * @private
     */
    _nodeChange_startLine: function _nodeChange_startLine(element, newInnerNode, validation, startCon, startOff, isRemoveFormat, isRemoveNode, _removeCheck, _getMaintainedNode, _isMaintainedNode, _endContainer) {
      // not add tag
      var parentCon = startCon.parentNode;

      while (!parentCon.nextSibling && !parentCon.previousSibling && !util.isFormatElement(parentCon.parentNode) && !util.isWysiwygDiv(parentCon.parentNode)) {
        if (parentCon.nodeName === newInnerNode.nodeName) break;
        parentCon = parentCon.parentNode;
      }

      if (!isRemoveNode && parentCon.nodeName === newInnerNode.nodeName && !util.isFormatElement(parentCon) && !parentCon.nextSibling && util.onlyZeroWidthSpace(startCon.textContent.slice(0, startOff))) {
        var sameTag = true;
        var s = startCon.previousSibling;

        while (s) {
          if (!util.onlyZeroWidthSpace(s)) {
            sameTag = false;
            break;
          }

          s = s.previousSibling;
        }

        if (sameTag) {
          util.copyTagAttributes(parentCon, newInnerNode);
          return {
            ancestor: element,
            container: startCon,
            offset: startOff
          };
        }
      } // add tag


      _removeCheck.v = false;
      var el = element;
      var nNodeArray = [newInnerNode];
      var pNode = element.cloneNode(false);
      var container = startCon;
      var offset = startOff;
      var passNode = false;
      var pCurrent, newNode, appendNode, anchorNode;

      (function recursionFunc(current, ancestor) {
        var childNodes = current.childNodes;

        for (var i = 0, len = childNodes.length, vNode, cloneChild; i < len; i++) {
          var child = childNodes[i];
          if (!child) continue;
          var coverNode = ancestor;

          if (passNode && !util.isBreak(child)) {
            if (child.nodeType === 1) {
              if (util._isIgnoreNodeChange(child)) {
                newInnerNode = newInnerNode.cloneNode(false);
                cloneChild = child.cloneNode(true);
                pNode.appendChild(cloneChild);
                pNode.appendChild(newInnerNode);
                nNodeArray.push(newInnerNode); // end container

                if (_endContainer && child.contains(_endContainer)) {
                  var endPath = util.getNodePath(_endContainer, child);
                  _endContainer = util.getNodeFromPath(endPath, cloneChild);
                }
              } else {
                recursionFunc(child, child);
              }

              continue;
            }

            newNode = child;
            pCurrent = [];
            var anchors = [];

            while (newNode.parentNode !== null && newNode !== el && newNode !== newInnerNode) {
              vNode = validation(newNode);

              if (newNode.nodeType === 1 && vNode) {
                if (_isMaintainedNode(newNode)) {
                  if (!anchorNode) anchors.push(vNode);
                } else {
                  pCurrent.push(vNode);
                }
              }

              newNode = newNode.parentNode;
            }

            pCurrent = pCurrent.concat(anchors);
            var isTopNode = pCurrent.length > 0;
            var childNode = pCurrent.pop() || child;
            appendNode = childNode;
            newNode = childNode;

            while (pCurrent.length > 0) {
              newNode = pCurrent.pop();
              appendNode.appendChild(newNode);
              appendNode = newNode;
            }

            if (_isMaintainedNode(newInnerNode.parentNode) && !_isMaintainedNode(childNode)) {
              newInnerNode = newInnerNode.cloneNode(false);
              pNode.appendChild(newInnerNode);
              nNodeArray.push(newInnerNode);
            }

            if (!anchorNode && _isMaintainedNode(childNode)) {
              newInnerNode = newInnerNode.cloneNode(false);
              var aChildren = childNode.childNodes;

              for (var a = 0, aLen = aChildren.length; a < aLen; a++) {
                newInnerNode.appendChild(aChildren[a]);
              }

              childNode.appendChild(newInnerNode);
              pNode.appendChild(childNode);
              ancestor = !_isMaintainedNode(newNode) ? newNode : newInnerNode;
              nNodeArray.push(newInnerNode);
            } else if (isTopNode) {
              newInnerNode.appendChild(childNode);
              ancestor = newNode;
            } else {
              ancestor = newInnerNode;
            }

            if (anchorNode && child.nodeType === 3) {
              if (_getMaintainedNode(child)) {
                var ancestorAnchorNode = util.getParentElement(ancestor, function (current) {
                  return this._isMaintainedNode(current.parentNode) || current.parentNode === pNode;
                }.bind(util));
                anchorNode.appendChild(ancestorAnchorNode);
                newInnerNode = ancestorAnchorNode.cloneNode(false);
                nNodeArray.push(newInnerNode);
                pNode.appendChild(newInnerNode);
              } else {
                anchorNode = null;
              }
            }
          } // startContainer


          if (!passNode && child === container) {
            var line = pNode;
            anchorNode = _getMaintainedNode(child);
            var prevNode = util.createTextNode(container.nodeType === 1 ? "" : container.substringData(0, offset));
            var textNode = util.createTextNode(container.nodeType === 1 ? "" : container.substringData(offset, container.length - offset));

            if (anchorNode) {
              var _a2 = _getMaintainedNode(ancestor);

              if (_a2 && _a2.parentNode !== line) {
                var m = _a2;
                var p = null;

                while (m.parentNode !== line) {
                  ancestor = m.parentNode.cloneNode(false);
                  p = m.parentNode.cloneNode(false);

                  while (m.childNodes[0]) {
                    p.appendChild(m.childNodes[0]);
                  }

                  m.appendChild(p);
                  m = m.parentNode;
                }

                m.parentNode.appendChild(_a2);
              }

              anchorNode = anchorNode.cloneNode(false);
            }

            if (!util.onlyZeroWidthSpace(prevNode)) {
              ancestor.appendChild(prevNode);
            }

            var prevAnchorNode = _getMaintainedNode(ancestor);

            if (!!prevAnchorNode) anchorNode = prevAnchorNode;
            if (anchorNode) line = anchorNode;
            newNode = ancestor;
            pCurrent = [];

            while (newNode !== line && newNode !== null) {
              vNode = validation(newNode);

              if (newNode.nodeType === 1 && vNode) {
                pCurrent.push(vNode);
              }

              newNode = newNode.parentNode;
            }

            var _childNode3 = pCurrent.pop() || ancestor;

            appendNode = _childNode3;
            newNode = _childNode3;

            while (pCurrent.length > 0) {
              newNode = pCurrent.pop();
              appendNode.appendChild(newNode);
              appendNode = newNode;
            }

            if (_childNode3 !== ancestor) {
              newInnerNode.appendChild(_childNode3);
              ancestor = newNode;
            } else {
              ancestor = newInnerNode;
            }

            if (util.isBreak(child)) newInnerNode.appendChild(child.cloneNode(false));
            line.appendChild(newInnerNode);
            container = textNode;
            offset = 0;
            passNode = true;
            ancestor.appendChild(container);
            continue;
          }

          vNode = !passNode ? child.cloneNode(false) : validation(child);

          if (vNode) {
            ancestor.appendChild(vNode);
            if (child.nodeType === 1 && !util.isBreak(child)) coverNode = vNode;
          }

          recursionFunc(child, coverNode);
        }
      })(element, pNode); // not remove tag


      if (isRemoveNode && !isRemoveFormat && !_removeCheck.v) {
        return {
          ancestor: element,
          container: startCon,
          offset: startOff,
          endContainer: _endContainer
        };
      }

      isRemoveFormat = isRemoveFormat && isRemoveNode;

      if (isRemoveFormat) {
        for (var i = 0; i < nNodeArray.length; i++) {
          var removeNode = nNodeArray[i];
          var rChildren = removeNode.childNodes;
          var textNode = rChildren[0];

          while (rChildren[0]) {
            pNode.insertBefore(rChildren[0], removeNode);
          }

          util.removeItem(removeNode);
          if (i === 0) container = textNode;
        }
      } else if (isRemoveNode) {
        for (var _i12 = 0; _i12 < nNodeArray.length; _i12++) {
          this._stripRemoveNode(nNodeArray[_i12]);
        }
      }

      if (!isRemoveFormat && pNode.childNodes.length === 0) {
        if (element.childNodes) {
          container = element.childNodes[0];
        } else {
          container = util.createTextNode(util.zeroWidthSpace);
          element.appendChild(container);
        }
      } else {
        util.removeEmptyNode(pNode, newInnerNode);

        if (util.onlyZeroWidthSpace(pNode.textContent)) {
          container = pNode.firstChild;
          offset = 0;
        } // node change


        var offsets = {
          s: 0,
          e: 0
        };
        var path = util.getNodePath(container, pNode, offsets);
        offset += offsets.s; // tag merge

        var newOffsets = util.mergeSameTags(pNode, [path], true);
        element.parentNode.replaceChild(pNode, element);
        container = util.getNodeFromPath(path, pNode);
        offset += newOffsets[0];
      }

      return {
        ancestor: pNode,
        container: container,
        offset: offset,
        endContainer: _endContainer
      };
    },

    /**
     * @description wraps mid lines selected text.
     * @param {Element} element The node of the line that contains the selected text node.
     * @param {Element} newInnerNode The dom that will wrap the selected text area
     * @param {Function} validation Check if the node should be stripped.
     * @param {Boolean} isRemoveFormat Is the remove all formats command?
     * @param {Boolean} isRemoveNode "newInnerNode" is remove node?
     * @param {Node} _endContainer Offset node of last line already modified (end.container)
     * @returns {Object} { ancestor, endContainer: "If end container is renewed, returned renewed node" }
     * @private
     */
    _nodeChange_middleLine: function _nodeChange_middleLine(element, newInnerNode, validation, isRemoveFormat, isRemoveNode, _removeCheck, _endContainer) {
      // not add tag
      if (!isRemoveNode) {
        // end container path
        var endPath = null;
        if (_endContainer && element.contains(_endContainer)) endPath = util.getNodePath(_endContainer, element);
        var tempNode = element.cloneNode(true);
        var newNodeName = newInnerNode.nodeName;
        var newCssText = newInnerNode.style.cssText;
        var newClass = newInnerNode.className;
        var children = tempNode.childNodes;
        var i = 0;
        var len = children.length;

        for (var child; i < len; i++) {
          child = children[i];
          if (child.nodeType === 3) break;

          if (child.nodeName === newNodeName) {
            child.style.cssText += newCssText;
            util.addClass(child, newClass);
          } else if (!util.isBreak(child) && util._isIgnoreNodeChange(child)) {
            continue;
          } else if (len === 1) {
            children = child.childNodes;
            len = children.length;
            i = -1;
            continue;
          } else {
            break;
          }
        }

        if (len > 0 && i === len) {
          element.innerHTML = tempNode.innerHTML;
          return {
            ancestor: element,
            endContainer: endPath ? util.getNodeFromPath(endPath, element) : null
          };
        }
      } // add tag


      _removeCheck.v = false;
      var pNode = element.cloneNode(false);
      var nNodeArray = [newInnerNode];
      var noneChange = true;

      (function recursionFunc(current, ancestor) {
        var childNodes = current.childNodes;

        for (var _i13 = 0, _len6 = childNodes.length, vNode, cloneChild; _i13 < _len6; _i13++) {
          var _child = childNodes[_i13];
          if (!_child) continue;
          var coverNode = ancestor;

          if (!util.isBreak(_child) && util._isIgnoreNodeChange(_child)) {
            if (newInnerNode.childNodes.length > 0) {
              pNode.appendChild(newInnerNode);
              newInnerNode = newInnerNode.cloneNode(false);
            }

            cloneChild = _child.cloneNode(true);
            pNode.appendChild(cloneChild);
            pNode.appendChild(newInnerNode);
            nNodeArray.push(newInnerNode);
            ancestor = newInnerNode; // end container

            if (_endContainer && _child.contains(_endContainer)) {
              var _endPath = util.getNodePath(_endContainer, _child);

              _endContainer = util.getNodeFromPath(_endPath, cloneChild);
            }

            continue;
          } else {
            vNode = validation(_child);

            if (vNode) {
              noneChange = false;
              ancestor.appendChild(vNode);
              if (_child.nodeType === 1) coverNode = vNode;
            }
          }

          if (!util.isBreak(_child)) recursionFunc(_child, coverNode);
        }
      })(element, newInnerNode); // not remove tag


      if (noneChange || isRemoveNode && !isRemoveFormat && !_removeCheck.v) return {
        ancestor: element,
        endContainer: _endContainer
      };
      pNode.appendChild(newInnerNode);

      if (isRemoveFormat && isRemoveNode) {
        for (var _i14 = 0; _i14 < nNodeArray.length; _i14++) {
          var removeNode = nNodeArray[_i14];
          var rChildren = removeNode.childNodes;

          while (rChildren[0]) {
            pNode.insertBefore(rChildren[0], removeNode);
          }

          util.removeItem(removeNode);
        }
      } else if (isRemoveNode) {
        for (var _i15 = 0; _i15 < nNodeArray.length; _i15++) {
          this._stripRemoveNode(nNodeArray[_i15]);
        }
      }

      util.removeEmptyNode(pNode, newInnerNode);
      util.mergeSameTags(pNode, null, true); // node change

      element.parentNode.replaceChild(pNode, element);
      return {
        ancestor: pNode,
        endContainer: _endContainer
      };
    },

    /**
     * @description wraps last line selected text.
     * @param {Element} element The node of the line that contains the selected text node.
     * @param {Element} newInnerNode The dom that will wrap the selected text area
     * @param {Function} validation Check if the node should be stripped.
     * @param {Node} endCon The endContainer property of the selection object.
     * @param {Number} endOff The endOffset property of the selection object.
     * @param {Boolean} isRemoveFormat Is the remove all formats command?
     * @param {Boolean} isRemoveNode "newInnerNode" is remove node?
     * @returns {Object} { ancestor, container, offset }
     * @private
     */
    _nodeChange_endLine: function _nodeChange_endLine(element, newInnerNode, validation, endCon, endOff, isRemoveFormat, isRemoveNode, _removeCheck, _getMaintainedNode, _isMaintainedNode) {
      // not add tag
      var parentCon = endCon.parentNode;

      while (!parentCon.nextSibling && !parentCon.previousSibling && !util.isFormatElement(parentCon.parentNode) && !util.isWysiwygDiv(parentCon.parentNode)) {
        if (parentCon.nodeName === newInnerNode.nodeName) break;
        parentCon = parentCon.parentNode;
      }

      if (!isRemoveNode && parentCon.nodeName === newInnerNode.nodeName && !util.isFormatElement(parentCon) && !parentCon.previousSibling && util.onlyZeroWidthSpace(endCon.textContent.slice(endOff))) {
        var sameTag = true;
        var e = endCon.nextSibling;

        while (e) {
          if (!util.onlyZeroWidthSpace(e)) {
            sameTag = false;
            break;
          }

          e = e.nextSibling;
        }

        if (sameTag) {
          util.copyTagAttributes(parentCon, newInnerNode);
          return {
            ancestor: element,
            container: endCon,
            offset: endOff
          };
        }
      } // add tag


      _removeCheck.v = false;
      var el = element;
      var nNodeArray = [newInnerNode];
      var pNode = element.cloneNode(false);
      var container = endCon;
      var offset = endOff;
      var passNode = false;
      var pCurrent, newNode, appendNode, anchorNode;

      (function recursionFunc(current, ancestor) {
        var childNodes = current.childNodes;

        for (var i = childNodes.length - 1, vNode; 0 <= i; i--) {
          var child = childNodes[i];
          if (!child) continue;
          var coverNode = ancestor;

          if (passNode && !util.isBreak(child)) {
            if (child.nodeType === 1) {
              if (util._isIgnoreNodeChange(child)) {
                newInnerNode = newInnerNode.cloneNode(false);
                var cloneChild = child.cloneNode(true);
                pNode.insertBefore(cloneChild, ancestor);
                pNode.insertBefore(newInnerNode, cloneChild);
                nNodeArray.push(newInnerNode);
              } else {
                recursionFunc(child, child);
              }

              continue;
            }

            newNode = child;
            pCurrent = [];
            var anchors = [];

            while (newNode.parentNode !== null && newNode !== el && newNode !== newInnerNode) {
              vNode = validation(newNode);

              if (vNode && newNode.nodeType === 1) {
                if (_isMaintainedNode(newNode)) {
                  if (!anchorNode) anchors.push(vNode);
                } else {
                  pCurrent.push(vNode);
                }
              }

              newNode = newNode.parentNode;
            }

            pCurrent = pCurrent.concat(anchors);
            var isTopNode = pCurrent.length > 0;
            var childNode = pCurrent.pop() || child;
            appendNode = childNode;
            newNode = childNode;

            while (pCurrent.length > 0) {
              newNode = pCurrent.pop();
              appendNode.appendChild(newNode);
              appendNode = newNode;
            }

            if (_isMaintainedNode(newInnerNode.parentNode) && !_isMaintainedNode(childNode)) {
              newInnerNode = newInnerNode.cloneNode(false);
              pNode.insertBefore(newInnerNode, pNode.firstChild);
              nNodeArray.push(newInnerNode);
            }

            if (!anchorNode && _isMaintainedNode(childNode)) {
              newInnerNode = newInnerNode.cloneNode(false);
              var aChildren = childNode.childNodes;

              for (var a = 0, aLen = aChildren.length; a < aLen; a++) {
                newInnerNode.appendChild(aChildren[a]);
              }

              childNode.appendChild(newInnerNode);
              pNode.insertBefore(childNode, pNode.firstChild);
              nNodeArray.push(newInnerNode);
              if (newInnerNode.children.length > 0) ancestor = newNode;else ancestor = newInnerNode;
            } else if (isTopNode) {
              newInnerNode.insertBefore(childNode, newInnerNode.firstChild);
              ancestor = newNode;
            } else {
              ancestor = newInnerNode;
            }

            if (anchorNode && child.nodeType === 3) {
              if (_getMaintainedNode(child)) {
                var ancestorAnchorNode = util.getParentElement(ancestor, function (current) {
                  return this._isMaintainedNode(current.parentNode) || current.parentNode === pNode;
                }.bind(util));
                anchorNode.appendChild(ancestorAnchorNode);
                newInnerNode = ancestorAnchorNode.cloneNode(false);
                nNodeArray.push(newInnerNode);
                pNode.insertBefore(newInnerNode, pNode.firstChild);
              } else {
                anchorNode = null;
              }
            }
          } // endContainer


          if (!passNode && child === container) {
            anchorNode = _getMaintainedNode(child);
            var afterNode = util.createTextNode(container.nodeType === 1 ? "" : container.substringData(offset, container.length - offset));
            var textNode = util.createTextNode(container.nodeType === 1 ? "" : container.substringData(0, offset));

            if (anchorNode) {
              anchorNode = anchorNode.cloneNode(false);

              var _a3 = _getMaintainedNode(ancestor);

              if (_a3 && _a3.parentNode !== pNode) {
                var m = _a3;
                var p = null;

                while (m.parentNode !== pNode) {
                  ancestor = m.parentNode.cloneNode(false);
                  p = m.parentNode.cloneNode(false);

                  while (m.childNodes[0]) {
                    p.appendChild(m.childNodes[0]);
                  }

                  m.appendChild(p);
                  m = m.parentNode;
                }

                m.parentNode.insertBefore(_a3, m.parentNode.firstChild);
              }

              anchorNode = anchorNode.cloneNode(false);
            } else if (_isMaintainedNode(newInnerNode.parentNode) && !anchorNode) {
              newInnerNode = newInnerNode.cloneNode(false);
              pNode.appendChild(newInnerNode);
              nNodeArray.push(newInnerNode);
            }

            if (!util.onlyZeroWidthSpace(afterNode)) {
              ancestor.insertBefore(afterNode, ancestor.firstChild);
            }

            newNode = ancestor;
            pCurrent = [];

            while (newNode !== pNode && newNode !== null) {
              vNode = _isMaintainedNode(newNode) ? null : validation(newNode);

              if (vNode && newNode.nodeType === 1) {
                pCurrent.push(vNode);
              }

              newNode = newNode.parentNode;
            }

            var _childNode4 = pCurrent.pop() || ancestor;

            appendNode = _childNode4;
            newNode = _childNode4;

            while (pCurrent.length > 0) {
              newNode = pCurrent.pop();
              appendNode.appendChild(newNode);
              appendNode = newNode;
            }

            if (_childNode4 !== ancestor) {
              newInnerNode.insertBefore(_childNode4, newInnerNode.firstChild);
              ancestor = newNode;
            } else {
              ancestor = newInnerNode;
            }

            if (util.isBreak(child)) newInnerNode.appendChild(child.cloneNode(false));

            if (anchorNode) {
              anchorNode.insertBefore(newInnerNode, anchorNode.firstChild);
              pNode.insertBefore(anchorNode, pNode.firstChild);
              anchorNode = null;
            } else {
              pNode.insertBefore(newInnerNode, pNode.firstChild);
            }

            container = textNode;
            offset = textNode.data.length;
            passNode = true;
            ancestor.insertBefore(container, ancestor.firstChild);
            continue;
          }

          vNode = !passNode ? child.cloneNode(false) : validation(child);

          if (vNode) {
            ancestor.insertBefore(vNode, ancestor.firstChild);
            if (child.nodeType === 1 && !util.isBreak(child)) coverNode = vNode;
          }

          recursionFunc(child, coverNode);
        }
      })(element, pNode); // not remove tag


      if (isRemoveNode && !isRemoveFormat && !_removeCheck.v) {
        return {
          ancestor: element,
          container: endCon,
          offset: endOff
        };
      }

      isRemoveFormat = isRemoveFormat && isRemoveNode;

      if (isRemoveFormat) {
        for (var i = 0; i < nNodeArray.length; i++) {
          var removeNode = nNodeArray[i];
          var rChildren = removeNode.childNodes;
          var textNode = null;

          while (rChildren[0]) {
            textNode = rChildren[0];
            pNode.insertBefore(textNode, removeNode);
          }

          util.removeItem(removeNode);

          if (i === nNodeArray.length - 1) {
            container = textNode;
            offset = textNode.textContent.length;
          }
        }
      } else if (isRemoveNode) {
        for (var _i16 = 0; _i16 < nNodeArray.length; _i16++) {
          this._stripRemoveNode(nNodeArray[_i16]);
        }
      }

      if (!isRemoveFormat && pNode.childNodes.length === 0) {
        if (element.childNodes) {
          container = element.childNodes[0];
        } else {
          container = util.createTextNode(util.zeroWidthSpace);
          element.appendChild(container);
        }
      } else {
        if (!isRemoveNode && newInnerNode.textContent.length === 0) {
          util.removeEmptyNode(pNode, null);
          return {
            ancestor: null,
            container: null,
            offset: 0
          };
        }

        util.removeEmptyNode(pNode, newInnerNode);

        if (util.onlyZeroWidthSpace(pNode.textContent)) {
          container = pNode.firstChild;
          offset = container.textContent.length;
        } else if (util.onlyZeroWidthSpace(container)) {
          container = newInnerNode;
          offset = 1;
        } // node change


        var offsets = {
          s: 0,
          e: 0
        };
        var path = util.getNodePath(container, pNode, offsets);
        offset += offsets.s; // tag merge

        var newOffsets = util.mergeSameTags(pNode, [path], true);
        element.parentNode.replaceChild(pNode, element);
        container = util.getNodeFromPath(path, pNode);
        offset += newOffsets[0];
      }

      return {
        ancestor: pNode,
        container: container,
        offset: offset
      };
    },

    /**
     * @description Run plugin calls and basic commands.
     * @param {String} command Command string
     * @param {String} display Display type string ('command', 'submenu', 'dialog', 'container')
     * @param {Element} target The element of command button
     */
    actionCall: function actionCall(command, display, target) {
      // call plugins
      if (display) {
        if (/more/i.test(display) && target !== this._moreLayerActiveButton) {
          var layer = context.element.toolbar.querySelector("." + command);

          if (layer) {
            if (this._moreLayerActiveButton) {
              context.element.toolbar.querySelector("." + this._moreLayerActiveButton.getAttribute("data-command")).style.display = "none";
              util.removeClass(this._moreLayerActiveButton, "on");
            }

            util.addClass(target, "on");
            this._moreLayerActiveButton = target;
            layer.style.display = "block";

            event._showToolbarBalloon();

            event._showToolbarInline();
          }

          return;
        } else if (/submenu/.test(display) && (this._menuTray[command] === null || target !== this.submenuActiveButton)) {
          this.callPlugin(command, this.submenuOn.bind(this, target), target);
          return;
        } else if (/dialog/.test(display)) {
          this.callPlugin(command, this.plugins[command].open.bind(this), target);
          return;
        } else if (/command/.test(display)) {
          this.callPlugin(command, this.plugins[command].action.bind(this), target);
        } else if (/container/.test(display) && (this._menuTray[command] === null || target !== this.containerActiveButton)) {
          this.callPlugin(command, this.containerOn.bind(this, target), target);
          return;
        } else if (/fileBrowser/.test(display)) {
          this.callPlugin(command, this.plugins[command].open.bind(this, null), target);
        }
      } // default command
      else if (command) {
          this.commandHandler(target, command);
        }

      if (/more/i.test(display)) {
        var _layer = context.element.toolbar.querySelector("." + this._moreLayerActiveButton.getAttribute("data-command"));

        if (_layer) {
          util.removeClass(this._moreLayerActiveButton, "on");
          this._moreLayerActiveButton = null;
          _layer.style.display = "none";

          event._showToolbarBalloon();

          event._showToolbarInline();
        }
      } else if (/submenu/.test(display)) {
        this.submenuOff();
      } else {
        this.submenuOff();
        this.containerOff();
      }
    },

    /**
     * @description Execute command of command button(All Buttons except submenu and dialog)
     * (undo, redo, bold, underline, italic, strikethrough, subscript, superscript, removeFormat, indent, outdent, fullscreen, showBlocks, codeview, preview, print)
     * @param {Element} target The element of command button
     * @param {String} command Property of command button (data-value)
     */
    commandHandler: function commandHandler(target, command) {
      switch (command) {
        case "selectAll":
          var wysiwyg = context.element.wysiwyg;
          var first = util.getChildElement(wysiwyg.firstChild, function (current) {
            return current.childNodes.length === 0 || current.nodeType === 3;
          }, false) || wysiwyg.firstChild;
          var last = util.getChildElement(wysiwyg.lastChild, function (current) {
            return current.childNodes.length === 0 || current.nodeType === 3;
          }, true) || wysiwyg.lastChild;
          if (!first || !last) return;
          this.setRange(first, 0, last, last.textContent.length);
          break;

        case "codeView":
          this.toggleCodeView();
          break;

        case "fullScreen":
          this.toggleFullScreen(target);
          break;

        case "indent":
        case "outdent":
          this.indent(command);
          break;

        case "undo":
          this.history.undo();
          break;

        case "redo":
          this.history.redo();
          break;

        case "removeFormat":
          this.removeFormat();
          this.focus();
          break;

        case "print":
          this.print();
          break;

        case "preview":
          this.preview();
          break;

        case "showBlocks":
          this.toggleDisplayBlocks();
          break;

        case "save":
          if (typeof options.callBackSave === "function") {
            options.callBackSave(this.getContents(false));
          } else if (typeof functions.save === "function") {
            functions.save();
          } else {
            throw Error("[KothingEditor.core.commandHandler.fail] Please register call back function in creation option. (callBackSave : Function)");
          }

          if (context.tool.save) context.tool.save.setAttribute("disabled", true);
          break;

        default:
          // 'STRONG', 'U', 'EM', 'DEL', 'SUB', 'SUP'..
          command = this._defaultCommand[command.toLowerCase()] || command;
          if (!this.commandMap[command]) this.commandMap[command] = target;
          var nodesMap = this._variable.currentNodesMap;
          var cmd = nodesMap.indexOf(command) > -1 ? null : util.createElement(command);
          var removeNode = command;

          if (/^SUB$/i.test(command) && nodesMap.indexOf("SUP") > -1) {
            removeNode = "SUP";
          } else if (/^SUP$/i.test(command) && nodesMap.indexOf("SUB") > -1) {
            removeNode = "SUB";
          }

          this.nodeChange(cmd, null, [removeNode], false);
          this.focus();
      }
    },

    /**
     * @description Remove format of the currently selected range
     */
    removeFormat: function removeFormat() {
      this.nodeChange(null, null, null, null);
    },

    /**
     * @description This method implements indentation to selected range.
     * Setted "margin-left" to "25px" in the top "P" tag of the parameter node.
     * @param {String} command Separator ("indent" or "outdent")
     */
    indent: function indent(command) {
      var range = this.getRange();
      var rangeLines = this.getSelectedElements(null);
      var cells = [];
      var shift = "indent" !== command;
      var sc = range.startContainer;
      var ec = range.endContainer;
      var so = range.startOffset;
      var eo = range.endOffset;

      for (var i = 0, len = rangeLines.length, f, margin; i < len; i++) {
        f = rangeLines[i];

        if (!util.isListCell(f) || !this.plugins.list) {
          margin = /\d+/.test(f.style.marginLeft) ? util.getNumber(f.style.marginLeft, 0) : 0;

          if (shift) {
            margin -= 25;
          } else {
            margin += 25;
          }

          util.setStyle(f, "marginLeft", margin <= 0 ? "" : margin + "px");
        } else {
          if (shift || f.previousElementSibling) {
            cells.push(f);
          }
        }
      } // list cells


      if (cells.length > 0) {
        this.plugins.list.editInsideList.call(this, shift, cells);
      }

      this.effectNode = null;
      this.setRange(sc, so, ec, eo); // history stack

      this.history.push(false);
    },

    /**
     * @description Add or remove the class name of "body" so that the code block is visible
     */
    toggleDisplayBlocks: function toggleDisplayBlocks() {
      var wysiwyg = context.element.wysiwyg;
      util.toggleClass(wysiwyg, "ke-show-block");

      if (util.hasClass(wysiwyg, "ke-show-block")) {
        util.addClass(this._styleCommandMap.showBlocks, "active");
      } else {
        util.removeClass(this._styleCommandMap.showBlocks, "active");
      }

      this._resourcesStateChange();
    },

    /**
     * @description Changes to code view or wysiwyg view
     */
    toggleCodeView: function toggleCodeView() {
      var isCodeView = this._variable.isCodeView;
      this.controllersOff();
      util.setDisabledButtons(!isCodeView, this.codeViewDisabledButtons);

      if (isCodeView) {
        this._setCodeDataToEditor();

        context.element.wysiwygFrame.scrollTop = 0;
        context.element.code.style.display = "none";
        context.element.wysiwygFrame.style.display = "block";
        this._variable._codeOriginCssText = this._variable._codeOriginCssText.replace(/(\s?display(\s+)?:(\s+)?)[a-zA-Z]+(?=;)/, "display: none");
        this._variable._wysiwygOriginCssText = this._variable._wysiwygOriginCssText.replace(/(\s?display(\s+)?:(\s+)?)[a-zA-Z]+(?=;)/, "display: block");
        if (options.height === "auto" && !options.codeMirrorEditor) context.element.code.style.height = "0px";
        this._variable.isCodeView = false;

        if (!this._variable.isFullScreen) {
          this._notHideToolbar = false;

          if (/balloon|balloon-always/i.test(options.mode)) {
            context.element._arrow.style.display = "";
            this._isInline = false;
            this._isBalloon = true;

            event._hideToolbar();
          }
        }

        this.nativeFocus();
        util.removeClass(this._styleCommandMap.codeView, "active"); // history stack

        this.history.push(false);
      } else {
        this._setEditorDataToCodeView();

        this._variable._codeOriginCssText = this._variable._codeOriginCssText.replace(/(\s?display(\s+)?:(\s+)?)[a-zA-Z]+(?=;)/, "display: block");
        this._variable._wysiwygOriginCssText = this._variable._wysiwygOriginCssText.replace(/(\s?display(\s+)?:(\s+)?)[a-zA-Z]+(?=;)/, "display: none");
        if (options.height === "auto" && !options.codeMirrorEditor) context.element.code.style.height = context.element.code.scrollHeight > 0 ? context.element.code.scrollHeight + "px" : "auto";
        if (options.codeMirrorEditor) options.codeMirrorEditor.refresh();
        this._variable.isCodeView = true;

        if (!this._variable.isFullScreen) {
          this._notHideToolbar = true;

          if (this._isBalloon) {
            context.element._arrow.style.display = "none";
            context.element.toolbar.style.left = "";
            this._isInline = true;
            this._isBalloon = false;

            event._showToolbarInline();
          }
        }

        this._variable._range = null;
        context.element.code.focus();
        util.addClass(this._styleCommandMap.codeView, "active");
      }

      this._checkPlaceholder();

      if (typeof functions.toggleCodeView === "function") functions.toggleCodeView(this._variable.isCodeView, this);
    },

    /**
     * @description Convert the data of the code view and put it in the WYSIWYG area.
     * @private
     */
    _setCodeDataToEditor: function _setCodeDataToEditor() {
      var code_html = this._getCodeView();

      if (options.fullPage) {
        var parseDocument = this._parser.parseFromString(code_html, "text/html");

        var headChildren = parseDocument.head.children;

        for (var i = 0, len = headChildren.length; i < len; i++) {
          if (/script/i.test(headChildren[i].tagName)) {
            parseDocument.head.removeChild(headChildren[i]);
            i--, len--;
          }
        }

        this._wd.head.innerHTML = parseDocument.head.innerHTML;
        this._wd.body.innerHTML = this.convertContentsForEditor(parseDocument.body.innerHTML);
        var attrs = parseDocument.body.attributes;

        for (var _i17 = 0, _len7 = attrs.length; _i17 < _len7; _i17++) {
          if (attrs[_i17].name === "contenteditable") continue;

          this._wd.body.setAttribute(attrs[_i17].name, attrs[_i17].value);
        }

        if (!util.hasClass(this._wd.body, "kothing-editor-editable")) util.addClass(this._wd.body, "kothing-editor-editable");
      } else {
        context.element.wysiwyg.innerHTML = code_html.length > 0 ? this.convertContentsForEditor(code_html) : "<p><br></p>";
      }
    },

    /**
     * @description Convert the data of the WYSIWYG area and put it in the code view area.
     * @private
     */
    _setEditorDataToCodeView: function _setEditorDataToCodeView() {
      var codeContents = this.convertHTMLForCodeView(context.element.wysiwyg);
      var codeValue = "";

      if (options.fullPage) {
        var attrs = util.getAttributesToString(this._wd.body, null);
        codeValue = "<!DOCTYPE html>\n<html>\n" + this._wd.head.outerHTML.replace(/>(?!\n)/g, ">\n") + "<body " + attrs + ">\n" + codeContents + "</body>\n</html>";
      } else {
        codeValue = codeContents;
      }

      context.element.code.style.display = "block";
      context.element.wysiwygFrame.style.display = "none";

      this._setCodeView(codeValue);
    },

    /**
     * @description Changes to full screen or default screen
     * @param {Element} element full screen button
     */
    toggleFullScreen: function toggleFullScreen(element) {
      var topArea = context.element.topArea;
      var toolbar = context.element.toolbar;
      var editorArea = context.element.editorArea;
      var wysiwygFrame = context.element.wysiwygFrame;
      var code = context.element.code;
      var _var = this._variable;
      this.controllersOff();

      if (!_var.isFullScreen) {
        _var.isFullScreen = true;
        _var._fullScreenAttrs.inline = this._isInline;
        _var._fullScreenAttrs.balloon = this._isBalloon;

        if (this._isInline || this._isBalloon) {
          this._isInline = false;
          this._isBalloon = false;
        }

        if (!!options.toolbarContainer) context.element.relative.insertBefore(toolbar, editorArea);
        topArea.style.position = "fixed";
        topArea.style.top = "0";
        topArea.style.left = "0";
        topArea.style.width = "100%";
        topArea.style.maxWidth = "100%";
        topArea.style.height = "100%";
        topArea.style.zIndex = "2147483647";

        if (context.element._stickyDummy.style.display !== ("none" && "")) {
          _var._fullScreenAttrs.sticky = true;
          context.element._stickyDummy.style.display = "none";
          util.removeClass(toolbar, "ke-toolbar-sticky");
        }

        _var._bodyOverflow = _d.body.style.overflow;
        _d.body.style.overflow = "hidden";
        _var._editorAreaOriginCssText = editorArea.style.cssText;
        _var._wysiwygOriginCssText = wysiwygFrame.style.cssText;
        _var._codeOriginCssText = code.style.cssText;
        editorArea.style.cssText = "";
        toolbar.style.cssText = "";
        wysiwygFrame.style.cssText = (wysiwygFrame.style.cssText.match(/\s?display(\s+)?:(\s+)?[a-zA-Z]+;/) || [""])[0];
        code.style.cssText = (code.style.cssText.match(/\s?display(\s+)?:(\s+)?[a-zA-Z]+;/) || [""])[0];
        toolbar.style.width = "100%";
        wysiwygFrame.style.height = "100%";
        code.style.height = "100%";
        toolbar.style.position = "relative";
        toolbar.style.display = "block";
        _var.innerHeight_fullScreen = _w.innerHeight - toolbar.offsetHeight;
        editorArea.style.height = _var.innerHeight_fullScreen + "px";
        util.changeElement(element.firstElementChild, icons.reduction);

        if (options.iframe && options.height === "auto") {
          editorArea.style.overflow = "auto";

          this._iframeAutoHeight();
        }

        util.addClass(this._styleCommandMap.fullScreen, "active");
      } else {
        _var.isFullScreen = false;
        wysiwygFrame.style.cssText = _var._wysiwygOriginCssText;
        code.style.cssText = _var._codeOriginCssText;
        toolbar.style.cssText = "";
        editorArea.style.cssText = _var._editorAreaOriginCssText;
        topArea.style.cssText = _var._originCssText;
        _d.body.style.overflow = _var._bodyOverflow;
        if (!!options.toolbarContainer) options.toolbarContainer.appendChild(toolbar);

        if (options.stickyToolbar > -1) {
          util.removeClass(toolbar, "ke-toolbar-sticky");
        }

        if (_var._fullScreenAttrs.sticky && !options.toolbarContainer) {
          _var._fullScreenAttrs.sticky = false;
          context.element._stickyDummy.style.display = "block";
          util.addClass(toolbar, "ke-toolbar-sticky");
        }

        this._isInline = _var._fullScreenAttrs.inline;
        this._isBalloon = _var._fullScreenAttrs.balloon;
        if (this._isInline) event._showToolbarInline();
        if (!!options.toolbarContainer) util.removeClass(toolbar, "ke-toolbar-balloon");
        event.onScroll_window();
        util.changeElement(element.firstElementChild, icons.expansion);
        util.removeClass(this._styleCommandMap.fullScreen, "active");
      }

      if (typeof functions.toggleFullScreen === "function") functions.toggleFullScreen(this._variable.isFullScreen, this);
    },

    /**
     * @description Prints the current contents of the editor.
     */
    print: function print() {
      var iframe = util.createElement("IFRAME");
      iframe.style.display = "none";

      _d.body.appendChild(iframe);

      var printDocument = util.getIframeDocument(iframe);
      var contentsHTML = this.getContents(true);
      var wDoc = this._wd;

      if (options.iframe) {
        var arrts = options.fullPage ? util.getAttributesToString(wDoc.body, ["contenteditable"]) : 'class="kothing-editor-editable"';
        printDocument.write("" + "<!DOCTYPE html><html>" + "<head>" + wDoc.head.innerHTML + "</head>" + "<body " + arrts + ">" + contentsHTML + "</body>" + "</html>");
      } else {
        var links = _d.head.getElementsByTagName("link");

        var styles = _d.head.getElementsByTagName("style");

        var linkHTML = "";

        for (var i = 0, len = links.length; i < len; i++) {
          linkHTML += links[i].outerHTML;
        }

        for (var _i18 = 0, _len8 = styles.length; _i18 < _len8; _i18++) {
          linkHTML += styles[_i18].outerHTML;
        }

        printDocument.write("" + "<!DOCTYPE html><html>" + "<head>" + linkHTML + "</head>" + '<body class="kothing-editor-editable">' + contentsHTML + "</body>" + "</html>");
      }

      this.showLoading();

      _w.setTimeout(function () {
        try {
          iframe.focus(); // IE or Edge

          if (util.isIE_Edge || !!_d.documentMode || !!_w.StyleMedia) {
            try {
              iframe.contentWindow.document.execCommand("print", false, null);
            } catch (e) {
              iframe.contentWindow.print();
            }
          } else {
            // Other browsers
            iframe.contentWindow.print();
          }
        } catch (error) {
          throw Error("[KothingEditor.core.print.fail] error: " + error);
        } finally {
          core.closeLoading();
          util.removeItem(iframe);
        }
      }, 1000);
    },

    /**
     * @description Open the preview window.
     */
    preview: function preview() {
      core.submenuOff();
      core.containerOff();
      core.controllersOff();
      var contentsHTML = this.getContents(true);

      var windowObject = _w.open("", "_blank");

      windowObject.mimeType = "text/html";
      var w = context.element.wysiwygFrame.offsetWidth + "px !important";
      var wDoc = this._wd;

      if (options.iframe) {
        var arrts = options.fullPage ? util.getAttributesToString(wDoc.body, ["contenteditable"]) : 'class="kothing-editor-editable"';
        windowObject.document.write("" + "<!DOCTYPE html><html>" + "<head>" + wDoc.head.innerHTML + "<style>body {overflow:auto !important; width:" + w + "; border:1px solid #ccc; margin: 10px auto !important; height:auto !important;}</style>" + "</head>" + "<body " + arrts + ">" + contentsHTML + "</body>" + "</html>");
      } else {
        var links = _d.head.getElementsByTagName("link");

        var styles = _d.head.getElementsByTagName("style");

        var linkHTML = "";

        for (var i = 0, len = links.length; i < len; i++) {
          linkHTML += links[i].outerHTML;
        }

        for (var _i19 = 0, _len9 = styles.length; _i19 < _len9; _i19++) {
          linkHTML += styles[_i19].outerHTML;
        }

        windowObject.document.write("" + "<!DOCTYPE html><html>" + "<head>" + '<meta charset="utf-8" />' + '<meta name="viewport" content="width=device-width, initial-scale=1">' + "<title>" + lang.toolbar.preview + "</title>" + linkHTML + "</head>" + '<body class="kothing-editor-editable" style="width:' + w + '; border:1px solid #ccc; margin:10px auto !important; height:auto !important;">' + contentsHTML + "</body>" + "</html>");
      }
    },

    /**
     * @description Sets the HTML string
     * @param {String} html HTML string
     */
    setContents: function setContents(html) {
      var convertValue = this.convertContentsForEditor(html);

      this._resetComponents();

      if (!this._variable.isCodeView) {
        context.element.wysiwyg.innerHTML = convertValue; // history stack

        this.history.push(false);
      } else {
        var value = this.convertHTMLForCodeView(convertValue);

        this._setCodeView(value);
      }
    },

    /**
     * @description Gets the current contents
     * @param {Boolean} onlyContents Return only the contents of the body without headers when the "fullPage" option is true
     * @returns {Object}
     */
    getContents: function getContents(onlyContents) {
      var contents = context.element.wysiwyg.innerHTML;
      var renderHTML = util.createElement("DIV");
      renderHTML.innerHTML = contents;
      var figcaptions = util.getListChildren(renderHTML, function (current) {
        return /FIGCAPTION/i.test(current.nodeName);
      });

      for (var i = 0, len = figcaptions.length; i < len; i++) {
        figcaptions[i].removeAttribute("contenteditable");
      }

      if (options.fullPage && !onlyContents) {
        var attrs = util.getAttributesToString(this._wd.body, ["contenteditable"]);
        return "<!DOCTYPE html><html>" + this._wd.head.outerHTML + "<body " + attrs + ">" + renderHTML.innerHTML + "</body></html>";
      } else {
        return renderHTML.innerHTML;
      }
    },

    /**
     * @description Returns HTML string according to tag type and configuration.
     * Use only "cleanHTML", "convertContentsForEditor"
     * @param {Node} node Node
     * @param {Boolean} requireFormat If true, text nodes that do not have a format node is wrapped with the format tag.
     * @private
     */
    _makeLine: function _makeLine(node, requireFormat) {
      // element
      if (node.nodeType === 1) {
        if (util._disallowedTags(node)) return "";

        if (!requireFormat || util.isFormatElement(node) || util.isRangeFormatElement(node) || util.isComponent(node) || util.isMedia(node) || util.isAnchor(node) && util.isMedia(node.firstElementChild)) {
          return node.outerHTML;
        } else {
          return "<p>" + node.outerHTML + "</p>";
        }
      } // text


      if (node.nodeType === 3) {
        if (!requireFormat) return node.textContent;
        var textArray = node.textContent.split(/\n/g);
        var html = "";

        for (var i = 0, tLen = textArray.length, text; i < tLen; i++) {
          text = textArray[i].trim();
          if (text.length > 0) html += "<p>" + text + "</p>";
        }

        return html;
      } // comments


      if (node.nodeType === 8 && this._allowHTMLComments) {
        return "<!--" + node.textContent.trim() + "-->";
      }

      return "";
    },

    /**
     * @description Removes attribute values such as style and converts tags that do not conform to the "html5" standard.
     * @param {String} text
     * @returns {String} HTML string
     * @private
     */
    _tagConvertor: function _tagConvertor(text) {
      if (!this._disallowedTextTagsRegExp) return text;
      var ec = {
        b: "strong",
        i: "em",
        ins: "u",
        strike: "del",
        s: "del"
      };
      return text.replace(this._disallowedTextTagsRegExp, function (m, t, n) {
        return t + (typeof ec[n] === "string" ? ec[n] : n);
      });
    },

    /**
     * @description Delete disallowed tags
     * @param {String} html HTML string
     * @returns {String}
     * @private
     */
    _deleteDisallowedTags: function _deleteDisallowedTags(html) {
      return html.replace(/\n/g, "").replace(/<(script|style).*>(\n|.)*<\/(script|style)>/gi, "").replace(/<[a-z0-9]+\:[a-z0-9]+[^>^\/]*>[^>]*<\/[a-z0-9]+\:[a-z0-9]+>/gi, "").replace(this.editorTagsWhitelistRegExp, "");
    },

    /**
     * @description Gets the clean HTML code for editor
     * @param {String} html HTML string
     * @param {String|RegExp} whitelist Regular expression of allowed tags.
     * RegExp object is create by util.createTagsWhitelist method. (core.pasteTagsWhitelistRegExp)
     * @returns {String}
     */
    cleanHTML: function cleanHTML(html, whitelist) {
      html = this._deleteDisallowedTags(html).replace(/(<[a-zA-Z0-9]+)[^>]*(?=>)/g, function (m, t) {
        if (/^<[a-z0-9]+\:[a-z0-9]+/i.test(m)) return m;
        var v = null;

        var tAttr = this._attributesTagsWhitelist[t.match(/(?!<)[a-zA-Z0-9]+/)[0].toLowerCase()];

        if (tAttr) v = m.match(tAttr);else v = m.match(this._attributesWhitelistRegExp);

        if (/<span/i.test(t) && (!v || !/style=/i.test(v.toString()))) {
          var sv = m.match(/style\s*=\s*"[^"]*"/);

          if (sv) {
            if (!v) v = [];
            v.push(sv[0]);
          }
        }

        if (v) {
          for (var i = 0, len = v.length; i < len; i++) {
            if (/^class="(?!(__ke__|ke-|katex))/.test(v[i])) continue;
            t += " " + v[i];
          }
        }

        return t;
      }.bind(this));

      var dom = _d.createRange().createContextualFragment(html);

      try {
        util._consistencyCheckOfHTML(dom, this._htmlCheckWhitelistRegExp);
      } catch (error) {
        console.warn("[KothingEditor.cleanHTML.consistencyCheck.fail] " + error);
      }

      if (this.managedTagsInfo && this.managedTagsInfo.query) {
        var textCompList = dom.querySelectorAll(this.managedTagsInfo.query);

        for (var i = 0, len = textCompList.length, initMethod, classList; i < len; i++) {
          classList = [].slice.call(textCompList[i].classList);

          for (var c = 0, cLen = classList.length; c < cLen; c++) {
            initMethod = this.managedTagsInfo.map[classList[c]];

            if (initMethod) {
              initMethod(textCompList[i]);
              break;
            }
          }
        }
      }

      var domTree = dom.childNodes;
      var cleanHTML = "";
      var requireFormat = false;

      for (var _i20 = 0, _len10 = domTree.length, t; _i20 < _len10; _i20++) {
        t = domTree[_i20];

        if (t.nodeType === 1 && !util.isTextStyleElement(t) && !util.isBreak(t) && !util._disallowedTags(t)) {
          requireFormat = true;
          break;
        }
      }

      for (var _i21 = 0, _len11 = domTree.length; _i21 < _len11; _i21++) {
        cleanHTML += this._makeLine(domTree[_i21], requireFormat);
      }

      cleanHTML = util.htmlRemoveWhiteSpace(cleanHTML);
      return this._tagConvertor(!cleanHTML ? html : !whitelist ? cleanHTML : cleanHTML.replace(typeof whitelist === "string" ? util.createTagsWhitelist(whitelist) : whitelist, ""));
    },

    /**
     * @description Converts contents into a format that can be placed in an editor
     * @param {String} contents contents
     * @returns {String}
     */
    convertContentsForEditor: function convertContentsForEditor(contents) {
      var dom = _d.createRange().createContextualFragment(this._deleteDisallowedTags(contents));

      try {
        util._consistencyCheckOfHTML(dom, this._htmlCheckWhitelistRegExp);
      } catch (error) {
        console.warn("[KothingEditor.convertContentsForEditor.consistencyCheck.fail] " + error);
      }

      var domTree = dom.childNodes;
      var cleanHTML = "";

      for (var i = 0, len = domTree.length; i < len; i++) {
        cleanHTML += this._makeLine(domTree[i], true);
      }

      if (cleanHTML.length === 0) return "<p><br></p>";
      cleanHTML = util.htmlRemoveWhiteSpace(cleanHTML);
      return this._tagConvertor(cleanHTML);
    },

    /**
     * @description Converts wysiwyg area element into a format that can be placed in an editor of code view mode
     * @param {Element|String} html WYSIWYG element (context.element.wysiwyg) or HTML string.
     * @returns {String}
     */
    convertHTMLForCodeView: function convertHTMLForCodeView(html) {
      var returnHTML = "";
      var wRegExp = _w.RegExp;
      var brReg = new wRegExp("^(BLOCKQUOTE|PRE|TABLE|THEAD|TBODY|TR|TH|TD|OL|UL|IMG|IFRAME|VIDEO|AUDIO|FIGURE|FIGCAPTION|HR|BR|CANVAS|SELECT)$", "i");
      var isFormatElement = util.isFormatElement.bind(util);
      var wDoc = typeof html === "string" ? _d.createRange().createContextualFragment(html) : html;
      var indentSize = this._variable.codeIndent * 1;
      indentSize = indentSize > 0 ? new _w.Array(indentSize + 1).join(" ") : "";

      (function recursionFunc(element, indent, lineBR) {
        var children = element.childNodes;
        var elementRegTest = brReg.test(element.nodeName);
        var elementIndent = elementRegTest ? indent : "";

        for (var i = 0, len = children.length, node, br, nodeRegTest; i < len; i++) {
          node = children[i];
          nodeRegTest = brReg.test(node.nodeName);
          br = nodeRegTest ? "\n" : "";
          lineBR = isFormatElement(node) && !elementRegTest && !/^(TH|TD)$/i.test(element.nodeName) ? "\n" : "";

          if (node.nodeType === 8) {
            returnHTML += "\n<!-- " + node.textContent.trim() + " -->" + br;
            continue;
          }

          if (node.nodeType === 3) {
            returnHTML += util._HTMLConvertor(/^\n+$/.test(node.data) ? "" : node.data);
            continue;
          }

          if (node.childNodes.length === 0) {
            returnHTML += (/^HR$/i.test(node.nodeName) ? "\n" : "") + elementIndent + node.outerHTML + br;
            continue;
          }

          node.innerHTML = node.innerHTML;
          var tag = node.nodeName.toLowerCase();
          returnHTML += (lineBR || (elementRegTest ? "" : br)) + (elementIndent || nodeRegTest ? indent : "") + node.outerHTML.match(wRegExp("<" + tag + "[^>]*>", "i"))[0] + br;
          recursionFunc(node, indent + indentSize, "");
          returnHTML += (nodeRegTest ? indent : "") + "</" + tag + ">" + (lineBR || br || elementRegTest ? "\n" : "" || /^(TH|TD)$/i.test(node.nodeName) ? "\n" : "");
        }
      })(wDoc, "", "\n");

      return returnHTML.trim() + "\n";
    },

    /**
     * @description Add an event to document.
     * When created as an Iframe, the same event is added to the document in the Iframe.
     * @param {String} type Event type
     * @param {Function} listener Event listener
     * @param {Boolean} useCapture Use event capture
     */
    addDocEvent: function addDocEvent(type, listener, useCapture) {
      _d.addEventListener(type, listener, useCapture);

      if (options.iframe) {
        this._wd.addEventListener(type, listener);
      }
    },

    /**
     * @description Remove events from document.
     * When created as an Iframe, the event of the document inside the Iframe is also removed.
     * @param {String} type Event type
     * @param {Function} listener Event listener
     */
    removeDocEvent: function removeDocEvent(type, listener) {
      _d.removeEventListener(type, listener);

      if (options.iframe) {
        this._wd.removeEventListener(type, listener);
      }
    },

    /**
     * @description The current number of characters is counted and displayed.
     * @param {String} inputText Text added.
     * @returns {Boolean}
     * @private
     */
    _charCount: function _charCount(inputText) {
      var maxCharCount = options.maxCharCount;
      var countType = options.charCounterType;
      var nextCharCount = 0;
      if (!!inputText) nextCharCount = this.getCharLength(inputText, countType);

      this._setCharCount();

      if (maxCharCount > 0) {
        var over = false;
        var count = functions.getCharCount(countType);

        if (count > maxCharCount) {
          over = true;

          if (nextCharCount > 0) {
            this._editorRange();

            var range = this.getRange();
            var endOff = range.endOffset - 1;
            var text = this.getSelectionNode().textContent;
            var slicePosition = range.endOffset - (count - maxCharCount);
            this.getSelectionNode().textContent = text.slice(0, slicePosition < 0 ? 0 : slicePosition) + text.slice(range.endOffset, text.length);
            this.setRange(range.endContainer, endOff, range.endContainer, endOff);
          }
        } else if (count + nextCharCount > maxCharCount) {
          over = true;
        }

        if (over) {
          this._callCounterBlink();

          if (nextCharCount > 0) return false;
        }
      }

      return true;
    },

    /**
     * @description When "element" is added, if it is greater than "options.maxCharCount", false is returned.
     * @param {Node|String} element Element node or String.
     * @param {String|null} charCounterType charCounterType. If it is null, the options.charCounterType
     * @returns {Boolean}
     */
    checkCharCount: function checkCharCount(element, charCounterType) {
      if (options.maxCharCount) {
        var countType = charCounterType || options.charCounterType;
        var length = this.getCharLength(typeof element === "string" ? element : this._charTypeHTML ? element.outerHTML : element.textContent, countType);

        if (length > 0 && length + functions.getCharCount(countType) > options.maxCharCount) {
          this._callCounterBlink();

          return false;
        }
      }

      return true;
    },

    /**
     * @description Get the length of the content.
     * Depending on the option, the length of the character is taken. (charCounterType)
     * @param {String} content Content to count
     * @param {String} charCounterType options.charCounterType
     * @returns {Number}
     */
    getCharLength: function getCharLength(content, charCounterType) {
      return /byte/.test(charCounterType) ? util.getByteLength(content) : content.length;
    },

    /**
     * @description Set the char count to charCounter element textContent.
     * @private
     */
    _setCharCount: function _setCharCount() {
      if (context.element.charCounter) {
        _w.setTimeout(function () {
          context.element.charCounter.textContent = functions.getCharCount(options.charCounterType);
        });
      }
    },

    /**
     * @description The character counter blinks.
     * @private
     */
    _callCounterBlink: function _callCounterBlink() {
      var charWrapper = context.element.charWrapper;

      if (charWrapper && !util.hasClass(charWrapper, "ke-blink")) {
        util.addClass(charWrapper, "ke-blink");

        _w.setTimeout(function () {
          util.removeClass(charWrapper, "ke-blink");
        }, 600);
      }
    },

    /**
     * @description Check the components such as image and video and modify them according to the format.
     * @private
     */
    _checkComponents: function _checkComponents() {
      for (var i = 0, len = this._fileInfoPluginsCheck.length; i < len; i++) {
        this._fileInfoPluginsCheck[i]();
      }
    },

    /**
     * @description Initialize the information of the components.
     * @private
     */
    _resetComponents: function _resetComponents() {
      for (var i = 0, len = this._fileInfoPluginsReset.length; i < len; i++) {
        this._fileInfoPluginsReset[i]();
      }
    },

    /**
     * @description Set method in the code view area
     * @param {String} value HTML string
     * @private
     */
    _setCodeView: function _setCodeView(value) {
      if (options.codeMirrorEditor) {
        options.codeMirrorEditor.getDoc().setValue(value);
      } else {
        context.element.code.value = value;
      }
    },

    /**
     * @description Get method in the code view area
     * @private
     */
    _getCodeView: function _getCodeView() {
      return options.codeMirrorEditor ? options.codeMirrorEditor.getDoc().getValue() : context.element.code.value;
    },

    /**
     * @description Initializ core variable
     * @param {Boolean} reload Is relooad?
     * @param {String} _initHTML initial html string
     * @private
     */
    _init: function _init(reload, _initHTML) {
      var wRegExp = _w.RegExp;
      this._ww = options.iframe ? context.element.wysiwygFrame.contentWindow : _w;
      this._wd = _d;
      this._charTypeHTML = options.charCounterType === "byte-html";

      if (!options.iframe && typeof _w.ShadowRoot === "function") {
        var child = context.element.wysiwygFrame;

        while (child) {
          if (child.shadowRoot) {
            this._shadowRoot = child.shadowRoot;
            break;
          } else if (child instanceof _w.ShadowRoot) {
            this._shadowRoot = child;
            break;
          }

          child = child.parentNode;
        }
      } // set disallow text nodes


      var disallowTextTags = ["b", "i", "ins", "s", "strike"];
      var allowTextTags = !options.addTagsWhitelist ? [] : options.addTagsWhitelist.split("|").filter(function (v) {
        return /b|i|ins|s|strike/i.test(v);
      });

      for (var i = 0; i < allowTextTags.length; i++) {
        disallowTextTags.splice(disallowTextTags.indexOf(allowTextTags[i].toLowerCase()), 1);
      }

      this._disallowedTextTagsRegExp = disallowTextTags.length === 0 ? null : new wRegExp("(<\\/?)(" + disallowTextTags.join("|") + ")\\b\\s*(?:[^>^<]+)?\\s*(?=>)", "gi"); // set whitelist

      var defaultAttr = "contenteditable|colspan|rowspan|target|href|src|class|type|controls|data-format|data-size|data-file-size|data-file-name|data-origin|data-align|data-image-link|data-rotate|data-proportion|data-percentage|origin-size|data-exp|data-font-size";
      this._allowHTMLComments = options._editorTagsWhitelist.indexOf("//") > -1;
      this._htmlCheckWhitelistRegExp = new wRegExp("^(" + options._editorTagsWhitelist.replace("|//", "") + ")$", "i");
      this.editorTagsWhitelistRegExp = util.createTagsWhitelist(options._editorTagsWhitelist.replace("|//", "|<!--|-->"));
      this.pasteTagsWhitelistRegExp = util.createTagsWhitelist(options.pasteTagsWhitelist);
      var _attr = options.attributesWhitelist;
      var tagsAttr = {};
      var allAttr = "";

      if (!!_attr) {
        for (var k in _attr) {
          if (!util.hasOwn(_attr, k)) continue;

          if (k === "all") {
            allAttr = _attr[k] + "|";
          } else {
            tagsAttr[k] = new wRegExp("((?:" + _attr[k] + "|" + defaultAttr + ')s*=s*"[^"]*")', "ig");
          }
        }
      }

      this._attributesWhitelistRegExp = new wRegExp("((?:" + allAttr + defaultAttr + ')s*=s*"[^"]*")', "ig");
      this._attributesTagsWhitelist = tagsAttr; // set modes

      this._isInline = /inline/i.test(options.mode);
      this._isBalloon = /balloon|balloon-always/i.test(options.mode);
      this._isBalloonAlways = /balloon-always/i.test(options.mode); // caching buttons

      this._cachingButtons(); // file components


      this._fileInfoPluginsCheck = [];
      this._fileInfoPluginsReset = []; // text components

      this.managedTagsInfo = {
        query: "",
        map: {}
      };
      var managedClass = []; // Command and file plugins registration

      this.activePlugins = [];
      this._fileManager.tags = [];
      this._fileManager.pluginMap = {};
      var filePluginRegExp = [];
      var plugin, button;

      for (var key in plugins) {
        if (!util.hasOwn(plugins, key)) continue;
        plugin = plugins[key];
        button = pluginCallButtons[key];

        if (plugin.active && button) {
          this.callPlugin(key, null, button);
        }

        if (typeof plugin.checkFileInfo === "function" && typeof plugin.resetFileInfo === "function") {
          this.callPlugin(key, null, button);

          this._fileInfoPluginsCheck.push(plugin.checkFileInfo.bind(this));

          this._fileInfoPluginsReset.push(plugin.resetFileInfo.bind(this));
        }

        if (_w.Array.isArray(plugin.fileTags)) {
          var fileTags = plugin.fileTags;
          this.callPlugin(key, null, button);
          this._fileManager.tags = this._fileManager.tags.concat(fileTags);
          filePluginRegExp.push(key);

          for (var tag = 0, tLen = fileTags.length; tag < tLen; tag++) {
            this._fileManager.pluginMap[fileTags[tag].toLowerCase()] = key;
          }
        }

        if (plugin.managedTags) {
          var info = plugin.managedTags();
          managedClass.push("." + info.className);
          this.managedTagsInfo.map[info.className] = info.method.bind(this);
        }
      }

      this.managedTagsInfo.query = managedClass.toString();
      this._fileManager.queryString = this._fileManager.tags.join(",");
      this._fileManager.regExp = new wRegExp("^(" + this._fileManager.tags.join("|") + ")$", "i");
      this._fileManager.pluginRegExp = new wRegExp("^(" + (filePluginRegExp.length === 0 ? "undefined" : filePluginRegExp.join("|")) + ")$", "i"); // cache editor's element

      this._variable._originCssText = context.element.topArea.style.cssText;
      this._placeholder = context.element.placeholder;
      this._lineBreaker = context.element.lineBreaker;
      this._lineBreakerButton = this._lineBreaker.querySelector("button"); // Excute history function

      this.history = (0, _history2.default)(this, this._onChange_historyStack.bind(this)); // register notice module

      this.addModule([_notice2.default]); // Init, validate

      if (options.iframe) {
        this._wd = context.element.wysiwygFrame.contentDocument;
        context.element.wysiwyg = this._wd.body;

        if (options._editorStyles.editor) {
          context.element.wysiwyg.style.cssText = options._editorStyles.editor;
        }

        if (options.height === "auto") {
          this._iframeAuto = this._wd.body;
        }
      }

      this._initWysiwygArea(reload, _initHTML);
    },

    /**
     * @description Caching basic buttons to use
     * @private
     */
    _cachingButtons: function _cachingButtons() {
      this.codeViewDisabledButtons = context.element.toolbar.querySelectorAll('.ke-toolbar button:not([class~="ke-code-view-enabled"])');
      this.resizingDisabledButtons = context.element.toolbar.querySelectorAll('.ke-toolbar button:not([class~="ke-resizing-enabled"])');
      var tool = context.tool;
      this.commandMap = {
        STRONG: tool.bold,
        U: tool.underline,
        EM: tool.italic,
        DEL: tool.strike,
        SUB: tool.subscript,
        SUP: tool.superscript,
        OUTDENT: tool.outdent,
        INDENT: tool.indent
      };
      this._styleCommandMap = {
        fullScreen: tool.fullScreen,
        showBlocks: tool.showBlocks,
        codeView: tool.codeView
      };
    },

    /**
     * @description Initializ wysiwyg area (Only called from core._init)
     * @param {Boolean} reload Is relooad?
     * @param {String} _initHTML initial html string
     * @private
     */
    _initWysiwygArea: function _initWysiwygArea(reload, _initHTML) {
      context.element.wysiwyg.innerHTML = reload ? _initHTML : this.convertContentsForEditor(typeof _initHTML === "string" ? _initHTML : context.element.originElement.value);
    },

    /**
     * @description Called when there are changes to tags in the wysiwyg region.
     * @private
     */
    _resourcesStateChange: function _resourcesStateChange() {
      this._iframeAutoHeight();

      this._checkPlaceholder();
    },

    /**
     * @description Called when after execute "history.push"
     * @private
     */
    _onChange_historyStack: function _onChange_historyStack() {
      event._applyTagEffects();

      if (context.tool.save) context.tool.save.removeAttribute("disabled");
      if (functions.onChange) functions.onChange(this.getContents(true), this);
    },

    /**
     * @description Modify the height value of the iframe when the height of the iframe is automatic.
     * @private
     */
    _iframeAutoHeight: function _iframeAutoHeight() {
      if (this._iframeAuto) {
        _w.setTimeout(function () {
          context.element.wysiwygFrame.style.height = core._iframeAuto.offsetHeight + "px";
        });
      }
    },

    /**
     * @description Set display property when there is placeholder.
     * @private
     */
    _checkPlaceholder: function _checkPlaceholder() {
      if (this._placeholder) {
        if (this._variable.isCodeView) {
          this._placeholder.style.display = "none";
          return;
        }

        var wysiwyg = context.element.wysiwyg;

        if (!util.onlyZeroWidthSpace(wysiwyg.textContent) || wysiwyg.querySelector(".ke-component, pre, blockquote, hr, li, table, img, iframe, video") || (wysiwyg.innerText.match(/\n/g) || "").length > 1) {
          this._placeholder.style.display = "none";
        } else {
          this._placeholder.style.display = "block";
        }
      }
    },

    /**
     * @description If there is no default format, add a format and move "selection".
     * @param {String|null} formatName Format tag name (default: 'P')
     * @private
     */
    _setDefaultFormat: function _setDefaultFormat(formatName) {
      if (this._fileManager.pluginRegExp.test(this.currentControllerName)) return;
      var range = this.getRange();
      var commonCon = range.commonAncestorContainer;
      var startCon = range.startContainer;
      var rangeEl = util.getRangeFormatElement(commonCon, null);
      var focusNode, offset, format;
      var fileComponent = util.getParentElement(commonCon, util.isComponent);
      if (fileComponent && !util.isTable(fileComponent)) return;
      if ((util.isRangeFormatElement(startCon) || util.isWysiwygDiv(startCon)) && util.isComponent(startCon.childNodes[range.startOffset])) return;

      if (rangeEl) {
        format = util.createElement(formatName || "P");
        format.innerHTML = rangeEl.innerHTML;
        if (format.childNodes.length === 0) format.innerHTML = util.zeroWidthSpace;
        rangeEl.innerHTML = format.outerHTML;
        format = rangeEl.firstChild;
        focusNode = util.getEdgeChildNodes(format, null).sc;

        if (!focusNode) {
          focusNode = util.createTextNode(util.zeroWidthSpace);
          format.insertBefore(focusNode, format.firstChild);
        }

        offset = focusNode.textContent.length;
        this.setRange(focusNode, offset, focusNode, offset);
        return;
      }

      if (util.isRangeFormatElement(commonCon) && commonCon.childNodes.length <= 1) {
        var br = null;

        if (commonCon.childNodes.length === 1 && util.isBreak(commonCon.firstChild)) {
          br = commonCon.firstChild;
        } else {
          br = util.createTextNode(util.zeroWidthSpace);
          commonCon.appendChild(br);
        }

        this.setRange(br, 1, br, 1);
        return;
      }

      this.execCommand("formatBlock", false, formatName || "P");
      focusNode = util.getEdgeChildNodes(commonCon, commonCon);
      focusNode = focusNode ? focusNode.ec : commonCon;
      format = util.getFormatElement(focusNode, null);

      if (!format) {
        this.removeRange();

        this._editorRange();

        return;
      }

      if (util.isBreak(format.nextSibling)) util.removeItem(format.nextSibling);
      if (util.isBreak(format.previousSibling)) util.removeItem(format.previousSibling);

      if (util.isBreak(focusNode)) {
        var zeroWidth = util.createTextNode(util.zeroWidthSpace);
        focusNode.parentNode.insertBefore(zeroWidth, focusNode);
        focusNode = zeroWidth;
      }

      this.effectNode = null;
      this.nativeFocus();
    },

    /**
     * @description Initialization after "setOptions"
     * @param {Object} el context.element
     * @param {String} _initHTML Initial html string
     * @private
     */
    _setOptionsInit: function _setOptionsInit(el, _initHTML) {
      this.context = (0, _context.default)(el.originElement, this._getConstructed(el), options);
      context = (0, _context.default)(el.originElement, this._getConstructed(el), options);
      this._componentsInfoReset = true;

      this._editorInit(true, _initHTML);
    },

    /**
     * @description Initializ editor
     * @param {Boolean} reload Is relooad?
     * @param {String} _initHTML initial html string
     * @private
     */
    _editorInit: function _editorInit(reload, _initHTML) {
      // initialize core and add event listeners
      this._init(reload, _initHTML);

      event._addEvent();

      this._setCharCount();

      event._offStickyToolbar();

      event.onResize_window(); // toolbar visibility

      context.element.toolbar.style.visibility = "";

      this._checkComponents();

      this._componentsInfoInit = false;
      this._componentsInfoReset = false;
      this.history.reset(true);

      this._resourcesStateChange();

      _w.setTimeout(function () {
        if (typeof functions.onload === "function") {
          functions.onload(core, reload);
        }
      });
    },

    /**
     * @description Create and return an object to cache the new context.
     * @param {Element} contextEl context.element
     * @returns {Object}
     * @private
     */
    _getConstructed: function _getConstructed(contextEl) {
      return {
        _top: contextEl.topArea,
        _relative: contextEl.relative,
        _toolBar: contextEl.toolbar,
        _menuTray: contextEl._menuTray,
        _editorArea: contextEl.editorArea,
        _wysiwygArea: contextEl.wysiwygFrame,
        _codeArea: contextEl.code,
        _placeholder: contextEl.placeholder,
        _resizingBar: contextEl.resizingBar,
        _navigation: contextEl.navigation,
        _charCounter: contextEl.charCounter,
        _charWrapper: contextEl.charWrapper,
        _loading: contextEl.loading,
        _lineBreaker: contextEl.lineBreaker,
        _lineBreaker_t: contextEl.lineBreaker_t,
        _lineBreaker_b: contextEl.lineBreaker_b,
        _resizeBack: contextEl.resizeBackground,
        _stickyDummy: contextEl._stickyDummy,
        _arrow: contextEl._arrow
      };
    }
  };
  /**
   * @description event function
   */

  var event = {
    _IEisComposing: false,
    // In IE, there is no "e.isComposing" in the key-up event.
    _lineBreakerBind: null,
    _responsiveCurrentSize: "default",
    _responsiveButtonSize: null,
    _responsiveButtons: null,
    _directionKeyCode: new _w.RegExp("^(8|13|3[2-9]|40|46)$"),
    _nonTextKeyCode: new _w.RegExp("^(8|13|1[6-9]|20|27|3[3-9]|40|45|46|11[2-9]|12[0-3]|144|145)$"),
    _historyIgnoreKeyCode: new _w.RegExp("^(1[6-9]|20|27|3[3-9]|40|45|11[2-9]|12[0-3]|144|145)$"),
    _onButtonsCheck: new _w.RegExp("^(STRONG|U|EM|DEL|SUB|SUP)$"),
    _frontZeroWidthReg: new _w.RegExp(util.zeroWidthSpace + "+", ""),
    _keyCodeShortcut: {
      65: "A",
      66: "B",
      83: "S",
      85: "U",
      73: "I",
      89: "Y",
      90: "Z",
      219: "[",
      221: "]"
    },
    _shortcutCommand: function _shortcutCommand(keyCode, shift) {
      var command = null;
      var keyStr = event._keyCodeShortcut[keyCode];

      switch (keyStr) {
        case "A":
          command = "selectAll";
          break;

        case "B":
          if (options.shortcutsDisable.indexOf("bold") === -1) {
            command = "STRONG";
          }

          break;

        case "S":
          if (shift && options.shortcutsDisable.indexOf("strike") === -1) {
            command = "DEL";
          }

          break;

        case "U":
          if (options.shortcutsDisable.indexOf("underline") === -1) {
            command = "U";
          }

          break;

        case "I":
          if (options.shortcutsDisable.indexOf("italic") === -1) {
            command = "EM";
          }

          break;

        case "Z":
          if (options.shortcutsDisable.indexOf("undo") === -1) {
            if (shift) {
              command = "redo";
            } else {
              command = "undo";
            }
          }

          break;

        case "Y":
          if (options.shortcutsDisable.indexOf("undo") === -1) {
            command = "redo";
          }

          break;

        case "[":
          if (options.shortcutsDisable.indexOf("indent") === -1) {
            command = "outdent";
          }

          break;

        case "]":
          if (options.shortcutsDisable.indexOf("indent") === -1) {
            command = "indent";
          }

          break;
      }

      if (!command) return false;
      core.commandHandler(core.commandMap[command], command);
      return true;
    },
    _applyTagEffects: function _applyTagEffects() {
      var selectionNode = core.getSelectionNode();
      if (selectionNode === core.effectNode) return;
      core.effectNode = selectionNode;
      var commandMap = core.commandMap;
      var classOnCheck = this._onButtonsCheck;
      var commandMapNodes = [];
      var currentNodes = [];
      var activePlugins = core.activePlugins;
      var cLen = activePlugins.length;
      var nodeName = "";

      while (selectionNode.firstChild) {
        selectionNode = selectionNode.firstChild;
      }

      for (var element = selectionNode; !util.isWysiwygDiv(element); element = element.parentNode) {
        if (!element) break;
        if (element.nodeType !== 1 || util.isBreak(element)) continue;
        nodeName = element.nodeName.toUpperCase();
        currentNodes.push(nodeName);
        /* Active plugins */

        for (var c = 0, name; c < cLen; c++) {
          name = activePlugins[c];

          if (commandMapNodes.indexOf(name) === -1 && plugins[name].active.call(core, element)) {
            commandMapNodes.push(name);
          }
        }

        if (util.isFormatElement(element)) {
          /* Outdent */
          if (commandMapNodes.indexOf("OUTDENT") === -1 && commandMap.OUTDENT) {
            if (util.isListCell(element) || element.style.marginLeft && util.getNumber(element.style.marginLeft, 0) > 0) {
              commandMapNodes.push("OUTDENT");
              commandMap.OUTDENT.removeAttribute("disabled");
            }
          }
          /* Indent */


          if (commandMapNodes.indexOf("INDENT") === -1 && commandMap.INDENT && util.isListCell(element) && !element.previousElementSibling) {
            commandMapNodes.push("INDENT");
            commandMap.INDENT.setAttribute("disabled", true);
          }

          continue;
        }
        /** default active buttons [strong, ins, em, del, sub, sup] */


        if (classOnCheck.test(nodeName)) {
          commandMapNodes.push(nodeName);
          util.addClass(commandMap[nodeName], "active");
        }
      }
      /** remove class, display text */


      for (var key in commandMap) {
        if (commandMapNodes.indexOf(key) > -1 || !util.hasOwn(commandMap, key)) continue;

        if (activePlugins.indexOf(key) > -1) {
          plugins[key].active.call(core, null);
        } else if (commandMap.OUTDENT && /^OUTDENT$/i.test(key)) {
          commandMap.OUTDENT.setAttribute("disabled", true);
        } else if (commandMap.INDENT && /^INDENT$/i.test(key)) {
          commandMap.INDENT.removeAttribute("disabled");
        } else {
          util.removeClass(commandMap[key], "active");
        }
      }
      /** save current nodes */


      core._variable.currentNodes = currentNodes.reverse();
      core._variable.currentNodesMap = commandMapNodes;
      /**  Displays the current node structure to resizingBar */

      if (options.showPathLabel) context.element.navigation.textContent = core._variable.currentNodes.join(" > ");
    },
    _cancelCaptionEdit: function _cancelCaptionEdit() {
      this.setAttribute("contenteditable", false);
      this.removeEventListener("blur", event._cancelCaptionEdit);
    },
    _buttonsEventHandler: function _buttonsEventHandler(e) {
      var target = e.target;
      if (core._bindControllersOff) e.stopPropagation();

      if (/^(input|textarea|select|option)$/i.test(target.nodeName)) {
        core._antiBlur = false;
      } else {
        e.preventDefault();
      }

      if (util.getParentElement(target, ".ke-submenu")) {
        e.stopPropagation();
        core._notHideToolbar = true;
      } else {
        var command = target.getAttribute("data-command");
        var className = target.className;

        while (!command && !/ke-menu-list/.test(className) && !/kothing-editor-common/.test(className)) {
          target = target.parentNode;
          command = target.getAttribute("data-command");
          className = target.className;
        }

        if (command === core._submenuName || command === core._containerName) {
          e.stopPropagation();
        }
      }
    },
    onClick_toolbar: function onClick_toolbar(e) {
      var target = e.target;
      var display = target.getAttribute("data-display");
      var command = target.getAttribute("data-command");
      var className = target.className;

      while (target.parentNode && !command && !/ke-menu-list/.test(className) && !/ke-toolbar/.test(className)) {
        target = target.parentNode;
        command = target.getAttribute("data-command");
        display = target.getAttribute("data-display");
        className = target.className;
      }

      if (!command && !display) return;
      if (target.disabled) return;
      if (!core.hasFocus) core.nativeFocus();
      if (!core._variable.isCodeView) core._editorRange();
      core.actionCall(command, display, target);
    },
    onMouseDown_wysiwyg: function onMouseDown_wysiwyg(e) {
      if (util.isNonEditable(context.element.wysiwyg)) return;
      var tableCell = util.getParentElement(e.target, util.isCell);

      if (tableCell) {
        var tablePlugin = core.plugins.table;

        if (tablePlugin && tableCell !== tablePlugin._fixedCell && !tablePlugin._shift) {
          core.callPlugin("table", function () {
            tablePlugin.onTableCellMultiSelect.call(core, tableCell, false);
          }, null);
        }
      }

      if (core._isBalloon) {
        event._hideToolbar();
      }

      if (/FIGURE/i.test(e.target.nodeName)) e.preventDefault();
      if (typeof functions.onMouseDown === "function") functions.onMouseDown(e, core);
    },
    onClick_wysiwyg: function onClick_wysiwyg(e) {
      var targetElement = e.target;
      if (util.isNonEditable(context.element.wysiwyg)) return;
      var fileComponentInfo = core.getFileComponent(targetElement);

      if (fileComponentInfo) {
        e.preventDefault();
        core.selectComponent(fileComponentInfo.target, fileComponentInfo.pluginName);
        return;
      }

      var figcaption = util.getParentElement(targetElement, "FIGCAPTION");

      if (util.isNonEditable(figcaption)) {
        e.preventDefault();
        figcaption.setAttribute("contenteditable", true);
        figcaption.focus();

        if (core._isInline && !core._inlineToolbarAttr.isShow) {
          event._showToolbarInline();

          var hideToolbar = function hideToolbar() {
            event._hideToolbar();

            figcaption.removeEventListener("blur", hideToolbar);
          };

          figcaption.addEventListener("blur", hideToolbar);
        }
      }

      _w.setTimeout(core._editorRange.bind(core));

      core._editorRange();

      var selectionNode = core.getSelectionNode();
      var formatEl = util.getFormatElement(selectionNode, null);
      var rangeEl = util.getRangeFormatElement(selectionNode, null);

      if ((!formatEl || formatEl === rangeEl) && !util.isNonEditable(targetElement) && !util.isList(rangeEl)) {
        var range = core.getRange();

        if (util.getFormatElement(range.startContainer) === util.getFormatElement(range.endContainer)) {
          if (util.isList(rangeEl)) {
            var oLi = util.createElement("LI");
            var prevLi = selectionNode.nextElementSibling;
            oLi.appendChild(selectionNode);
            rangeEl.insertBefore(oLi, prevLi);
          } else if (!util.isWysiwygDiv(selectionNode) && !util.isComponent(selectionNode) && (!util.isTable(selectionNode) || util.isCell(selectionNode))) {
            core._setDefaultFormat(util.isRangeFormatElement(rangeEl) ? "DIV" : "P");
          }

          e.preventDefault();
          core.focus();
        }
      } else {
        event._applyTagEffects();
      }

      if (core._isBalloon) _w.setTimeout(event._toggleToolbarBalloon);
      if (typeof functions.onClick === "function") functions.onClick(e, core);
    },
    _balloonDelay: null,
    _showToolbarBalloonDelay: function _showToolbarBalloonDelay() {
      if (event._balloonDelay) {
        _w.clearTimeout(event._balloonDelay);
      }

      event._balloonDelay = _w.setTimeout(function () {
        _w.clearTimeout(this._balloonDelay);

        this._balloonDelay = null;

        this._showToolbarBalloon();
      }.bind(event), 350);
    },
    _toggleToolbarBalloon: function _toggleToolbarBalloon() {
      core._editorRange();

      var range = core.getRange();
      if (core._bindControllersOff || !core._isBalloonAlways && range.collapsed) event._hideToolbar();else event._showToolbarBalloon(range);
    },
    _showToolbarBalloon: function _showToolbarBalloon(rangeObj) {
      if (!core._isBalloon) return;
      var range = rangeObj || core.getRange();
      var toolbar = context.element.toolbar;
      var selection = core.getSelection();
      var isDirTop;

      if (core._isBalloonAlways && range.collapsed) {
        isDirTop = true;
      } else if (selection.focusNode === selection.anchorNode) {
        isDirTop = selection.focusOffset < selection.anchorOffset;
      } else {
        var childNodes = util.getListChildNodes(range.commonAncestorContainer, null);
        isDirTop = util.getArrayIndex(childNodes, selection.focusNode) < util.getArrayIndex(childNodes, selection.anchorNode);
      }

      var rects = range.getClientRects();
      rects = rects[isDirTop ? 0 : rects.length - 1];
      var scrollLeft = 0;
      var scrollTop = 0;
      var el = context.element.topArea;

      while (!!el) {
        scrollLeft += el.scrollLeft;
        scrollTop += el.scrollTop;
        el = el.parentElement;
      }

      var editorWidth = context.element.topArea.offsetWidth;

      var offsets = event._getEditorOffsets(null);

      var stickyTop = offsets.top;
      var editorLeft = offsets.left;
      toolbar.style.top = "-10000px";
      toolbar.style.visibility = "hidden";
      toolbar.style.display = "block";

      if (!rects) {
        var node = core.getSelectionNode();

        if (util.isFormatElement(node)) {
          var zeroWidth = util.createTextNode(util.zeroWidthSpace);
          core.insertNode(zeroWidth, null, false);
          core.setRange(zeroWidth, 1, zeroWidth, 1);

          core._editorRange();

          rects = core.getRange().getClientRects();
          rects = rects[isDirTop ? 0 : rects.length - 1];
        }

        if (!rects) {
          var nodeOffset = util.getOffset(node, context.element.wysiwygFrame);
          rects = {
            left: nodeOffset.left,
            top: nodeOffset.top,
            right: nodeOffset.left,
            bottom: nodeOffset.top + node.offsetHeight,
            noText: true
          };
          scrollLeft = 0;
          scrollTop = 0;
        }

        isDirTop = true;
      }

      var arrowMargin = _w.Math.round(context.element._arrow.offsetWidth / 2);

      var toolbarWidth = toolbar.offsetWidth;
      var toolbarHeight = toolbar.offsetHeight;
      var iframeRects = /iframe/i.test(context.element.wysiwygFrame.nodeName) ? context.element.wysiwygFrame.getClientRects()[0] : null;

      if (iframeRects) {
        rects = {
          left: rects.left + iframeRects.left,
          top: rects.top + iframeRects.top,
          right: rects.right + iframeRects.right - iframeRects.width,
          bottom: rects.bottom + iframeRects.bottom - iframeRects.height
        };
      }

      event._setToolbarOffset(isDirTop, rects, toolbar, editorLeft, editorWidth, scrollLeft, scrollTop, stickyTop, arrowMargin);

      if (toolbarWidth !== toolbar.offsetWidth || toolbarHeight !== toolbar.offsetHeight) {
        event._setToolbarOffset(isDirTop, rects, toolbar, editorLeft, editorWidth, scrollLeft, scrollTop, stickyTop, arrowMargin);
      }

      toolbar.style.visibility = "";
    },
    _setToolbarOffset: function _setToolbarOffset(isDirTop, rects, toolbar, editorLeft, editorWidth, scrollLeft, scrollTop, stickyTop, arrowMargin) {
      var padding = 1;
      var toolbarWidth = toolbar.offsetWidth;
      var toolbarHeight = rects.noText && !isDirTop ? 0 : toolbar.offsetHeight;
      var absoluteLeft = (isDirTop ? rects.left : rects.right) - editorLeft - toolbarWidth / 2 + scrollLeft;
      var overRight = absoluteLeft + toolbarWidth - editorWidth;
      var t = (isDirTop ? rects.top - toolbarHeight - arrowMargin : rects.bottom + arrowMargin) - (rects.noText ? 0 : stickyTop) + scrollTop;
      var l = absoluteLeft < 0 ? padding : overRight < 0 ? absoluteLeft : absoluteLeft - overRight - padding - 1;
      var resetTop = false;
      var space = t + (isDirTop ? event._getEditorOffsets(null).top : toolbar.offsetHeight - context.element.wysiwyg.offsetHeight);

      if (!isDirTop && space > 0 && event._getPageBottomSpace() < space) {
        isDirTop = true;
        resetTop = true;
      } else if (isDirTop && _d.documentElement.offsetTop > space) {
        isDirTop = false;
        resetTop = true;
      }

      if (resetTop) t = (isDirTop ? rects.top - toolbarHeight - arrowMargin : rects.bottom + arrowMargin) - (rects.noText ? 0 : stickyTop) + scrollTop;
      toolbar.style.left = _w.Math.floor(l) + "px";
      toolbar.style.top = _w.Math.floor(t) + "px";

      if (isDirTop) {
        util.removeClass(context.element._arrow, "ke-arrow-up");
        util.addClass(context.element._arrow, "ke-arrow-down");
        context.element._arrow.style.top = toolbarHeight + "px";
      } else {
        util.removeClass(context.element._arrow, "ke-arrow-down");
        util.addClass(context.element._arrow, "ke-arrow-up");
        context.element._arrow.style.top = -arrowMargin + "px";
      }

      var arrow_left = _w.Math.floor(toolbarWidth / 2 + (absoluteLeft - l));

      context.element._arrow.style.left = (arrow_left + arrowMargin > toolbar.offsetWidth ? toolbar.offsetWidth - arrowMargin : arrow_left < arrowMargin ? arrowMargin : arrow_left) + "px";
    },
    _showToolbarInline: function _showToolbarInline() {
      if (!core._isInline) return;
      var toolbar = context.element.toolbar;
      if (options.toolbarContainer) toolbar.style.position = "relative";else toolbar.style.position = "absolute";
      toolbar.style.visibility = "hidden";
      toolbar.style.display = "block";
      core._inlineToolbarAttr.width = options.toolbarWidth;
      toolbar.style.width = options.toolbarWidth;
      core._inlineToolbarAttr.top = (options.toolbarContainer ? 0 : -1 - toolbar.offsetHeight) + "px";
      toolbar.style.top = (options.toolbarContainer ? 0 : -1 - toolbar.offsetHeight) + "px";
      if (typeof functions.showInline === "function") functions.showInline(toolbar, context, core);
      event.onScroll_window();
      core._inlineToolbarAttr.isShow = true;
      toolbar.style.visibility = "";
    },
    _hideToolbar: function _hideToolbar() {
      if (!core._notHideToolbar && !core._variable.isFullScreen) {
        context.element.toolbar.style.display = "none";
        core._inlineToolbarAttr.isShow = false;
      }
    },
    onInput_wysiwyg: function onInput_wysiwyg(e) {
      core._editorRange();

      var data = (e.data === null ? "" : e.data === undefined ? " " : e.data) || "";

      if (!core._charCount(data)) {
        e.preventDefault();
        e.stopPropagation();
      } // history stack


      core.history.push(true);
      if (typeof functions.onInput === "function") functions.onInput(e, core);
    },
    _onShortcutKey: false,
    onKeyDown_wysiwyg: function onKeyDown_wysiwyg(e) {
      var keyCode = e.keyCode;
      var shift = e.shiftKey;
      var ctrl = e.ctrlKey || e.metaKey || keyCode === 91 || keyCode === 92 || keyCode === 224;
      var alt = e.altKey;
      event._IEisComposing = keyCode === 229;
      core.submenuOff();

      if (core._isBalloon) {
        event._hideToolbar();
      }
      /** Shortcuts */


      if (ctrl && event._shortcutCommand(keyCode, shift)) {
        event._onShortcutKey = true;
        e.preventDefault();
        e.stopPropagation();
        return false;
      } else if (event._onShortcutKey) {
        event._onShortcutKey = false;
      }
      /** default key action */


      var selectionNode = core.getSelectionNode();
      var range = core.getRange();
      var selectRange = !range.collapsed || range.startContainer !== range.endContainer;
      var fileComponentName = core._fileManager.pluginRegExp.test(core.currentControllerName) ? core.currentControllerName : "";
      var formatEl = util.getFormatElement(selectionNode, null) || selectionNode;
      var rangeEl = util.getRangeFormatElement(formatEl, null);

      switch (keyCode) {
        case 8
        /** backspace key */
        :
          if (!selectRange) {
            if (fileComponentName) {
              e.preventDefault();
              e.stopPropagation();
              core.plugins[fileComponentName].destroy.call(core);
              break;
            }
          }

          if (selectRange && event._hardDelete()) {
            e.preventDefault();
            e.stopPropagation();
            break;
          }

          if (!util.isFormatElement(formatEl) && !context.element.wysiwyg.firstElementChild && !util.isComponent(selectionNode)) {
            e.preventDefault();
            e.stopPropagation();

            core._setDefaultFormat("P");

            return false;
          }

          if (!selectRange && !formatEl.previousElementSibling && range.startOffset === 0 && !selectionNode.previousSibling && !util.isListCell(formatEl) && util.isFormatElement(formatEl) && (!util.isFreeFormatElement(formatEl) || util.isClosureFreeFormatElement(formatEl))) {
            // closure range
            if (util.isClosureRangeFormatElement(formatEl.parentNode)) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            } // maintain default format


            if (util.isWysiwygDiv(formatEl.parentNode) && formatEl.childNodes.length <= 1 && (!formatEl.firstChild || util.onlyZeroWidthSpace(formatEl.textContent))) {
              e.preventDefault();
              e.stopPropagation();
              formatEl.innerHTML = "<br>";
              var attrs = formatEl.attributes;

              while (attrs[0]) {
                formatEl.removeAttribute(attrs[0].name);
              }

              core.nativeFocus();
              return false;
            }
          } // clean remove tag


          if (formatEl && range.startContainer === range.endContainer && selectionNode.nodeType === 3 && !util.isFormatElement(selectionNode.parentNode)) {
            if (range.collapsed ? selectionNode.textContent.length === 1 : range.endOffset - range.startOffset === selectionNode.textContent.length) {
              e.preventDefault();
              var offset = null;
              var prev = selectionNode.parentNode.previousSibling;
              var next = selectionNode.parentNode.nextSibling;

              if (!prev) {
                if (!next) {
                  prev = util.createElement("BR");
                  formatEl.appendChild(prev);
                } else {
                  prev = next;
                  offset = 0;
                }
              }

              selectionNode.textContent = "";
              util.removeItemAllParents(selectionNode, null, formatEl);
              offset = typeof offset === "number" ? offset : prev.nodeType === 3 ? prev.textContent.length : 1;
              core.setRange(prev, offset, prev, offset);
              break;
            }
          } // nested list


          var commonCon = range.commonAncestorContainer;
          formatEl = util.getFormatElement(range.startContainer, null);
          rangeEl = util.getRangeFormatElement(formatEl, null);

          if (rangeEl && formatEl && !util.isCell(rangeEl) && !/^FIGCAPTION$/i.test(rangeEl.nodeName)) {
            if (util.isListCell(formatEl) && util.isList(rangeEl) && (util.isListCell(rangeEl.parentNode) || formatEl.previousElementSibling) && (selectionNode === formatEl || selectionNode.nodeType === 3 && (!selectionNode.previousSibling || util.isList(selectionNode.previousSibling))) && (util.getFormatElement(range.startContainer, null) !== util.getFormatElement(range.endContainer, null) ? rangeEl.contains(range.startContainer) : range.startOffset === 0 && range.collapsed)) {
              if (range.startContainer !== range.endContainer) {
                e.preventDefault();
                core.removeNode();

                if (range.startContainer.nodeType === 3) {
                  core.setRange(range.startContainer, range.startContainer.textContent.length, range.startContainer, range.startContainer.textContent.length);
                } // history stack


                core.history.push(true);
              } else {
                var _prev = formatEl.previousElementSibling || rangeEl.parentNode;

                if (util.isListCell(_prev)) {
                  e.preventDefault();
                  var prevLast = _prev;

                  if (!_prev.contains(formatEl) && util.isListCell(prevLast) && util.isList(prevLast.lastElementChild)) {
                    prevLast = prevLast.lastElementChild.lastElementChild;

                    while (util.isListCell(prevLast) && util.isList(prevLast.lastElementChild)) {
                      prevLast = prevLast.lastElementChild && prevLast.lastElementChild.lastElementChild;
                    }

                    _prev = prevLast;
                  }

                  var con = _prev === rangeEl.parentNode ? rangeEl.previousSibling : _prev.lastChild;

                  if (!con) {
                    con = util.createTextNode(util.zeroWidthSpace);
                    rangeEl.parentNode.insertBefore(con, rangeEl.parentNode.firstChild);
                  }

                  var _offset = con.nodeType === 3 ? con.textContent.length : 1;

                  var children = formatEl.childNodes;
                  var after = con;
                  var child = children[0];

                  while (child = children[0]) {
                    _prev.insertBefore(child, after.nextSibling);

                    after = child;
                  }

                  util.removeItem(formatEl);
                  if (rangeEl.children.length === 0) util.removeItem(rangeEl);
                  core.setRange(con, _offset, con, _offset); // history stack

                  core.history.push(true);
                }
              }

              break;
            } // detach range


            if (!selectRange && range.startOffset === 0) {
              var detach = true;
              var comm = commonCon;

              while (comm && comm !== rangeEl && !util.isWysiwygDiv(comm)) {
                if (comm.previousSibling) {
                  if (comm.previousSibling.nodeType === 1 || !util.onlyZeroWidthSpace(comm.previousSibling.textContent.trim())) {
                    detach = false;
                    break;
                  }
                }

                comm = comm.parentNode;
              }

              if (detach && rangeEl.parentNode) {
                e.preventDefault();
                core.detachRangeFormatElement(rangeEl, util.isListCell(formatEl) ? [formatEl] : null, null, false, false); // history stack

                core.history.push(true);
                break;
              }
            }
          } // component


          if (!selectRange && (range.startOffset === 0 || (selectionNode === formatEl ? !!formatEl.childNodes[range.startOffset] : false))) {
            var sel = selectionNode === formatEl ? formatEl.childNodes[range.startOffset] : selectionNode; // select file component

            var ignoreZWS = (commonCon.nodeType === 3 || util.isBreak(commonCon)) && !commonCon.previousSibling && range.startOffset === 0;

            if (!sel.previousSibling && (util.isComponent(commonCon.previousSibling) || ignoreZWS && util.isComponent(formatEl.previousSibling))) {
              var fileComponentInfo = core.getFileComponent(formatEl.previousSibling);

              if (fileComponentInfo) {
                e.preventDefault();
                e.stopPropagation();
                if (formatEl.textContent.length === 0) util.removeItem(formatEl);
                core.selectComponent(fileComponentInfo.target, fileComponentInfo.pluginName);
              }

              break;
            } // delete nonEditable


            if (util.isNonEditable(sel.previousSibling)) {
              e.preventDefault();
              e.stopPropagation();
              util.removeItem(sel.previousSibling);
              break;
            }
          }

          break;

        case 46
        /** delete key */
        :
          if (fileComponentName) {
            e.preventDefault();
            e.stopPropagation();
            core.plugins[fileComponentName].destroy.call(core);
            break;
          }

          if (selectRange && event._hardDelete()) {
            e.preventDefault();
            e.stopPropagation();
            break;
          } // component


          if ((util.isFormatElement(selectionNode) || selectionNode.nextSibling === null || util.onlyZeroWidthSpace(selectionNode.nextSibling) && selectionNode.nextSibling.nextSibling === null) && range.startOffset === selectionNode.textContent.length) {
            var nextEl = formatEl.nextElementSibling;

            if (!nextEl) {
              e.preventDefault();
              break;
            }

            if (util.isComponent(nextEl)) {
              e.preventDefault();

              if (util.onlyZeroWidthSpace(formatEl)) {
                util.removeItem(formatEl); // table component

                if (util.isTable(nextEl)) {
                  var cell = util.getChildElement(nextEl, util.isCell, false);
                  cell = cell.firstElementChild || cell;
                  core.setRange(cell, 0, cell, 0);
                  break;
                }
              } // select file component


              var _fileComponentInfo = core.getFileComponent(nextEl);

              if (_fileComponentInfo) {
                e.stopPropagation();
                core.selectComponent(_fileComponentInfo.target, _fileComponentInfo.pluginName);
              }

              break;
            }
          }

          if (!selectRange && (core.isEdgePoint(range.endContainer, range.endOffset) || (selectionNode === formatEl ? !!formatEl.childNodes[range.startOffset] : false))) {
            var _sel = selectionNode === formatEl ? formatEl.childNodes[range.startOffset] : selectionNode; // delete nonEditable


            if (util.isNonEditable(_sel.nextSibling)) {
              e.preventDefault();
              e.stopPropagation();
              util.removeItem(_sel.nextSibling);
              break;
            }
          } // nested list


          formatEl = util.getFormatElement(range.startContainer, null);
          rangeEl = util.getRangeFormatElement(formatEl, null);

          if (util.isListCell(formatEl) && util.isList(rangeEl) && (selectionNode === formatEl || selectionNode.nodeType === 3 && (!selectionNode.nextSibling || util.isList(selectionNode.nextSibling)) && (util.getFormatElement(range.startContainer, null) !== util.getFormatElement(range.endContainer, null) ? rangeEl.contains(range.endContainer) : range.endOffset === selectionNode.textContent.length && range.collapsed))) {
            if (range.startContainer !== range.endContainer) core.removeNode();

            var _next = util.getArrayItem(formatEl.children, util.isList, false);

            _next = _next || formatEl.nextElementSibling || rangeEl.parentNode.nextElementSibling;

            if (_next && (util.isList(_next) || util.getArrayItem(_next.children, util.isList, false))) {
              e.preventDefault();

              var _con, _children;

              if (util.isList(_next)) {
                var _child2 = _next.firstElementChild;
                _children = _child2.childNodes;
                _con = _children[0];

                while (_children[0]) {
                  formatEl.insertBefore(_children[0], _next);
                }

                util.removeItem(_child2);
              } else {
                _con = _next.firstChild;
                _children = _next.childNodes;

                while (_children[0]) {
                  formatEl.appendChild(_children[0]);
                }

                util.removeItem(_next);
              }

              core.setRange(_con, 0, _con, 0); // history stack

              core.history.push(true);
            }

            break;
          }

          break;

        case 9
        /** tab key */
        :
          if (fileComponentName || options.tabDisable) break;
          e.preventDefault();
          if (ctrl || alt || util.isWysiwygDiv(selectionNode)) break;
          var isEdge = !range.collapsed || core.isEdgePoint(range.startContainer, range.startOffset);
          var selectedFormats = core.getSelectedElements(null);
          selectionNode = core.getSelectionNode();
          var cells = [];
          var lines = [];
          var fc = util.isListCell(selectedFormats[0]);
          var lc = util.isListCell(selectedFormats[selectedFormats.length - 1]);
          var r = {
            sc: range.startContainer,
            so: range.startOffset,
            ec: range.endContainer,
            eo: range.endOffset
          };

          for (var i = 0, len = selectedFormats.length, f; i < len; i++) {
            f = selectedFormats[i];

            if (util.isListCell(f)) {
              if (!f.previousElementSibling && !shift) {
                continue;
              } else {
                cells.push(f);
              }
            } else {
              lines.push(f);
            }
          } // Nested list


          if (cells.length > 0 && isEdge && core.plugins.list) {
            r = core.plugins.list.editInsideList.call(core, shift, cells);
          } else {
            // table
            var tableCell = util.getParentElement(selectionNode, util.isCell);

            if (tableCell && isEdge) {
              var table = util.getParentElement(tableCell, "table");

              var _cells = util.getListChildren(table, util.isCell);

              var idx = shift ? util.prevIdx(_cells, tableCell) : util.nextIdx(_cells, tableCell);
              if (idx === _cells.length && !shift) idx = 0;
              if (idx === -1 && shift) idx = _cells.length - 1;
              var moveCell = _cells[idx];
              if (!moveCell) break;
              moveCell = moveCell.firstElementChild || moveCell;
              core.setRange(moveCell, 0, moveCell, 0);
              break;
            }

            lines = lines.concat(cells);
            fc = null;
            lc = null;
          } // Lines tab(4)


          if (lines.length > 0) {
            if (!shift) {
              var tabText = util.createTextNode(new _w.Array(core._variable.tabSize + 1).join("\xA0"));

              if (lines.length === 1) {
                var textRange = core.insertNode(tabText, null, true);
                if (!textRange) return false;

                if (!fc) {
                  r.sc = tabText;
                  r.so = textRange.endOffset;
                }

                if (!lc) {
                  r.ec = tabText;
                  r.eo = textRange.endOffset;
                }
              } else {
                var _len12 = lines.length - 1;

                for (var _i22 = 0, _child3; _i22 <= _len12; _i22++) {
                  _child3 = lines[_i22].firstChild;
                  if (!_child3) continue;

                  if (util.isBreak(_child3)) {
                    lines[_i22].insertBefore(tabText.cloneNode(false), _child3);
                  } else {
                    _child3.textContent = tabText.textContent + _child3.textContent;
                  }
                }

                var firstChild = util.getChildElement(lines[0], "text", false);
                var endChild = util.getChildElement(lines[_len12], "text", true);

                if (!fc && firstChild) {
                  r.sc = firstChild;
                  r.so = 0;
                }

                if (!lc && endChild) {
                  r.ec = endChild;
                  r.eo = endChild.textContent.length;
                }
              }
            } else {
              var _len13 = lines.length - 1;

              for (var _i23 = 0, line; _i23 <= _len13; _i23++) {
                line = lines[_i23].childNodes;

                for (var c = 0, cLen = line.length, _child4; c < cLen; c++) {
                  _child4 = line[c];
                  if (!_child4) break;
                  if (util.onlyZeroWidthSpace(_child4)) continue;

                  if (/^\s{1,4}$/.test(_child4.textContent)) {
                    util.removeItem(_child4);
                  } else if (/^\s{1,4}/.test(_child4.textContent)) {
                    _child4.textContent = _child4.textContent.replace(/^\s{1,4}/, "");
                  }

                  break;
                }
              }

              var _firstChild = util.getChildElement(lines[0], "text", false);

              var _endChild = util.getChildElement(lines[_len13], "text", true);

              if (!fc && _firstChild) {
                r.sc = _firstChild;
                r.so = 0;
              }

              if (!lc && _endChild) {
                r.ec = _endChild;
                r.eo = _endChild.textContent.length;
              }
            }
          }

          core.setRange(r.sc, r.so, r.ec, r.eo); // history stack

          core.history.push(false);
          break;

        case 13
        /** enter key */
        :
          var freeFormatEl = util.getFreeFormatElement(selectionNode, null);

          if (core._charTypeHTML) {
            var enterHTML = "";

            if (!shift && freeFormatEl || shift) {
              enterHTML = "<br>";
            } else {
              enterHTML = "<" + formatEl.nodeName + "><br></" + formatEl.nodeName + ">";
            }

            if (!core.checkCharCount(enterHTML, "byte-html")) {
              e.preventDefault();
              return false;
            }
          }

          if (!shift && freeFormatEl) {
            e.preventDefault();
            var selectionFormat = selectionNode === freeFormatEl;
            var wSelection = core.getSelection();
            var _children2 = selectionNode.childNodes;
            var _offset2 = wSelection.focusOffset;
            var _prev2 = selectionNode.previousElementSibling;
            var _next2 = selectionNode.nextSibling;

            if (!util.isClosureFreeFormatElement(freeFormatEl) && !!_children2 && (selectionFormat && range.collapsed && _children2.length - 1 <= _offset2 + 1 && util.isBreak(_children2[_offset2]) && (!_children2[_offset2 + 1] || (!_children2[_offset2 + 2] || util.onlyZeroWidthSpace(_children2[_offset2 + 2].textContent)) && _children2[_offset2 + 1].nodeType === 3 && util.onlyZeroWidthSpace(_children2[_offset2 + 1].textContent)) && _offset2 > 0 && util.isBreak(_children2[_offset2 - 1]) || !selectionFormat && util.onlyZeroWidthSpace(selectionNode.textContent) && util.isBreak(_prev2) && (util.isBreak(_prev2.previousSibling) || !util.onlyZeroWidthSpace(_prev2.previousSibling.textContent)) && (!_next2 || !util.isBreak(_next2) && util.onlyZeroWidthSpace(_next2.textContent)))) {
              if (selectionFormat) util.removeItem(_children2[_offset2 - 1]);else util.removeItem(selectionNode);
              var newEl = core.appendFormatTag(freeFormatEl, util.isFormatElement(freeFormatEl.nextElementSibling) ? freeFormatEl.nextElementSibling : null);
              util.copyFormatAttributes(newEl, freeFormatEl);
              core.setRange(newEl, 1, newEl, 1);
              break;
            }

            if (selectionFormat) {
              functions.insertHTML(range.collapsed && util.isBreak(range.startContainer.childNodes[range.startOffset - 1]) ? "<br>" : "<br><br>", true, false);
              var focusNode = wSelection.focusNode;
              var wOffset = wSelection.focusOffset;

              if (freeFormatEl === focusNode) {
                focusNode = focusNode.childNodes[wOffset - _offset2 > 1 ? wOffset - 1 : wOffset];
              }

              core.setRange(focusNode, 1, focusNode, 1);
            } else {
              var focusNext = wSelection.focusNode.nextSibling;
              var br = util.createElement("BR");
              core.insertNode(br, null, false);
              var brPrev = br.previousSibling;
              var brNext = br.nextSibling;

              if (!util.isBreak(focusNext) && !util.isBreak(brPrev) && (!brNext || util.onlyZeroWidthSpace(brNext))) {
                br.parentNode.insertBefore(br.cloneNode(false), br);
                core.setRange(br, 1, br, 1);
              } else {
                core.setRange(brNext, 0, brNext, 0);
              }
            }

            event._onShortcutKey = true;
            break;
          }

          if (selectRange) break;

          if (rangeEl && formatEl && !util.isCell(rangeEl) && !/^FIGCAPTION$/i.test(rangeEl.nodeName)) {
            var _range = core.getRange();

            if (core.isEdgePoint(_range.endContainer, _range.endOffset) && util.isList(selectionNode.nextSibling)) {
              e.preventDefault();

              var _newEl = util.createElement("LI");

              var _br = util.createElement("BR");

              _newEl.appendChild(_br);

              formatEl.parentNode.insertBefore(_newEl, formatEl.nextElementSibling);

              _newEl.appendChild(selectionNode.nextSibling);

              core.setRange(_br, 1, _br, 1);
              break;
            }

            if ((_range.commonAncestorContainer.nodeType === 3 ? !_range.commonAncestorContainer.nextElementSibling : true) && util.onlyZeroWidthSpace(formatEl.innerText.trim())) {
              e.preventDefault();
              var _newEl2 = null;

              if (util.isListCell(rangeEl.parentNode)) {
                rangeEl = formatEl.parentNode.parentNode.parentNode;
                _newEl2 = util.splitElement(formatEl, null, util.getElementDepth(formatEl) - 2);

                if (!_newEl2) {
                  var newListCell = util.createElement("LI");
                  newListCell.innerHTML = "<br>";
                  rangeEl.insertBefore(newListCell, _newEl2);
                  _newEl2 = newListCell;
                }
              } else {
                var newFormat = util.isCell(rangeEl.parentNode) ? "DIV" : util.isList(rangeEl.parentNode) ? "LI" : util.isFormatElement(rangeEl.nextElementSibling) ? rangeEl.nextElementSibling.nodeName : util.isFormatElement(rangeEl.previousElementSibling) ? rangeEl.previousElementSibling.nodeName : "P";
                _newEl2 = util.createElement(newFormat);
                var edge = core.detachRangeFormatElement(rangeEl, [formatEl], null, true, true);
                edge.cc.insertBefore(_newEl2, edge.ec);
              }

              _newEl2.innerHTML = "<br>";
              util.copyFormatAttributes(_newEl2, formatEl);
              util.removeItemAllParents(formatEl, null, null);
              core.setRange(_newEl2, 1, _newEl2, 1);
              break;
            }
          }

          if (rangeEl && util.getParentElement(rangeEl, "FIGCAPTION") && util.getParentElement(rangeEl, util.isList)) {
            e.preventDefault();
            formatEl = core.appendFormatTag(formatEl, null);
            core.setRange(formatEl, 0, formatEl, 0);
          }

          if (fileComponentName) {
            e.preventDefault();
            e.stopPropagation();
            var compContext = context[fileComponentName];
            var container = compContext._container;
            var sibling = container.previousElementSibling || container.nextElementSibling;
            var _newEl3 = null;

            if (util.isListCell(container.parentNode)) {
              _newEl3 = util.createElement("BR");
            } else {
              _newEl3 = util.createElement(util.isFormatElement(sibling) ? sibling.nodeName : "P");
              _newEl3.innerHTML = "<br>";
            }

            container.parentNode.insertBefore(_newEl3, container);
            core.callPlugin(fileComponentName, function () {
              core.selectComponent(compContext._element, fileComponentName);
            }, null);
          }

          break;

        case 27:
          if (fileComponentName) {
            e.preventDefault();
            e.stopPropagation();
            core.controllersOff();
            return false;
          }

          break;
      }

      if (shift && /16/.test(keyCode)) {
        e.preventDefault();
        e.stopPropagation();
        var tablePlugin = core.plugins.table;

        if (tablePlugin && !tablePlugin._shift && !tablePlugin._ref) {
          var _cell = util.getParentElement(formatEl, util.isCell);

          if (_cell) {
            tablePlugin.onTableCellMultiSelect.call(core, _cell, true);
            return;
          }
        }
      }

      var textKey = !ctrl && !alt && !selectRange && !event._nonTextKeyCode.test(keyCode);

      if (textKey && range.collapsed && range.startContainer === range.endContainer && util.isBreak(range.commonAncestorContainer)) {
        var zeroWidth = util.createTextNode(util.zeroWidthSpace);
        core.insertNode(zeroWidth, null, false);
        core.setRange(zeroWidth, 1, zeroWidth, 1);
      }

      if (typeof functions.onKeyDown === "function") functions.onKeyDown(e, core);
    },
    onKeyUp_wysiwyg: function onKeyUp_wysiwyg(e) {
      if (event._onShortcutKey) return;

      core._editorRange();

      var range = core.getRange();
      var keyCode = e.keyCode;
      var ctrl = e.ctrlKey || e.metaKey || keyCode === 91 || keyCode === 92 || keyCode === 224;
      var alt = e.altKey;
      var selectionNode = core.getSelectionNode();

      if (core._isBalloon && (core._isBalloonAlways && keyCode !== 27 || !range.collapsed)) {
        if (core._isBalloonAlways) {
          if (keyCode !== 27) event._showToolbarBalloonDelay();
        } else {
          event._showToolbarBalloon();

          return;
        }
      }
      /** when format tag deleted */


      if (keyCode === 8 && util.isWysiwygDiv(selectionNode) && selectionNode.textContent === "" && selectionNode.children.length === 0) {
        e.preventDefault();
        e.stopPropagation();
        selectionNode.innerHTML = "";
        var oFormatTag = util.createElement(util.isFormatElement(core._variable.currentNodes[0]) ? core._variable.currentNodes[0] : "P");
        oFormatTag.innerHTML = "<br>";
        selectionNode.appendChild(oFormatTag);
        core.setRange(oFormatTag, 0, oFormatTag, 0);

        event._applyTagEffects();

        core.history.push(false);
        return;
      }

      var formatEl = util.getFormatElement(selectionNode, null);
      var rangeEl = util.getRangeFormatElement(selectionNode, null);

      if ((!formatEl && range.collapsed || formatEl === rangeEl) && !util.isComponent(selectionNode) && !util.isList(selectionNode)) {
        core._setDefaultFormat(util.isRangeFormatElement(rangeEl) ? "DIV" : "P");

        selectionNode = core.getSelectionNode();
      }

      if (event._directionKeyCode.test(keyCode)) {
        event._applyTagEffects();
      }

      var textKey = !ctrl && !alt && !event._nonTextKeyCode.test(keyCode);

      if (textKey && selectionNode.nodeType === 3 && util.zeroWidthRegExp.test(selectionNode.textContent) && !(e.isComposing !== undefined ? e.isComposing : event._IEisComposing)) {
        var so = range.startOffset;
        var eo = range.endOffset;
        var frontZeroWidthCnt = (selectionNode.textContent.substring(0, eo).match(event._frontZeroWidthReg) || "").length;
        so = range.startOffset - frontZeroWidthCnt;
        eo = range.endOffset - frontZeroWidthCnt;
        selectionNode.textContent = selectionNode.textContent.replace(util.zeroWidthRegExp, "");
        core.setRange(selectionNode, so < 0 ? 0 : so, selectionNode, eo < 0 ? 0 : eo);
      }

      core._charCount(""); // history stack


      core.history.push(true);
      if (typeof functions.onKeyUp === "function") functions.onKeyUp(e, core);
    },
    onScroll_wysiwyg: function onScroll_wysiwyg(e) {
      core.controllersOff();
      core._lineBreaker.style.display = "none";
      if (core._isBalloon) event._hideToolbar();
      if (typeof functions.onScroll === "function") functions.onScroll(e, core);
    },
    onFocus_wysiwyg: function onFocus_wysiwyg(e) {
      if (core._antiBlur) return;
      core.hasFocus = true;
      if (core._isInline) event._showToolbarInline();
      if (typeof functions.onFocus === "function") functions.onFocus(e, core);
    },
    onBlur_wysiwyg: function onBlur_wysiwyg(e) {
      if (core._antiBlur) return;
      core.hasFocus = false;
      core.controllersOff();
      if (core._isInline || core._isBalloon) event._hideToolbar();
      if (typeof functions.onBlur === "function") functions.onBlur(e, core); // active class reset of buttons

      var commandMap = core.commandMap;
      var activePlugins = core.activePlugins;

      for (var key in commandMap) {
        if (!util.hasOwn(commandMap, key)) continue;

        if (activePlugins.indexOf(key) > -1) {
          plugins[key].active.call(core, null);
        } else if (commandMap.OUTDENT && /^OUTDENT$/i.test(key)) {
          commandMap.OUTDENT.setAttribute("disabled", true);
        } else if (commandMap.INDENT && /^INDENT$/i.test(key)) {
          commandMap.INDENT.removeAttribute("disabled");
        } else {
          util.removeClass(commandMap[key], "active");
        }
      }

      core._variable.currentNodes = [];
      core._variable.currentNodesMap = [];
      if (options.showPathLabel) context.element.navigation.textContent = "";
    },
    onMouseDown_resizingBar: function onMouseDown_resizingBar(e) {
      e.stopPropagation();
      core._variable.resizeClientY = e.clientY;
      context.element.resizeBackground.style.display = "block";

      function closureFunc() {
        context.element.resizeBackground.style.display = "none";

        _d.removeEventListener("mousemove", event._resize_editor);

        _d.removeEventListener("mouseup", closureFunc);
      }

      _d.addEventListener("mousemove", event._resize_editor);

      _d.addEventListener("mouseup", closureFunc);
    },
    _resize_editor: function _resize_editor(e) {
      var resizeInterval = context.element.editorArea.offsetHeight + (e.clientY - core._variable.resizeClientY);
      context.element.wysiwygFrame.style.height = (resizeInterval < core._variable.minResizingSize ? core._variable.minResizingSize : resizeInterval) + "px";
      context.element.code.style.height = (resizeInterval < core._variable.minResizingSize ? core._variable.minResizingSize : resizeInterval) + "px";
      core._variable.resizeClientY = e.clientY;
    },
    onResize_window: function onResize_window() {
      core.controllersOff();
      var responsiveSize = event._responsiveButtonSize;

      if (responsiveSize) {
        var windowWidth = _w.innerWidth;
        var responsiveWidth = "default";

        for (var i = 1, len = responsiveSize.length; i < len; i++) {
          if (windowWidth < responsiveSize[i]) {
            responsiveWidth = responsiveSize[i] + "";
          }
        }

        if (event._responsiveCurrentSize !== responsiveWidth) {
          event._responsiveCurrentSize = responsiveWidth;
          functions.setToolbarButtons(event._responsiveButtons[responsiveWidth]);
        }
      }

      if (context.element.toolbar.offsetWidth === 0) return;

      if (context.fileBrowser && context.fileBrowser.area.style.display === "block") {
        context.fileBrowser.body.style.maxHeight = _w.innerHeight - context.fileBrowser.header.offsetHeight - 50 + "px";
      }

      if (core.submenuActiveButton && core.submenu) {
        core._setMenuPosition(core.submenuActiveButton, core.submenu);
      }

      if (core._variable.isFullScreen) {
        core._variable.innerHeight_fullScreen += _w.innerHeight - context.element.toolbar.offsetHeight - core._variable.innerHeight_fullScreen;
        context.element.editorArea.style.height = core._variable.innerHeight_fullScreen + "px";
        return;
      }

      if (core._variable.isCodeView && core._isInline) {
        event._showToolbarInline();

        return;
      }

      core._iframeAutoHeight();

      if (core._sticky) {
        context.element.toolbar.style.width = context.element.topArea.offsetWidth - 2 + "px";
        event.onScroll_window();
      }
    },
    onScroll_window: function onScroll_window() {
      if (core._variable.isFullScreen || context.element.toolbar.offsetWidth === 0 || options.stickyToolbar < 0) return;
      var element = context.element;
      var editorHeight = element.editorArea.offsetHeight;
      var y = (this.scrollY || _d.documentElement.scrollTop) + options.stickyToolbar;
      var editorTop = event._getEditorOffsets(options.toolbarContainer).top - (core._isInline ? element.toolbar.offsetHeight : 0);

      if (y < editorTop) {
        event._offStickyToolbar();
      } else if (y + core._variable.minResizingSize >= editorHeight + editorTop) {
        if (!core._sticky) event._onStickyToolbar();
        element.toolbar.style.top = editorHeight + editorTop + options.stickyToolbar - y - core._variable.minResizingSize + "px";
      } else if (y >= editorTop) {
        event._onStickyToolbar();
      }
    },
    _getEditorOffsets: function _getEditorOffsets(container) {
      var offsetEl = container || context.element.topArea;
      var t = 0;
      var l = 0;
      var s = 0;

      while (offsetEl) {
        t += offsetEl.offsetTop;
        l += offsetEl.offsetLeft;
        s += offsetEl.scrollTop;
        offsetEl = offsetEl.offsetParent;
      }

      return {
        top: t,
        left: l,
        scroll: s
      };
    },
    _getPageBottomSpace: function _getPageBottomSpace() {
      return _d.documentElement.scrollHeight - (event._getEditorOffsets(null).top + context.element.topArea.offsetHeight);
    },
    _onStickyToolbar: function _onStickyToolbar() {
      var element = context.element;

      if (!core._isInline && !options.toolbarContainer) {
        element._stickyDummy.style.height = element.toolbar.offsetHeight + "px";
        element._stickyDummy.style.display = "block";
      }

      element.toolbar.style.top = options.stickyToolbar + "px";
      element.toolbar.style.width = core._isInline ? core._inlineToolbarAttr.width : element.toolbar.offsetWidth + "px";
      util.addClass(element.toolbar, "ke-toolbar-sticky");
      core._sticky = true;
    },
    _offStickyToolbar: function _offStickyToolbar() {
      var element = context.element;
      element._stickyDummy.style.display = "none";
      element.toolbar.style.top = core._isInline ? core._inlineToolbarAttr.top : "";
      element.toolbar.style.width = core._isInline ? core._inlineToolbarAttr.width : "";
      element.editorArea.style.marginTop = "";
      util.removeClass(element.toolbar, "ke-toolbar-sticky");
      core._sticky = false;
    },
    _codeViewAutoHeight: function _codeViewAutoHeight() {
      context.element.code.style.height = context.element.code.scrollHeight + "px";
    },
    // FireFox - table delete, Chrome - image, video, audio
    _hardDelete: function _hardDelete() {
      var range = core.getRange();
      var sc = range.startContainer;
      var ec = range.endContainer; // table

      var sCell = util.getRangeFormatElement(sc);
      var eCell = util.getRangeFormatElement(ec);
      var sIsCell = util.isCell(sCell);
      var eIsCell = util.isCell(eCell);

      if ((sIsCell && !sCell.previousElementSibling && !sCell.parentElement.previousElementSibling || eIsCell && !eCell.nextElementSibling && !eCell.parentElement.nextElementSibling) && sCell !== eCell) {
        if (!sIsCell) {
          util.removeItem(util.getParentElement(eCell, util.isComponent));
        } else if (!eIsCell) {
          util.removeItem(util.getParentElement(sCell, util.isComponent));
        } else {
          util.removeItem(util.getParentElement(sCell, util.isComponent));
          core.nativeFocus();
          return true;
        }
      } // component


      var sComp = sc.nodeType === 1 ? util.getParentElement(sc, ".ke-component") : null;
      var eComp = ec.nodeType === 1 ? util.getParentElement(ec, ".ke-component") : null;
      if (sComp) util.removeItem(sComp);
      if (eComp) util.removeItem(eComp);
      return false;
    },
    onPaste_wysiwyg: function onPaste_wysiwyg(e) {
      var clipboardData = util.isIE ? _w.clipboardData : e.clipboardData;
      if (!clipboardData) return true;
      return event._dataTransferAction("paste", e, clipboardData);
    },
    _setClipboardComponent: function _setClipboardComponent(e, info, clipboardData) {
      e.preventDefault();
      e.stopPropagation();
      clipboardData.setData("text/html", info.component.outerHTML);
    },
    onCopy_wysiwyg: function onCopy_wysiwyg(e) {
      var clipboardData = util.isIE ? _w.clipboardData : e.clipboardData;

      if (typeof functions.onCopy === "function" && !functions.onCopy(e, clipboardData, core)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      var info = core.currentFileComponentInfo;

      if (info && !util.isIE) {
        event._setClipboardComponent(e, info, clipboardData);

        util.addClass(info.component, "ke-component-copy"); // copy effect

        _w.setTimeout(function () {
          util.removeClass(info.component, "ke-component-copy");
        }, 150);
      }
    },
    onCut_wysiwyg: function onCut_wysiwyg(e) {
      var clipboardData = util.isIE ? _w.clipboardData : e.clipboardData;

      if (typeof functions.onCut === "function" && !functions.onCut(e, clipboardData, core)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      var info = core.currentFileComponentInfo;

      if (info && !util.isIE) {
        event._setClipboardComponent(e, info, clipboardData);

        util.removeItem(info.component);
        core.controllersOff();
      }

      _w.setTimeout(function () {
        // history stack
        core.history.push(false);
      });
    },
    onDrop_wysiwyg: function onDrop_wysiwyg(e) {
      var dataTransfer = e.dataTransfer;
      if (!dataTransfer) return true;

      if (util.isIE) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      core.removeNode();

      event._setDropLocationSelection(e);

      return event._dataTransferAction("drop", e, dataTransfer);
    },
    _setDropLocationSelection: function _setDropLocationSelection(e) {
      if (e.rangeParent) {
        core.setRange(e.rangeParent, e.rangeOffset, e.rangeParent, e.rangeOffset);
      } else if (core._wd.caretRangeFromPoint) {
        var r = core._wd.caretRangeFromPoint(e.clientX, e.clientY);

        core.setRange(r.startContainer, r.startOffset, r.endContainer, r.endOffset);
      } else {
        var _r2 = core.getRange();

        core.setRange(_r2.startContainer, _r2.startOffset, _r2.endContainer, _r2.endOffset);
      }
    },
    _dataTransferAction: function _dataTransferAction(type, e, data) {
      var plainText, cleanData;

      if (util.isIE) {
        plainText = data.getData("Text");
        var range = core.getRange();
        var tempDiv = util.createElement("DIV");
        var tempRange = {
          sc: range.startContainer,
          so: range.startOffset,
          ec: range.endContainer,
          eo: range.endOffset
        };
        tempDiv.setAttribute("contenteditable", true);
        tempDiv.style.cssText = "position:absolute; top:0; left:0; width:1px; height:1px; overflow:hidden;";
        context.element.relative.appendChild(tempDiv);
        tempDiv.focus();

        _w.setTimeout(function () {
          cleanData = tempDiv.innerHTML;
          util.removeItem(tempDiv);
          core.setRange(tempRange.sc, tempRange.so, tempRange.ec, tempRange.eo);

          event._setClipboardData(type, e, plainText, cleanData, data);
        });

        return true;
      } else {
        plainText = data.getData("text/plain");
        cleanData = data.getData("text/html");

        if (event._setClipboardData(type, e, plainText, cleanData, data) === false) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    },
    _setClipboardData: function _setClipboardData(type, e, plainText, cleanData, data) {
      // MS word
      if (/class=["']*Mso(Normal|List)/i.test(cleanData) || /content=["']*Word.Document/i.test(cleanData) || /content=["']*OneNote.File/i.test(cleanData)) {
        cleanData = cleanData.replace(/\n/g, " ");
        plainText = plainText.replace(/\n/g, " ");
      } else {
        plainText = plainText.replace(/\n/g, "");
      }

      cleanData = core.cleanHTML(cleanData, core.pasteTagsWhitelistRegExp);

      var maxCharCount = core._charCount(core._charTypeHTML ? cleanData : plainText); // paste event


      if (type === "paste" && typeof functions.onPaste === "function" && !functions.onPaste(e, cleanData, maxCharCount, core)) {
        return false;
      } // drop event


      if (type === "drop" && typeof functions.onDrop === "function" && !functions.onDrop(e, data, core)) {
        return false;
      } // files


      var files = data.files;

      if (files.length > 0) {
        if (/^image/.test(files[0].type) && core.plugins.image) {
          functions.insertImage(files);
        }

        return false;
      }

      if (!maxCharCount) {
        return false;
      }

      if (cleanData) {
        functions.insertHTML(cleanData, true, false);
        return false;
      }
    },
    onMouseMove_wysiwyg: function onMouseMove_wysiwyg(e) {
      if (core.isDisabled) return;
      var component = util.getParentElement(e.target, util.isComponent);
      var lineBreakerStyle = core._lineBreaker.style;

      if (component && !core.currentControllerName) {
        var scrollTop = 0;
        var el = context.element.wysiwyg;

        do {
          scrollTop += el.scrollTop;
          el = el.parentElement;
        } while (el && !/^(BODY|HTML)$/i.test(el.nodeName));

        var wScroll = context.element.wysiwyg.scrollTop;

        var offsets = event._getEditorOffsets(null);

        var componentTop = util.getOffset(component, context.element.wysiwygFrame).top + wScroll;
        var y = e.pageY + scrollTop + (options.iframe && !options.toolbarContainer ? context.element.toolbar.offsetHeight : 0);
        var c = componentTop + (options.iframe ? scrollTop : offsets.top);
        var isList = util.isListCell(component.parentNode);
        var dir = "";
        var top = "";

        if ((isList ? !component.previousSibling : !util.isFormatElement(component.previousElementSibling)) && y < c + 20) {
          top = componentTop;
          dir = "t";
        } else if ((isList ? !component.nextSibling : !util.isFormatElement(component.nextElementSibling)) && y > c + component.offsetHeight - 20) {
          top = componentTop + component.offsetHeight;
          dir = "b";
        } else {
          lineBreakerStyle.display = "none";
          return;
        }

        core._variable._lineBreakComp = component;
        core._variable._lineBreakDir = dir;
        lineBreakerStyle.top = top - wScroll + "px";
        core._lineBreakerButton.style.left = util.getOffset(component).left + component.offsetWidth / 2 - 15 + "px";
        lineBreakerStyle.display = "block";
      } // off line breaker
      else if (lineBreakerStyle.display !== "none") {
          lineBreakerStyle.display = "none";
        }
    },
    _onMouseDown_lineBreak: function _onMouseDown_lineBreak(e) {
      e.preventDefault();
    },
    _onLineBreak: function _onLineBreak(e) {
      e.preventDefault();
      var component = core._variable._lineBreakComp;
      var dir = !this ? core._variable._lineBreakDir : this;
      var isList = util.isListCell(component.parentNode);
      var format = util.createElement(isList ? "BR" : util.isCell(component.parentNode) ? "DIV" : "P");
      if (!isList) format.innerHTML = "<br>";
      if (core._charTypeHTML && !core.checkCharCount(format.outerHTML, "byte-html")) return;
      component.parentNode.insertBefore(format, dir === "t" ? component : component.nextSibling);
      core._lineBreaker.style.display = "none";
      core._variable._lineBreakComp = null;
      var focusEl = isList ? format : format.firstChild;
      core.setRange(focusEl, 1, focusEl, 1); // history stack

      core.history.push(false);
    },
    _addEvent: function _addEvent() {
      var eventWysiwyg = options.iframe ? core._ww : context.element.wysiwyg;
      /** toolbar event */

      context.element.toolbar.addEventListener("mousedown", event._buttonsEventHandler, false);

      context.element._menuTray.addEventListener("mousedown", event._buttonsEventHandler, false);

      context.element.toolbar.addEventListener("click", event.onClick_toolbar, false);
      /** editor area */

      eventWysiwyg.addEventListener("mousedown", event.onMouseDown_wysiwyg, false);
      eventWysiwyg.addEventListener("click", event.onClick_wysiwyg, false);
      eventWysiwyg.addEventListener(util.isIE ? "textinput" : "input", event.onInput_wysiwyg, false);
      eventWysiwyg.addEventListener("keydown", event.onKeyDown_wysiwyg, false);
      eventWysiwyg.addEventListener("keyup", event.onKeyUp_wysiwyg, false);
      eventWysiwyg.addEventListener("paste", event.onPaste_wysiwyg, false);
      eventWysiwyg.addEventListener("copy", event.onCopy_wysiwyg, false);
      eventWysiwyg.addEventListener("cut", event.onCut_wysiwyg, false);
      eventWysiwyg.addEventListener("drop", event.onDrop_wysiwyg, false);
      eventWysiwyg.addEventListener("scroll", event.onScroll_wysiwyg, false);
      eventWysiwyg.addEventListener("focus", event.onFocus_wysiwyg, false);
      eventWysiwyg.addEventListener("blur", event.onBlur_wysiwyg, false);
      /** line breaker */

      event._lineBreakerBind = {
        a: event._onLineBreak.bind(""),
        t: event._onLineBreak.bind("t"),
        b: event._onLineBreak.bind("b")
      };
      eventWysiwyg.addEventListener("mousemove", event.onMouseMove_wysiwyg, false);

      core._lineBreakerButton.addEventListener("mousedown", event._onMouseDown_lineBreak, false);

      core._lineBreakerButton.addEventListener("click", event._lineBreakerBind.a, false);

      context.element.lineBreaker_t.addEventListener("mousedown", event._lineBreakerBind.t, false);
      context.element.lineBreaker_b.addEventListener("mousedown", event._lineBreakerBind.b, false);
      /** Events are registered only when there is a table plugin.  */

      if (core.plugins.table) {
        eventWysiwyg.addEventListener("touchstart", event.onMouseDown_wysiwyg, {
          passive: true,
          useCapture: false
        });
      }
      /** code view area auto line */


      if (options.height === "auto" && !options.codeMirrorEditor) {
        context.element.code.addEventListener("keydown", event._codeViewAutoHeight, false);
        context.element.code.addEventListener("keyup", event._codeViewAutoHeight, false);
        context.element.code.addEventListener("paste", event._codeViewAutoHeight, false);
      }
      /** resizingBar */


      if (context.element.resizingBar) {
        if (/\d+/.test(options.height)) {
          context.element.resizingBar.addEventListener("mousedown", event.onMouseDown_resizingBar, false);
        } else {
          util.addClass(context.element.resizingBar, "ke-resizing-none");
        }
      }
      /** window event */


      event._setResponsiveToolbar();

      _w.removeEventListener("resize", event.onResize_window);

      _w.removeEventListener("scroll", event.onScroll_window);

      _w.addEventListener("resize", event.onResize_window, false);

      if (options.stickyToolbar > -1) {
        _w.addEventListener("scroll", event.onScroll_window, false);
      }
    },
    _removeEvent: function _removeEvent() {
      var eventWysiwyg = options.iframe ? core._ww : context.element.wysiwyg;
      context.element.toolbar.removeEventListener("mousedown", event._buttonsEventHandler);

      context.element._menuTray.removeEventListener("mousedown", event._buttonsEventHandler);

      context.element.toolbar.removeEventListener("click", event.onClick_toolbar);
      eventWysiwyg.removeEventListener("mousedown", event.onMouseDown_wysiwyg);
      eventWysiwyg.removeEventListener("click", event.onClick_wysiwyg);
      eventWysiwyg.removeEventListener(util.isIE ? "textinput" : "input", event.onInput_wysiwyg);
      eventWysiwyg.removeEventListener("keydown", event.onKeyDown_wysiwyg);
      eventWysiwyg.removeEventListener("keyup", event.onKeyUp_wysiwyg);
      eventWysiwyg.removeEventListener("paste", event.onPaste_wysiwyg);
      eventWysiwyg.removeEventListener("copy", event.onCopy_wysiwyg);
      eventWysiwyg.removeEventListener("cut", event.onCut_wysiwyg);
      eventWysiwyg.removeEventListener("drop", event.onDrop_wysiwyg);
      eventWysiwyg.removeEventListener("scroll", event.onScroll_wysiwyg);
      eventWysiwyg.removeEventListener("mousemove", event.onMouseMove_wysiwyg);

      core._lineBreakerButton.removeEventListener("mousedown", event._onMouseDown_lineBreak);

      core._lineBreakerButton.removeEventListener("click", event._lineBreakerBind.a);

      context.element.lineBreaker_t.removeEventListener("mousedown", event._lineBreakerBind.t);
      context.element.lineBreaker_b.removeEventListener("mousedown", event._lineBreakerBind.b);
      event._lineBreakerBind = null;
      eventWysiwyg.removeEventListener("touchstart", event.onMouseDown_wysiwyg, {
        passive: true,
        useCapture: false
      });
      eventWysiwyg.removeEventListener("focus", event.onFocus_wysiwyg);
      eventWysiwyg.removeEventListener("blur", event.onBlur_wysiwyg);
      context.element.code.removeEventListener("keydown", event._codeViewAutoHeight);
      context.element.code.removeEventListener("keyup", event._codeViewAutoHeight);
      context.element.code.removeEventListener("paste", event._codeViewAutoHeight);

      if (context.element.resizingBar) {
        context.element.resizingBar.removeEventListener("mousedown", event.onMouseDown_resizingBar);
      }

      _w.removeEventListener("resize", event.onResize_window);

      _w.removeEventListener("scroll", event.onScroll_window);
    },
    _setResponsiveToolbar: function _setResponsiveToolbar() {
      if (_responsiveButtons.length === 0) {
        _responsiveButtons = null;
        return;
      }

      var sizeArray = ["default"];
      event._responsiveButtonSize = ["default"];
      var buttonsObj = {
        default: _responsiveButtons[0]
      };
      event._responsiveButtons = {
        default: _responsiveButtons[0]
      };

      for (var i = 1, len = _responsiveButtons.length, size, buttonGroup; i < len; i++) {
        buttonGroup = _responsiveButtons[i];
        size = buttonGroup[0] * 1;
        sizeArray.push(size);
        buttonsObj[size] = buttonGroup[1];
      }
    }
  };
  /** functions */

  var functions = {
    /**
     * @description Core, Util object
     */
    core: core,
    util: util,

    /**
     * @description Event functions
     * @param {Object} e Event Object
     * @param {Object} core Core object
     */
    onload: null,
    onScroll: null,
    onMouseDown: null,
    onClick: null,
    onInput: null,
    onKeyDown: null,
    onKeyUp: null,
    onDrop: null,
    onChange: null,
    onCopy: null,
    onCut: null,
    onPaste: null,
    onFocus: null,
    onBlur: null,

    /**
     * @description Called just before the inline toolbar is positioned and displayed on the screen.
     * @param {Element} toolbar Toolbar Element
     * @param {Object} context The editor's context object (editor.getContext())
     * @param {Object} core Core object
     */
    showInline: null,

    /**
     * @description Called just after the controller is positioned and displayed on the screen.
     * controller - editing elements displayed on the screen [image resizing, table editor, link editor..]]
     * @param {String} name The name of the plugin that called the controller
     * @param {Array} controllers Array of Controller elements
     * @param {Object} core Core object
     */
    showController: null,

    /**
     * @description An event when toggling between code view and wysiwyg view.
     * @param {Boolean} isCodeView Whether the current code view mode
     * @param {Object} core Core object
     */
    toggleCodeView: null,

    /**
     * @description An event when toggling full screen.
     * @param {Boolean} isFullScreen Whether the current full screen mode
     * @param {Object} core Core object
     */
    toggleFullScreen: null,

    /**
     * @description It replaces the default callback function of the image upload
     * @param {Object} response Response object
     * @param {Object} info Input information
     * - linkValue: Link url value
     * - linkNewWindow: Open in new window Check Value
     * - inputWidth: Value of width input
     * - inputHeight: Value of height input
     * - align: Align Check Value
     * - isUpdate: Update image if true, create image if false
     * - element: If isUpdate is true, the currently selected image.
     * @param {Object} core Core object
     */
    imageUploadHandler: null,

    /**
     * @description It replaces the default callback function of the video upload
     * @param xmlHttp xmlHttpRequest object
     * @param info Input information
     * - inputWidth: Value of width input
     * - inputHeight: Value of height input
     * - align: Align Check Value
     * - isUpdate: Update video if true, create video if false
     * - element: If isUpdate is true, the currently selected video.
     * @param core Core object
     */
    videoUploadHandler: null,

    /**
     * @description It replaces the default callback function of the audio upload
     * @param xmlHttp xmlHttpRequest object
     * @param info Input information
     * - isUpdate: Update audio if true, create audio if false
     * - element: If isUpdate is true, the currently selected audio.
     * @param core Core object
     */
    audioUploadHandler: null,

    /**
     * @description Called before the image is uploaded
     * If false is returned, no image upload is performed.
     * If new fileList are returned,  replaced the previous fileList
     * @param {Array} files Files array
     * @param {Object} info info: {
     * - linkValue: Link url value
     * - linkNewWindow: Open in new window Check Value
     * - inputWidth: Value of width input
     * - inputHeight: Value of height input
     * - align: Align Check Value
     * - isUpdate: Update image if true, create image if false
     * - element: If isUpdate is true, the currently selected image.
     * }
     * @param {Object} core Core object
     * @param {Function} uploadHandler If undefined is returned, it waits until "uploadHandler" is executed.
     *                "uploadHandler" is an upload function with "core" and "info" bound.
     *                [upload files] : uploadHandler(files or [new File(...),])
     *                [error]        : uploadHandler("Error message")
     *                [Just finish]  : uploadHandler()
     *                [directly register] : uploadHandler(response) // Same format as "imageUploadUrl" response
     *                                   ex) {
     *                                      // "errorMessage": "insert error message",
     *                                      "result": [ { "url": "...", "name": "...", "size": "999" }, ]
     *                                   }
     * @returns {Boolean|Array|undefined}
     */
    onImageUploadBefore: null,

    /**
     * @description Called before the video is uploaded
     * If false is returned, no video(iframe, video) upload is performed.
     * If new fileList are returned,  replaced the previous fileList
     * @param {Array} files Files array
     * @param {Object} info info: {
     * - inputWidth: Value of width input
     * - inputHeight: Value of height input
     * - align: Align Check Value
     * - isUpdate: Update video if true, create video if false
     * - element: If isUpdate is true, the currently selected video.
     * }
     * @param {Object} core Core object
     * @param {Function} uploadHandler If undefined is returned, it waits until "uploadHandler" is executed.
     *                "uploadHandler" is an upload function with "core" and "info" bound.
     *                [upload files] : uploadHandler(files or [new File(...),])
     *                [error]        : uploadHandler("Error message")
     *                [Just finish]  : uploadHandler()
     *                [directly register] : uploadHandler(response) // Same format as "videoUploadUrl" response
     *                                   ex) {
     *                                      // "errorMessage": "insert error message",
     *                                      "result": [ { "url": "...", "name": "...", "size": "999" }, ]
     *                                   }
     * @returns {Boolean|Array|undefined}
     */
    onVideoUploadBefore: null,

    /**
     * @description Called before the audio is uploaded
     * If false is returned, no audio upload is performed.
     * If new fileList are returned,  replaced the previous fileList
     * @param {Array} files Files array
     * @param {Object} info info: {
     * - isUpdate: Update audio if true, create audio if false
     * - element: If isUpdate is true, the currently selected audio.
     * }
     * @param {Object} core Core object
     * @param {Function} uploadHandler If undefined is returned, it waits until "uploadHandler" is executed.
     *                "uploadHandler" is an upload function with "core" and "info" bound.
     *                [upload files] : uploadHandler(files or [new File(...),])
     *                [error]        : uploadHandler("Error message")
     *                [Just finish]  : uploadHandler()
     *                [directly register] : uploadHandler(response) // Same format as "audioUploadUrl" response
     *                                   ex) {
     *                                      // "errorMessage": "insert error message",
     *                                      "result": [ { "url": "...", "name": "...", "size": "999" }, ]
     *                                   }
     * @returns {Boolean|Array|undefined}
     */
    onAudioUploadBefore: null,

    /**
     * @description Called when the image is uploaded, updated, deleted
     * @param {Element} targetElement Target element
     * @param {Number} index Uploaded index
     * @param {String} state Upload status ('create', 'update', 'delete')
     * @param {Object} info Image info object
     * - index: data index
     * - name: file name
     * - size: file size
     * - select: select function
     * - delete: delete function
     * - element: target element
     * - src: src attribute of tag
     * @param {Number} remainingFilesCount Count of remaining files to upload (0 when added as a url)
     * @param {Object} core Core object
     */
    onImageUpload: null,

    /**
     * @description Called when the video(iframe, video) is is uploaded, updated, deleted
     * -- arguments is same "onImageUpload" --
     */
    onVideoUpload: null,

    /**
     * @description Called when the audio is is uploaded, updated, deleted
     * -- arguments is same "onImageUpload" --
     */
    onAudioUpload: null,

    /**
     * @description Called when the image is upload failed
     * @param {String} errorMessage Error message
     * @param {Object} result Response Object
     * @param {Object} core Core object
     * @returns {Boolean}
     */
    onImageUploadError: null,

    /**
     * @description Called when the video(iframe, video) upload failed
     * -- arguments is same "onImageUploadError" --
     */
    onVideoUploadError: null,

    /**
     * @description Called when the audio upload failed
     * -- arguments is same "onImageUploadError" --
     */
    onAudioUploadError: null,

    /**
     * @description Reset the buttons on the toolbar. (Editor is not reloaded)
     * You cannot set a new plugin for the button.
     * @param {Array} toolbarItem Button list
     */
    setToolbarButtons: function setToolbarButtons(toolbarItem) {
      core.submenuOff();
      core.containerOff();

      var newToolbar = _constructor.default._createToolBar(_d, toolbarItem, core.plugins, options);

      _responsiveButtons = newToolbar.responsiveButtons;
      core._moreLayerActiveButton = null;

      event._setResponsiveToolbar();

      context.element.toolbar.replaceChild(newToolbar._buttonTray, context.element._buttonTray);
      var newContext = (0, _context.default)(context.element.originElement, core._getConstructed(context.element), options);
      context.element = newContext.element;
      context.tool = newContext.tool;
      if (options.iframe) context.element.wysiwyg = core._wd.body;

      core._cachingButtons();

      core.history._resetCachingButton();

      core.activePlugins = [];
      var oldCallButtons = pluginCallButtons;
      pluginCallButtons = newToolbar.pluginCallButtons;
      var plugin, button, oldButton;

      for (var key in pluginCallButtons) {
        if (!util.hasOwn(pluginCallButtons, key)) continue;
        plugin = plugins[key];
        button = pluginCallButtons[key];

        if (plugin.active && button) {
          oldButton = oldCallButtons[key];
          core.callPlugin(key, null, oldButton || button);

          if (oldButton) {
            button.parentElement.replaceChild(oldButton, button);
            pluginCallButtons[key] = oldButton;
          }
        }
      }

      if (core.hasFocus) event._applyTagEffects();
      if (core._variable.isCodeView) util.addClass(core._styleCommandMap.codeView, "active");
      if (core._variable.isFullScreen) util.addClass(core._styleCommandMap.fullScreen, "active");
      if (util.hasClass(context.element.wysiwyg, "ke-show-block")) util.addClass(core._styleCommandMap.showBlocks, "active");
    },

    /**
     * @description Add or reset option property (Editor is reloaded)
     * @param {Object} _options Options
     */
    setOptions: function setOptions(_options) {
      event._removeEvent();

      core._resetComponents();

      util.removeClass(core._styleCommandMap.showBlocks, "active");
      util.removeClass(core._styleCommandMap.codeView, "active");
      core._variable.isCodeView = false;
      core._iframeAuto = null;
      core.plugins = _options.plugins || core.plugins;
      var mergeOptions = [options, _options].reduce(function (init, option) {
        for (var key in option) {
          if (!util.hasOwn(option, key)) continue;

          if (key === "plugins" && option[key] && init[key]) {
            (function () {
              var i = init[key];
              var o = option[key];
              i = i.length ? i : _w.Object.keys(i).map(function (name) {
                return i[name];
              });
              o = o.length ? o : _w.Object.keys(o).map(function (name) {
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
      var el = context.element;
      var _initHTML = el.wysiwyg.innerHTML; // set option

      var cons = _constructor.default._setOptions(mergeOptions, context, core.plugins, options);

      if (cons.callButtons) {
        pluginCallButtons = cons.callButtons;
        core.initPlugins = {};
      }

      if (cons.plugins) {
        core.plugins = cons.plugins;
      } // reset context


      if (el._menuTray.children.length === 0) this._menuTray = {};
      _responsiveButtons = cons.toolbar.responsiveButtons;
      options = mergeOptions;
      core.lang = options.lang;

      if (options.iframe) {
        el.wysiwygFrame.addEventListener("load", function () {
          util._setIframeDocument(this, options);

          core._setOptionsInit(el, _initHTML);
        });
      }

      el.editorArea.appendChild(el.wysiwygFrame);

      if (!options.iframe) {
        core._setOptionsInit(el, _initHTML);
      }
    },

    /**
     * @description Set "options.defaultStyle" style.
     * Define the style of the edit area
     * It can also be defined with the "setOptions" method, but the "setDefaultStyle" method does not render the editor again.
     * @param {String} style Style string
     */
    setDefaultStyle: function setDefaultStyle(style) {
      var newStyles = util._setDefaultOptionStyle(options, style);

      options._editorStyles = util._setDefaultOptionStyle(options, style);
      var el = context.element; // top area

      el.topArea.style.cssText = newStyles.top; // code view

      el.code.style.cssText = options._editorStyles.frame;
      el.code.style.display = "none";

      if (options.height === "auto") {
        el.code.style.overflow = "hidden";
      } else {
        el.code.style.overflow = "";
      } // wysiwyg frame


      if (!options.iframe) {
        el.wysiwygFrame.style.cssText = newStyles.frame + newStyles.editor;
      } else {
        el.wysiwygFrame.style.cssText = newStyles.frame;
        el.wysiwyg.style.cssText = newStyles.editor;
      }
    },

    /**
     * @description Open a notice area
     * @param {String} message Notice message
     */
    noticeOpen: function noticeOpen(message) {
      core.notice.open.call(core, message);
    },

    /**
     * @description Close a notice area
     */
    noticeClose: function noticeClose() {
      core.notice.close.call(core);
    },

    /**
     * @description Copying the contents of the editor to the original textarea
     */
    save: function save() {
      context.element.originElement.value = core.getContents(false);
    },

    /**
     * @description Gets the KothingEditor's context object. Contains settings, plugins, and cached element objects
     * @returns {Object}
     */
    getContext: function getContext() {
      return context;
    },

    /**
     * @description Gets the contents of the KothingEditor
     * @param {Boolean} onlyContents - Return only the contents of the body without headers when the "fullPage" option is true
     * @returns {String}
     */
    getContents: function getContents(onlyContents) {
      return core.getContents(onlyContents);
    },

    /**
     * @description Gets only the text of the KothingEditor contents
     * @returns {String}
     */
    getText: function getText() {
      return context.element.wysiwyg.textContent;
    },

    /**
     * @description Get the editor's number of characters or binary data size.
     * You can use the "charCounterType" option format.
     * @param {String|null} charCounterType options - charCounterType ('char', 'byte', 'byte-html')
     * If argument is no value, the currently set "charCounterType" option is used.
     * @returns {Number}
     */
    getCharCount: function getCharCount(charCounterType) {
      charCounterType = typeof charCounterType === "string" ? charCounterType : options.charCounterType;
      return core.getCharLength(core._charTypeHTML ? context.element.wysiwyg.innerHTML : context.element.wysiwyg.textContent, charCounterType);
    },

    /**
     * @description Gets uploaded images informations
     * - index: data index
     * - name: file name
     * - size: file size
     * - select: select function
     * - delete: delete function
     * - element: target element
     * - src: src attribute of tag
     * @returns {Array}
     */
    getImagesInfo: function getImagesInfo() {
      return context.image ? context.image._infoList : [];
    },

    /**
     * @description Gets uploaded files(plugin using fileManager) information list.
     * image: [img], video: [video, iframe], audio: [audio]
     * When the argument value is 'image', it is the same function as "getImagesInfo".
     * - index: data index
     * - name: file name
     * - size: file size
     * - select: select function
     * - delete: delete function
     * - element: target element
     * - src: src attribute of tag
     * @param {String} pluginName Plugin name (image, video, audio)
     * @returns {Array}
     */
    getFilesInfo: function getFilesInfo(pluginName) {
      return context[pluginName] ? context[pluginName]._infoList : [];
    },

    /**
     * @description Upload images using image plugin
     * @param {FileList} files FileList
     */
    insertImage: function insertImage(files) {
      if (!core.plugins.image || !files) return;
      if (!core.initPlugins.image) core.callPlugin("image", core.plugins.image.submitAction.bind(core, files), null);else core.plugins.image.submitAction.call(core, files);
      core.focus();
    },

    /**
     * @description Inserts an HTML element or HTML string or plain string at the current cursor position
     * @param {Element|String} html HTML Element or HTML string or plain string
     * @param {Boolean} notCleaningData If true, inserts the HTML string without refining it with core.cleanHTML.
     * @param {Boolean} checkCharCount If true, if "options.maxCharCount" is exceeded when "element" is added, null is returned without addition.
     * @param {Boolean} rangeSelection If true, range select the inserted node.
     */
    insertHTML: function insertHTML(html, notCleaningData, checkCharCount, rangeSelection) {
      if (typeof html === "string") {
        if (!notCleaningData) html = core.cleanHTML(html, null);

        try {
          var dom = _d.createRange().createContextualFragment(html);

          var domTree = dom.childNodes;

          if (checkCharCount) {
            var type = core._charTypeHTML ? "outerHTML" : "textContent";
            var checkHTML = "";

            for (var i = 0, len = domTree.length; i < len; i++) {
              checkHTML += domTree[i][type];
            }

            if (!core.checkCharCount(checkHTML, null)) return;
          }

          var c, a, t, firstCon;

          while (c = domTree[0]) {
            t = core.insertNode(c, a, false);
            a = t.container || t;
            if (!firstCon) firstCon = t;
          }

          var offset = a.nodeType === 3 ? t.endOffset || a.textContent.length : a.childNodes.length;
          if (rangeSelection) core.setRange(firstCon.container || firstCon, firstCon.startOffset || 0, a, offset);else core.setRange(a, offset, a, offset);
        } catch (error) {
          core.execCommand("insertHTML", false, html);
        }
      } else {
        if (util.isComponent(html)) {
          core.insertComponent(html, false, checkCharCount, false);
        } else {
          var afterNode = null;

          if (util.isFormatElement(html) || util.isMedia(html)) {
            afterNode = util.getFormatElement(core.getSelectionNode(), null);
          }

          core.insertNode(html, afterNode, checkCharCount);
        }
      }

      core.effectNode = null;
      core.focus(); // history stack

      core.history.push(false);
    },

    /**
     * @description Change the contents of the KothingEditor
     * @param {String} contents Contents to Input
     */
    setContents: function setContents(contents) {
      core.setContents(contents);
    },

    /**
     * @description Add contents to the KothingEditor
     * @param {String} contents Contents to Input
     */
    appendContents: function appendContents(contents) {
      var convertValue = core.convertContentsForEditor(contents);

      if (!core._variable.isCodeView) {
        var temp = util.createElement("DIV");
        temp.innerHTML = convertValue;
        var wysiwyg = context.element.wysiwyg;
        var children = temp.children;

        for (var i = 0, len = children.length; i < len; i++) {
          wysiwyg.appendChild(children[i]);
        }
      } else {
        core._setCodeView(core._getCodeView() + "\n" + core.convertHTMLForCodeView(convertValue));
      } // history stack


      core.history.push(false);
    },

    /**
     * @description Disable the KothingEditor
     */
    disabled: function disabled() {
      context.tool.cover.style.display = "block";
      context.element.wysiwyg.setAttribute("contenteditable", false);
      core.isDisabled = true;

      if (options.codeMirrorEditor) {
        options.codeMirrorEditor.setOption("readOnly", true);
      } else {
        context.element.code.setAttribute("disabled", "disabled");
      }
    },

    /**
     * @description Enable the KothingEditor
     */
    enabled: function enabled() {
      context.tool.cover.style.display = "none";
      context.element.wysiwyg.setAttribute("contenteditable", true);
      core.isDisabled = false;

      if (options.codeMirrorEditor) {
        options.codeMirrorEditor.setOption("readOnly", false);
      } else {
        context.element.code.removeAttribute("disabled");
      }
    },

    /**
     * @description Show the KothingEditor
     */
    show: function show() {
      var topAreaStyle = context.element.topArea.style;
      if (topAreaStyle.display === "none") topAreaStyle.display = options.display;
    },

    /**
     * @description Hide the KothingEditor
     */
    hide: function hide() {
      context.element.topArea.style.display = "none";
    },

    /**
     * @description Destroy the KothingEditor
     */
    destroy: function destroy() {
      /** off menus */
      core.submenuOff();
      core.containerOff();
      core.controllersOff();
      if (core.notice) core.notice.close.call(core);
      if (core.modalForm) core.plugins.dialog.close.call(core);
      /** remove history */

      core.history._destroy();
      /** remove event listeners */


      event._removeEvent();
      /** remove element */


      util.removeItem(context.element.toolbar);
      util.removeItem(context.element.topArea);
      /** remove object reference */

      for (var k in core) {
        if (util.hasOwn(core, k)) delete core[k];
      }

      for (var _k in event) {
        if (util.hasOwn(event, _k)) delete event[_k];
      }

      for (var _k2 in context) {
        if (util.hasOwn(context, _k2)) delete context[_k2];
      }

      for (var _k3 in pluginCallButtons) {
        if (util.hasOwn(pluginCallButtons, _k3)) delete pluginCallButtons[_k3];
      }
      /** remove user object */


      for (var _k4 in this) {
        if (util.hasOwn(this, _k4)) delete this[_k4];
      }
    },

    /**
     * @description Toolbar methods
     */
    toolbar: {
      /**
       * @description Disable the toolbar
       */
      disabled: function disabled() {
        context.tool.cover.style.display = "block";
      },

      /**
       * @description Enable the toolbar
       */
      enabled: function enabled() {
        context.tool.cover.style.display = "none";
      },

      /**
       * @description Show the toolbar
       */
      show: function show() {
        if (core._isInline) {
          event._showToolbarInline();
        } else {
          context.element.toolbar.style.display = "";
          context.element._stickyDummy.style.display = "";
        }
      },

      /**
       * @description Hide the toolbar
       */
      hide: function hide() {
        if (core._isInline) {
          event._hideToolbar();
        } else {
          context.element.toolbar.style.display = "none";
          context.element._stickyDummy.style.display = "none";
        }
      }
    }
  };
  /************ Core init ************/
  // functions

  core.functions = functions; // Create to sibling node

  var contextEl = context.element;
  var originEl = contextEl.originElement;
  var topEl = contextEl.topArea;
  originEl.style.display = "none";
  topEl.style.display = "block"; // init

  if (options.iframe) {
    contextEl.wysiwygFrame.addEventListener("load", function () {
      util._setIframeDocument(this, options);

      core._editorInit(false, options.value);

      options.value = null;
    });
  } // insert editor element


  if (_typeof(originEl.nextElementSibling) === "object") {
    originEl.parentNode.insertBefore(topEl, originEl.nextElementSibling);
  } else {
    originEl.parentNode.appendChild(topEl);
  }

  contextEl.editorArea.appendChild(contextEl.wysiwygFrame);
  contextEl = null;
  originEl = null;
  topEl = null; // init

  if (!options.iframe) {
    core._editorInit(false, options.value);

    options.value = null;
  }

  return functions;
}