/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "moment"
var external_moment_namespaceObject = moment;
;// CONCATENATED MODULE: external "axios"
var external_axios_namespaceObject = axios;
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_namespaceObject);
;// CONCATENATED MODULE: ./templates/service.js

var api = {
  getArticles: "/api/articles",
  upload: "/api/upload"
};
var Network = {
  fetch: function fetch(url, config) {
    return new Promise(function (resolve, reject) {
      external_axios_default().get(url, config).then(function (res) {
        resolve(res.data);
      }).catch(function (err) {
        reject(err);
      });
    });
  },
  put: function put(url, data, config) {
    return new Promise(function (resolve, reject) {
      external_axios_default().put(url, data, config).then(function (res) {
        resolve(res.data);
      }).catch(function (err) {
        reject(err);
      });
    });
  },
  post: function post(url, config) {
    return new Promise(function (resolve, reject) {
      external_axios_default().get(url, config).then(function (res) {
        resolve(res);
      }).catch(function (err) {
        reject(err);
      });
    });
  },
  delete: function _delete(url, config) {
    return new Promise(function (resolve, reject) {
      external_axios_default().delete(url, config).then(function (res) {
        resolve(res);
      }).catch(function (err) {
        reject(err);
      });
    });
  }
};
var Service = Object.create(Network);

Service.getArticles = function (config) {
  return this.fetch(api.getArticles, config);
};

Service.getArticlesByTagAndYear = function (tag, year, config) {
  return this.fetch("".concat(api.getArticles, "/").concat(tag, "/").concat(year), config);
};

Service.getArticlesByYear = function (year, config) {
  return this.fetch("".concat(api.getArticles, "/").concat(year), config);
};

Service.upload = function (data, config) {
  return this.put(api.upload, data, config);
};

/* harmony default export */ var service = (Service);
;// CONCATENATED MODULE: external "_"
var external_namespaceObject = _;
var external_default = /*#__PURE__*/__webpack_require__.n(external_namespaceObject);
;// CONCATENATED MODULE: ./templates/archives/model.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr && (typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]); if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



var INVALIDTIME = "00:00:00";
var Model = {
  modelData: [],
  initWithYear: function initWithYear(year, config) {
    return service.getArticlesByYear.apply(service, arguments);
  },
  initWithTagAndYear: function initWithTagAndYear(tag, year, config) {
    return service.getArticlesByTagAndYear.apply(service, arguments);
  },
  formatData: function formatData(data) {
    if (!external_default().isArray(data)) return;
    data.forEach(function (value, index, arr) {
      var _data$index$article_t = data[index].article_time.split('T'),
          _data$index$article_t2 = _slicedToArray(_data$index$article_t, 2),
          day = _data$index$article_t2[0],
          time = _data$index$article_t2[1];

      data[index].article_time = time === INVALIDTIME ? day : "".concat(day, " ").concat(time);
    });
    return data;
  }
};
/* harmony default export */ var model = (Model);
;// CONCATENATED MODULE: ./templates/archives/view.js


function generateArticleList(data) {
  if (!external_default().isArray(data)) return;
  var result = '';
  data.forEach(function (value, index, arr) {
    result += "<li class=\"item\"><p class=\"ellipsis\"><time>".concat(value.article_time, "</time><a href=\"/article_detail/").concat(value.article_id, "\">").concat(value.article_title, "</a></p></li>");
  });
  return result;
}


;// CONCATENATED MODULE: ./templates/utils.js
function getOneViewportHeigh() {
  return document.documentElement.clientHeight + "px";
}

function getElementComputedProperty(element, property) {
  if (window.getComputedStyle) return property ? window.getComputedStyle(element, null)[property] : null;
  if (element.currentStyle) return element.currentStyle[property];
}

function clearInnerhtml(element) {
  var _this = this;

  if (element instanceof Array) {
    element.forEach(function (ele) {
      _this.clearInnerhtml(ele);
    });
  }

  element.innerHTML = "";
}

function isExsitDom(selector) {
  return $(selector).length > 0;
}


;// CONCATENATED MODULE: external "$"
var external_$_namespaceObject = $;
var external_$_default = /*#__PURE__*/__webpack_require__.n(external_$_namespaceObject);
;// CONCATENATED MODULE: ./templates/touchBottomFlush.js
var touchBottomFlush = {
  flush: null,
  scrollEnd: null,
  eventListener: function eventListener() {
    var _this = this;

    window.onmousewheel = function () {
      if (_this.scrollEnd) clearTimeout(_this.scrollEnd);
      _this.scrollEnd = setTimeout(function () {
        _this.mouseWheel();
      }, 100);
    };

    window.addEventListener("touchmove", function () {
      _this.mouseWheel();
    });
  },
  removeListener: function removeListener() {
    window.onmousewheel = null;
  },
  mouseWheel: function mouseWheel() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageXOffset;
    var contentHeight = document.documentElement.scrollHeight;
    var viewHeight = document.documentElement.clientHeight;
    var bottom = Math.ceil(scrollTop + viewHeight);

    if (bottom >= contentHeight) {
      this.flush();
    }
  },
  setup: function setup(action) {
    this.flush = action;
    this.eventListener();
  }
};

;// CONCATENATED MODULE: ./templates/archives/archives.js







(function () {
  var currentYear = parseFloat(external_moment_namespaceObject().format("YYYY"));
  var archiveDom = document.getElementById("archive");
  var offset = 0;
  var limit = 10;
  var fetched_count = 0;
  var allEnd = false;
  var tag;
  var modelType;

  function renderOneViewPortYPage() {
    var modelInitor;
    if (allEnd) return;

    switch (modelType) {
      case "year":
        modelInitor = model.initWithYear(currentYear, {
          params: {
            offset: offset,
            limit: limit,
            fetched_count: fetched_count
          }
        });
        break;

      case "year and tag":
        modelInitor = model.initWithTagAndYear(tag, currentYear, {
          params: {
            offset: offset,
            limit: limit,
            fetched_count: fetched_count
          }
        });
        break;

      default:
        modelInitor = model.initWithYear(currentYear, {
          params: {
            offset: offset,
            limit: limit,
            fetched_count: fetched_count
          }
        });
        break;
    }

    modelInitor.then(function (res) {
      if (res.end) {
        allEnd = true;
        return;
      }

      if (!res.result) {
        currentYear--, offset = 0;
        if (!isEnoughOneViewPortY()) renderOneViewPortYPage(modelType);
        return;
      }

      model.modelData.concat(model.formatData(res.data));
      if (isExsitDom("h3[id=".concat(currentYear, "]"))) external_$_default()("#".concat(currentYear)).next().append(generateArticleList(res.data));
      if (!isExsitDom("h3[id=".concat(currentYear, "]"))) external_$_default()("div[id=archive]").append("<h3 id='".concat(currentYear, "'>").concat(currentYear, "</h3><ul class='post-list'>").concat(generateArticleList(res.data), "</ul>"));
      offset += 10, fetched_count += res.data.length;

      if (res.data.length < 10) {
        offset = 0, currentYear--;
      }

      if (!isEnoughOneViewPortY()) renderOneViewPortYPage(modelType);
    });
  }

  function isExsitDom(selector) {
    return external_$_default()(selector).length > 0;
  }

  function isEnoughOneViewPortY() {
    return document.documentElement.offsetHeight >= window.innerHeight + 50;
  }

  (function init() {
    touchBottomFlush.setup(renderOneViewPortYPage);
    external_$_default()("#theme-tag").on("click", function (e) {
      tag = e.target.getAttribute("tag"), currentYear = parseFloat(external_moment_namespaceObject().format("YYYY")), offset = 0, fetched_count = 0, model.modelData = [];
      clearInnerhtml(archiveDom);
      allEnd = false;
      modelType = "year and tag";
      renderOneViewPortYPage();
    });
    clearInnerhtml(archiveDom);
    modelType = "year";
    renderOneViewPortYPage();
  })();
})();
/******/ })()
;