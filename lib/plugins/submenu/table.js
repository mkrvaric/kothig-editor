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
  name: "table",
  display: "submenu",
  add: function add(core, targetElement) {
    var context = core.context;
    context.table = {
      _element: null,
      _tdElement: null,
      _trElement: null,
      _trElements: null,
      _tableXY: [],
      _maxWidth: true,
      _fixedColumn: false,
      cellControllerTop: context.options.tableCellControllerPosition === "top",
      resizeText: null,
      headerButton: null,
      mergeButton: null,
      splitButton: null,
      splitMenu: null,
      maxText: core.lang.controller.maxSize,
      minText: core.lang.controller.minSize,
      _physical_cellCnt: 0,
      _logical_cellCnt: 0,
      _rowCnt: 0,
      _rowIndex: 0,
      _physical_cellIndex: 0,
      _logical_cellIndex: 0,
      _current_colSpan: 0,
      _current_rowSpan: 0,
      icons: {
        expansion: core.icons.expansion,
        reduction: core.icons.reduction
      }
    };
    /** set submenu */

    var listDiv = this.setSubmenu.call(core);
    var tablePicker = listDiv.querySelector(".ke-controller-table-picker");
    context.table.tableHighlight = listDiv.querySelector(".ke-table-size-highlighted");
    context.table.tableUnHighlight = listDiv.querySelector(".ke-table-size-unhighlighted");
    context.table.tableDisplay = listDiv.querySelector(".ke-table-size-display");
    /** set table controller */

    var tableController = this.setController_table.call(core);
    context.table.tableController = tableController;
    context.table.resizeButton = tableController.querySelector("._ke_table_resize");
    context.table.resizeText = tableController.querySelector("._ke_table_resize > span > span");
    context.table.columnFixedButton = tableController.querySelector("._ke_table_fixed_column");
    context.table.headerButton = tableController.querySelector("._ke_table_header");
    tableController.addEventListener("mousedown", core.eventStop);
    /** set resizing */

    var resizeDiv = this.setController_tableEditor.call(core, context.table.cellControllerTop);
    context.table.resizeDiv = resizeDiv;
    context.table.splitMenu = resizeDiv.querySelector(".ke-btn-group-sub");
    context.table.mergeButton = resizeDiv.querySelector("._ke_table_merge_button");
    context.table.splitButton = resizeDiv.querySelector("._ke_table_split_button");
    context.table.insertRowAboveButton = resizeDiv.querySelector("._ke_table_insert_row_a");
    context.table.insertRowBelowButton = resizeDiv.querySelector("._ke_table_insert_row_b");
    resizeDiv.addEventListener("mousedown", core.eventStop);
    /** add event listeners */

    tablePicker.addEventListener("mousemove", this.onMouseMove_tablePicker.bind(core));
    tablePicker.addEventListener("click", this.appendTable.bind(core));
    resizeDiv.addEventListener("click", this.onClick_tableController.bind(core));
    tableController.addEventListener("click", this.onClick_tableController.bind(core));
    /** append target button menu */

    core.initMenuTarget(this.name, targetElement, listDiv);
    /** append controller */

    context.element.relative.appendChild(resizeDiv);
    context.element.relative.appendChild(tableController);
    /** empty memory */

    listDiv = null, tablePicker = null, resizeDiv = null, tableController = null;
  },
  setSubmenu: function setSubmenu() {
    var listDiv = this.util.createElement("DIV");
    listDiv.className = "ke-submenu ke-selector-table";
    listDiv.innerHTML = "\n      <div class=\"ke-table-size\">\n        <div class=\"ke-table-size-picker ke-controller-table-picker\"></div>\n        <div class=\"ke-table-size-highlighted\"></div>\n        <div class=\"ke-table-size-unhighlighted\"></div>\n      </div>\n      <div class=\"ke-table-size-display\">1 x 1</div>";
    return listDiv;
  },
  setController_table: function setController_table() {
    var lang = this.lang;
    var icons = this.icons;
    var tableResize = this.util.createElement("DIV");
    tableResize.className = "ke-controller ke-controller-table";
    tableResize.innerHTML = "\n      <div>\n        <div class=\"ke-btn-group\">\n          <button type=\"button\" data-command=\"resize\" class=\"ke-btn ke-tooltip _ke_table_resize\">\n            ".concat(icons.expansion, "\n            <span class=\"ke-tooltip-inner\">\n              <span class=\"ke-tooltip-text\">\n                ").concat(lang.controller.maxSize, "\n              </span>\n            </span>\n          </button>\n          <button type=\"button\" data-command=\"layout\" class=\"ke-btn ke-tooltip _ke_table_fixed_column\">\n            ").concat(icons.fixed_column_width, "\n            <span class=\"ke-tooltip-inner\">\n              <span class=\"ke-tooltip-text\">\n                ").concat(lang.controller.fixedColumnWidth, "\n              </span>\n            </span>\n          </button>\n          <button type=\"button\" data-command=\"header\" class=\"ke-btn ke-tooltip _ke_table_header\">\n            ").concat(icons.table_header, "\n            <span class=\"ke-tooltip-inner\">\n              <span class=\"ke-tooltip-text\">\n                ").concat(lang.controller.tableHeader, "\n              </span>\n            </span>\n          </button>\n          <button type=\"button\" data-command=\"remove\" class=\"ke-btn ke-tooltip\">\n            ").concat(icons.delete, "\n            <span class=\"ke-tooltip-inner\">\n              <span class=\"ke-tooltip-text\">\n                ").concat(lang.controller.remove, "\n              </span>\n            </span>\n          </button>\n        </div>\n      </div>");
    return tableResize;
  },
  setController_tableEditor: function setController_tableEditor(cellControllerTop) {
    var lang = this.lang;
    var icons = this.icons;
    var tableResize = this.util.createElement("DIV");
    tableResize.className = "ke-controller ke-controller-table-cell";
    tableResize.innerHTML = (cellControllerTop ? "" : '<div class="ke-arrow ke-arrow-up"></div>') + '<div class="ke-btn-group">' + '<button type="button" data-command="insert" data-value="row" data-option="up" class="ke-btn ke-tooltip _ke_table_insert_row_a">' + icons.insert_row_above + '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' + lang.controller.insertRowAbove + "</span></span>" + "</button>" + '<button type="button" data-command="insert" data-value="row" data-option="down" class="ke-btn ke-tooltip _ke_table_insert_row_b">' + icons.insert_row_below + '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' + lang.controller.insertRowBelow + "</span></span>" + "</button>" + '<button type="button" data-command="delete" data-value="row" class="ke-btn ke-tooltip">' + icons.delete_row + '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' + lang.controller.deleteRow + "</span></span>" + "</button>" + '<button type="button" data-command="merge" class="_ke_table_merge_button ke-btn ke-tooltip" disabled>' + icons.merge_cell + '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' + lang.controller.mergeCells + "</span></span>" + "</button>" + "</div>" + '<div class="ke-btn-group" style="padding-top: 0;">' + '<button type="button" data-command="insert" data-value="cell" data-option="left" class="ke-btn ke-tooltip">' + icons.insert_column_left + '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' + lang.controller.insertColumnBefore + "</span></span>" + "</button>" + '<button type="button" data-command="insert" data-value="cell" data-option="right" class="ke-btn ke-tooltip">' + icons.insert_column_right + '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' + lang.controller.insertColumnAfter + "</span></span>" + "</button>" + '<button type="button" data-command="delete" data-value="cell" class="ke-btn ke-tooltip">' + icons.delete_column + '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' + lang.controller.deleteColumn + "</span></span>" + "</button>" + '<button type="button" data-command="onsplit" class="_ke_table_split_button ke-btn ke-tooltip">' + icons.split_cell + '<span class="ke-tooltip-inner"><span class="ke-tooltip-text">' + lang.controller.splitCells + "</span></span>" + "</button>" + '<div class="ke-btn-group-sub kothing-editor-common ke-list-layer">' + '<div class="ke-list-inner">' + '<ul class="ke-list-basic">' + '<li class="ke-btn-list" data-command="split" data-value="vertical" style="line-height:32px;" title="' + lang.controller.VerticalSplit + '">' + lang.controller.VerticalSplit + "</li>" + '<li class="ke-btn-list" data-command="split" data-value="horizontal" style="line-height:32px;" title="' + lang.controller.HorizontalSplit + '">' + lang.controller.HorizontalSplit + "</li>" + "</ul>" + "</div>" + "</div>" + "</div>";
    return tableResize;
  },
  appendTable: function appendTable() {
    var oTable = this.util.createElement("TABLE");
    var createCells = this.plugins.table.createCells;
    var x = this.context.table._tableXY[0];
    var y = this.context.table._tableXY[1];
    var tableHTML = "<tbody>";

    while (y > 0) {
      tableHTML += "<tr>" + createCells.call(this, "td", x) + "</tr>";
      --y;
    }

    tableHTML += "</tbody>";
    oTable.innerHTML = tableHTML;
    var changed = this.insertComponent(oTable, false, true, false);

    if (changed) {
      var firstTd = oTable.querySelector("td div");
      this.setRange(firstTd, 0, firstTd, 0);
      this.plugins.table.reset_table_picker.call(this);
    }
  },
  createCells: function createCells(nodeName, cnt, returnElement) {
    nodeName = nodeName.toLowerCase();

    if (!returnElement) {
      var cellsHTML = "";

      while (cnt > 0) {
        cellsHTML += "<" + nodeName + "><div><br></div></" + nodeName + ">";
        cnt--;
      }

      return cellsHTML;
    } else {
      var cell = this.util.createElement(nodeName);
      cell.innerHTML = "<div><br></div>";
      return cell;
    }
  },
  onMouseMove_tablePicker: function onMouseMove_tablePicker(e) {
    e.stopPropagation();

    var x = this._w.Math.ceil(e.offsetX / 18);

    var y = this._w.Math.ceil(e.offsetY / 18);

    x = x < 1 ? 1 : x;
    y = y < 1 ? 1 : y;
    this.context.table.tableHighlight.style.width = x + "em";
    this.context.table.tableHighlight.style.height = y + "em";
    var x_u = 10; // x < 5 ? 5 : (x > 9 ? 10 : x + 1);

    var y_u = 10; //y < 5 ? 5 : (y > 9 ? 10 : y + 1);

    this.context.table.tableUnHighlight.style.width = x_u + "em";
    this.context.table.tableUnHighlight.style.height = y_u + "em";
    this.util.changeTxt(this.context.table.tableDisplay, x + " x " + y);
    this.context.table._tableXY = [x, y];
  },
  reset_table_picker: function reset_table_picker() {
    if (!this.context.table.tableHighlight) {
      return;
    }

    var highlight = this.context.table.tableHighlight.style;
    var unHighlight = this.context.table.tableUnHighlight.style;
    highlight.width = "1em";
    highlight.height = "1em";
    unHighlight.width = "10em";
    unHighlight.height = "10em";
    this.util.changeTxt(this.context.table.tableDisplay, "1 x 1");
    this.submenuOff();
  },
  init: function init() {
    var contextTable = this.context.table;
    var tablePlugin = this.plugins.table;

    tablePlugin._removeEvents.call(this);

    if (tablePlugin._selectedTable) {
      var selectedCells = tablePlugin._selectedTable.querySelectorAll(".ke-table-selected-cell");

      for (var i = 0, len = selectedCells.length; i < len; i++) {
        this.util.removeClass(selectedCells[i], "ke-table-selected-cell");
      }
    }

    tablePlugin._toggleEditor.call(this, true);

    contextTable._element = null;
    contextTable._tdElement = null;
    contextTable._trElement = null;
    contextTable._trElements = null;
    contextTable._tableXY = [];
    contextTable._maxWidth = true;
    contextTable._fixedColumn = false;
    contextTable._physical_cellCnt = 0;
    contextTable._logical_cellCnt = 0;
    contextTable._rowCnt = 0;
    contextTable._rowIndex = 0;
    contextTable._physical_cellIndex = 0;
    contextTable._logical_cellIndex = 0;
    contextTable._current_colSpan = 0;
    contextTable._current_rowSpan = 0;
    tablePlugin._shift = false;
    tablePlugin._selectedCells = null;
    tablePlugin._selectedTable = null;
    tablePlugin._ref = null;
    tablePlugin._fixedCell = null;
    tablePlugin._selectedCell = null;
    tablePlugin._fixedCellName = null;
  },

  /** table edit controller */
  call_controller_tableEdit: function call_controller_tableEdit(tdElement) {
    var tablePlugin = this.plugins.table;
    var contextTable = this.context.table;

    if (!this.getSelection().isCollapsed && !tablePlugin._selectedCell) {
      this.controllersOff();
      this.util.removeClass(tdElement, "ke-table-selected-cell");
      return;
    }

    var tableElement = contextTable._element || this.plugins.table._selectedTable || this.util.getParentElement(tdElement, "TABLE");
    tablePlugin.setPositionControllerTop.call(this, tableElement);
    contextTable._maxWidth = this.util.hasClass(tableElement, "ke-table-size-100") || tableElement.style.width === "100%" || !tableElement.style.width && !this.util.hasClass(tableElement, "ke-table-size-auto");
    contextTable._fixedColumn = this.util.hasClass(tableElement, "ke-table-layout-fixed") || tableElement.style.tableLayout === "fixed";
    tablePlugin.setTableStyle.call(this, contextTable._maxWidth ? "width|column" : "width");
    tablePlugin.setPositionControllerDiv.call(this, tdElement, tablePlugin._shift);

    if (!tablePlugin._shift) {
      this.controllersOn(contextTable.resizeDiv, contextTable.tableController, tablePlugin.init.bind(this), tdElement, "table");
    }
  },
  setPositionControllerTop: function setPositionControllerTop(tableElement) {
    var tableController = this.context.table.tableController;
    var offset = this.util.getOffset(tableElement, this.context.element.wysiwygFrame);
    tableController.style.left = offset.left + "px";
    tableController.style.display = "block";
    tableController.style.top = offset.top - tableController.offsetHeight - 2 + "px";
  },
  setPositionControllerDiv: function setPositionControllerDiv(tdElement, reset) {
    var contextTable = this.context.table;
    var resizeDiv = contextTable.resizeDiv;
    this.plugins.table.setCellInfo.call(this, tdElement, reset);
    resizeDiv.style.visibility = "hidden";
    resizeDiv.style.display = "block";

    if (contextTable.cellControllerTop) {
      var offset = this.util.getOffset(contextTable._element, this.context.element.wysiwygFrame);
      resizeDiv.style.top = offset.top - resizeDiv.offsetHeight - 2 + "px";
      resizeDiv.style.left = offset.left + contextTable.tableController.offsetWidth + "px";
    } else {
      var _offset = this.util.getOffset(tdElement, this.context.element.wysiwygFrame);

      resizeDiv.style.left = _offset.left - this.context.element.wysiwygFrame.scrollLeft + "px";
      resizeDiv.style.top = _offset.top + tdElement.offsetHeight + 12 + "px";
      var overLeft = this.context.element.wysiwygFrame.offsetWidth - (resizeDiv.offsetLeft + resizeDiv.offsetWidth);

      if (overLeft < 0) {
        resizeDiv.style.left = resizeDiv.offsetLeft + overLeft + "px";
        resizeDiv.firstElementChild.style.left = 20 - overLeft + "px";
      } else {
        resizeDiv.firstElementChild.style.left = "20px";
      }
    }

    resizeDiv.style.visibility = "";
  },
  setCellInfo: function setCellInfo(tdElement, reset) {
    var contextTable = this.context.table;
    var table = contextTable._element = this.plugins.table._selectedTable || this.util.getParentElement(tdElement, "TABLE");

    if (/THEAD/i.test(table.firstElementChild.nodeName)) {
      this.util.addClass(contextTable.headerButton, "active");
    } else {
      this.util.removeClass(contextTable.headerButton, "active");
    }

    if (reset || contextTable._physical_cellCnt === 0) {
      if (contextTable._tdElement !== tdElement) {
        contextTable._tdElement = tdElement;
        contextTable._trElement = tdElement.parentNode;
      }

      var rows = table.rows;
      contextTable._trElements = table.rows;
      var cellIndex = tdElement.cellIndex;
      var cellCnt = 0;

      for (var i = 0, cells = rows[0].cells, len = rows[0].cells.length; i < len; i++) {
        cellCnt += cells[i].colSpan;
      } // row cnt, row index


      var rowIndex = contextTable._rowIndex = contextTable._trElement.rowIndex;
      contextTable._rowCnt = rows.length; // cell cnt, physical cell index

      contextTable._physical_cellCnt = contextTable._trElement.cells.length;
      contextTable._logical_cellCnt = cellCnt;
      contextTable._physical_cellIndex = cellIndex; // span

      contextTable._current_colSpan = contextTable._tdElement.colSpan - 1;
      contextTable._current_rowSpan - contextTable._trElement.cells[cellIndex].rowSpan - 1; // find logcal cell index

      var rowSpanArr = [];
      var spanIndex = [];

      for (var _i = 0, _cells, colSpan; _i <= rowIndex; _i++) {
        _cells = rows[_i].cells;
        colSpan = 0;

        for (var c = 0, cLen = _cells.length, cell, cs, rs, logcalIndex; c < cLen; c++) {
          cell = _cells[c];
          cs = cell.colSpan - 1;
          rs = cell.rowSpan - 1;
          logcalIndex = c + colSpan;

          if (spanIndex.length > 0) {
            for (var r = 0, arr; r < spanIndex.length; r++) {
              arr = spanIndex[r];

              if (arr.row > _i) {
                continue;
              }

              if (logcalIndex >= arr.index) {
                colSpan += arr.cs;
                logcalIndex += arr.cs;
                arr.rs -= 1;
                arr.row = _i + 1;

                if (arr.rs < 1) {
                  spanIndex.splice(r, 1);
                  r--;
                }
              } else if (c === cLen - 1) {
                arr.rs -= 1;
                arr.row = _i + 1;

                if (arr.rs < 1) {
                  spanIndex.splice(r, 1);
                  r--;
                }
              }
            }
          } // logcal cell index


          if (_i === rowIndex && c === cellIndex) {
            contextTable._logical_cellIndex = logcalIndex;
            break;
          }

          if (rs > 0) {
            rowSpanArr.push({
              index: logcalIndex,
              cs: cs + 1,
              rs: rs,
              row: -1
            });
          }

          colSpan += cs;
        }

        spanIndex = spanIndex.concat(rowSpanArr).sort(function (a, b) {
          return a.index - b.index;
        });
        rowSpanArr = [];
      }

      rowSpanArr = null;
      spanIndex = null;
    }
  },
  editTable: function editTable(type, option) {
    var tablePlugin = this.plugins.table;
    var contextTable = this.context.table;
    var table = contextTable._element;
    var isRow = type === "row";

    if (isRow) {
      var tableAttr = contextTable._trElement.parentNode;

      if (/^THEAD$/i.test(tableAttr.nodeName)) {
        if (option === "up") {
          return;
        } else if (!tableAttr.nextElementSibling || !/^TBODY$/i.test(tableAttr.nextElementSibling.nodeName)) {
          table.innerHTML += "<tbody><tr>" + tablePlugin.createCells.call(this, "td", contextTable._logical_cellCnt, false) + "</tr></tbody>";
          return;
        }
      }
    } // multi


    if (tablePlugin._ref) {
      var positionCell = contextTable._tdElement;
      var selectedCells = tablePlugin._selectedCells; // multi - row

      if (isRow) {
        // remove row
        if (!option) {
          var row = selectedCells[0].parentNode;
          var removeCells = [selectedCells[0]];

          for (var i = 1, len = selectedCells.length, cell; i < len; i++) {
            cell = selectedCells[i];

            if (row !== cell.parentNode) {
              removeCells.push(cell);
              row = cell.parentNode;
            }
          }

          for (var _i2 = 0, _len = removeCells.length; _i2 < _len; _i2++) {
            tablePlugin.setCellInfo.call(this, removeCells[_i2], true);
            tablePlugin.editRow.call(this, option);
          }
        } else {
          // edit row
          tablePlugin.setCellInfo.call(this, option === "up" ? selectedCells[0] : selectedCells[selectedCells.length - 1], true);
          tablePlugin.editRow.call(this, option, positionCell);
        }
      } else {
        // multi - cell
        var firstRow = selectedCells[0].parentNode; // remove cell

        if (!option) {
          var _removeCells = [selectedCells[0]];

          for (var _i3 = 1, _len2 = selectedCells.length, _cell; _i3 < _len2; _i3++) {
            _cell = selectedCells[_i3];

            if (firstRow === _cell.parentNode) {
              _removeCells.push(_cell);
            } else {
              break;
            }
          }

          for (var _i4 = 0, _len3 = _removeCells.length; _i4 < _len3; _i4++) {
            tablePlugin.setCellInfo.call(this, _removeCells[_i4], true);
            tablePlugin.editCell.call(this, option);
          }
        } else {
          // edit cell
          var rightCell = null;

          for (var _i5 = 0, _len4 = selectedCells.length - 1; _i5 < _len4; _i5++) {
            if (firstRow !== selectedCells[_i5 + 1].parentNode) {
              rightCell = selectedCells[_i5];
              break;
            }
          }

          tablePlugin.setCellInfo.call(this, option === "left" ? selectedCells[0] : rightCell || selectedCells[0], true);
          tablePlugin.editCell.call(this, option, positionCell);
        }
      }

      if (!option) {
        tablePlugin.init.call(this);
      }
    } else {
      tablePlugin[isRow ? "editRow" : "editCell"].call(this, option);
    } // after remove


    if (!option) {
      var children = table.children;

      for (var _i6 = 0; _i6 < children.length; _i6++) {
        if (children[_i6].children.length === 0) {
          this.util.removeItem(children[_i6]);
          _i6--;
        }
      }

      if (table.children.length === 0) {
        this.util.removeItem(table);
      }
    }
  },
  editRow: function editRow(option, positionResetElement) {
    var contextTable = this.context.table;
    var remove = !option;
    var up = option === "up";
    var originRowIndex = contextTable._rowIndex;
    var rowIndex = remove || up ? originRowIndex : originRowIndex + contextTable._current_rowSpan + 1;
    var sign = remove ? -1 : 1;
    var rows = contextTable._trElements;
    var cellCnt = contextTable._logical_cellCnt;

    for (var i = 0, len = originRowIndex + (remove ? -1 : 0), cell; i <= len; i++) {
      cell = rows[i].cells;

      if (cell.length === 0) {
        return;
      }

      for (var c = 0, cLen = cell.length, rs, cs; c < cLen; c++) {
        rs = cell[c].rowSpan;
        cs = cell[c].colSpan;

        if (rs < 2 && cs < 2) {
          continue;
        }

        if (rs + i > rowIndex && rowIndex > i) {
          cell[c].rowSpan = rs + sign;
          cellCnt -= cs;
        }
      }
    }

    if (remove) {
      var next = rows[originRowIndex + 1];

      if (next) {
        var spanCells = [];
        var cells = rows[originRowIndex].cells;
        var colSpan = 0;

        for (var _i7 = 0, _len5 = cells.length, _cell2, logcalIndex; _i7 < _len5; _i7++) {
          _cell2 = cells[_i7];
          logcalIndex = _i7 + colSpan;
          colSpan += _cell2.colSpan - 1;

          if (_cell2.rowSpan > 1) {
            _cell2.rowSpan -= 1;
            spanCells.push({
              cell: _cell2.cloneNode(false),
              index: logcalIndex
            });
          }
        }

        if (spanCells.length > 0) {
          var spanCell = spanCells.shift();
          cells = next.cells;
          colSpan = 0;

          for (var _i8 = 0, _len6 = cells.length, _cell3, _logcalIndex; _i8 < _len6; _i8++) {
            _cell3 = cells[_i8];
            _logcalIndex = _i8 + colSpan;
            colSpan += _cell3.colSpan - 1;

            if (_logcalIndex >= spanCell.index) {
              _i8--, colSpan--;
              colSpan += spanCell.cell.colSpan - 1;
              next.insertBefore(spanCell.cell, _cell3);
              spanCell = spanCells.shift();

              if (!spanCell) {
                break;
              }
            }
          }

          if (spanCell) {
            next.appendChild(spanCell.cell);

            for (var _i9 = 0, _len7 = spanCells.length; _i9 < _len7; _i9++) {
              next.appendChild(spanCells[_i9].cell);
            }
          }
        }
      }

      contextTable._element.deleteRow(rowIndex);
    } else {
      var newRow = contextTable._element.insertRow(rowIndex);

      newRow.innerHTML = this.plugins.table.createCells.call(this, "td", cellCnt, false);
    }

    if (!remove) {
      this.plugins.table.setPositionControllerDiv.call(this, positionResetElement || contextTable._tdElement, true);
    } else {
      this.controllersOff();
    }
  },
  editCell: function editCell(option, positionResetElement) {
    var contextTable = this.context.table;
    var util = this.util;
    var remove = !option;
    var left = option === "left";
    var colSpan = contextTable._current_colSpan;
    var cellIndex = remove || left ? contextTable._logical_cellIndex : contextTable._logical_cellIndex + colSpan + 1;
    var rows = contextTable._trElements;
    var rowSpanArr = [];
    var spanIndex = [];
    var passCell = 0;
    var removeCell = [];
    var removeSpanArr = [];

    for (var i = 0, len = contextTable._rowCnt, row, insertIndex, cells, newCell, applySpan, cellColSpan; i < len; i++) {
      row = rows[i];
      insertIndex = cellIndex;
      applySpan = false;
      cells = row.cells;
      cellColSpan = 0;

      for (var c = 0, cell, cLen = cells.length, rs, cs, removeIndex; c < cLen; c++) {
        cell = cells[c];

        if (!cell) {
          break;
        }

        rs = cell.rowSpan - 1;
        cs = cell.colSpan - 1;

        if (!remove) {
          if (c >= insertIndex) {
            break;
          }

          if (cs > 0) {
            if (passCell < 1 && cs + c >= insertIndex) {
              cell.colSpan += 1;
              insertIndex = null;
              passCell = rs + 1;
              break;
            }

            insertIndex -= cs;
          }

          if (!applySpan) {
            for (var r = 0, arr; r < spanIndex.length; r++) {
              arr = spanIndex[r];
              insertIndex -= arr.cs;
              arr.rs -= 1;

              if (arr.rs < 1) {
                spanIndex.splice(r, 1);
                r--;
              }
            }

            applySpan = true;
          }
        } else {
          removeIndex = c + cellColSpan;

          if (spanIndex.length > 0) {
            var lastCell = !cells[c + 1];

            for (var _r = 0, _arr; _r < spanIndex.length; _r++) {
              _arr = spanIndex[_r];

              if (_arr.row > i) {
                continue;
              }

              if (removeIndex >= _arr.index) {
                cellColSpan += _arr.cs;
                removeIndex = c + cellColSpan;
                _arr.rs -= 1;
                _arr.row = i + 1;

                if (_arr.rs < 1) {
                  spanIndex.splice(_r, 1);
                  _r--;
                }
              } else if (lastCell) {
                _arr.rs -= 1;
                _arr.row = i + 1;

                if (_arr.rs < 1) {
                  spanIndex.splice(_r, 1);
                  _r--;
                }
              }
            }
          }

          if (rs > 0) {
            rowSpanArr.push({
              rs: rs,
              cs: cs + 1,
              index: removeIndex,
              row: -1
            });
          }

          if (removeIndex >= insertIndex && removeIndex + cs <= insertIndex + colSpan) {
            removeCell.push(cell);
          } else if (removeIndex <= insertIndex + colSpan && removeIndex + cs >= insertIndex) {
            cell.colSpan -= util.getOverlapRangeAtIndex(cellIndex, cellIndex + colSpan, removeIndex, removeIndex + cs);
          } else if (rs > 0 && (removeIndex < insertIndex || removeIndex + cs > insertIndex + colSpan)) {
            removeSpanArr.push({
              cell: cell,
              i: i,
              rs: i + rs
            });
          }

          cellColSpan += cs;
        }
      }

      spanIndex = spanIndex.concat(rowSpanArr).sort(function (a, b) {
        return a.index - b.index;
      });
      rowSpanArr = [];

      if (!remove) {
        if (passCell > 0) {
          passCell -= 1;
          continue;
        }

        if (insertIndex !== null && cells.length > 0) {
          newCell = this.plugins.table.createCells.call(this, cells[0].nodeName, 0, true);
          newCell = row.insertBefore(newCell, cells[insertIndex]);
        }
      }
    }

    if (remove) {
      var removeFirst, removeEnd;

      for (var _r2 = 0, rLen = removeCell.length, _row; _r2 < rLen; _r2++) {
        _row = removeCell[_r2].parentNode;
        util.removeItem(removeCell[_r2]);

        if (_row.cells.length === 0) {
          if (!removeFirst) {
            removeFirst = util.getArrayIndex(rows, _row);
          }

          removeEnd = util.getArrayIndex(rows, _row);
          util.removeItem(_row);
        }
      }

      for (var _c = 0, _cLen = removeSpanArr.length, rowSpanCell; _c < _cLen; _c++) {
        rowSpanCell = removeSpanArr[_c];
        rowSpanCell.cell.rowSpan = util.getOverlapRangeAtIndex(removeFirst, removeEnd, rowSpanCell.i, rowSpanCell.rs);
      }

      this.controllersOff();
    } else {
      this.plugins.table.setPositionControllerDiv.call(this, positionResetElement || contextTable._tdElement, true);
    }
  },
  _closeSplitMenu: null,
  openSplitMenu: function openSplitMenu() {
    this.util.addClass(this.context.table.splitButton, "on");
    this.context.table.splitMenu.style.display = "inline-table";

    this.plugins.table._closeSplitMenu = function () {
      this.util.removeClass(this.context.table.splitButton, "on");
      this.context.table.splitMenu.style.display = "none";
      this.removeDocEvent("mousedown", this.plugins.table._closeSplitMenu);
      this.plugins.table._closeSplitMenu = null;
    }.bind(this);

    this.addDocEvent("mousedown", this.plugins.table._closeSplitMenu);
  },
  splitCells: function splitCells(direction) {
    var util = this.util;
    var vertical = direction === "vertical";
    var contextTable = this.context.table;
    var currentCell = contextTable._tdElement;
    var rows = contextTable._trElements;
    var currentRow = contextTable._trElement;
    var index = contextTable._logical_cellIndex;
    var rowIndex = contextTable._rowIndex;
    var newCell = this.plugins.table.createCells.call(this, currentCell.nodeName, 0, true); // vertical

    if (vertical) {
      var currentColSpan = currentCell.colSpan;
      newCell.rowSpan = currentCell.rowSpan; // colspan > 1

      if (currentColSpan > 1) {
        newCell.colSpan = this._w.Math.floor(currentColSpan / 2);
        currentCell.colSpan = currentColSpan - newCell.colSpan;
        currentRow.insertBefore(newCell, currentCell.nextElementSibling);
      } else {
        // colspan - 1
        var rowSpanArr = [];
        var spanIndex = [];

        for (var i = 0, len = contextTable._rowCnt, cells, colSpan; i < len; i++) {
          cells = rows[i].cells;
          colSpan = 0;

          for (var c = 0, cLen = cells.length, cell, cs, rs, logcalIndex; c < cLen; c++) {
            cell = cells[c];
            cs = cell.colSpan - 1;
            rs = cell.rowSpan - 1;
            logcalIndex = c + colSpan;

            if (spanIndex.length > 0) {
              for (var r = 0, arr; r < spanIndex.length; r++) {
                arr = spanIndex[r];

                if (arr.row > i) {
                  continue;
                }

                if (logcalIndex >= arr.index) {
                  colSpan += arr.cs;
                  logcalIndex += arr.cs;
                  arr.rs -= 1;
                  arr.row = i + 1;

                  if (arr.rs < 1) {
                    spanIndex.splice(r, 1);
                    r--;
                  }
                } else if (c === cLen - 1) {
                  arr.rs -= 1;
                  arr.row = i + 1;

                  if (arr.rs < 1) {
                    spanIndex.splice(r, 1);
                    r--;
                  }
                }
              }
            }

            if (logcalIndex <= index && rs > 0) {
              rowSpanArr.push({
                index: logcalIndex,
                cs: cs + 1,
                rs: rs,
                row: -1
              });
            }

            if (cell !== currentCell && logcalIndex <= index && logcalIndex + cs >= index + currentColSpan - 1) {
              cell.colSpan += 1;
              break;
            }

            if (logcalIndex > index) {
              break;
            }

            colSpan += cs;
          }

          spanIndex = spanIndex.concat(rowSpanArr).sort(function (a, b) {
            return a.index - b.index;
          });
          rowSpanArr = [];
        }

        currentRow.insertBefore(newCell, currentCell.nextElementSibling);
      }
    } else {
      // horizontal
      var currentRowSpan = currentCell.rowSpan;
      newCell.colSpan = currentCell.colSpan; // rowspan > 1

      if (currentRowSpan > 1) {
        newCell.rowSpan = this._w.Math.floor(currentRowSpan / 2);
        var newRowSpan = currentRowSpan - newCell.rowSpan;
        var _rowSpanArr = [];
        var nextRowIndex = util.getArrayIndex(rows, currentRow) + newRowSpan;

        for (var _i10 = 0, _cells2, _colSpan; _i10 < nextRowIndex; _i10++) {
          _cells2 = rows[_i10].cells;
          _colSpan = 0;

          for (var _c2 = 0, _cLen2 = _cells2.length, _cell4, _cs, _logcalIndex2; _c2 < _cLen2; _c2++) {
            _logcalIndex2 = _c2 + _colSpan;

            if (_logcalIndex2 >= index) {
              break;
            }

            _cell4 = _cells2[_c2];
            _cs = _cell4.rowSpan - 1;

            if (_cs > 0 && _cs + _i10 >= nextRowIndex && _logcalIndex2 < index) {
              _rowSpanArr.push({
                index: _logcalIndex2,
                cs: _cell4.colSpan
              });
            }

            _colSpan += _cell4.colSpan - 1;
          }
        }

        var nextRow = rows[nextRowIndex];
        var nextCells = nextRow.cells;

        var _rs = _rowSpanArr.shift();

        for (var _c3 = 0, _cLen3 = nextCells.length, _colSpan2 = 0, _cell5, _cs2, _logcalIndex3, insertIndex; _c3 < _cLen3; _c3++) {
          _logcalIndex3 = _c3 + _colSpan2;
          _cell5 = nextCells[_c3];
          _cs2 = _cell5.colSpan - 1;
          insertIndex = _logcalIndex3 + _cs2 + 1;

          if (_rs && insertIndex >= _rs.index) {
            _colSpan2 += _rs.cs;
            insertIndex += _rs.cs;
            _rs = _rowSpanArr.shift();
          }

          if (insertIndex >= index || _c3 === _cLen3 - 1) {
            nextRow.insertBefore(newCell, _cell5.nextElementSibling);
            break;
          }

          _colSpan2 += _cs2;
        }

        currentCell.rowSpan = newRowSpan;
      } else {
        // rowspan - 1
        newCell.rowSpan = currentCell.rowSpan;
        var newRow = util.createElement("TR");
        newRow.appendChild(newCell);

        for (var _i11 = 0, _cells4; _i11 < rowIndex; _i11++) {
          _cells4 = rows[_i11].cells;

          if (_cells4.length === 0) {
            return;
          }

          for (var _c4 = 0, _cLen4 = _cells4.length; _c4 < _cLen4; _c4++) {
            if (_i11 + _cells4[_c4].rowSpan - 1 >= rowIndex) {
              _cells4[_c4].rowSpan += 1;
            }
          }
        }

        var physicalIndex = contextTable._physical_cellIndex;
        var _cells3 = currentRow.cells;

        for (var _c5 = 0, _cLen5 = _cells3.length; _c5 < _cLen5; _c5++) {
          if (_c5 === physicalIndex) {
            continue;
          }

          _cells3[_c5].rowSpan += 1;
        }

        currentRow.parentNode.insertBefore(newRow, currentRow.nextElementSibling);
      }
    }

    this.focusEdge(currentCell);
    this.plugins.table.setPositionControllerDiv.call(this, currentCell, true);
  },
  mergeCells: function mergeCells() {
    var tablePlugin = this.plugins.table;
    var contextTable = this.context.table;
    var util = this.util;
    var ref = tablePlugin._ref;
    var selectedCells = tablePlugin._selectedCells;
    var mergeCell = selectedCells[0];
    var emptyRowFirst = null;
    var emptyRowLast = null;
    var cs = ref.ce - ref.cs + 1;
    var rs = ref.re - ref.rs + 1;
    var mergeHTML = "";
    var row = null;

    for (var i = 1, len = selectedCells.length, cell, ch; i < len; i++) {
      cell = selectedCells[i];

      if (row !== cell.parentNode) {
        row = cell.parentNode;
      }

      ch = cell.children;

      for (var c = 0, cLen = ch.length; c < cLen; c++) {
        if (util.isFormatElement(ch[c]) && util.onlyZeroWidthSpace(ch[c].textContent)) {
          util.removeItem(ch[c]);
        }
      }

      mergeHTML += cell.innerHTML;
      util.removeItem(cell);

      if (row.cells.length === 0) {
        if (!emptyRowFirst) {
          emptyRowFirst = row;
        } else {
          emptyRowLast = row;
        }

        rs -= 1;
      }
    }

    if (emptyRowFirst) {
      var rows = contextTable._trElements;
      var rowIndexFirst = util.getArrayIndex(rows, emptyRowFirst);
      var rowIndexLast = util.getArrayIndex(rows, emptyRowLast || emptyRowFirst);
      var removeRows = [];

      for (var _i12 = 0, cells; _i12 <= rowIndexLast; _i12++) {
        cells = rows[_i12].cells;

        if (cells.length === 0) {
          removeRows.push(rows[_i12]);
          continue;
        }

        for (var _c6 = 0, _cLen6 = cells.length, _cell6, _rs2; _c6 < _cLen6; _c6++) {
          _cell6 = cells[_c6];
          _rs2 = _cell6.rowSpan - 1;

          if (_rs2 > 0 && _i12 + _rs2 >= rowIndexFirst) {
            _cell6.rowSpan -= util.getOverlapRangeAtIndex(rowIndexFirst, rowIndexLast, _i12, _i12 + _rs2);
          }
        }
      }

      for (var _i13 = 0, _len8 = removeRows.length; _i13 < _len8; _i13++) {
        util.removeItem(removeRows[_i13]);
      }
    }

    mergeCell.innerHTML += mergeHTML;
    mergeCell.colSpan = cs;
    mergeCell.rowSpan = rs;
    this.controllersOff();
    tablePlugin.setActiveButton.call(this, true, false);
    tablePlugin.call_controller_tableEdit.call(this, mergeCell);
    util.addClass(mergeCell, "ke-table-selected-cell");
    this.focusEdge(mergeCell);
  },
  toggleHeader: function toggleHeader() {
    var util = this.util;
    var headerButton = this.context.table.headerButton;
    var active = util.hasClass(headerButton, "active");
    var table = this.context.table._element;

    if (!active) {
      var header = util.createElement("THEAD");
      header.innerHTML = "<tr>" + this.plugins.table.createCells.call(this, "th", this.context.table._logical_cellCnt, false) + "</tr>";
      table.insertBefore(header, table.firstElementChild);
    } else {
      util.removeItem(table.querySelector("thead"));
    }

    util.toggleClass(headerButton, "active");

    if (/TH/i.test(this.context.table._tdElement.nodeName)) {
      this.controllersOff();
    } else {
      this.plugins.table.setPositionControllerDiv.call(this, this.context.table._tdElement, false);
    }
  },
  setTableStyle: function setTableStyle(styles) {
    var contextTable = this.context.table;
    var tableElement = contextTable._element;
    var icon, span, sizeIcon, text;

    if (styles.indexOf("width") > -1) {
      icon = contextTable.resizeButton.firstElementChild;
      span = contextTable.resizeText;

      if (!contextTable._maxWidth) {
        sizeIcon = contextTable.icons.expansion;
        text = contextTable.maxText;
        contextTable.columnFixedButton.style.display = "none";
        this.util.removeClass(tableElement, "ke-table-size-100");
        this.util.addClass(tableElement, "ke-table-size-auto");
      } else {
        sizeIcon = contextTable.icons.reduction;
        text = contextTable.minText;
        contextTable.columnFixedButton.style.display = "block";
        this.util.removeClass(tableElement, "ke-table-size-auto");
        this.util.addClass(tableElement, "ke-table-size-100");
      }

      this.util.changeElement(icon, sizeIcon);
      this.util.changeTxt(span, text);
    }

    if (styles.indexOf("column") > -1) {
      if (!contextTable._fixedColumn) {
        this.util.removeClass(tableElement, "ke-table-layout-fixed");
        this.util.addClass(tableElement, "ke-table-layout-auto");
        this.util.removeClass(contextTable.columnFixedButton, "active");
      } else {
        this.util.removeClass(tableElement, "ke-table-layout-auto");
        this.util.addClass(tableElement, "ke-table-layout-fixed");
        this.util.addClass(contextTable.columnFixedButton, "active");
      }
    }
  },
  setActiveButton: function setActiveButton(fixedCell, selectedCell) {
    var contextTable = this.context.table;

    if (/^TH$/i.test(fixedCell.nodeName)) {
      contextTable.insertRowAboveButton.setAttribute("disabled", true);
      contextTable.insertRowBelowButton.setAttribute("disabled", true);
    } else {
      contextTable.insertRowAboveButton.removeAttribute("disabled");
      contextTable.insertRowBelowButton.removeAttribute("disabled");
    }

    if (!selectedCell || fixedCell === selectedCell) {
      contextTable.splitButton.removeAttribute("disabled");
      contextTable.mergeButton.setAttribute("disabled", true);
    } else {
      contextTable.splitButton.setAttribute("disabled", true);
      contextTable.mergeButton.removeAttribute("disabled");
    }
  },
  // multi selecte
  _bindOnSelect: null,
  _bindOffSelect: null,
  _bindOffShift: null,
  _selectedCells: null,
  _shift: false,
  _fixedCell: null,
  _fixedCellName: null,
  _selectedCell: null,
  _selectedTable: null,
  _ref: null,
  _toggleEditor: function _toggleEditor(enabled) {
    this.context.element.wysiwyg.setAttribute("contenteditable", enabled);

    if (enabled) {
      this.util.removeClass(this.context.element.wysiwyg, "ke-disabled");
    } else {
      this.util.addClass(this.context.element.wysiwyg, "ke-disabled");
    }
  },
  _offCellMultiSelect: function _offCellMultiSelect(e) {
    e.stopPropagation();
    var tablePlugin = this.plugins.table;

    if (!tablePlugin._shift) {
      tablePlugin._removeEvents.call(this);

      tablePlugin._toggleEditor.call(this, true);
    } else if (tablePlugin._initBind) {
      this._wd.removeEventListener("touchmove", tablePlugin._initBind);

      tablePlugin._initBind = null;
    }

    if (!tablePlugin._fixedCell || !tablePlugin._selectedTable) {
      return;
    }

    tablePlugin.setActiveButton.call(this, tablePlugin._fixedCell, tablePlugin._selectedCell);
    tablePlugin.call_controller_tableEdit.call(this, tablePlugin._selectedCell || tablePlugin._fixedCell);
    tablePlugin._selectedCells = tablePlugin._selectedTable.querySelectorAll(".ke-table-selected-cell");

    if (tablePlugin._selectedCell && tablePlugin._fixedCell) {
      this.focusEdge(tablePlugin._selectedCell);
    }

    if (!tablePlugin._shift) {
      tablePlugin._fixedCell = null;
      tablePlugin._selectedCell = null;
      tablePlugin._fixedCellName = null;
    }
  },
  _onCellMultiSelect: function _onCellMultiSelect(e) {
    this._antiBlur = true;
    var tablePlugin = this.plugins.table;
    var target = this.util.getParentElement(e.target, this.util.isCell);

    if (tablePlugin._shift) {
      if (target === tablePlugin._fixedCell) {
        tablePlugin._toggleEditor.call(this, true);
      } else {
        tablePlugin._toggleEditor.call(this, false);
      }
    } else if (!tablePlugin._ref) {
      if (target === tablePlugin._fixedCell) {
        return;
      } else {
        tablePlugin._toggleEditor.call(this, false);
      }
    }

    if (!target || target === tablePlugin._selectedCell || tablePlugin._fixedCellName !== target.nodeName || tablePlugin._selectedTable !== this.util.getParentElement(target, "TABLE")) {
      return;
    }

    tablePlugin._selectedCell = target;

    tablePlugin._setMultiCells.call(this, tablePlugin._fixedCell, target);
  },
  _setMultiCells: function _setMultiCells(startCell, endCell) {
    var tablePlugin = this.plugins.table;
    var rows = tablePlugin._selectedTable.rows;
    var util = this.util;

    var selectedCells = tablePlugin._selectedTable.querySelectorAll(".ke-table-selected-cell");

    for (var i = 0, len = selectedCells.length; i < len; i++) {
      util.removeClass(selectedCells[i], "ke-table-selected-cell");
    }

    if (startCell === endCell) {
      util.addClass(startCell, "ke-table-selected-cell");

      if (!tablePlugin._shift) {
        return;
      }
    }

    var findSelectedCell = true;
    var spanIndex = [];
    var rowSpanArr = [];
    var ref = {
      _i: 0,
      cs: null,
      ce: null,
      rs: null,
      re: null
    };
    tablePlugin._ref = {
      _i: 0,
      cs: null,
      ce: null,
      rs: null,
      re: null
    };

    for (var _i14 = 0, _len9 = rows.length, cells, colSpan; _i14 < _len9; _i14++) {
      cells = rows[_i14].cells;
      colSpan = 0;

      for (var c = 0, cLen = cells.length, cell, logcalIndex, cs, rs; c < cLen; c++) {
        cell = cells[c];
        cs = cell.colSpan - 1;
        rs = cell.rowSpan - 1;
        logcalIndex = c + colSpan;

        if (spanIndex.length > 0) {
          for (var r = 0, arr; r < spanIndex.length; r++) {
            arr = spanIndex[r];

            if (arr.row > _i14) {
              continue;
            }

            if (logcalIndex >= arr.index) {
              colSpan += arr.cs;
              logcalIndex += arr.cs;
              arr.rs -= 1;
              arr.row = _i14 + 1;

              if (arr.rs < 1) {
                spanIndex.splice(r, 1);
                r--;
              }
            } else if (c === cLen - 1) {
              arr.rs -= 1;
              arr.row = _i14 + 1;

              if (arr.rs < 1) {
                spanIndex.splice(r, 1);
                r--;
              }
            }
          }
        }

        if (findSelectedCell) {
          if (cell === startCell || cell === endCell) {
            ref.cs = ref.cs !== null && ref.cs < logcalIndex ? ref.cs : logcalIndex;
            ref.ce = ref.ce !== null && ref.ce > logcalIndex + cs ? ref.ce : logcalIndex + cs;
            ref.rs = ref.rs !== null && ref.rs < _i14 ? ref.rs : _i14;
            ref.re = ref.re !== null && ref.re > _i14 + rs ? ref.re : _i14 + rs;
            ref._i += 1;
          }

          if (ref._i === 2) {
            findSelectedCell = false;
            spanIndex = [];
            rowSpanArr = [];
            _i14 = -1;
            break;
          }
        } else if (util.getOverlapRangeAtIndex(ref.cs, ref.ce, logcalIndex, logcalIndex + cs) && util.getOverlapRangeAtIndex(ref.rs, ref.re, _i14, _i14 + rs)) {
          var newCs = ref.cs < logcalIndex ? ref.cs : logcalIndex;
          var newCe = ref.ce > logcalIndex + cs ? ref.ce : logcalIndex + cs;
          var newRs = ref.rs < _i14 ? ref.rs : _i14;
          var newRe = ref.re > _i14 + rs ? ref.re : _i14 + rs;

          if (ref.cs !== newCs || ref.ce !== newCe || ref.rs !== newRs || ref.re !== newRe) {
            ref.cs = newCs;
            ref.ce = newCe;
            ref.rs = newRs;
            ref.re = newRe;
            _i14 = -1;
            spanIndex = [];
            rowSpanArr = [];
            break;
          }

          util.addClass(cell, "ke-table-selected-cell");
        }

        if (rs > 0) {
          rowSpanArr.push({
            index: logcalIndex,
            cs: cs + 1,
            rs: rs,
            row: -1
          });
        }

        colSpan += cell.colSpan - 1;
      }

      spanIndex = spanIndex.concat(rowSpanArr).sort(function (a, b) {
        return a.index - b.index;
      });
      rowSpanArr = [];
    }
  },
  _removeEvents: function _removeEvents() {
    var tablePlugin = this.plugins.table;

    if (tablePlugin._initBind) {
      this._wd.removeEventListener("touchmove", tablePlugin._initBind);

      tablePlugin._initBind = null;
    }

    if (tablePlugin._bindOnSelect) {
      this._wd.removeEventListener("mousedown", tablePlugin._bindOnSelect);

      this._wd.removeEventListener("mousemove", tablePlugin._bindOnSelect);

      tablePlugin._bindOnSelect = null;
    }

    if (tablePlugin._bindOffSelect) {
      this._wd.removeEventListener("mouseup", tablePlugin._bindOffSelect);

      tablePlugin._bindOffSelect = null;
    }

    if (tablePlugin._bindOffShift) {
      this._wd.removeEventListener("keyup", tablePlugin._bindOffShift);

      tablePlugin._bindOffShift = null;
    }
  },
  _initBind: null,
  onTableCellMultiSelect: function onTableCellMultiSelect(tdElement, shift) {
    var tablePlugin = this.plugins.table;

    tablePlugin._removeEvents.call(this);

    this.controllersOff();
    tablePlugin._shift = shift;
    tablePlugin._fixedCell = tdElement;
    tablePlugin._fixedCellName = tdElement.nodeName;
    tablePlugin._selectedTable = this.util.getParentElement(tdElement, "TABLE");

    var selectedCells = tablePlugin._selectedTable.querySelectorAll(".ke-table-selected-cell");

    for (var i = 0, len = selectedCells.length; i < len; i++) {
      this.util.removeClass(selectedCells[i], "ke-table-selected-cell");
    }

    this.util.addClass(tdElement, "ke-table-selected-cell");
    tablePlugin._bindOnSelect = tablePlugin._onCellMultiSelect.bind(this);
    tablePlugin._bindOffSelect = tablePlugin._offCellMultiSelect.bind(this);

    if (!shift) {
      this._wd.addEventListener("mousemove", tablePlugin._bindOnSelect, false);
    } else {
      tablePlugin._bindOffShift = function () {
        this.controllersOn(this.context.table.resizeDiv, this.context.table.tableController, this.plugins.table.init.bind(this), tdElement, "table");

        if (!tablePlugin._ref) {
          this.controllersOff();
        }
      }.bind(this);

      this._wd.addEventListener("keyup", tablePlugin._bindOffShift, false);

      this._wd.addEventListener("mousedown", tablePlugin._bindOnSelect, false);
    }

    this._wd.addEventListener("mouseup", tablePlugin._bindOffSelect, false);

    tablePlugin._initBind = tablePlugin.init.bind(this);

    this._wd.addEventListener("touchmove", tablePlugin._initBind, false);
  },
  onClick_tableController: function onClick_tableController(e) {
    e.stopPropagation();
    var target = e.target.getAttribute("data-command") ? e.target : e.target.parentNode;

    if (target.getAttribute("disabled")) {
      return;
    }

    var command = target.getAttribute("data-command");
    var value = target.getAttribute("data-value");
    var option = target.getAttribute("data-option");
    var tablePlugin = this.plugins.table;

    if (typeof tablePlugin._closeSplitMenu === "function") {
      tablePlugin._closeSplitMenu();

      if (command === "onsplit") {
        return;
      }
    }

    if (!command) {
      return;
    }

    e.preventDefault();
    var contextTable = this.context.table;

    switch (command) {
      case "insert":
      case "delete":
        tablePlugin.editTable.call(this, value, option);
        break;

      case "header":
        tablePlugin.toggleHeader.call(this);
        break;

      case "onsplit":
        tablePlugin.openSplitMenu.call(this);
        break;

      case "split":
        tablePlugin.splitCells.call(this, value);
        break;

      case "merge":
        tablePlugin.mergeCells.call(this);
        break;

      case "resize":
        contextTable._maxWidth = !contextTable._maxWidth;
        tablePlugin.setTableStyle.call(this, "width");
        tablePlugin.setPositionControllerTop.call(this, contextTable._element);
        tablePlugin.setPositionControllerDiv.call(this, contextTable._tdElement, tablePlugin._shift);
        break;

      case "layout":
        contextTable._fixedColumn = !contextTable._fixedColumn;
        tablePlugin.setTableStyle.call(this, "column");
        tablePlugin.setPositionControllerTop.call(this, contextTable._element);
        tablePlugin.setPositionControllerDiv.call(this, contextTable._tdElement, tablePlugin._shift);
        break;

      case "remove":
        {
          var emptyDiv = contextTable._element.parentNode;
          this.util.removeItem(contextTable._element);
          this.controllersOff();

          if (emptyDiv !== this.context.element.wysiwyg) {
            this.util.removeItemAllParents(emptyDiv, function (current) {
              return current.childNodes.length === 0;
            }, null);
          }

          this.focus();
          break;
        }

      default:
    } // history stack


    this.history.push(false);
  }
};
exports.default = _default;