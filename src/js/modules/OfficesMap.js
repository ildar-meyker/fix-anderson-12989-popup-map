class OfficesMap {
	constructor(options) {
		this._map = null;
		this._placemarks = [];
		this._loadedList = [];
		this._options = Object.assign({}, options);

		this._addListeners();
		this._drawMap();

		$.getJSON(this._options.dataUrl)
			.done((data) => {
				this._loadedList = data;
				this._drawMarkers();
			})
			.fail(() => {
				console.error("Map addresses loading is failed.");
			});
	}

	_handleWindowResize() {
		this.refresh();
	}

	_addListeners() {
		$(window).on(
			"resize",
			$.debounce(250, this._handleWindowResize.bind(this))
		);
	}

	_drawMap() {
		this._map = new ymaps.Map(this._options.el, {
			controls: [],
			center: this._options.center,
			zoom: this._options.zoom || 10,
		});
	}

	_drawMarkers() {
		this._loadedList.forEach((item) => {
			const placemark = new ymaps.Placemark(
				item.position,
				{
					balloonContentBody: item.content,
					hintContent: item.title,
				},
				{
					iconLayout: "default#image",
					iconImageHref: this._options.iconUrl,
					iconImageOffset: this._options.iconOffset,
					iconImageSize: this._options.iconSize,
				}
			);

			this._map.geoObjects.add(placemark);
			this._placemarks[item.id] = placemark;
		});
	}

	refresh() {
		this._map.container.fitToViewport();
	}
}

export default OfficesMap;
