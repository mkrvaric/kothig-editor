"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
 * Rich Text Editor
 *
 * kothing-ditor.js
 * Copyright Kothing.
 * MIT license.
 */
var _default = {
  name: "fileManager",
  _xmlHttp: null,

  /**
   * @description Upload the file to the server.
   * @param {String} uploadUrl Upload server url
   * @param {Object|null} uploadHeader Request header
   * @param {FormData} formData FormData in body
   * @param {Function|null} callBack Success call back function
   * @param {Function|null} errorCallBack Error call back function
   * @example this.plugins.fileManager.upload.call(this, imageUploadUrl, this.context.option.imageUploadHeader, formData, this.plugins.image.callBack_imgUpload.bind(this, info), this.functions.onImageUploadError);
   */
  upload: function upload(uploadUrl, uploadHeader, formData, callBack, errorCallBack) {
    this.showLoading();
    var filePlugin = this.plugins.fileManager;
    var xmlHttp = this.util.getXMLHttpRequest();
    filePlugin._xmlHttp = this.util.getXMLHttpRequest();
    xmlHttp.onreadystatechange = filePlugin._callBackUpload.bind(this, xmlHttp, callBack, errorCallBack);
    xmlHttp.open("post", uploadUrl, true);

    if (uploadHeader !== null && _typeof(uploadHeader) === "object" && this._w.Object.keys(uploadHeader).length > 0) {
      for (var key in uploadHeader) {
        xmlHttp.setRequestHeader(key, uploadHeader[key]);
      }
    }

    xmlHttp.send(formData);
  },
  _callBackUpload: function _callBackUpload(xmlHttp, callBack, errorCallBack) {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        try {
          callBack(xmlHttp);
        } catch (e) {
          throw Error('[KothingEditor.fileManager.upload.callBack.fail] cause : "' + e.message + '"');
        } finally {
          this.closeLoading();
        }
      } else {
        // exception
        this.closeLoading();
        var res = !xmlHttp.responseText ? xmlHttp : JSON.parse(xmlHttp.responseText);

        if (typeof errorCallBack !== "function" || errorCallBack("", res, this)) {
          var err = "[KothingEditor.fileManager.upload.serverException] status: " + xmlHttp.status + ", response: " + (res.errorMessage || xmlHttp.responseText);
          this.functions.noticeOpen(err);
          throw Error(err);
        }
      }
    }
  },

  /**
   * @description Checke the file's information and modify the tag that does not fit the format.
   * @param {String} pluginName Plugin name
   * @param {Array} tagNames Tag array to check
   * @param {Function|null} uploadEventHandler Event handler to process updated file info after checking (used in "setInfo")
   * @param {Function} modifyHandler A function to modify a tag that does not fit the format (Argument value: Tag element)
   * @param {Boolean} resizing True if the plugin is using a resizing module
   * @example
   * const modifyHandler = function (tag) {
   *      imagePlugin.onModifyMode.call(this, tag, null);
   *      imagePlugin.openModify.call(this, true);
   *      imagePlugin.update_image.call(this, true, false, true);
   *  }.bind(this);
   *  this.plugins.fileManager.checkInfo.call(this, 'image', ['img'], this.functions.onImageUpload, modifyHandler, true);
   */
  checkInfo: function checkInfo(pluginName, tagNames, uploadEventHandler, modifyHandler, resizing) {
    var tags = [];

    for (var i = 0, len = tagNames.length; i < len; i++) {
      tags = tags.concat([].slice.call(this.context.element.wysiwyg.getElementsByTagName(tagNames[i])));
    }

    var context = this.context[pluginName];
    var infoList = context._infoList;
    var setFileInfo = this.plugins.fileManager.setInfo.bind(this);

    if (tags.length === infoList.length) {
      // reset
      if (this._componentsInfoReset) {
        for (var _i = 0, _len = tags.length; _i < _len; _i++) {
          setFileInfo(pluginName, tags[_i], uploadEventHandler, null, resizing);
        }

        return;
      } else {
        var infoUpdate = false;

        var _loop = function _loop(_info, _i2, _len2) {
          _info = infoList[_i2];

          if (tags.filter(function (t) {
            info = _info;
            return _info.src === t.src && _info.index.toString() === t.getAttribute("data-index");
          }).length === 0) {
            infoUpdate = true;
            info = _info;
            return "break";
          }

          info = _info;
        };

        for (var _i2 = 0, _len2 = infoList.length, info; _i2 < _len2; _i2++) {
          var _ret = _loop(info, _i2, _len2);

          if (_ret === "break") break;
        } // pass


        if (!infoUpdate) {
          return;
        }
      }
    } // check


    var _resize_plugin = resizing ? this.context.resizing._resize_plugin : "";

    if (resizing) {
      this.context.resizing._resize_plugin = pluginName;
    }

    var currentTags = [];
    var infoIndex = [];

    for (var _i3 = 0, _len3 = infoList.length; _i3 < _len3; _i3++) {
      infoIndex[_i3] = infoList[_i3].index;
    }

    for (var _i4 = 0, _len4 = tags.length, tag; _i4 < _len4; _i4++) {
      tag = tags[_i4];

      if (!this.util.getParentElement(tag, this.util.isMediaComponent) || !/FIGURE/i.test(tag.parentElement.nodeName)) {
        currentTags.push(context._infoIndex);
        modifyHandler(tag);
      } else if (!tag.getAttribute("data-index") || infoIndex.indexOf(tag.getAttribute("data-index") * 1) < 0) {
        currentTags.push(context._infoIndex);
        tag.removeAttribute("data-index");
        setFileInfo(pluginName, tag, uploadEventHandler, null, resizing);
      } else {
        currentTags.push(tag.getAttribute("data-index") * 1);
      }
    }

    for (var _i5 = 0, dataIndex; _i5 < infoList.length; _i5++) {
      dataIndex = infoList[_i5].index;

      if (currentTags.indexOf(dataIndex) > -1) {
        continue;
      }

      infoList.splice(_i5, 1);

      if (typeof uploadEventHandler === "function") {
        uploadEventHandler(null, dataIndex, "delete", null, 0, this);
      }

      _i5--;
    }

    if (resizing) {
      this.context.resizing._resize_plugin = _resize_plugin;
    }
  },

  /**
   * @description Create info object of file and add it to "_infoList" (this.context[pluginName]._infoList[])
   * @param {String} pluginName Plugin name
   * @param {Element} element
   * @param {Function|null} uploadEventHandler Event handler to process updated file info (created in setInfo)
   * @param {Object|null} file
   * @param {Boolean} resizing True if the plugin is using a resizing module
   * @example
   * uploadCallBack {.. file = { name: fileList[i].name, size: fileList[i].size };
   * this.plugins.fileManager.setInfo.call(this, 'image', oImg, this.functions.onImageUpload, file, true);
   */
  setInfo: function setInfo(pluginName, element, uploadEventHandler, file, resizing) {
    var _resize_plugin = resizing ? this.context.resizing._resize_plugin : "";

    if (resizing) {
      this.context.resizing._resize_plugin = pluginName;
    }

    var plguin = this.plugins[pluginName];
    var context = this.context[pluginName];
    var infoList = context._infoList;
    var dataIndex = element.getAttribute("data-index");
    var info = null;
    var state = "";

    if (!file) {
      file = {
        name: element.getAttribute("data-file-name") || (typeof element.src === "string" ? element.src.split("/").pop() : ""),
        size: element.getAttribute("data-file-size") || 0
      };
    } // create


    if (!dataIndex || this._componentsInfoInit) {
      state = "create";
      dataIndex = context._infoIndex++;
      element.setAttribute("data-index", dataIndex);
      element.setAttribute("data-file-name", file.name);
      element.setAttribute("data-file-size", file.size);
      info = {
        src: element.src,
        index: dataIndex * 1,
        name: file.name,
        size: file.size
      };
      infoList.push(info);
    } else {
      // update
      state = "update";
      dataIndex *= 1;

      for (var i = 0, len = infoList.length; i < len; i++) {
        if (dataIndex === infoList[i].index) {
          info = infoList[i];
          break;
        }
      }

      if (!info) {
        dataIndex = context._infoIndex++;
        info = {
          index: dataIndex
        };
        infoList.push(info);
      }

      info.src = element.src;
      info.name = element.getAttribute("data-file-name");
      info.size = element.getAttribute("data-file-size") * 1;
    } // method bind


    info.element = element;
    info.delete = plguin.destroy.bind(this, element);

    info.select = function (element) {
      element.scrollIntoView(true);

      this._w.setTimeout(plguin.select.bind(this, element));
    }.bind(this, element);

    if (resizing) {
      if (!element.getAttribute("origin-size") && element.naturalWidth) {
        element.setAttribute("origin-size", element.naturalWidth + "," + element.naturalHeight);
      }

      if (!element.getAttribute("data-origin")) {
        var container = this.util.getParentElement(element, this.util.isMediaComponent);
        var cover = this.util.getParentElement(element, "FIGURE");

        var w = this.plugins.resizing._module_getSizeX.call(this, context, element, cover, container);

        var h = this.plugins.resizing._module_getSizeY.call(this, context, element, cover, container);

        element.setAttribute("data-origin", w + "," + h);
        element.setAttribute("data-size", w + "," + h);
      }

      if (!element.style.width) {
        var size = (element.getAttribute("data-size") || element.getAttribute("data-origin") || "").split(",");
        plguin.onModifyMode.call(this, element, null);
        plguin.applySize.call(this, size[0], size[1]);
      }

      this.context.resizing._resize_plugin = _resize_plugin;
    }

    if (typeof uploadEventHandler === "function") {
      uploadEventHandler(element, dataIndex, state, info, --context._uploadFileLength < 0 ? 0 : context._uploadFileLength, this);
    }
  },

  /**
   * @description Delete info object at "_infoList"
   * @param {String} pluginName Plugin name
   * @param {Number} index index of info object (this.context[pluginName]._infoList[].index)
   * @param {Function|null} uploadEventHandler Event handler to process updated file info (created in setInfo)
   */
  deleteInfo: function deleteInfo(pluginName, index, uploadEventHandler) {
    if (index >= 0) {
      var infoList = this.context[pluginName]._infoList;

      for (var i = 0, len = infoList.length; i < len; i++) {
        if (index === infoList[i].index) {
          infoList.splice(i, 1);

          if (typeof uploadEventHandler === "function") {
            uploadEventHandler(null, index, "delete", null, 0, this);
          }

          return;
        }
      }
    }
  },

  /**
   * @description Reset info object and "_infoList = []", "_infoIndex = 0"
   * @param {String} pluginName Plugin name
   * @param {Function|null} uploadEventHandler Event handler to process updated file info (created in setInfo)
   */
  resetInfo: function resetInfo(pluginName, uploadEventHandler) {
    var context = this.context[pluginName];

    if (typeof uploadEventHandler === "function") {
      var infoList = context._infoList;

      for (var i = 0, len = infoList.length; i < len; i++) {
        uploadEventHandler(null, infoList[i].index, "delete", null, 0, this);
      }
    }

    context._infoList = [];
    context._infoIndex = 0;
  }
};
exports.default = _default;