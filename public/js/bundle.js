/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/PopupDelivery.js":
/*!*****************************************!*\
  !*** ./src/js/modules/PopupDelivery.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
var CafesMap = {
  _map: null,
  _options: {},
  _handleWindowResize: function _handleWindowResize() {
    this.refresh();
  },
  _handleBallonApply: function _handleBallonApply(e) {
    var cafeId = $(e.currentTarget).data("id");
    PopupDelivery.App.pickCafeById(cafeId);

    this._map.balloon.close(true);
  },
  _createMap: function _createMap() {
    var baseOptions = $("#popup-delivery").data("base-map-options");
    var cafeOptions = $("#popup-delivery").data("cafes-map-options");
    this._options = Object.assign({}, baseOptions, cafeOptions);
    this._map = new ymaps.Map("popup-delivery__cafes-map", this._options);
  },
  addCafes: function addCafes(cafes) {
    var _this = this;

    cafes.forEach(function (cafe) {
      var balloonHtml = $(cafe.content).append("<button type=\"button\" class=\"c-button c-button__default popup-delivery__balloon__apply\" data-id=\"".concat(cafe.id, "\">\n\t\t\t\t\t\t\u0412\u044B\u0431\u0440\u0430\u0442\u044C\n\t\t\t\t\t</button>")).html();
      var placemark = new ymaps.Placemark(cafe.location, {
        balloonContentBody: balloonHtml,
        hintContent: cafe.title
      }, {
        iconLayout: "default#image",
        iconImageHref: _this._options.iconUrl,
        iconImageOffset: _this._options.iconOffset,
        iconImageSize: _this._options.iconSize
      });

      _this._map.geoObjects.add(placemark);
    });
  },
  refresh: function refresh() {
    this._map.container.fitToViewport();
  },
  init: function init() {
    $(document).on("click", ".popup-delivery__balloon__apply", this._handleBallonApply.bind(this));
    $(window).on("resize", $.debounce(250, this._handleWindowResize.bind(this)));

    this._createMap();
  }
};
var DeliveryMap = {
  _map: null,
  _options: {},
  _objectManager: null,
  _suggestView: null,
  _handleWindowResize: function _handleWindowResize() {
    this.refresh();
  },
  _createMap: function _createMap() {
    var baseOptions = $("#popup-delivery").data("base-map-options");
    var deliveryOptions = $("#popup-delivery").data("delivery-map-options");
    this._options = Object.assign({}, baseOptions, deliveryOptions);
    this._map = new ymaps.Map("popup-delivery__delivery-map", this._options);
    this._objectManager = new ymaps.ObjectManager({
      clusterize: true,
      clusterHasBalloon: false,
      geoObjectOpenBalloonOnClick: true
    });

    this._map.geoObjects.add(this._objectManager);
  },
  _createSuggestView: function _createSuggestView() {
    var _this2 = this;

    this._suggestView = new ymaps.SuggestView("popup-delivery__delivery-input", {
      provider: this._provider
    });

    this._suggestView.events.add("select", function (e) {
      var address = e.get("item");
      PopupDelivery.App.address = address.displayName;

      _this2._objectManager.removeAll();

      _this2._objectManager.add({
        type: "FeatureCollection",
        features: [{
          type: "Feature",
          id: address.id,
          geometry: {
            type: "Point",
            coordinates: address.location
          },
          properties: {
            balloonContentBody: address.displayName,
            hintContent: address.displayName
          },
          options: {
            preset: "islands#icon"
          }
        }]
      });

      _this2._map.setCenter(address.location);
    });
  },
  _provider: {
    suggest: function suggest(searchText, options) {
      var matches = PopupDelivery.App.loadedAddresses.filter(function (address) {
        return (address.title + "").toLowerCase().includes(searchText.toLowerCase());
      });
      var results = [];
      var count = Math.min(options.results, matches.length);

      for (var i = 0; i < count; i++) {
        results.push({
          displayName: matches[i].title,
          value: matches[i].title,
          id: matches[i].id,
          location: matches[i].location
        });
      }

      return ymaps.vow.resolve(results);
    }
  },
  refresh: function refresh() {
    this._map.container.fitToViewport();
  },
  init: function init() {
    $(window).on("resize", $.debounce(250, this._handleWindowResize.bind(this)));

    this._createMap();

    this._createSuggestView();
  }
};
var PopupDelivery = {
  App: null,
  _handleOutsideClick: function _handleOutsideClick(e) {
    if (this.App !== null && $(e.target).closest(".popup-delivery__input").length === 0) {
      this.App.closeCafesList();
    }
  },
  open: function open() {
    $("#popup-delivery__caller").trigger("click");
  },
  close: function close() {
    $("#popup-delivery .popup-close").trigger("click");
  },
  init: function init() {
    $(document).on("click", this._handleOutsideClick.bind(this));

    try {
      showPopup("#popup-delivery__caller", "#popup-delivery");
    } catch (e) {
      console.log(e);
    }

    this.App = new Vue({
      el: "#popup-delivery",
      data: function data() {
        return {
          loadedCafes: [],
          loadedAddresses: [],
          selectedCafe: null,
          address: "",
          currentTab: "yourself",
          isCafesListOpen: false
        };
      },
      created: function created() {
        this.loadData();
        var initial = JSON.parse($("#popup-delivery__state").val());
        this.currentTab = initial.currentTab;

        switch (this.currentTab) {
          case "yourself":
            this.selectedCafe = initial.selectedCafe;
            break;

          case "delivery":
            this.address = initial.address;
            break;
        }
      },
      methods: {
        loadData: function loadData() {
          var _this3 = this;

          var cafesUrl = $("#popup-delivery").data("cafes-url");
          var addressesUrl = $("#popup-delivery").data("addresses-url");
          $.when($.getJSON(cafesUrl), $.getJSON(addressesUrl)).done(function (xhr1, xhr2) {
            _this3.loadedCafes = xhr1[0];
            _this3.loadedAddresses = xhr2[0];
            ymaps.ready(function () {
              CafesMap.init();
              CafesMap.addCafes(_this3.loadedCafes);
              DeliveryMap.init();
            });
          }).fail(function (error) {
            console.log(error);
          });
        },
        pickCafe: function pickCafe(cafe) {
          this.selectedCafe = cafe;
          this.closeCafesList();
        },
        pickCafeById: function pickCafeById(id) {
          this.pickCafe(this.loadedCafes.find(function (cafe) {
            return cafe.id == id;
          }));
        },
        depickCafe: function depickCafe() {
          this.selectedCafe = null;
          this.closeCafesList();
        },
        openCafesList: function openCafesList() {
          this.isCafesListOpen = true;
        },
        closeCafesList: function closeCafesList() {
          this.isCafesListOpen = false;
        },
        saveAndClose: function saveAndClose() {
          var state = JSON.stringify({
            currentTab: this.currentTab,
            selectedCafe: Object.assign({}, {
              id: this.selectedCafe.id,
              title: this.selectedCafe.title
            }),
            address: this.address
          });
          $("#popup-delivery__state").val(state);
          var onsaved = $("#popup-delivery").data("onsaved");

          if (typeof window[onsaved] === "function") {
            window[onsaved](state);
          }

          PopupDelivery.close();
        }
      }
    });
  }
};

if ($("#popup-delivery").length) {
  PopupDelivery.init();
  PopupDelivery.open();
}

window.CafesMap = CafesMap;
window.DeliveryMap = DeliveryMap;
window.PopupDelivery = PopupDelivery;
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