const CafesMap = {
	_map: null,

	_options: {},

	_handleWindowResize() {
		this.refresh();
	},

	_handleBallonApply(e) {
		const cafeId = $(e.currentTarget).data("id");
		PopupDelivery.App.pickCafeById(cafeId);
		this._map.balloon.close(true);
	},

	_createMap() {
		const baseOptions = $("#popup-delivery").data("base-map-options");
		const cafeOptions = $("#popup-delivery").data("cafes-map-options");
		this._options = Object.assign({}, baseOptions, cafeOptions);

		this._map = new ymaps.Map("popup-delivery__cafes-map", this._options);
	},

	addCafes(cafes) {
		cafes.forEach((cafe) => {
			const balloonHtml = $(cafe.content)
				.append(
					`<button type="button" class="c-button c-button__default popup-delivery__balloon__apply" data-id="${cafe.id}">
						Выбрать
					</button>`
				)
				.html();

			const placemark = new ymaps.Placemark(
				cafe.location,
				{
					balloonContentBody: balloonHtml,
					hintContent: cafe.title,
				},
				{
					iconLayout: "default#image",
					iconImageHref: this._options.iconUrl,
					iconImageOffset: this._options.iconOffset,
					iconImageSize: this._options.iconSize,
				}
			);

			this._map.geoObjects.add(placemark);
		});
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

const DeliveryMap = {
	_map: null,

	_options: {},

	_objectManager: null,

	_suggestView: null,

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
		});
		this._map.geoObjects.add(this._objectManager);
	},

	_createSuggestView() {
		this._suggestView = new ymaps.SuggestView(
			"popup-delivery__delivery-input",
			{
				provider: this._provider,
			}
		);

		this._suggestView.events.add("select", (e) => {
			const address = e.get("item");

			PopupDelivery.App.address = address.displayName;

			this._objectManager.removeAll();

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
							balloonContentBody: address.displayName,
							hintContent: address.displayName,
						},
						options: {
							preset: "islands#icon",
						},
					},
				],
			});

			this._map.setCenter(address.location);
		});
	},

	_provider: {
		suggest(searchText, options) {
			const matches = PopupDelivery.App.loadedAddresses.filter(
				(address) => {
					return (address.title + "")
						.toLowerCase()
						.includes(searchText.toLowerCase());
				}
			);

			const results = [];

			const count = Math.min(options.results, matches.length);

			for (var i = 0; i < count; i++) {
				results.push({
					displayName: matches[i].title,
					value: matches[i].title,
					id: matches[i].id,
					location: matches[i].location,
				});
			}

			return ymaps.vow.resolve(results);
		},
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
		this._createSuggestView();
	},
};

const PopupDelivery = {
	App: null,

	_handleOutsideClick(e) {
		if (
			this.App !== null &&
			$(e.target).closest(".popup-delivery__input").length === 0
		) {
			this.App.closeCafesList();
		}
	},

	open() {
		$("#popup-delivery__caller").trigger("click");
	},

	close() {
		$("#popup-delivery .popup-close").trigger("click");
	},

	init() {
		$(document).on("click", this._handleOutsideClick.bind(this));

		try {
			showPopup("#popup-delivery__caller", "#popup-delivery");
		} catch (e) {
			console.log(e);
		}

		this.App = new Vue({
			el: "#popup-delivery",

			data() {
				return {
					loadedCafes: [],
					loadedAddresses: [],
					selectedCafe: null,
					address: "",

					currentTab: "yourself",
					isCafesListOpen: false,
				};
			},

			created() {
				this.loadData();

				const initial = JSON.parse($("#popup-delivery__state").val());

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
				loadData() {
					const cafesUrl = $("#popup-delivery").data("cafes-url");
					const addressesUrl =
						$("#popup-delivery").data("addresses-url");

					$.when($.getJSON(cafesUrl), $.getJSON(addressesUrl))
						.done((xhr1, xhr2) => {
							this.loadedCafes = xhr1[0];
							this.loadedAddresses = xhr2[0];

							ymaps.ready(() => {
								CafesMap.init();
								CafesMap.addCafes(this.loadedCafes);

								DeliveryMap.init();
							});
						})
						.fail((error) => {
							console.log(error);
						});
				},

				pickCafe(cafe) {
					this.selectedCafe = cafe;
					this.closeCafesList();
				},

				pickCafeById(id) {
					this.pickCafe(
						this.loadedCafes.find((cafe) => {
							return cafe.id == id;
						})
					);
				},

				depickCafe() {
					this.selectedCafe = null;
					this.closeCafesList();
				},

				openCafesList() {
					this.isCafesListOpen = true;
				},

				closeCafesList() {
					this.isCafesListOpen = false;
				},

				saveAndClose() {
					const state = JSON.stringify({
						currentTab: this.currentTab,
						selectedCafe: Object.assign(
							{},
							{
								id: this.selectedCafe.id,
								title: this.selectedCafe.title,
							}
						),
						address: this.address.trim(),
					});

					$("#popup-delivery__state").val(state);

					const onsaved = $("#popup-delivery").data("onsaved");
					if (typeof window[onsaved] === "function") {
						window[onsaved](state);
					}

					PopupDelivery.close();
				},
			},
		});
	},
};

if ($("#popup-delivery").length) {
	PopupDelivery.init();
	PopupDelivery.open();
}
window.CafesMap = CafesMap;
window.DeliveryMap = DeliveryMap;
window.PopupDelivery = PopupDelivery;

export default PopupDelivery;
