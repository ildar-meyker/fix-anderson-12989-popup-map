import PopupDelivery from "./PopupDelivery";

const DeliveryMap = {
	_map: null,

	_options: {},

	_objectManager: null,

	_handleWindowResize() {
		this.refresh();
	},

	_createMap() {
		const baseOptions = $("#popup-delivery").data("base-map-options");
		const deliveryOptions = $("#popup-delivery").data(
			"delivery-map-options"
		);
		this._options = Object.assign({}, baseOptions, deliveryOptions);

		this._map = new ymaps.Map(
			"popup-delivery__delivery-map",
			this._options
		);

		this._objectManager = new ymaps.ObjectManager({
			clusterize: true,
			clusterHasBalloon: false,
			geoObjectOpenBalloonOnClick: true,
			clusterIconColor: "#7cbd41",
		});
		this._map.geoObjects.add(this._objectManager);
	},

	addAddress(address) {
		this._objectManager.removeAll();

		if (address === null) return;

		this._objectManager.add({
			type: "FeatureCollection",
			features: [
				{
					type: "Feature",
					id: address.id,
					geometry: {
						type: "Point",
						coordinates: address.location,
					},
					properties: {
						balloonContentBody: address.title,
						hintContent: address.title,
					},
					options: {
						iconLayout: "default#image",
						iconImageHref: this._options.selectedIconUrl,
						iconImageOffset: this._options.iconOffset,
						iconImageSize: this._options.iconSize,
					},
				},
			],
		});

		this._map.setCenter(address.location);
	},

	isInitialized() {
		return this._map !== null;
	},

	refresh() {
		this._map.container.fitToViewport();
	},

	init() {
		$(window).on(
			"resize",
			$.debounce(250, this._handleWindowResize.bind(this))
		);

		this._createMap();
	},
};

export default DeliveryMap;
