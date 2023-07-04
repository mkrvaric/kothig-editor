"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable no-unused-vars */

/*
 * Rich Text Editor
 *
 * kothing-ditor.js
 * Copyright Kothing.
 * MIT license.
 */
var _default = {
  name: "list",
  display: "submenu",
  add: function add(core, targetElement) {
    var context = core.context;
    context.list = {
      targetButton: targetElement,
      _list: null,
      currentList: "",
      icons: {
        bullets: core.icons.list_bullets,
        number: core.icons.list_number
      }
    };
    /** set submenu */

    var listDiv = this.setSubmenu.call(core);
    var listUl = listDiv.querySelector("ul");
    /** add event listeners */

    listUl.addEventListener("click", this.pickup.bind(core));
    context.list._list = listUl.querySelectorAll("li button");
    /** append target button menu */

    core.initMenuTarget(this.name, targetElement, listDiv);
    /** empty memory */

    listDiv = null;
    listUl = null;
  },
  setSubmenu: function setSubmenu() {
    var lang = this.lang;
    var listDiv = this.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-list-layer";
    listDiv.innerHTML = "\n      <div class=\"ke-list-inner\">\n        <ul class=\"ke-list-basic\">\n          <li>\n            <button type=\"button\" class=\"ke-btn-list\" data-command=\"OL\" title=\"".concat(lang.toolbar.orderList, "\">\n              ").concat(this.icons.list_number, "\n            </button>\n          </li>\n          <li>\n            <button type=\"button\" class=\"ke-btn-list\" data-command=\"UL\" title=\"").concat(lang.toolbar.unorderList, "\">\n              ").concat(this.icons.list_bullets, "\n            </button>\n          </li>\n        </ul>\n      </div>");
    return listDiv;
  },

  /**
   * @Override core
   */
  active: function active(element) {
    var button = this.context.list.targetButton;
    var icon = button.firstElementChild;
    var util = this.util;

    if (!element) {
      button.removeAttribute("data-focus");
      util.changeElement(icon, this.context.list.icons.number);
      util.removeClass(button, "active");
    } else if (util.isList(element)) {
      var nodeName = element.nodeName;
      button.setAttribute("data-focus", nodeName);
      util.addClass(button, "active");

      if (/UL/i.test(nodeName)) {
        util.changeElement(icon, this.context.list.icons.bullets);
      } else {
        util.changeElement(icon, this.context.list.icons.number);
      }

      return true;
    }

    return false;
  },

  /**
   * @Override submenu
   */
  on: function on() {
    var listContext = this.context.list;
    var list = listContext._list;
    var currentList = listContext.targetButton.getAttribute("data-focus") || "";

    if (currentList !== listContext.currentList) {
      for (var i = 0, len = list.length; i < len; i++) {
        if (currentList === list[i].getAttribute("data-command")) {
          this.util.addClass(list[i], "active");
        } else {
          this.util.removeClass(list[i], "active");
        }
      }

      listContext.currentList = currentList;
    }
  },
  editList: function editList(command, selectedCells, detach) {
    var range = this.getRange();
    var selectedFormats = !selectedCells ? this.getSelectedElementsAndComponents(false) : selectedCells;

    if (selectedFormats.length === 0) {
      if (selectedCells) {
        return;
      }

      range = this.getRange_addLine(range);
      selectedFormats = this.getSelectedElementsAndComponents(false);

      if (selectedFormats.length === 0) {
        return;
      }
    }

    var util = this.util;
    util.sortByDepth(selectedFormats, true); // merge

    var firstSel = selectedFormats[0];
    var lastSel = selectedFormats[selectedFormats.length - 1];
    var topEl = (util.isListCell(firstSel) || util.isComponent(firstSel)) && !firstSel.previousElementSibling ? firstSel.parentNode.previousElementSibling : firstSel.previousElementSibling;
    var bottomEl = (util.isListCell(lastSel) || util.isComponent(lastSel)) && !lastSel.nextElementSibling ? lastSel.parentNode.nextElementSibling : lastSel.nextElementSibling;
    var originRange = {
      sc: range.startContainer,
      so: range.startOffset,
      ec: range.endContainer,
      eo: range.endOffset
    };
    var isRemove = true;

    var _loop = function _loop(i, len) {
      if (!util.isList(util.getRangeFormatElement(selectedFormats[i], function (current) {
        return this.getRangeFormatElement(current) && current !== selectedFormats[i];
      }.bind(util)))) {
        isRemove = false;
        return "break";
      }
    };

    for (var i = 0, len = selectedFormats.length; i < len; i++) {
      var _ret = _loop(i, len);

      if (_ret === "break") break;
    }

    if (isRemove && (!topEl || firstSel.tagName !== topEl.tagName || command !== topEl.tagName.toUpperCase()) && (!bottomEl || lastSel.tagName !== bottomEl.tagName || command !== bottomEl.tagName.toUpperCase())) {
      if (detach) {
        for (var _i = 0, _len = selectedFormats.length; _i < _len; _i++) {
          for (var j = _i - 1; j >= 0; j--) {
            if (selectedFormats[j].contains(selectedFormats[_i])) {
              selectedFormats.splice(_i, 1);
              _i--;
              _len--;
              break;
            }
          }
        }
      }

      var currentFormat = util.getRangeFormatElement(firstSel);
      var cancel = currentFormat && currentFormat.tagName === command;
      var rangeArr, tempList;

      var passComponent = function (current) {
        return !this.isComponent(current);
      }.bind(util);

      if (!cancel) {
        tempList = util.createElement(command);
      }

      for (var _i2 = 0, _len2 = selectedFormats.length, r, o; _i2 < _len2; _i2++) {
        o = util.getRangeFormatElement(selectedFormats[_i2], passComponent);

        if (!o || !util.isList(o)) {
          continue;
        }

        if (!r) {
          r = o;
          rangeArr = {
            r: r,
            f: [util.getParentElement(selectedFormats[_i2], "LI")]
          };
        } else {
          if (r !== o) {
            if (detach && util.isListCell(o.parentNode)) {
              this.plugins.list._detachNested.call(this, rangeArr.f);
            } else {
              this.detachRangeFormatElement(rangeArr.f[0].parentNode, rangeArr.f, tempList, false, true);
            }

            o = selectedFormats[_i2].parentNode;

            if (!cancel) {
              tempList = util.createElement(command);
            }

            r = o;
            rangeArr = {
              r: r,
              f: [util.getParentElement(selectedFormats[_i2], "LI")]
            };
          } else {
            rangeArr.f.push(util.getParentElement(selectedFormats[_i2], "LI"));
          }
        }

        if (_i2 === _len2 - 1) {
          if (detach && util.isListCell(o.parentNode)) {
            this.plugins.list._detachNested.call(this, rangeArr.f);
          } else {
            this.detachRangeFormatElement(rangeArr.f[0].parentNode, rangeArr.f, tempList, false, true);
          }
        }
      }
    } else {
      var topElParent = topEl ? topEl.parentNode : topEl;
      var bottomElParent = bottomEl ? bottomEl.parentNode : bottomEl;
      topEl = topElParent && !util.isWysiwygDiv(topElParent) && topElParent.nodeName === command ? topElParent : topEl;
      bottomEl = bottomElParent && !util.isWysiwygDiv(bottomElParent) && bottomElParent.nodeName === command ? bottomElParent : bottomEl;
      var mergeTop = topEl && topEl.tagName === command;
      var mergeBottom = bottomEl && bottomEl.tagName === command;
      var list = mergeTop ? topEl : util.createElement(command);
      var firstList = null;
      var lastList = null;
      var topNumber = null;
      var bottomNumber = null;

      var _passComponent = function (current) {
        return !this.isComponent(current) && !this.isList(current);
      }.bind(util);

      for (var _i3 = 0, _len3 = selectedFormats.length, newCell, fTag, isCell, next, originParent, nextParent, parentTag, siblingTag, rangeTag; _i3 < _len3; _i3++) {
        fTag = selectedFormats[_i3];

        if (fTag.childNodes.length === 0 && !util._isIgnoreNodeChange(fTag)) {
          util.removeItem(fTag);
          continue;
        }

        next = selectedFormats[_i3 + 1];
        originParent = fTag.parentNode;
        nextParent = next ? next.parentNode : null;
        isCell = util.isListCell(fTag);
        rangeTag = util.isRangeFormatElement(originParent) ? originParent : null;
        parentTag = isCell && !util.isWysiwygDiv(originParent) ? originParent.parentNode : originParent;
        siblingTag = isCell && !util.isWysiwygDiv(originParent) ? !next || util.isListCell(parentTag) ? originParent : originParent.nextSibling : fTag.nextSibling;
        newCell = util.createElement("LI");
        util.copyFormatAttributes(newCell, fTag);

        if (util.isComponent(fTag)) {
          var isHR = /^HR$/i.test(fTag.nodeName);

          if (!isHR) {
            newCell.innerHTML = "<br>";
          }

          newCell.innerHTML += fTag.outerHTML;

          if (isHR) {
            newCell.innerHTML += "<br>";
          }
        } else {
          var fChildren = fTag.childNodes;

          while (fChildren[0]) {
            newCell.appendChild(fChildren[0]);
          }
        }

        list.appendChild(newCell);

        if (!next) {
          lastList = list;
        }

        if (!next || parentTag !== nextParent || util.isRangeFormatElement(siblingTag)) {
          if (!firstList) {
            firstList = list;
          }

          if ((!mergeTop || !next || parentTag !== nextParent) && !(next && util.isList(nextParent) && nextParent === originParent)) {
            if (list.parentNode !== parentTag) {
              parentTag.insertBefore(list, siblingTag);
            }
          }
        }

        util.removeItem(fTag);

        if (mergeTop && topNumber === null) {
          topNumber = list.children.length - 1;
        }

        if (next && (util.getRangeFormatElement(nextParent, _passComponent) !== util.getRangeFormatElement(originParent, _passComponent) || util.isList(nextParent) && util.isList(originParent) && util.getElementDepth(nextParent) !== util.getElementDepth(originParent))) {
          list = util.createElement(command);
        }

        if (rangeTag && rangeTag.children.length === 0) {
          util.removeItem(rangeTag);
        }
      }

      if (topNumber) {
        firstList = firstList.children[topNumber];
      }

      if (mergeBottom) {
        bottomNumber = list.children.length - 1;
        list.innerHTML += bottomEl.innerHTML;
        lastList = list.children[bottomNumber];
        util.removeItem(bottomEl);
      }
    }

    this.effectNode = null;
    return originRange;
  },
  _detachNested: function _detachNested(cells) {
    var first = cells[0];
    var last = cells[cells.length - 1];
    var next = last.nextElementSibling;
    var originList = first.parentNode;
    var sibling = originList.parentNode.nextElementSibling;
    var parentNode = originList.parentNode.parentNode;

    for (var c = 0, cLen = cells.length; c < cLen; c++) {
      parentNode.insertBefore(cells[c], sibling);
    }

    if (next && originList.children.length > 0) {
      var newList = originList.cloneNode(false);
      var children = originList.childNodes;
      var index = this.util.getPositionIndex(next);

      while (children[index]) {
        newList.appendChild(children[index]);
      }

      last.appendChild(newList);
    }

    if (originList.children.length === 0) {
      this.util.removeItem(originList);
    }

    this.util.mergeSameTags(parentNode);
    var edge = this.util.getEdgeChildNodes(first, last);
    return {
      cc: first.parentNode,
      sc: edge.sc,
      ec: edge.ec
    };
  },
  editInsideList: function editInsideList(remove, selectedCells) {
    selectedCells = !selectedCells ? this.getSelectedElements().filter(function (el) {
      return this.isListCell(el);
    }.bind(this.util)) : selectedCells;
    var cellsLen = selectedCells.length;

    if (cellsLen === 0 || !remove && !this.util.isListCell(selectedCells[0].previousElementSibling) && !this.util.isListCell(selectedCells[cellsLen - 1].nextElementSibling)) {
      return {
        sc: selectedCells[0],
        so: 0,
        ec: selectedCells[cellsLen - 1],
        eo: 1
      };
    }

    var originList = selectedCells[0].parentNode;
    var lastCell = selectedCells[cellsLen - 1];
    var range = null;

    if (remove) {
      if (originList !== lastCell.parentNode && this.util.isList(lastCell.parentNode.parentNode) && lastCell.nextElementSibling) {
        lastCell = lastCell.nextElementSibling;

        while (lastCell) {
          selectedCells.push(lastCell);
          lastCell = lastCell.nextElementSibling;
        }
      }

      range = this.plugins.list.editList.call(this, originList.nodeName.toUpperCase(), selectedCells, true);
    } else {
      var innerList = this.util.createElement(originList.nodeName);
      var prev = selectedCells[0].previousElementSibling;
      var next = lastCell.nextElementSibling;
      var nodePath = {
        s: null,
        e: null,
        sl: originList,
        el: originList
      };

      for (var i = 0, len = cellsLen, c; i < len; i++) {
        c = selectedCells[i];

        if (c.parentNode !== originList) {
          this.plugins.list._insiedList.call(this, originList, innerList, prev, next, nodePath);

          originList = c.parentNode;
          innerList = this.util.createElement(originList.nodeName);
        }

        prev = c.previousElementSibling;
        next = c.nextElementSibling;
        innerList.appendChild(c);
      }

      this.plugins.list._insiedList.call(this, originList, innerList, prev, next, nodePath);

      var sc = this.util.getNodeFromPath(nodePath.s, nodePath.sl);
      var ec = this.util.getNodeFromPath(nodePath.e, nodePath.el);
      range = {
        sc: sc,
        so: 0,
        ec: ec,
        eo: ec.textContent.length
      };
    }

    return range;
  },
  _insiedList: function _insiedList(originList, innerList, prev, next, nodePath) {
    var insertPrev = false;

    if (prev && innerList.tagName === prev.tagName) {
      var children = innerList.children;

      while (children[0]) {
        prev.appendChild(children[0]);
      }

      innerList = prev;
      insertPrev = true;
    }

    if (next && innerList.tagName === next.tagName) {
      var _children = next.children;

      while (_children[0]) {
        innerList.appendChild(_children[0]);
      }

      var temp = next.nextElementSibling;
      next.parentNode.removeChild(next);
      next = temp;
    }

    if (!insertPrev) {
      if (this.util.isListCell(prev)) {
        originList = prev;
        next = null;
      }

      originList.insertBefore(innerList, next);

      if (!nodePath.s) {
        nodePath.s = this.util.getNodePath(innerList.firstElementChild.firstChild, originList, null);
        nodePath.sl = originList;
      }

      var slPath = originList.contains(nodePath.sl) ? this.util.getNodePath(nodePath.sl, originList) : null;
      nodePath.e = this.util.getNodePath(innerList.lastElementChild.firstChild, originList, null);
      nodePath.el = originList;
      this.util.mergeSameTags(originList, [nodePath.s, nodePath.e, slPath], false);
      this.util.mergeNestedTags(originList);

      if (slPath) {
        nodePath.sl = this.util.getNodeFromPath(slPath, originList);
      }
    }

    return innerList;
  },
  pickup: function pickup(e) {
    e.preventDefault();
    e.stopPropagation();
    var target = e.target;
    var command = "";

    while (!command && !/^UL$/i.test(target.tagName)) {
      command = target.getAttribute("data-command");
      target = target.parentNode;
    }

    if (!command) {
      return;
    }

    var range = this.plugins.list.editList.call(this, command, null, false);

    if (range) {
      this.setRange(range.sc, range.so, range.ec, range.eo);
    }

    this.submenuOff(); // history stack

    this.history.push(false);
  }
};
exports.default = _default;