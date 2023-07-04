"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dialog = _interopRequireDefault(require("../modules/dialog"));

var _component = _interopRequireDefault(require("../modules/component"));

var _fileManager = _interopRequireDefault(require("../modules/fileManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = {
  name: "audio",
  display: "dialog",
  add: function add(core) {
    core.addModule([_dialog.default, _component.default, _fileManager.default]);
    var context = core.context;
    var defaultAudio = {
      _infoList: [],
      _infoIndex: 0,
      _uploadFileLength: 0,
      focusElement: null,
      targetSelect: null,
      _origin_w: context.option.audioWidth,
      _origin_h: context.option.audioHeight,
      _linkValue: "",
      _element: null,
      _cover: null,
      _container: null
    };
    var contextAudio = defaultAudio;
    context.audio = defaultAudio;
    /** dialog */

    var audio_dialog = this.setDialog.call(core);
    contextAudio.modal = audio_dialog;
    contextAudio.audioInputFile = audio_dialog.querySelector("._ke_audio_files");
    contextAudio.audioUrlFile = audio_dialog.querySelector(".ke-input-url");
    contextAudio.focusElement = contextAudio.audioInputFile || contextAudio.audioUrlFile;
    contextAudio.preview = audio_dialog.querySelector(".ke-link-preview");
    /** controller */

    var audio_controller = this.setController.call(core);
    contextAudio.controller = audio_controller;
    audio_controller.addEventListener("mousedown", core.eventStop);
    /** add event listeners */

    audio_dialog.querySelector(".ke-btn-primary").addEventListener("click", this.submit.bind(core));

    if (contextAudio.audioInputFile) {
      audio_dialog.querySelector(".ke-dialog-files-edge-button").addEventListener("click", this._removeSelectedFiles.bind(contextAudio.audioInputFile, contextAudio.audioUrlFile, contextAudio.preview));
    }

    if (contextAudio.audioInputFile && contextAudio.audioUrlFile) {
      contextAudio.audioInputFile.addEventListener("change", this._fileInputChange.bind(contextAudio));
    }

    audio_controller.addEventListener("click", this.onClick_controller.bind(core));

    if (contextAudio.audioUrlFile) {
      contextAudio.audioUrlFile.addEventListener("input", this._onLinkPreview.bind(contextAudio.preview, contextAudio, context.options.linkProtocol));
    }
    /** append html */


    context.dialog.modal.appendChild(audio_dialog);
    /** append controller */

    context.element.relative.appendChild(audio_controller);
    /** empty memory */

    audio_dialog = null;
    audio_controller = null;
  },

  /** HTML - dialog */
  setDialog: function setDialog() {
    var option = this.context.option;
    var lang = this.lang;
    var dialog = this.util.createElement("DIV");
    dialog.className = "ke-dialog-content";
    dialog.style.display = "none";
    var html = "" + '<form method="post" enctype="multipart/form-data">' + '<div class="ke-dialog-header">' + '<button type="button" data-command="close" class="ke-btn ke-dialog-close" aria-label="Close" title="' + lang.dialogBox.close + '">' + this.icons.cancel + "</button>" + '<span class="ke-modal-title">' + lang.dialogBox.audioBox.title + "</span>" + "</div>" + '<div class="ke-dialog-body">';

    if (option.audioFileInput) {
      html += "" + '<div class="se-dialog-form">' + "<label>" + lang.dialogBox.audioBox.file + "</label>" + '<div class="se-dialog-form-files">' + '<input class="se-input-form _se_audio_files" type="file" accept="' + option.audioAccept + '"' + (option.audioMultipleFile ? ' multiple="multiple"' : "") + "/>" + '<button type="button" data-command="filesRemove" class="se-btn se-dialog-files-edge-button se-file-remove" title="' + lang.controller.remove + '">' + this.icons.cancel + "</button>" + "</div>" + "</div>";
    }

    if (option.audioUrlInput) {
      html += "" + '<div class="ke-dialog-form">' + "<label>" + lang.dialogBox.audioBox.url + "</label>" + '<input class="ke-input-form ke-input-url" type="text" />' + '<pre class="ke-link-preview"></pre>' + "</div>";
    }

    html += "" + "</div>" + '<div class="ke-dialog-footer">' + '<button type="submit" class="ke-btn-primary" title="' + lang.dialogBox.submitButton + '"><span>' + lang.dialogBox.submitButton + "</span></button>" + "</div>" + "</form>";
    dialog.innerHTML = html;
    return dialog;
  },

  /** HTML - controller */
  setController: function setController() {
    var lang = this.lang;
    var icons = this.icons;
    var link_btn = this.util.createElement("DIV");
    link_btn.className = "ke-controller ke-controller-link";
    link_btn.innerHTML = "\n      <div class=\"ke-arrow ke-arrow-up\"></div>\n      <div class=\"link-content\">\n        <div class=\"ke-btn-group\">\n          <button type=\"button\" data-command=\"update\" data-tooltip=\"".concat(lang.controller.edit, "\" tabindex=\"-1\">\n          ").concat(icons.edit, "\n          </button>\n          <button type=\"button\" data-command=\"delete\" data-tooltip=\"").concat(lang.controller.remove, "\" tabindex=\"-1\">\n            ").concat(icons.delete, "\n          </button>\n        </div>\n      </div>");
    return link_btn;
  },
  // Disable url input when uploading files
  _fileInputChange: function _fileInputChange() {
    if (!this.audioInputFile.value) {
      this.audioUrlFile.removeAttribute("disabled");
      this.preview.style.textDecoration = "";
    } else {
      this.audioUrlFile.setAttribute("disabled", true);
      this.preview.style.textDecoration = "line-through";
    }
  },
  // Disable url input when uploading files
  _removeSelectedFiles: function _removeSelectedFiles(urlInput, preview) {
    this.value = "";

    if (urlInput) {
      urlInput.removeAttribute("disabled");
      preview.style.textDecoration = "";
    }
  },
  // create new audio tag
  _createAudioTag: function _createAudioTag() {
    var oAudio = this.util.createElement("AUDIO");

    this.plugins.audio._setTagAttrs.call(this, oAudio);

    var w = this.context.audio._origin_w;
    var h = this.context.audio._origin_h;
    oAudio.setAttribute("origin-size", w + "," + h);
    oAudio.style.cssText = (w ? "width:" + w + "; " : "") + (h ? "height:" + h + ";" : "");
    return oAudio;
  },
  _setTagAttrs: function _setTagAttrs(element) {
    element.setAttribute("controls", true);
    var attrs = this.context.options.audioTagAttrs;

    if (!attrs) {
      return;
    }

    for (var key in attrs) {
      if (!this.util.hasOwn(attrs, key)) {
        continue;
      }

      element.setAttribute(key, attrs[key]);
    }
  },
  _onLinkPreview: function _onLinkPreview(context, protocol, e) {
    var value = e.target.value.trim();
    context._linkValue = !value ? "" : protocol && value.indexOf("://") === -1 && value.indexOf("#") !== 0 ? protocol + value : value.indexOf("://") === -1 ? "/" + value : value;
    this.textContent = !value ? "" : protocol && value.indexOf("://") === -1 && value.indexOf("#") !== 0 ? protocol + value : value.indexOf("://") === -1 ? "/" + value : value;
  },

  /**
   * @Required @Override fileManager
   */
  fileTags: ["audio"],

  /**
   * @Override core, fileManager, resizing
   * @description It is called from core.selectComponent.
   * @param {Element} element Target element
   */
  select: function select(element) {
    this.plugins.audio.onModifyMode.call(this, element);
  },

  /**
   * @Override fileManager, resizing
   */
  destroy: function destroy(element) {
    element = element || this.context.audio._element;
    var container = this.util.getParentElement(element, this.util.isComponent) || element;
    var dataIndex = element.getAttribute("data-index") * 1;
    var focusEl = container.previousElementSibling || container.nextElementSibling;
    var emptyDiv = container.parentNode;
    this.util.removeItem(container);
    this.plugins.audio.init.call(this);
    this.controllersOff();

    if (emptyDiv !== this.context.element.wysiwyg) {
      this.util.removeItemAllParents(emptyDiv, function (current) {
        return current.childNodes.length === 0;
      }, null);
    } // focus


    this.focusEdge(focusEl); // fileManager event

    this.plugins.fileManager.deleteInfo.call(this, "audio", dataIndex, this.functions.onAudioUpload); // history stack

    this.history.push(false);
  },

  /**
   * @Override fileManager
   */
  checkFileInfo: function checkFileInfo() {
    this.plugins.fileManager.checkInfo.call(this, "audio", ["audio"], this.functions.onAudioUpload, this.plugins.audio.updateCover.bind(this), false);
  },

  /**
   * @Override fileManager
   */
  resetFileInfo: function resetFileInfo() {
    this.plugins.fileManager.resetInfo.call(this, "audio", this.functions.onAudioUpload);
  },

  /**
   * @Required @Override dialog
   */
  on: function on(update) {
    var contextAudio = this.context.audio;

    if (!update) {
      this.plugins.audio.init.call(this);

      if (contextAudio.audioInputFile && this.context.options.audioMultipleFile) {
        contextAudio.audioInputFile.setAttribute("multiple", "multiple");
      }
    } else if (contextAudio._element) {
      this.context.dialog.updateModal = true;
      contextAudio._linkValue = contextAudio._element.src;
      contextAudio.preview.textContent = contextAudio._element.src;
      contextAudio.audioUrlFile.value = contextAudio._element.src;

      if (contextAudio.audioInputFile && this.context.options.audioMultipleFile) {
        contextAudio.audioInputFile.removeAttribute("multiple");
      }
    } else {
      if (contextAudio.audioInputFile && this.context.options.audioMultipleFile) {
        contextAudio.audioInputFile.removeAttribute("multiple");
      }
    }
  },

  /**
   * @Required @Override dialog
   */
  open: function open() {
    this.plugins.dialog.open.call(this, "audio", this.currentControllerName === "audio");
  },
  submit: function submit(e) {
    var contextAudio = this.context.audio;
    e.preventDefault();
    e.stopPropagation();

    try {
      if (contextAudio.audioInputFile && contextAudio.audioInputFile.files.length > 0) {
        this.showLoading();
        this.plugins.audio.submitAction.call(this, contextAudio.audioInputFile.files);
      } else if (contextAudio.audioUrlFile && contextAudio._linkValue.length > 0) {
        this.showLoading();
        this.plugins.audio.setupUrl.call(this, contextAudio._linkValue);
      }
    } catch (error) {
      this.closeLoading();
      throw Error('[KothingEditor.audio.submit.fail] cause : "' + error.message + '"');
    } finally {
      this.plugins.dialog.close.call(this);
    }

    return false;
  },
  submitAction: function submitAction(fileList) {
    if (fileList.length === 0) {
      return;
    }

    var fileSize = 0;
    var files = [];

    for (var i = 0, len = fileList.length; i < len; i++) {
      if (/audio/i.test(fileList[i].type)) {
        files.push(fileList[i]);
        fileSize += fileList[i].size;
      }
    }

    var limitSize = this.context.option.audioUploadSizeLimit;

    if (limitSize > 0) {
      var infoSize = 0;
      var audiosInfo = this.context.audio._infoList;

      for (var _i = 0, _len = audiosInfo.length; _i < _len; _i++) {
        infoSize += audiosInfo[_i].size * 1;
      }

      if (fileSize + infoSize > limitSize) {
        this.closeLoading();
        var err = "[KothingEditor.audioUpload.fail] Size of uploadable total audios: " + limitSize / 1000 + "KB";

        if (this.functions.onAudioUploadError !== "function" || this.functions.onAudioUploadError(err, {
          limitSize: limitSize,
          currentSize: infoSize,
          uploadSize: fileSize
        }, this)) {
          this.functions.noticeOpen(err);
        }

        return;
      }
    }

    var contextAudio = this.context.audio;
    contextAudio._uploadFileLength = files.length;
    var info = {
      isUpdate: this.context.dialog.updateModal,
      element: contextAudio._element
    };

    if (typeof this.functions.onAudioUploadBefore === "function") {
      var result = this.functions.onAudioUploadBefore(files, info, this, function (data) {
        if (data && this._w.Array.isArray(data.result)) {
          this.plugins.audio.register.call(this, info, data);
        } else {
          this.plugins.audio.upload.call(this, info, data);
        }
      }.bind(this));

      if (typeof result === "undefined") {
        return;
      }

      if (!result) {
        this.closeLoading();
        return;
      }

      if (_typeof(result) === "object" && result.length > 0) {
        files = result;
      }
    }

    this.plugins.audio.upload.call(this, info, files);
  },
  error: function error(message, response) {
    this.closeLoading();

    if (typeof this.functions.onAudioUploadError !== "function" || this.functions.onAudioUploadError(message, response, this)) {
      this.functions.noticeOpen(message);
      throw Error("[KothingEditor.plugin.audio.exception] response: " + message);
    }
  },
  upload: function upload(info, files) {
    if (!files) {
      this.closeLoading();
      return;
    }

    if (typeof files === "string") {
      this.plugins.audio.error.call(this, files, null);
      return;
    }

    var audioUploadUrl = this.context.option.audioUploadUrl;
    var filesLen = this.context.dialog.updateModal ? 1 : files.length; // create formData

    var formData = new FormData();

    for (var i = 0; i < filesLen; i++) {
      formData.append("file-" + i, files[i]);
    } // server upload


    this.plugins.fileManager.upload.call(this, audioUploadUrl, this.context.option.audioUploadHeader, formData, this.plugins.audio.callBack_upload.bind(this, info), this.functions.onAudioUploadError);
  },
  callBack_upload: function callBack_upload(info, xmlHttp) {
    if (typeof this.functions.audioUploadHandler === "function") {
      this.functions.audioUploadHandler(xmlHttp, info, this);
    } else {
      var response = JSON.parse(xmlHttp.responseText);

      if (response.errorMessage) {
        this.plugins.audio.error.call(this, response.errorMessage, response);
      } else {
        this.plugins.audio.register.call(this, info, response);
      }
    }
  },
  register: function register(info, response) {
    var fileList = response.result;

    for (var i = 0, len = fileList.length, file, oAudio; i < len; i++) {
      if (info.isUpdate) {
        oAudio = info.element;
      } else {
        oAudio = this.plugins.audio._createAudioTag.call(this);
      }

      file = {
        name: fileList[i].name,
        size: fileList[i].size
      };
      this.plugins.audio.create_audio.call(this, oAudio, fileList[i].url, file, info.isUpdate);
    }

    this.closeLoading();
  },
  setupUrl: function setupUrl(src) {
    try {
      if (src.length === 0) {
        return false;
      }

      this.plugins.audio.create_audio.call(this, this.plugins.audio._createAudioTag.call(this), src, null, this.context.dialog.updateModal);
    } catch (error) {
      throw Error('[KothingEditor.audio.audio.fail] cause : "' + error.message + '"');
    } finally {
      this.closeLoading();
    }
  },
  create_audio: function create_audio(element, src, file, isUpdate) {
    var contextAudio = this.context.audio; // create new tag

    if (!isUpdate) {
      element.src = src;
      var cover = this.plugins.component.set_cover.call(this, element);
      var container = this.plugins.component.set_container.call(this, cover, "");

      if (!this.insertComponent(container, false, true, false)) {
        this.focus();
        return;
      }
    } else {
      // update
      if (contextAudio._element) {
        element = contextAudio._element;
      }

      if (element && element.src !== src) {
        element.src = src;
      } else {
        this.selectComponent(element, "audio");
        return;
      }
    }

    this.plugins.fileManager.setInfo.call(this, "audio", element, this.functions.onAudioUpload, file, false);
    this.selectComponent(element, "audio");

    if (isUpdate) {
      this.history.push(false);
    }
  },
  updateCover: function updateCover(element) {
    var contextAudio = this.context.audio;

    this.plugins.audio._setTagAttrs.call(this, element); // find component element


    var existElement = this.util.getParentElement(element, this.util.isMediaComponent) || this.util.getParentElement(element, function (current) {
      return this.isWysiwygDiv(current.parentNode);
    }.bind(this.util)); // clone element

    contextAudio._element = element.cloneNode(false);
    element = element.cloneNode(false);
    var cover = this.plugins.component.set_cover.call(this, element);
    var container = this.plugins.component.set_container.call(this, cover, "ke-audio-container");
    existElement.parentNode.replaceChild(container, existElement);
    this.plugins.fileManager.setInfo.call(this, "audio", element, this.functions.onAudioUpload, null, false);
  },

  /**
   * @Required @Override fileManager, resizing
   */
  onModifyMode: function onModifyMode(selectionTag) {
    var contextAudio = this.context.audio;
    var controller = contextAudio.controller;
    var offset = this.util.getOffset(selectionTag, this.context.element.wysiwygFrame);
    controller.style.top = offset.top + selectionTag.offsetHeight + 10 + "px";
    controller.style.left = offset.left - this.context.element.wysiwygFrame.scrollLeft + "px";
    controller.style.display = "block";
    var overLeft = this.context.element.wysiwygFrame.offsetWidth - (controller.offsetLeft + controller.offsetWidth);

    if (overLeft < 0) {
      controller.style.left = controller.offsetLeft + overLeft + "px";
      controller.firstElementChild.style.left = 20 - overLeft + "px";
    } else {
      controller.firstElementChild.style.left = "20px";
    }

    this.controllersOn(controller, selectionTag, this.plugins.audio.onControllerOff.bind(this, selectionTag), "audio");
    this.util.addClass(selectionTag, "active");
    contextAudio._element = selectionTag;
    contextAudio._cover = this.util.getParentElement(selectionTag, "FIGURE");
    contextAudio._container = this.util.getParentElement(selectionTag, this.util.isComponent);
  },

  /**
   * @Required @Override fileManager, resizing
   */
  openModify: function openModify(notOpen) {
    if (this.context.audio.audioUrlFile) {
      var contextAudio = this.context.audio;
      contextAudio._linkValue = contextAudio._element.src;
      contextAudio.preview.textContent = contextAudio._element.src;
      contextAudio.audioUrlFile.value = contextAudio._element.src;
    }

    if (!notOpen) {
      this.plugins.dialog.open.call(this, "audio", true);
    }
  },
  onClick_controller: function onClick_controller(e) {
    e.stopPropagation();
    var command = e.target.getAttribute("data-command");

    if (!command) {
      return;
    }

    e.preventDefault();

    if (/update/.test(command)) {
      this.plugins.audio.openModify.call(this, false);
    } else {
      /** delete */
      this.plugins.audio.destroy.call(this, this.context.audio._element);
    }

    this.controllersOff();
  },
  onControllerOff: function onControllerOff(selectionTag) {
    this.util.removeClass(selectionTag, "active");
    this.context.audio.controller.style.display = "none";
  },

  /**
   * @Required @Override dialog
   */
  init: function init() {
    if (this.context.dialog.updateModal) {
      return;
    }

    var contextAudio = this.context.audio;

    if (contextAudio.audioInputFile) {
      contextAudio.audioInputFile.value = "";
    }

    if (contextAudio.audioUrlFile) {
      contextAudio._linkValue = "";
      contextAudio.preview.textContent = "";
      contextAudio.audioUrlFile.value = "";
    }

    if (contextAudio.audioInputFile && contextAudio.audioUrlFile) {
      contextAudio.audioUrlFile.removeAttribute("disabled");
      contextAudio.preview.style.textDecoration = "";
    }

    contextAudio._element = null;
  }
};
exports.default = _default;