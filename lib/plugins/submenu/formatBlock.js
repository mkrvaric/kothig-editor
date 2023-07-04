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
  name: "formatBlock",
  display: "submenu",
  add: function add(core, targetElement) {
    var icons = core.icons;
    var context = core.context;
    context.formatBlock = {
      targetText: targetElement.querySelector(".txt"),
      targetTooltip: targetElement.parentNode.querySelector(".ke-tooltip-text"),
      _formatList: null,
      currentFormat: "",
      icon: icons.format_block
    };
    /** set submenu */

    var listDiv = this.setSubmenu.call(core);
    /** add event listeners */

    listDiv.querySelector("ul").addEventListener("click", this.pickUp.bind(core));
    context.formatBlock._formatList = listDiv.querySelectorAll("li button");
    /** append target button menu */

    core.initMenuTarget(this.name, targetElement, listDiv);
    /** empty memory */

    listDiv = null;
  },
  setSubmenu: function setSubmenu() {
    var option = this.context.option;
    var lang_toolbar = this.lang.toolbar;
    var listDiv = this.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-list-layer ke-list-format";
    var defaultFormats = ["p", "div", "blockquote", "pre", "h1", "h2", "h3", "h4", "h5", "h6"];
    var formatList = !option.formats || option.formats.length === 0 ? defaultFormats : option.formats;
    var list = '<div class="ke-list-inner"><ul class="ke-list-basic">';

    for (var i = 0, len = formatList.length, format, tagName, command, name, h, attrs, className; i < len; i++) {
      format = formatList[i];

      if (typeof format === "string" && defaultFormats.indexOf(format) > -1) {
        tagName = format.toLowerCase();
        command = tagName === "blockquote" ? "range" : tagName === "pre" ? "free" : "replace";
        h = /^h/.test(tagName) ? tagName.match(/\d+/)[0] : "";
        name = lang_toolbar["tag_" + (h ? "h" : tagName)] + h;
        className = "";
        attrs = "";
      } else {
        tagName = format.tag.toLowerCase();
        command = format.command;
        name = format.name || tagName;
        className = format.class;
        attrs = className ? ' class="' + className + '"' : "";
      }

      list += "<li>" + '<button type="button" class="ke-btn-list" data-command="' + command + '" data-value="' + tagName + '" data-class="' + className + '" title="' + name + '">' + "<" + tagName + attrs + ">" + name + "</" + tagName + ">" + "</button></li>";
    }

    list += "</ul></div>";
    listDiv.innerHTML = list;
    return listDiv;
  },

  /**
   * @Override core
   */
  active: function active(element) {
    var formatTitle = this.lang.toolbar.formats;
    var target = this.context.formatBlock.targetText.firstElementChild;
    var icon = this.context.formatBlock.icon;

    if (!element) {
      this.util.changeElement(target, icon);
    } else if (this.util.isFormatElement(element)) {
      var formatContext = this.context.formatBlock;
      var formatList = formatContext._formatList;
      var nodeName = element.nodeName.toLowerCase();
      var className = (element.className.match(/(\s|^)__ke__format__[^\s]+/) || [""])[0].trim();

      for (var i = 0, len = formatList.length, f; i < len; i++) {
        f = formatList[i];

        if (nodeName === f.getAttribute("data-value") && className === f.getAttribute("data-class")) {
          formatTitle = f.title;
          break;
        }
      }

      this.util.changeElement(target, "<span>".concat(formatTitle, "</span>"));
      target.setAttribute("data-value", nodeName);
      target.setAttribute("data-class", className);
      return true;
    }

    return false;
  },

  /**
   * @Override submenu
   */
  on: function on() {
    var formatContext = this.context.formatBlock;
    var formatList = formatContext._formatList;
    var target = formatContext.targetText;
    var currentFormat = (target.getAttribute("data-value") || "") + (target.getAttribute("data-class") || "");

    if (currentFormat !== formatContext.currentFormat) {
      for (var i = 0, len = formatList.length, f; i < len; i++) {
        f = formatList[i];

        if (currentFormat === f.getAttribute("data-value") + f.getAttribute("data-class")) {
          this.util.addClass(f, "active");
        } else {
          this.util.removeClass(f, "active");
        }
      }

      formatContext.currentFormat = currentFormat;
    }
  },
  pickUp: function pickUp(e) {
    var _this = this;

    e.preventDefault();
    e.stopPropagation();
    var target = e.target;
    var command = null,
        value = null,
        tag = null,
        className = "";

    while (!command && !/UL/i.test(target.tagName)) {
      command = target.getAttribute("data-command");
      value = target.getAttribute("data-value");
      className = target.getAttribute("data-class");

      if (command) {
        tag = target.firstChild;
        break;
      }

      target = target.parentNode;
    }

    if (!command) {
      return;
    } // blockquote


    if (command === "range") {
      var rangeElement = tag.cloneNode(false);
      this.applyRangeFormatElement(rangeElement);
    } else {
      var range = this.getRange();
      var selectedFormsts = this.getSelectedElementsAndComponents(false);

      if (selectedFormsts.length === 0) {
        range = this.getRange_addLine(range);
        selectedFormsts = this.getSelectedElementsAndComponents(false);

        if (selectedFormsts.length === 0) {
          return;
        }
      }

      var startOffset = range.startOffset;
      var endOffset = range.endOffset;
      var util = this.util;
      var first = selectedFormsts[0];
      var last = selectedFormsts[selectedFormsts.length - 1];
      var firstPath = util.getNodePath(range.startContainer, first, null, null);
      var lastPath = util.getNodePath(range.endContainer, last, null, null); // remove selected list

      var rlist = this.detachList(selectedFormsts, false);

      if (rlist.sc) {
        first = rlist.sc;
      }

      if (rlist.ec) {
        last = rlist.ec;
      } // change format tag


      this.setRange(util.getNodeFromPath(firstPath, first), startOffset, util.getNodeFromPath(lastPath, last), endOffset);
      var modifiedFormsts = this.getSelectedElementsAndComponents(false); // free format

      if (command === "free") {
        (function () {
          var len = modifiedFormsts.length - 1;
          var parentNode = modifiedFormsts[len].parentNode;
          var freeElement = tag.cloneNode(false);
          var focusElement = freeElement;

          for (var i = len, f, html, before, next, inner, isComp, _first = true; i >= 0; i--) {
            f = modifiedFormsts[i];

            if (f === (!modifiedFormsts[i + 1] ? null : modifiedFormsts[i + 1].parentNode)) {
              continue;
            }

            isComp = util.isComponent(f);
            html = isComp ? "" : f.innerHTML.replace(/(?!>)\s+(?=<)|\n/g, " ");
            before = util.getParentElement(f, function (current) {
              return current.parentNode === parentNode;
            });

            if (parentNode !== f.parentNode || isComp) {
              if (util.isFormatElement(parentNode)) {
                parentNode.parentNode.insertBefore(freeElement, parentNode.nextSibling);
                parentNode = parentNode.parentNode;
              } else {
                parentNode.insertBefore(freeElement, before ? before.nextSibling : null);
                parentNode = f.parentNode;
              }

              next = freeElement.nextSibling;

              if (next && freeElement.nodeName === next.nodeName && util.isSameAttributes(freeElement, next)) {
                freeElement.innerHTML += "<BR>" + next.innerHTML;
                util.removeItem(next);
              }

              freeElement = tag.cloneNode(false);
              _first = true;
            }

            inner = freeElement.innerHTML;
            freeElement.innerHTML = (_first || !html || !inner || /<br>$/i.test(html) ? html : html + "<BR>") + inner;

            if (i === 0) {
              parentNode.insertBefore(freeElement, f);
              next = f.nextSibling;

              if (next && freeElement.nodeName === next.nodeName && util.isSameAttributes(freeElement, next)) {
                freeElement.innerHTML += "<BR>" + next.innerHTML;
                util.removeItem(next);
              }

              var prev = freeElement.previousSibling;

              if (prev && freeElement.nodeName === prev.nodeName && util.isSameAttributes(freeElement, prev)) {
                prev.innerHTML += "<BR>" + freeElement.innerHTML;
                util.removeItem(freeElement);
              }
            }

            if (!isComp) {
              util.removeItem(f);
            }

            if (html) {
              _first = false;
            }
          }

          _this.setRange(focusElement, 0, focusElement, 0);
        })();
      } else {
        for (var i = 0, len = modifiedFormsts.length, node, newFormat; i < len; i++) {
          node = modifiedFormsts[i];

          if ((node.nodeName.toLowerCase() !== value.toLowerCase() || (node.className.match(/(\s|^)__ke__format__[^\s]+/) || [""])[0].trim() !== className) && !util.isComponent(node)) {
            newFormat = tag.cloneNode(false);
            util.copyFormatAttributes(newFormat, node);
            newFormat.innerHTML = node.innerHTML;
            node.parentNode.replaceChild(newFormat, node);
          }

          if (i === 0) {
            first = newFormat || node;
          }

          if (i === len - 1) {
            last = newFormat || node;
          }

          newFormat = null;
        }

        this.setRange(util.getNodeFromPath(firstPath, first), startOffset, util.getNodeFromPath(lastPath, last), endOffset);
      } // history stack


      this.history.push(false);
    }

    this.submenuOff();
  }
};
exports.default = _default;