import Map from "./OfficesMap";

const PopupDelivery = {
	_yourselfMap: null,

	_deliveryMap: null,

	_handleTabClick(e) {
		e.preventDefault();

		const target = $(e.currentTarget).data("target");

		$("#popup-delivery__" + target)
			.siblings(".popup-delivery__pane")
			.removeClass("active")
			.end()
			.addClass("active");

		this["_" + target + "Map"].refresh();
	},

	_handleWindowResize() {
		this._yourselfMap.refresh();
		this._deliveryMap.refresh();
	},

	init() {
		showPopup(".popup-delivery__btn-open", "#popup-delivery");

		$(document).on(
			"click",
			".popup-delivery__tabs__item",
			this._handleTabClick.bind(this)
		);

		$(window).on(
			"resize",
			$.debounce(250, this._handleWindowResize.bind(this))
		);

		ymaps.ready(() => {
			this._yourselfMap = new Map({
				el: "popup-delivery__yourself-map",
				center: [55.7600134479554, 37.6234488098733],
				zoom: 8,
				dataUrl: "data/map-addresses.json",
				iconUrl: "data/map-icon.png",
				iconOffset: [-28, -68],
				iconSize: [56, 68],
			});

			this._deliveryMap = new Map({
				el: "popup-delivery__delivery-map",
				center: [55.7600134479554, 37.6234488098733],
				zoom: 8,
				dataUrl: "data/map-addresses.json",
				iconUrl: "data/map-icon.png",
				iconOffset: [-28, -68],
				iconSize: [56, 68],
			});
		});
	},

	open() {
		$(".popup-delivery__btn-open").trigger("click");
	},
};

$(function () {
	PopupDelivery.init();
	PopupDelivery.open();
});

export default PopupDelivery;
