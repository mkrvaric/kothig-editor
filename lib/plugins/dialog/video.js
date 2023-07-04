"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dialog = _interopRequireDefault(require("../modules/dialog"));

var _component = _interopRequireDefault(require("../modules/component"));

var _resizing = _interopRequireDefault(require("../modules/resizing"));

var _fileManager = _interopRequireDefault(require("../modules/fileManager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = {
  name: "video",
  display: "dialog",
  add: function add(core) {
    core.addModule([_dialog.default, _component.default, _resizing.default, _fileManager.default]);
    var context = core.context;
    var defaultVideo = {
      _infoList: [],
      // @Override fileManager
      _infoIndex: 0,
      // @Override fileManager
      _uploadFileLength: 0,
      // @Override fileManager
      sizeUnit: context.option._videoSizeUnit,
      _align: "none",
      _floatClassRegExp: "__ke__float\\-[a-z]+",
      _youtubeQuery: context.option.youtubeQuery,
      _videoRatio: context.option.videoRatio * 100 + "%",
      _defaultRatio: context.option.videoRatio * 100 + "%",
      _linkValue: "",
      // @require @Override component
      _element: null,
      _cover: null,
      _container: null,
      // @Override resizing properties
      inputX: null,
      inputY: null,
      _element_w: 1,
      _element_h: 1,
      _element_l: 0,
      _element_t: 0,
      _defaultSizeX: "100%",
      _defaultSizeY: context.option.videoRatio * 100 + "%",
      _origin_w: context.option.videoWidth === "100%" ? "" : context.option.videoWidth,
      _origin_h: context.option.videoHeight === "56.25%" ? "" : context.option.videoHeight,
      _proportionChecked: true,
      _resizing: context.option.videoResizing,
      _resizeDotHide: !context.option.videoHeightShow,
      _rotation: context.option.videoRotation,
      _onlyPercentage: context.option.videoSizeOnlyPercentage,
      _ratio: false,
      _ratioX: 1,
      _ratioY: 1,
      _captionShow: false
    };
    var contextVideo = defaultVideo;
    context.video = defaultVideo;
    /** video dialog */

    var video_dialog = this.setDialog.call(core);
    contextVideo.modal = video_dialog;
    contextVideo.videoInputFile = video_dialog.querySelector("._ke_video_file");
    contextVideo.videoUrlFile = video_dialog.querySelector(".ke-input-url");
    contextVideo.focusElement = contextVideo.videoUrlFile || contextVideo.videoInputFile;
    contextVideo.preview = video_dialog.querySelector(".ke-link-preview");
    /** add event listeners */

    video_dialog.querySelector(".ke-btn-primary").addEventListener("click", this.submit.bind(core));

    if (contextVideo.videoInputFile) {
      video_dialog.querySelector(".ke-dialog-files-edge-button").addEventListener("click", this._removeSelectedFiles.bind(contextVideo.videoInputFile, contextVideo.videoUrlFile, contextVideo.preview));
    }

    if (contextVideo.videoInputFile && contextVideo.videoUrlFile) {
      contextVideo.videoInputFile.addEventListener("change", this._fileInputChange.bind(contextVideo));
    }

    if (contextVideo.videoUrlFile) {
      contextVideo.videoUrlFile.addEventListener("input", this._onLinkPreview.bind(contextVideo.preview, contextVideo, context.options.linkProtocol));
    }

    contextVideo.proportion = {};
    contextVideo.videoRatioOption = {};
    contextVideo.inputX = {};
    contextVideo.inputY = {};

    if (context.option.videoResizing) {
      contextVideo.proportion = video_dialog.querySelector("._ke_video_check_proportion");
      contextVideo.videoRatioOption = video_dialog.querySelector(".ke-video-ratio");
      contextVideo.inputX = video_dialog.querySelector("._ke_video_size_x");
      contextVideo.inputY = video_dialog.querySelector("._ke_video_size_y");
      contextVideo.inputX.value = context.option.videoWidth;
      contextVideo.inputY.value = context.option.videoHeight;
      contextVideo.inputX.addEventListener("keyup", this.setInputSize.bind(core, "x"));
      contextVideo.inputY.addEventListener("keyup", this.setInputSize.bind(core, "y"));
      contextVideo.inputX.addEventListener("change", this.setRatio.bind(core));
      contextVideo.inputY.addEventListener("change", this.setRatio.bind(core));
      contextVideo.proportion.addEventListener("change", this.setRatio.bind(core));
      contextVideo.videoRatioOption.addEventListener("change", this.setVideoRatio.bind(core));
      video_dialog.querySelector(".ke-dialog-btn-revert").addEventListener("click", this.sizeRevert.bind(core));
    }
    /** append html */


    context.dialog.modal.appendChild(video_dialog);
    /** empty memory */

    video_dialog = null;
  },

  /** dialog */
  setDialog: function setDialog() {
    var option = this.context.option;
    var lang = this.lang;
    var dialog = this.util.createElement("DIV");
    dialog.className = "ke-dialog-content";
    dialog.style.display = "none";
    var html = "" + '<form method="post" enctype="multipart/form-data">' + '<div class="ke-dialog-header">' + '<button type="button" data-command="close" class="ke-btn ke-dialog-close" aria-label="Close" title="' + lang.dialogBox.close + '">' + this.icons.cancel + "</button>" + '<span class="ke-modal-title">' + lang.dialogBox.videoBox.title + "</span>" + "</div>" + '<div class="ke-dialog-body">';

    if (option.videoFileInput) {
      html += "" + '<div class="ke-dialog-form">' + "<label>" + lang.dialogBox.videoBox.file + "</label>" + '<div class="ke-dialog-form-files">' + '<input class="ke-input-form _ke_video_file" type="file" accept="' + option.videoAccept + '"' + (option.videoMultipleFile ? ' multiple="multiple"' : "") + "/>" + '<button type="button" data-command="filesRemove" class="ke-btn ke-dialog-files-edge-button ke-file-remove" title="' + lang.controller.remove + '">' + this.icons.cancel + "</button>" + "</div>" + "</div>";
    }

    if (option.videoUrlInput) {
      html += "" + '<div class="ke-dialog-form">' + "<label>" + lang.dialogBox.videoBox.url + "</label>" + '<input class="ke-input-form ke-input-url" type="text" />' + '<pre class="ke-link-preview"></pre>' + "</div>";
    }

    if (option.videoResizing) {
      var ratioList = option.videoRatioList || [{
        name: "16:9",
        value: 0.5625
      }, {
        name: "4:3",
        value: 0.75
      }, {
        name: "21:9",
        value: 0.4285
      }];
      var ratio = option.videoRatio;
      var onlyPercentage = option.videoSizeOnlyPercentage;
      var onlyPercentDisplay = onlyPercentage ? ' style="display: none !important;"' : "";
      var heightDisplay = !option.videoHeightShow ? ' style="display: none !important;"' : "";
      var ratioDisplay = !option.videoRatioShow ? ' style="display: none !important;"' : "";
      var onlyWidthDisplay = !onlyPercentage && !option.videoHeightShow && !option.videoRatioShow ? ' style="display: none !important;"' : "";
      html += "" + '<div class="ke-dialog-form">' + '<div class="ke-dialog-size-text">' + '<label class="size-w">' + lang.dialogBox.width + "</label>" + '<label class="ke-dialog-size-x">&nbsp;</label>' + '<label class="size-h"' + heightDisplay + ">" + lang.dialogBox.height + "</label>" + '<label class="size-h"' + ratioDisplay + ">(" + lang.dialogBox.ratio + ")</label>" + "</div>" + '<input class="ke-input-control _ke_video_size_x" placeholder="100%"' + (onlyPercentage ? ' type="number" min="1"' : 'type="text"') + (onlyPercentage ? ' max="100"' : "") + "/>" + '<label class="ke-dialog-size-x"' + onlyWidthDisplay + ">" + (onlyPercentage ? "%" : "x") + "</label>" + '<input class="ke-input-control _ke_video_size_y" placeholder="' + option.videoRatio * 100 + '%"' + (onlyPercentage ? ' type="number" min="1"' : 'type="text"') + (onlyPercentage ? ' max="100"' : "") + heightDisplay + "/>" + '<select class="ke-input-select ke-video-ratio" title="' + lang.dialogBox.ratio + '"' + ratioDisplay + ">";

      if (!heightDisplay) {
        html += '<option value=""> - </option>';
      }

      for (var i = 0, len = ratioList.length; i < len; i++) {
        html += '<option value="' + ratioList[i].value + '"' + (ratio.toString() === ratioList[i].value.toString() ? " selected" : "") + ">" + ratioList[i].name + "</option>";
      }

      html += "</select>" + '<button type="button" title="' + lang.dialogBox.revertButton + '" class="ke-btn ke-dialog-btn-revert" style="float: right;">' + this.icons.revert + "</button>" + "</div>" + '<div class="ke-dialog-form ke-dialog-form-footer"' + onlyPercentDisplay + onlyWidthDisplay + ">" + '<label><input type="checkbox" class="ke-dialog-btn-check _ke_video_check_proportion" checked/>&nbsp;' + lang.dialogBox.proportion + "</label>" + "</div>";
    }

    html += "" + "</div>" + '<div class="ke-dialog-footer">' + "<div>" + '<label><input type="radio" name="kothing-editor_video_radio" class="ke-dialog-btn-radio" value="none" checked>' + lang.dialogBox.basic + "</label>" + '<label><input type="radio" name="kothing-editor_video_radio" class="ke-dialog-btn-radio" value="left">' + lang.dialogBox.left + "</label>" + '<label><input type="radio" name="kothing-editor_video_radio" class="ke-dialog-btn-radio" value="center">' + lang.dialogBox.center + "</label>" + '<label><input type="radio" name="kothing-editor_video_radio" class="ke-dialog-btn-radio" value="right">' + lang.dialogBox.right + "</label>" + "</div>" + '<button type="submit" class="ke-btn-primary" title="' + lang.dialogBox.submitButton + '"><span>' + lang.dialogBox.submitButton + "</span></button>" + "</div>" + "</form>";
    dialog.innerHTML = html;
    return dialog;
  },
  _fileInputChange: function _fileInputChange() {
    if (!this.videoInputFile.value) {
      this.videoUrlFile.removeAttribute("disabled");
      this.preview.style.textDecoration = "";
    } else {
      this.videoUrlFile.setAttribute("disabled", true);
      this.preview.style.textDecoration = "line-through";
    }
  },
  _removeSelectedFiles: function _removeSelectedFiles(urlInput, preview) {
    this.value = "";

    if (urlInput) {
      urlInput.removeAttribute("disabled");
      preview.style.textDecoration = "";
    }
  },
  _onLinkPreview: function _onLinkPreview(context, protocol, e) {
    var value = e.target.value.trim();

    if (/^<iframe.*\/iframe>$/.test(value)) {
      context._linkValue = value;
      this.textContent = '<IFrame :src=".."></IFrame>';
    } else {
      context._linkValue = !value ? "" : protocol && value.indexOf("://") === -1 && value.indexOf("#") !== 0 ? protocol + value : value.indexOf("://") === -1 ? "/" + value : value;
      this.textContent = !value ? "" : protocol && value.indexOf("://") === -1 && value.indexOf("#") !== 0 ? protocol + value : value.indexOf("://") === -1 ? "/" + value : value;
    }
  },
  _setTagAttrs: function _setTagAttrs(element) {
    element.setAttribute("controls", true);
    var attrs = this.context.options.videoTagAttrs;

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
  createVideoTag: function createVideoTag() {
    var videoTag = this.util.createElement("VIDEO");

    this.plugins.video._setTagAttrs.call(this, videoTag);

    return videoTag;
  },
  _setIframeAttrs: function _setIframeAttrs(element) {
    element.frameBorder = "0";
    element.allowFullscreen = true;
    var attrs = this.context.options.videoIframeAttrs;

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
  createIframeTag: function createIframeTag() {
    var iframeTag = this.util.createElement("IFRAME");

    this.plugins.video._setIframeAttrs.call(this, iframeTag);

    return iframeTag;
  },

  /**
   * @Override @Required fileManager
   */
  fileTags: ["iframe", "video"],

  /**
   * @Override core, resizing, fileManager
   * @description It is called from core.selectComponent.
   * @param {Element} element Target element
   */
  select: function select(element) {
    this.plugins.video.onModifyMode.call(this, element, this.plugins.resizing.call_controller_resize.call(this, element, "video"));
  },

  /**
   * @Override fileManager, resizing
   */
  destroy: function destroy(element) {
    var frame = element || this.context.video._element;
    var container = this.context.video._container;
    var dataIndex = frame.getAttribute("data-index") * 1;
    var focusEl = container.previousElementSibling || container.nextElementSibling;
    var emptyDiv = container.parentNode;
    this.util.removeItem(container);
    this.plugins.video.init.call(this);
    this.controllersOff();

    if (emptyDiv !== this.context.element.wysiwyg) {
      this.util.removeItemAllParents(emptyDiv, function (current) {
        return current.childNodes.length === 0;
      }, null);
    } // focus


    this.focusEdge(focusEl); // event

    this.plugins.fileManager.deleteInfo.call(this, "video", dataIndex, this.functions.onVideoUpload); // history stack

    this.history.push(false);
  },

  /**
   * @Required @Override dialog
   */
  on: function on(update) {
    var contextVideo = this.context.video;

    if (!update) {
      contextVideo.inputX.value = contextVideo._origin_w = this.context.option.videoWidth === contextVideo._defaultSizeX ? "" : this.context.option.videoWidth;
      contextVideo.inputY.value = contextVideo._origin_h = this.context.option.videoHeight === contextVideo._defaultSizeY ? "" : this.context.option.videoHeight;
      contextVideo.proportion.disabled = true;

      if (contextVideo.videoInputFile && this.context.options.videoMultipleFile) {
        contextVideo.videoInputFile.setAttribute("multiple", "multiple");
      }
    } else {
      if (contextVideo.videoInputFile && this.context.options.videoMultipleFile) {
        contextVideo.videoInputFile.removeAttribute("multiple");
      }
    }

    if (contextVideo._resizing) {
      this.plugins.video.setVideoRatioSelect.call(this, contextVideo._origin_h || contextVideo._defaultRatio);
    }
  },

  /**
   * @Required @Override dialog
   */
  open: function open() {
    this.plugins.dialog.open.call(this, "video", this.currentControllerName === "video");
  },
  setVideoRatio: function setVideoRatio(e) {
    var contextVideo = this.context.video;
    var value = e.target.options[e.target.selectedIndex].value;
    contextVideo._defaultSizeY = !value ? contextVideo._defaultSizeY : value * 100 + "%";
    contextVideo._videoRatio = !value ? contextVideo._defaultSizeY : value * 100 + "%";
    contextVideo.inputY.placeholder = !value ? "" : value * 100 + "%";
    contextVideo.inputY.value = "";
  },

  /**
   * @Override resizing
   * @param {String} xy 'x': width, 'y': height
   * @param {KeyboardEvent} e Event object
   */
  setInputSize: function setInputSize(xy, e) {
    if (e && e.keyCode === 32) {
      e.preventDefault();
      return;
    }

    var contextVideo = this.context.video;

    this.plugins.resizing._module_setInputSize.call(this, contextVideo, xy);

    if (xy === "y") {
      this.plugins.video.setVideoRatioSelect.call(this, e.target.value || contextVideo._defaultRatio);
    }
  },

  /**
   * @Override resizing
   */
  setRatio: function setRatio() {
    this.plugins.resizing._module_setRatio.call(this, this.context.video);
  },
  submit: function submit(e) {
    var contextVideo = this.context.video;
    var videoPlugin = this.plugins.video;
    e.preventDefault();
    e.stopPropagation();
    contextVideo._align = contextVideo.modal.querySelector('input[name="kothing-editor_video_radio"]:checked').value;

    try {
      if (contextVideo.videoInputFile && contextVideo.videoInputFile.files.length > 0) {
        this.showLoading();
        videoPlugin.submitAction.call(this, this.context.video.videoInputFile.files);
      } else if (contextVideo.videoUrlFile && contextVideo._linkValue.length > 0) {
        this.showLoading();
        videoPlugin.setup_url.call(this);
      }
    } catch (error) {
      this.closeLoading();
      throw Error('[KothingEditor.video.submit.fail] cause : "' + error.message + '"');
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
      if (/video/i.test(fileList[i].type)) {
        files.push(fileList[i]);
        fileSize += fileList[i].size;
      }
    }

    var limitSize = this.context.option.videoUploadSizeLimit;

    if (limitSize > 0) {
      var infoSize = 0;
      var videosInfo = this.context.video._infoList;

      for (var _i = 0, _len = videosInfo.length; _i < _len; _i++) {
        infoSize += videosInfo[_i].size * 1;
      }

      if (fileSize + infoSize > limitSize) {
        this.closeLoading();
        var err = "[KothingEditor.videoUpload.fail] Size of uploadable total videos: " + limitSize / 1000 + "KB";

        if (this.functions.onVideoUploadError !== "function" || this.functions.onVideoUploadError(err, {
          limitSize: limitSize,
          currentSize: infoSize,
          uploadSize: fileSize
        }, this)) {
          this.functions.noticeOpen(err);
        }

        return;
      }
    }

    var contextVideo = this.context.video;
    contextVideo._uploadFileLength = files.length;
    var info = {
      inputWidth: contextVideo.inputX.value,
      inputHeight: contextVideo.inputY.value,
      align: contextVideo._align,
      isUpdate: this.context.dialog.updateModal,
      element: contextVideo._element
    };

    if (typeof this.functions.onVideoUploadBefore === "function") {
      var result = this.functions.onVideoUploadBefore(files, info, this, function (data) {
        if (data && this._w.Array.isArray(data.result)) {
          this.plugins.video.register.call(this, info, data);
        } else {
          this.plugins.video.upload.call(this, info, data);
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

    this.plugins.video.upload.call(this, info, files);
  },
  error: function error(message, response) {
    this.closeLoading();

    if (typeof this.functions.onVideoUploadError !== "function" || this.functions.onVideoUploadError(message, response, this)) {
      this.functions.noticeOpen(message);
      throw Error("[KothingEditor.plugin.video.error] response: " + message);
    }
  },
  upload: function upload(info, files) {
    if (!files) {
      this.closeLoading();
      return;
    }

    if (typeof files === "string") {
      this.plugins.video.error.call(this, files, null);
      return;
    }

    var videoUploadUrl = this.context.option.videoUploadUrl;
    var filesLen = this.context.dialog.updateModal ? 1 : files.length; // server upload

    if (typeof videoUploadUrl === "string" && videoUploadUrl.length > 0) {
      var formData = new FormData();

      for (var i = 0; i < filesLen; i++) {
        formData.append("file-" + i, files[i]);
      }

      this.plugins.fileManager.upload.call(this, videoUploadUrl, this.context.option.videoUploadHeader, formData, this.plugins.video.callBack_videoUpload.bind(this, info), this.functions.onVideoUploadError);
    } else {
      throw Error('[KothingEditor.videoUpload.fail] cause : There is no "videoUploadUrl" option.');
    }
  },
  callBack_videoUpload: function callBack_videoUpload(info, xmlHttp) {
    if (typeof this.functions.videoUploadHandler === "function") {
      this.functions.videoUploadHandler(xmlHttp, info, this);
    } else {
      var response = JSON.parse(xmlHttp.responseText);

      if (response.errorMessage) {
        this.plugins.video.error.call(this, response.errorMessage, response);
      } else {
        this.plugins.video.register.call(this, info, response);
      }
    }
  },
  register: function register(info, response) {
    var fileList = response.result;
    var videoTag = this.plugins.video.createVideoTag.call(this);

    for (var i = 0, len = fileList.length, file; i < len; i++) {
      file = {
        name: fileList[i].name,
        size: fileList[i].size
      };
      this.plugins.video.create_video.call(this, info.isUpdate ? info.element : videoTag.cloneNode(false), fileList[i].url, info.inputWidth, info.inputHeight, info.align, file, info.isUpdate);
    }

    this.closeLoading();
  },
  setup_url: function setup_url() {
    try {
      var contextVideo = this.context.video;
      var url = contextVideo._linkValue;

      if (url.length === 0) {
        return false;
      }
      /** iframe source */


      if (/^<iframe.*\/iframe>$/.test(url)) {
        var oIframe = new this._w.DOMParser().parseFromString(url, "text/html").querySelector("iframe");
        url = oIframe.src;

        if (url.length === 0) {
          return false;
        }
      }
      /** youtube */


      if (/youtu\.?be/.test(url)) {
        if (!/^http/.test(url)) {
          url = "https://" + url;
        }

        url = url.replace("watch?v=", "");

        if (!/^\/\/.+\/embed\//.test(url)) {
          url = url.replace(url.match(/\/\/.+\//)[0], "//www.youtube.com/embed/").replace("&", "?&");
        }

        if (contextVideo._youtubeQuery.length > 0) {
          if (/\?/.test(url)) {
            var splitUrl = url.split("?");
            url = splitUrl[0] + "?" + contextVideo._youtubeQuery + "&" + splitUrl[1];
          } else {
            url += "?" + contextVideo._youtubeQuery;
          }
        }
      } else if (/vimeo\.com/.test(url)) {
        if (url.endsWith("/")) {
          url = url.slice(0, -1);
        }

        url = "https://player.vimeo.com/video/" + url.slice(url.lastIndexOf("/") + 1);
      }

      this.plugins.video.create_video.call(this, this.plugins.video.createIframeTag.call(this), url, contextVideo.inputX.value, contextVideo.inputY.value, contextVideo._align, null, this.context.dialog.updateModal);
    } catch (error) {
      throw Error('[KothingEditor.video.upload.fail] cause : "' + error.message + '"');
    } finally {
      this.closeLoading();
    }
  },
  create_video: function create_video(oFrame, src, width, height, align, file, isUpdate) {
    this.context.resizing._resize_plugin = "video";
    var contextVideo = this.context.video;
    var cover = null;
    var container = null;
    var init = false;
    /** update */

    if (isUpdate) {
      oFrame = contextVideo._element;

      if (oFrame.src !== src) {
        init = true;
        var isYoutube = /youtu\.?be/.test(src);
        var isVimeo = /vimeo\.com/.test(src);

        if ((isYoutube || isVimeo) && !/^iframe$/i.test(oFrame.nodeName)) {
          var newTag = this.plugins.video.createIframeTag.call(this);
          newTag.src = src;
          oFrame.parentNode.replaceChild(newTag, oFrame);
          contextVideo._element = newTag;
          oFrame = newTag;
        } else if (!isYoutube && !isVimeo && !/^videoo$/i.test(oFrame.nodeName)) {
          var _newTag = this.plugins.video.createVideoTag.call(this);

          _newTag.src = src;
          oFrame.parentNode.replaceChild(_newTag, oFrame);
          contextVideo._element = _newTag;
          oFrame = _newTag;
        } else {
          oFrame.src = src;
        }
      }

      container = contextVideo._container;
      cover = this.util.getParentElement(oFrame, "FIGURE");
    } else {
      /** create */
      init = true;
      oFrame.src = src;
      contextVideo._element = oFrame;
      cover = this.plugins.component.set_cover.call(this, oFrame);
      container = this.plugins.component.set_container.call(this, cover, "ke-video-container");
    }
    /** rendering */


    contextVideo._cover = cover;
    contextVideo._container = container;

    var inputUpdate = this.plugins.resizing._module_getSizeX.call(this, contextVideo) !== (width || contextVideo._defaultSizeX) || this.plugins.resizing._module_getSizeY.call(this, contextVideo) !== (height || contextVideo._videoRatio);

    var changeSize = !isUpdate || inputUpdate;

    if (contextVideo._resizing) {
      this.context.video._proportionChecked = contextVideo.proportion.checked;
      oFrame.setAttribute("data-proportion", contextVideo._proportionChecked);
    } // size


    var isPercent = false;

    if (changeSize) {
      isPercent = this.plugins.video.applySize.call(this);
    } // align


    if (!(isPercent && align === "center")) {
      this.plugins.video.setAlign.call(this, null, oFrame, cover, container);
    }

    var changed = true;

    if (!isUpdate) {
      changed = this.insertComponent(container, false, true, false);
    } else if (contextVideo._resizing && this.context.resizing._rotateVertical && changeSize) {
      this.plugins.resizing.setTransformSize.call(this, oFrame, null, null);
    }

    if (changed) {
      if (init) {
        this.plugins.fileManager.setInfo.call(this, "video", oFrame, this.functions.onVideoUpload, file, true);
      }

      if (isUpdate) {
        this.selectComponent(oFrame, "video"); // history stack

        this.history.push(false);
      }
    }

    this.context.resizing._resize_plugin = "";
  },
  _update_videoCover: function _update_videoCover(oFrame) {
    if (!oFrame) {
      return;
    }

    var contextVideo = this.context.video;

    if (/^video$/i.test(oFrame.nodeName)) {
      this.plugins.video._setTagAttrs.call(this, oFrame);
    } else {
      this.plugins.video._setIframeAttrs.call(this, oFrame);
    }

    var existElement = this.util.getParentElement(oFrame, this.util.isMediaComponent) || this.util.getParentElement(oFrame, function (current) {
      return this.isWysiwygDiv(current.parentNode);
    }.bind(this.util));
    contextVideo._element = oFrame.cloneNode(true);
    oFrame = oFrame.cloneNode(true);
    var cover = this.plugins.component.set_cover.call(this, oFrame);
    contextVideo._cover = this.plugins.component.set_cover.call(this, oFrame);
    var container = this.plugins.component.set_container.call(this, cover, "ke-video-container");
    contextVideo._container = this.plugins.component.set_container.call(this, cover, "ke-video-container");
    var figcaption = existElement.querySelector("figcaption");
    var caption = null;

    if (figcaption) {
      caption = this.util.createElement("DIV");
      caption.innerHTML = figcaption.innerHTML;
      this.util.removeItem(figcaption);
    }

    var size = (oFrame.getAttribute("data-size") || oFrame.getAttribute("data-origin") || "").split(",");
    this.plugins.video.applySize.call(this, size[0], size[1]);
    existElement.parentNode.replaceChild(container, existElement);

    if (caption) {
      existElement.parentNode.insertBefore(caption, container.nextElementSibling);
    }

    this.plugins.fileManager.setInfo.call(this, "video", oFrame, this.functions.onVideoUpload, null, true);
  },

  /**
   * @Required @Override fileManager, resizing
   */
  onModifyMode: function onModifyMode(element, size) {
    var contextVideo = this.context.video;
    contextVideo._element = element;
    contextVideo._cover = this.util.getParentElement(element, "FIGURE");
    contextVideo._container = this.util.getParentElement(element, this.util.isMediaComponent);
    contextVideo._align = element.getAttribute("data-align") || "none";

    if (size) {
      contextVideo._element_w = size.w;
      contextVideo._element_h = size.h;
      contextVideo._element_t = size.t;
      contextVideo._element_l = size.l;
    }

    var origin = contextVideo._element.getAttribute("data-size") || contextVideo._element.getAttribute("data-origin");

    if (origin) {
      origin = origin.split(",");
      contextVideo._origin_w = origin[0];
      contextVideo._origin_h = origin[1];
    } else if (size) {
      contextVideo._origin_w = size.w;
      contextVideo._origin_h = size.h;
    }
  },

  /**
   * @Required @Override fileManager, resizing
   */
  openModify: function openModify(notOpen) {
    var contextVideo = this.context.video;

    if (contextVideo.videoUrlFile) {
      contextVideo._linkValue = contextVideo._element.src || (contextVideo._element.querySelector("source") || "").src || "";
      contextVideo.preview.textContent = contextVideo._element.src || (contextVideo._element.querySelector("source") || "").src || "";
      contextVideo.videoUrlFile.value = contextVideo._element.src || (contextVideo._element.querySelector("source") || "").src || "";
    }

    contextVideo.modal.querySelector('input[name="kothing-editor_video_radio"][value="' + contextVideo._align + '"]').checked = true;

    if (contextVideo._resizing) {
      this.plugins.resizing._module_setModifyInputSize.call(this, contextVideo, this.plugins.video);

      var y = this.plugins.resizing._module_getSizeY.call(this, contextVideo);

      contextVideo._videoRatio = this.plugins.resizing._module_getSizeY.call(this, contextVideo);
      var ratioSelected = this.plugins.video.setVideoRatioSelect.call(this, y);

      if (!ratioSelected) {
        contextVideo.inputY.value = contextVideo._onlyPercentage ? this.util.getNumber(y, 2) : y;
      }
    }

    if (!notOpen) {
      this.plugins.dialog.open.call(this, "video", true);
    }
  },
  setVideoRatioSelect: function setVideoRatioSelect(value) {
    var ratioSelected = false;
    var contextVideo = this.context.video;
    var ratioOptions = contextVideo.videoRatioOption.options;

    if (/%$/.test(value) || contextVideo._onlyPercentage) {
      value = this.util.getNumber(value, 2) / 100 + "";
    } else if (!this.util.isNumber(value) || value * 1 >= 1) {
      value = "";
    }

    contextVideo.inputY.placeholder = "";

    for (var i = 0, len = ratioOptions.length; i < len; i++) {
      if (ratioOptions[i].value === value) {
        ratioSelected = true;
        ratioOptions[i].selected = true;
        contextVideo.inputY.placeholder = !value ? "" : value * 100 + "%";
      } else {
        ratioOptions[i].selected = false;
      }
    }

    return ratioSelected;
  },

  /**
   * @Override fileManager
   */
  checkFileInfo: function checkFileInfo() {
    this.plugins.fileManager.checkInfo.call(this, "video", ["iframe", "video"], this.functions.onVideoUpload, this.plugins.video._update_videoCover.bind(this), true);
  },

  /**
   * @Override fileManager
   */
  resetFileInfo: function resetFileInfo() {
    this.plugins.fileManager.resetInfo.call(this, "video", this.functions.onVideoUpload);
  },

  /**
   * @Override resizing
   */
  sizeRevert: function sizeRevert() {
    this.plugins.resizing._module_sizeRevert.call(this, this.context.video);
  },

  /**
   * @Override resizing
   */
  applySize: function applySize(w, h) {
    var contextVideo = this.context.video;

    if (!w) {
      w = contextVideo.inputX.value || this.context.option.videoWidth;
    }

    if (!h) {
      h = contextVideo.inputY.value || this.context.option.videoHeight;
    }

    if (contextVideo._onlyPercentage || /%$/.test(w) || !w) {
      this.plugins.video.setPercentSize.call(this, w || "100%", h || (/%$/.test(contextVideo._videoRatio) ? contextVideo._videoRatio : contextVideo._defaultRatio));
      return true;
    } else if ((!w || w === "auto") && (!h || h === "auto")) {
      this.plugins.video.setAutoSize.call(this);
    } else {
      this.plugins.video.setSize.call(this, w, h || contextVideo._videoRatio || contextVideo._defaultRatio, false);
    }

    return false;
  },

  /**
   * @Override resizing
   */
  setSize: function setSize(w, h, notResetPercentage, direction) {
    var contextVideo = this.context.video;
    var onlyW = /^(rw|lw)$/.test(direction);
    var onlyH = /^(th|bh)$/.test(direction);

    if (!onlyH) {
      w = this.util.getNumber(w, 0);
    }

    if (!onlyW) {
      h = this.util.isNumber(h) ? h + contextVideo.sizeUnit : !h ? "" : h;
    }

    if (!onlyH) {
      contextVideo._element.style.width = w ? w + contextVideo.sizeUnit : "";
    }

    if (!onlyW) {
      contextVideo._cover.style.paddingBottom = h;
      contextVideo._cover.style.height = h;
    }

    if (!onlyH && !/%$/.test(w)) {
      contextVideo._cover.style.width = "";
      contextVideo._container.style.width = "";
    }

    if (!onlyW && !/%$/.test(h)) {
      contextVideo._element.style.height = h;
    } else {
      contextVideo._element.style.height = "";
    }

    if (!notResetPercentage) {
      contextVideo._element.removeAttribute("data-percentage");
    } // save current size


    this.plugins.resizing._module_saveCurrentSize.call(this, contextVideo);
  },

  /**
   * @Override resizing
   */
  setAutoSize: function setAutoSize() {
    this.plugins.video.setPercentSize.call(this, 100, this.context.video._defaultRatio);
  },

  /**
   * @Override resizing
   */
  setOriginSize: function setOriginSize(dataSize) {
    var contextVideo = this.context.video;

    contextVideo._element.removeAttribute("data-percentage");

    this.plugins.resizing.resetTransform.call(this, contextVideo._element);
    this.plugins.video.cancelPercentAttr.call(this);
    var originSize = ((dataSize ? contextVideo._element.getAttribute("data-size") : "") || contextVideo._element.getAttribute("data-origin") || "").split(",");

    if (originSize) {
      var w = originSize[0];
      var h = originSize[1];

      if (contextVideo._onlyPercentage || /%$/.test(w) && (/%$/.test(h) || !/\d/.test(h))) {
        this.plugins.video.setPercentSize.call(this, w, h);
      } else {
        this.plugins.video.setSize.call(this, w, h);
      } // save current size


      this.plugins.resizing._module_saveCurrentSize.call(this, contextVideo);
    }
  },

  /**
   * @Override resizing
   */
  setPercentSize: function setPercentSize(w, h) {
    var contextVideo = this.context.video;
    h = !!h && !/%$/.test(h) && !this.util.getNumber(h, 0) ? this.util.isNumber(h) ? h + "%" : h : this.util.isNumber(h) ? h + contextVideo.sizeUnit : h || contextVideo._defaultRatio;
    contextVideo._container.style.width = this.util.isNumber(w) ? w + "%" : w;
    contextVideo._container.style.height = "";
    contextVideo._cover.style.width = "100%";
    contextVideo._cover.style.height = h;
    contextVideo._cover.style.paddingBottom = h;
    contextVideo._element.style.width = "100%";
    contextVideo._element.style.height = "100%";
    contextVideo._element.style.maxWidth = "";

    if (contextVideo._align === "center") {
      this.plugins.video.setAlign.call(this, null, null, null, null);
    }

    contextVideo._element.setAttribute("data-percentage", w + "," + h); // save current size


    this.plugins.resizing._module_saveCurrentSize.call(this, contextVideo);
  },

  /**
   * @Override resizing
   */
  cancelPercentAttr: function cancelPercentAttr() {
    var contextVideo = this.context.video;
    contextVideo._cover.style.width = "";
    contextVideo._cover.style.height = "";
    contextVideo._cover.style.paddingBottom = "";
    contextVideo._container.style.width = "";
    contextVideo._container.style.height = "";
    this.util.removeClass(contextVideo._container, this.context.video._floatClassRegExp);
    this.util.addClass(contextVideo._container, "__ke__float-" + contextVideo._align);

    if (contextVideo._align === "center") {
      this.plugins.video.setAlign.call(this, null, null, null, null);
    }
  },

  /**
   * @Override resizing
   */
  setAlign: function setAlign(align, element, cover, container) {
    var contextVideo = this.context.video;

    if (!align) {
      align = contextVideo._align;
    }

    if (!element) {
      element = contextVideo._element;
    }

    if (!cover) {
      cover = contextVideo._cover;
    }

    if (!container) {
      container = contextVideo._container;
    }

    if (align && align !== "none") {
      cover.style.margin = "auto";
    } else {
      cover.style.margin = "0";
    }

    if (/%$/.test(element.style.width) && align === "center") {
      container.style.minWidth = "100%";
      cover.style.width = container.style.width;
      cover.style.height = container.style.height;
      cover.style.paddingBottom = !/%$/.test(cover.style.height) ? cover.style.height : this.util.getNumber(this.util.getNumber(cover.style.height, 2) / 100 * this.util.getNumber(cover.style.width, 2), 2) + "%";
    } else {
      container.style.minWidth = "";
      cover.style.width = this.context.resizing._rotateVertical ? element.style.height || element.offsetHeight : element.style.width || "100%";
      cover.style.paddingBottom = cover.style.height;
    }

    if (!this.util.hasClass(container, "__ke__float-" + align)) {
      this.util.removeClass(container, contextVideo._floatClassRegExp);
      this.util.addClass(container, "__ke__float-" + align);
    }

    element.setAttribute("data-align", align);
  },
  resetAlign: function resetAlign() {
    var contextVideo = this.context.video;

    contextVideo._element.setAttribute("data-align", "");

    contextVideo._align = "none";
    contextVideo._cover.style.margin = "0";
    this.util.removeClass(contextVideo._container, contextVideo._floatClassRegExp);
  },

  /**
   * @Override dialog
   */
  init: function init() {
    var contextVideo = this.context.video;

    if (contextVideo.videoInputFile) {
      contextVideo.videoInputFile.value = "";
    }

    if (contextVideo.videoUrlFile) {
      contextVideo._linkValue = "";
      contextVideo.preview.textContent = "";
      contextVideo.videoUrlFile.value = "";
    }

    if (contextVideo.videoInputFile && contextVideo.videoUrlFile) {
      contextVideo.videoUrlFile.removeAttribute("disabled");
      contextVideo.preview.style.textDecoration = "";
    }

    contextVideo._origin_w = this.context.option.videoWidth;
    contextVideo._origin_h = this.context.option.videoHeight;
    contextVideo.modal.querySelector('input[name="kothing-editor_video_radio"][value="none"]').checked = true;

    if (contextVideo._resizing) {
      contextVideo.inputX.value = this.context.option.videoWidth === contextVideo._defaultSizeX ? "" : this.context.option.videoWidth;
      contextVideo.inputY.value = this.context.option.videoHeight === contextVideo._defaultSizeY ? "" : this.context.option.videoHeight;
      contextVideo.proportion.checked = true;
      contextVideo.proportion.disabled = true;
      this.plugins.video.setVideoRatioSelect.call(this, contextVideo._defaultRatio);
    }
  }
};
exports.default = _default;