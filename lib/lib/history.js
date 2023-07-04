"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

/*
 * Rich Text Editor
 *
 * kothing-ditor.js
 * Copyright Kothing.
 * MIT license.
 */
function _default(core, change) {
  var _w = core._w;
  var util = core.util;
  var delayTime = core.context.options.historyStackDelayTime;
  var editor = core.context.element;
  var undo = core.context.tool.undo;
  var redo = core.context.tool.redo;
  var pushDelay = null;
  var stackIndex = 0;
  var stack = [];

  function setContentsFromStack() {
    var item = stack[stackIndex];
    editor.wysiwyg.innerHTML = item.contents;
    core.setRange(util.getNodeFromPath(item.s.path, editor.wysiwyg), item.s.offset, util.getNodeFromPath(item.e.path, editor.wysiwyg), item.e.offset);
    core.focus();

    if (stackIndex === 0) {
      if (undo) undo.setAttribute("disabled", true);
      if (redo) redo.removeAttribute("disabled");
    } else if (stackIndex === stack.length - 1) {
      if (undo) undo.removeAttribute("disabled");
      if (redo) redo.setAttribute("disabled", true);
    } else {
      if (undo) undo.removeAttribute("disabled");
      if (redo) redo.removeAttribute("disabled");
    }

    core.controllersOff();

    core._checkComponents();

    core._setCharCount();

    core._resourcesStateChange(); // onChange


    change();
  }

  function pushStack() {
    core._checkComponents();

    var current = core.getContents(true);
    if (!!stack[stackIndex] && current === stack[stackIndex].contents) return;
    stackIndex++;
    var range = core._variable._range;

    if (stack.length > stackIndex) {
      stack = stack.slice(0, stackIndex);
      if (redo) redo.setAttribute("disabled", true);
    }

    if (!range) {
      stack[stackIndex] = {
        contents: current,
        s: {
          path: [0, 0],
          offset: [0, 0]
        },
        e: {
          path: 0,
          offset: 0
        }
      };
    } else {
      stack[stackIndex] = {
        contents: current,
        s: {
          path: util.getNodePath(range.startContainer, null, null),
          offset: range.startOffset
        },
        e: {
          path: util.getNodePath(range.endContainer, null, null),
          offset: range.endOffset
        }
      };
    }

    if (stackIndex === 1 && undo) undo.removeAttribute("disabled");

    core._setCharCount(); // onChange


    change();
  }

  return {
    /**
     * @description History stack
     */
    stack: stack,

    /**
     * @description Saving the current status to the history object stack
     * If "delay" is true, it will be saved after (options.historyStackDelayTime || 400) miliseconds
     * If the function is called again with the "delay" argument true before it is saved, the delay time is renewal
     * You can specify the delay time by sending a number.
     * @param {Boolean|Number} delay If true, Add stack without delay time.
     */
    push: function push(delay) {
      _w.setTimeout(core._resourcesStateChange.bind(core));

      var time = typeof delay === "number" ? delay > 0 ? delay : 0 : !delay ? 0 : delayTime;

      if (!time || pushDelay) {
        _w.clearTimeout(pushDelay);

        if (!time) {
          pushStack();
          return;
        }
      }

      pushDelay = _w.setTimeout(function () {
        _w.clearTimeout(pushDelay);

        pushDelay = null;
        pushStack();
      }, time);
    },

    /**
     * @description Undo function
     */
    undo: function undo() {
      if (stackIndex > 0) {
        stackIndex--;
        setContentsFromStack();
      }
    },

    /**
     * @description Redo function
     */
    redo: function redo() {
      if (stack.length - 1 > stackIndex) {
        stackIndex++;
        setContentsFromStack();
      }
    },

    /**
     * @description Go to the history stack for that index.
     * If "index" is -1, go to the last stack
     * @param {Number} index Stack index
     */
    go: function go(index) {
      stackIndex = index < 0 ? stack.length - 1 : index;
      setContentsFromStack();
    },

    /**
     * @description Reset the history object
     */
    reset: function reset(ignoreChangeEvent) {
      if (undo) undo.setAttribute("disabled", true);
      if (redo) redo.setAttribute("disabled", true);
      if (core.context.tool.save) core.context.tool.save.setAttribute("disabled", true);
      stack.splice(0);
      stackIndex = 0; // pushStack

      stack[stackIndex] = {
        contents: core.getContents(true),
        s: {
          path: [0, 0],
          offset: 0
        },
        e: {
          path: [0, 0],
          offset: 0
        }
      };
      if (!ignoreChangeEvent) change();
    },

    /**
     * @description Reset the disabled state of the buttons to fit the current stack.
     * @private
     */
    _resetCachingButton: function _resetCachingButton() {
      editor = core.context.element;
      undo = core.context.tool.undo;
      redo = core.context.tool.redo;

      if (stackIndex === 0) {
        if (undo) undo.setAttribute("disabled", true);
        if (redo && stackIndex === stack.length - 1) redo.setAttribute("disabled", true);
        if (core.context.tool.save) core.context.tool.save.setAttribute("disabled", true);
      } else if (stackIndex === stack.length - 1) {
        if (redo) redo.setAttribute("disabled", true);
      }
    },

    /**
     * @description Remove all stacks and remove the timeout function.
     * @private
     */
    _destroy: function _destroy() {
      if (pushDelay) _w.clearTimeout(pushDelay);
      stack = null;
    }
  };
}