/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2840:
/***/ (function() {

(function () {
  var h1 = {
    dom: document.getElementById('h1'),
    event: function event() {
      document.execCommand('formatblock', false, 'H1');
    },
    init: function init() {
      this.dom.onclick = this.event;
    }
  };
  h1.init();
})();

/***/ }),

/***/ 4708:
/***/ (function() {

(function () {
  var h2 = {
    dom: document.getElementById('h2'),
    event: function event() {
      document.execCommand('formatblock', false, 'H2');
    },
    init: function init() {
      this.dom.onclick = this.event;
    }
  };
  h2.init();
})();

/***/ }),

/***/ 9003:
/***/ (function() {

(function () {
  var splitLine = {
    dom: document.getElementById("cutline"),
    event: function event() {
      document.execCommand("insertHTML", false, "<hr><p><br></p>");
    },
    init: function init() {
      this.dom.onclick = this.event;
    }
  };
  splitLine.init();
})();

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

// EXTERNAL MODULE: ./templates/admin/publish/editor_component/menus/h1.js
var h1 = __webpack_require__(2840);
// EXTERNAL MODULE: ./templates/admin/publish/editor_component/menus/h2.js
var h2 = __webpack_require__(4708);
// EXTERNAL MODULE: ./templates/admin/publish/editor_component/menus/splitLine.js
var splitLine = __webpack_require__(9003);
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
;// CONCATENATED MODULE: ./templates/admin/publish/editor_component/menus/fileUpload.js


(function () {
  var filePic = {
    dom: document.getElementById("file-pic"),
    event: function event(e) {
      var formData = new FormData();
      var csrfToken = $("meta[name=csrf-token]")[0].content;
      formData.append("file", e.target.files[0]);
      service.upload(formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": csrfToken
        }
      }).then(function (res) {
        $('#editor').trigger('focus');
        var data = "<img src=\"".concat(res.url, "\">");
        document.execCommand('insertHTML', false, data);
      });
    },
    init: function init() {
      this.dom.onchange = this.event;
    }
  };
  filePic.init();
})();
;// CONCATENATED MODULE: ./templates/admin/publish/editor_component/menus/menus.js





(function () {
  var menusComponent = {
    dom: document.getElementsByClassName("menus")[0],
    init: function init() {
      this.disableFocus();
    },
    disableFocus: function disableFocus() {
      this.dom.onmousedown = function (e) {
        e.preventDefault();
      };
    }
  };
  menusComponent.init();
})();
;// CONCATENATED MODULE: ./templates/admin/publish/editor_component/editor/keyMap.js
var KEYMAP = {
  BACKSPACE: "Backspace",
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 32,
  DELETE: 46,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  NUM0: 48,
  NUM1: 49,
  NUM2: 50,
  NUM3: 51,
  NUM4: 52,
  NUM5: 53,
  NUM6: 54,
  NUM7: 55,
  NUM8: 56,
  B: 66,
  E: 69,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  R: 82,
  S: 83,
  U: 85,
  V: 86,
  Y: 89,
  Z: 90,
  SLASH: 191,
  LEFTBRACKET: 219,
  BACKSLASH: 220,
  RIGHTBRACKET: 221,
  HOME: 36,
  END: 35,
  PAGEUP: 33,
  PAGEDOWN: 34
};
;// CONCATENATED MODULE: ./templates/admin/publish/editor_component/editor/editor.js



(function () {
  var editor = {
    dom: document.getElementById("editor"),
    init: function init() {
      document.execCommand("defaultParagraphSeparator", false, "p");

      if (!this.dom.innerText) {
        var p = document.createElement("p");
        var br = document.createElement("br");
        this.dom.appendChild(p);
        p.appendChild(br);
      }

      this.watchKeyEvent();
    },
    watchKeyEvent: function watchKeyEvent() {
      var _this = this;

      this.dom.addEventListener("keydown", function (e) {
        console.log(e.key);

        if (e.key == KEYMAP.BACKSPACE) {
          if (_this.dom.innerHTML == "<p><br></p>") e.preventDefault();
        }
      });
      this.dom.addEventListener("keyup", function (e) {
        if (_this.dom.innerHTML == "") _this.dom.innerHTML = "<p><br></p>";
      });
    }
  };
  editor.init();
})();
;// CONCATENATED MODULE: ./templates/admin/publish/publish.js

}();
/******/ })()
;