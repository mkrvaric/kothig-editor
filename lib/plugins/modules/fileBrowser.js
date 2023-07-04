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
  name: "fileBrowser",
  _xmlHttp: null,
  _loading: null,

  /**
   * @description Constructor
   * @param {Object} core Core object
   */
  add: function add(core) {
    var context = core.context;
    context.fileBrowser = {
      _closeSignal: false,
      area: null,
      header: null,
      tagArea: null,
      body: null,
      list: null,
      tagElements: null,
      items: [],
      selectedTags: [],
      selectorHandler: null,
      contextPlugin: "",
      columnSize: 4
    };
    /** fileBrowser */

    var browser_div = core.util.createElement("DIV");
    browser_div.className = "ke-file-browser kothing-editor-common";
    var back = core.util.createElement("DIV");
    back.className = "ke-file-browser-back";
    var content = core.util.createElement("DIV");
    content.className = "ke-file-browser-inner";
    content.innerHTML = this.set_browser(core);
    browser_div.appendChild(back);
    browser_div.appendChild(content);
    this._loading = browser_div.querySelector(".ke-loading-box");
    context.fileBrowser.area = browser_div;
    context.fileBrowser.header = content.querySelector(".ke-file-browser-header");
    context.fileBrowser.titleArea = content.querySelector(".ke-file-browser-title");
    context.fileBrowser.tagArea = content.querySelector(".ke-file-browser-tags");
    context.fileBrowser.body = content.querySelector(".ke-file-browser-body");
    context.fileBrowser.list = content.querySelector(".ke-file-browser-list");
    /** add event listeners */

    context.fileBrowser.tagArea.addEventListener("click", this.onClickTag.bind(core));
    context.fileBrowser.list.addEventListener("click", this.onClickFile.bind(core));
    content.addEventListener("mousedown", this._onMouseDown_browser.bind(core));
    content.addEventListener("click", this._onClick_browser.bind(core));
    /** append html */

    context.element.relative.appendChild(browser_div);
    /** empty memory */

    browser_div = null;
    back = null;
    content = null;
  },
  set_browser: function set_browser(core) {
    var lang = core.lang;
    return '<div class="ke-file-browser-content">' + '<div class="ke-file-browser-header">' + '<button type="button" data-command="close" class="ke-btn ke-file-browser-close" class="close" aria-label="Close" title="' + lang.dialogBox.close + '">' + core.icons.cancel + "</button>" + '<span class="ke-file-browser-title"></span>' + '<div class="ke-file-browser-tags"></div>' + "</div>" + '<div class="ke-file-browser-body">' + '<div class="ke-loading-box kothing-editor-common"><div class="ke-loading-effect"></div></div>' + '<div class="ke-file-browser-list"></div>' + "</div>" + "</div>";
  },

  /**
   * @description Event to control the behavior of closing the browser
   * @param {MouseEvent} e Event object
   * @private
   */
  _onMouseDown_browser: function _onMouseDown_browser(e) {
    if (/ke-file-browser-inner/.test(e.target.className)) {
      this.context.fileBrowser._closeSignal = true;
    } else {
      this.context.fileBrowser._closeSignal = false;
    }
  },

  /**
   * @description Event to close the window when the outside area of the browser or close button is click
   * @param {MouseEvent} e Event object
   * @private
   */
  _onClick_browser: function _onClick_browser(e) {
    e.stopPropagation();

    if (/close/.test(e.target.getAttribute("data-command")) || this.context.fileBrowser._closeSignal) {
      this.plugins.fileBrowser.close.call(this);
    }
  },

  /**
   * @description Open a file browser plugin
   * @param {String} pluginName Plugin name using the file browser
   * @param {Function|null} selectorHandler When the function comes as an argument value, it substitutes "context.selectorHandler".
   */
  open: function open(pluginName, selectorHandler) {
    if (this.plugins.fileBrowser._bindClose) {
      this._d.removeEventListener("keydown", this.plugins.fileBrowser._bindClose);

      this.plugins.fileBrowser._bindClose = null;
    }

    this.plugins.fileBrowser._bindClose = function (e) {
      if (!/27/.test(e.keyCode)) {
        return;
      }

      this.plugins.fileBrowser.close.call(this);
    }.bind(this);

    this._d.addEventListener("keydown", this.plugins.fileBrowser._bindClose);

    var fileBrowserContext = this.context.fileBrowser;
    fileBrowserContext.contextPlugin = pluginName;
    fileBrowserContext.selectorHandler = selectorHandler;
    var pluginContext = this.context[pluginName];
    var listClassName = pluginContext.listClass;

    if (!this.util.hasClass(fileBrowserContext.list, listClassName)) {
      fileBrowserContext.list.className = "ke-file-browser-list " + listClassName;
    }

    if (this.context.option.popupDisplay === "full") {
      fileBrowserContext.area.style.position = "fixed";
    } else {
      fileBrowserContext.area.style.position = "absolute";
    }

    fileBrowserContext.titleArea.textContent = pluginContext.title;
    fileBrowserContext.area.style.display = "block";

    this.plugins.fileBrowser._drawFileList.call(this, this.context[pluginName].url);
  },
  _bindClose: null,

  /**
   * @description Close a fileBrowser plugin
   * The plugin's "init" method is called.
   */
  close: function close() {
    var fileBrowserPlugin = this.plugins.fileBrowser;

    if (fileBrowserPlugin._xmlHttp) {
      fileBrowserPlugin._xmlHttp.abort();
    }

    if (fileBrowserPlugin._bindClose) {
      this._d.removeEventListener("keydown", fileBrowserPlugin._bindClose);

      fileBrowserPlugin._bindClose = null;
    }

    var fileBrowserContext = this.context.fileBrowser;
    fileBrowserContext.area.style.display = "none";
    fileBrowserContext.selectorHandler = null;
    fileBrowserContext.selectedTags = [];
    fileBrowserContext.items = [];
    fileBrowserContext.list.innerHTML = "";
    fileBrowserContext.tagArea.innerHTML = "";
    fileBrowserContext.titleArea.textContent = "";

    if (typeof this.plugins[fileBrowserContext.contextPlugin].init === "function") {
      this.plugins[fileBrowserContext.contextPlugin].init.call(this);
    }

    fileBrowserContext.contextPlugin = "";
  },

  /**
   * @description Show file browser loading box
   */
  showBrowserLoading: function showBrowserLoading() {
    this._loading.style.display = "block";
  },

  /**
   * @description Close file browser loading box
   */
  closeBrowserLoading: function closeBrowserLoading() {
    this._loading.style.display = "none";
  },
  _drawFileList: function _drawFileList(url) {
    var fileBrowserPlugin = this.plugins.fileBrowser;
    var xmlHttp = this.util.getXMLHttpRequest();
    fileBrowserPlugin._xmlHttp = this.util.getXMLHttpRequest();
    xmlHttp.onreadystatechange = fileBrowserPlugin._callBackGet.bind(this, xmlHttp);
    xmlHttp.open("get", url, true);
    xmlHttp.send(null);
    this.plugins.fileBrowser.showBrowserLoading();
  },
  _callBackGet: function _callBackGet(xmlHttp) {
    if (xmlHttp.readyState === 4) {
      this.plugins.fileBrowser._xmlHttp = null;

      if (xmlHttp.status === 200) {
        try {
          this.plugins.fileBrowser._drawListItem.call(this, JSON.parse(xmlHttp.responseText).result, true);
        } catch (e) {
          throw Error('[KothingEditor.fileBrowser.drawList.fail] cause : "' + e.message + '"');
        } finally {
          this.plugins.fileBrowser.closeBrowserLoading();
          this.context.fileBrowser.body.style.maxHeight = this._w.innerHeight - this.context.fileBrowser.header.offsetHeight - 50 + "px";
        }
      } else {
        // exception
        this.plugins.fileBrowser.closeBrowserLoading();

        if (xmlHttp.status !== 0) {
          var res = !xmlHttp.responseText ? xmlHttp : JSON.parse(xmlHttp.responseText);
          var err = "[KothingEditor.fileBrowser.get.serverException] status: " + xmlHttp.status + ", response: " + (res.errorMessage || xmlHttp.responseText);
          throw Error(err);
        }
      }
    }
  },
  _drawListItem: function _drawListItem(items, update) {
    var fileBrowserContext = this.context.fileBrowser;
    var pluginContext = this.context[fileBrowserContext.contextPlugin];
    var _tags = [];
    var len = items.length;
    var columnSize = pluginContext.columnSize || fileBrowserContext.columnSize;
    var splitSize = columnSize <= 1 ? 1 : Math.round(len / columnSize) || 1;
    var drawItemHandler = pluginContext.itemTemplateHandler;
    var tagsHTML = "";
    var listHTML = '<div class="ke-file-item-column">';
    var columns = 1;

    for (var i = 0, item, tags; i < len; i++) {
      item = items[i];
      tags = !item.tag ? [] : typeof item.tag === "string" ? item.tag.split(",") : item.tag;
      tags = tags.map(function (v) {
        return v.trim();
      });
      item.tag = tags.map(function (v) {
        return v.trim();
      });
      listHTML += drawItemHandler(item);

      if ((i + 1) % splitSize === 0 && columns < columnSize && i + 1 < len) {
        columns++;
        listHTML += '</div><div class="ke-file-item-column">';
      }

      if (update && tags.length > 0) {
        for (var t = 0, tLen = tags.length, tag; t < tLen; t++) {
          tag = tags[t];

          if (tag && _tags.indexOf(tag) === -1) {
            _tags.push(tag);

            tagsHTML += '<a title="' + tag + '">' + tag + "</a>";
          }
        }
      }
    }

    listHTML += "</div>";
    fileBrowserContext.list.innerHTML = listHTML;

    if (update) {
      fileBrowserContext.items = items;
      fileBrowserContext.tagArea.innerHTML = tagsHTML;
      fileBrowserContext.tagElements = fileBrowserContext.tagArea.querySelectorAll("A");
    }
  },
  onClickTag: function onClickTag(e) {
    var target = e.target;

    if (!this.util.isAnchor(target)) {
      return;
    }

    var tagName = target.textContent;
    var fileBrowserPlugin = this.plugins.fileBrowser;
    var fileBrowserContext = this.context.fileBrowser;
    var selectTag = fileBrowserContext.tagArea.querySelector('a[title="' + tagName + '"]');
    var selectedTags = fileBrowserContext.selectedTags;
    var sTagIndex = selectedTags.indexOf(tagName);

    if (sTagIndex > -1) {
      selectedTags.splice(sTagIndex, 1);
      this.util.removeClass(selectTag, "on");
    } else {
      selectedTags.push(tagName);
      this.util.addClass(selectTag, "on");
    }

    fileBrowserPlugin._drawListItem.call(this, selectedTags.length === 0 ? fileBrowserContext.items : fileBrowserContext.items.filter(function (item) {
      return item.tag.some(function (tag) {
        return selectedTags.indexOf(tag) > -1;
      });
    }), false);
  },
  onClickFile: function onClickFile(e) {
    e.preventDefault();
    e.stopPropagation();
    var fileBrowserContext = this.context.fileBrowser;
    var listEl = fileBrowserContext.list;
    var target = e.target;
    var command = null;

    if (target === listEl) {
      return;
    }

    while (listEl !== target.parentNode) {
      command = target.getAttribute("data-command");

      if (command) {
        break;
      }

      target = target.parentNode;
    }

    if (!command) {
      return;
    }

    var handler = fileBrowserContext.selectorHandler || this.context[fileBrowserContext.contextPlugin].selectorHandler;
    this.plugins.fileBrowser.close.call(this);
    handler(target);
  }
};
exports.default = _default;