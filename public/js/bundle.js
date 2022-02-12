/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/OfficesMap.js":
/*!**************************************!*\
  !*** ./src/js/modules/OfficesMap.js ***!
  \**************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var OfficesMap = /*#__PURE__*/function () {
  function OfficesMap(options) {
    var _this = this;

    _classCallCheck(this, OfficesMap);

    this._map = null;
    this._placemarks = [];
    this._loadedList = [];
    this._options = Object.assign({}, options);

    this._addListeners();

    this._drawMap();

    $.getJSON(this._options.dataUrl).done(function (data) {
      _this._loadedList = data;

      _this._drawMarkers();
    }).fail(function () {
      console.error("Map addresses loading is failed.");
    });
  }

  _createClass(OfficesMap, [{
    key: "_handleWindowResize",
    value: function _handleWindowResize() {
      this.refresh();
    }
  }, {
    key: "_addListeners",
    value: function _addListeners() {
      $(window).on("resize", $.debounce(250, this._handleWindowResize.bind(this)));
    }
  }, {
    key: "_drawMap",
    value: function _drawMap() {
      this._map = new ymaps.Map(this._options.el, {
        controls: [],
        center: this._options.center,
        zoom: this._options.zoom || 10
      });
    }
  }, {
    key: "_drawMarkers",
    value: function _drawMarkers() {
      var _this2 = this;

      this._loadedList.forEach(function (item) {
        var placemark = new ymaps.Placemark(item.position, {
          balloonContentBody: item.content,
          hintContent: item.title
        }, {
          iconLayout: "default#image",
          iconImageHref: _this2._options.iconUrl,
          iconImageOffset: _this2._options.iconOffset,
          iconImageSize: _this2._options.iconSize
        });

        _this2._map.geoObjects.add(placemark);

        _this2._placemarks[item.id] = placemark;
      });
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this._map.container.fitToViewport();
    }
  }]);

  return OfficesMap;
}();

/* harmony default export */ __webpack_exports__["default"] = (OfficesMap);

/***/ }),

/***/ "./src/js/modules/PopupDelivery.js":
/*!*****************************************!*\
  !*** ./src/js/modules/PopupDelivery.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _OfficesMap__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OfficesMap */ "./src/js/modules/OfficesMap.js");

var PopupDelivery = {
  _yourselfMap: null,
  _deliveryMap: null,
  _handleTabClick: function _handleTabClick(e) {
    e.preventDefault();
    var target = $(e.currentTarget).data("target");
    $("#popup-delivery__" + target).siblings(".popup-delivery__pane").removeClass("active").end().addClass("active");
    this["_" + target + "Map"].refresh();
  },
  init: function init() {
    var _this = this;

    showPopup(".popup-delivery__btn-open", "#popup-delivery");
    $(document).on("click", ".popup-delivery__tabs__item", this._handleTabClick.bind(this));
    ymaps.ready(function () {
      var options = {
        center: [55.7600134479554, 37.6234488098733],
        zoom: 8,
        dataUrl: "data/map-addresses.json",
        iconUrl: "data/map-icon.png",
        iconOffset: [-28, -68],
        iconSize: [56, 68]
      };
      _this._yourselfMap = new _OfficesMap__WEBPACK_IMPORTED_MODULE_0__["default"](Object.assign({}, options, {
        el: "popup-delivery__yourself-map"
      }));
      _this._deliveryMap = new _OfficesMap__WEBPACK_IMPORTED_MODULE_0__["default"](Object.assign({}, options, {
        el: "popup-delivery__delivery-map"
      }));
    });
  },
  open: function open() {
    $(".popup-delivery__btn-open").trigger("click");
  }
};
$(function () {
  PopupDelivery.init();
  PopupDelivery.open();
});
/* harmony default export */ __webpack_exports__["default"] = (PopupDelivery);

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
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_PopupDelivery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/PopupDelivery */ "./src/js/modules/PopupDelivery.js");

}();
/******/ })()
;
//# sourceMappingURL=bundle.js.map