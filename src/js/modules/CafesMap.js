import PopupDelivery from "./PopupDelivery";

const CafesMap = {
	_map: null,

	_options: {},

	_objectManager: null,

	_lastSelectedId: null,

	_handleWindowResize() {
		this.refresh();
	},

	_handleBallonApply(e) {
		const cafeId = $(e.currentTarget).data("id");
		PopupDelivery.App.selectFromBallon(cafeId);
		this._map.balloon.close(true);
	},

	_createMap() {
		const baseOptions = $("#popup-delivery").data("base-map-options");
		const cafeOptions = $("#popup-delivery").data("cafes-map-options");
		this._options = Object.assign({}, baseOptions, cafeOptions);

		this._map = new ymaps.Map("popup-delivery__cafes-map", this._options);

		this._objectManager = new ymaps.ObjectManager({
			clusterize: true,
			clusterHasBalloon: false,
			geoObjectOpenBalloonOnClick: true,
			clusterIconColor: "#7cbd41",
		});
		this._map.geoObjects.add(this._objectManager);
	},

	addCafes(cafes) {
		this._objectManager.removeAll();

		const features = cafes.map((cafe) => {
			const balloonHtml = $(cafe.content)
				.append(
					`<button type="button" class="c-button c-button__default popup-delivery__balloon__apply" data-id="${cafe.id}">
					Выбрать
				</button>`
				)
				.html();

			return {
				type: "Feature",
				id: cafe.id,
				geometry: {
					type: "Point",
					coordinates: cafe.location,
				},
				properties: {
					balloonContentBody:
						"<div class='popup-delivery__balloon'>" +
						balloonHtml +
						"</div>",
					hintContent: cafe.title,
				},
				options: {
					iconLayout: "default#image",
					iconImageHref: this._options.iconUrl,
					iconImageOffset: this._options.iconOffset,
					iconImageSize: this._options.iconSize,
				},
			};
		});

		this._objectManager.add({
			type: "FeatureCollection",
			features,
		});

		this.showAllPoints();
	},

	showAllPoints() {
		this._map.setBounds(this._map.geoObjects.getBounds());
	},

	selectById(id) {
		if (this._lastSelectedId !== null) {
			this._objectManager.objects.setObjectOptions(this._lastSelectedId, {
				iconImageHref: this._options.iconUrl,
			});
		}

		this._objectManager.objects.setObjectOptions(id, {
			iconImageHref: this._options.selectedIconUrl,
		});

		this._map.setCenter(
			this._objectManager.objects.getById(id).geometry.coordinates
		);

		this._map.setZoom(13);

		this._lastSelectedId = id;
	},

	deselect() {
		if (this._lastSelectedId !== null) {
			this._objectManager.objects.setObjectOptions(this._lastSelectedId, {
				iconImageHref: this._options.iconUrl,
			});
		}

		this.showAllPoints();

		this._lastSelectedId = null;
	},

	isInitialized() {
		return this._map !== null;
	},

	refresh() {
		this._map.container.fitToViewport();
	},

	init() {
		$(document).on(
			"click",
			".popup-delivery__balloon__apply",
			this._handleBallonApply.bind(this)
		);

		$(window).on(
			"resize",
			$.debounce(250, this._handleWindowResize.bind(this))
		);

		this._createMap();
	},
};

export default CafesMap;
