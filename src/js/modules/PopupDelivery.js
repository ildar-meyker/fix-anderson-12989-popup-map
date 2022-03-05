import vClickOutside from "v-click-outside";
Vue.use(vClickOutside);

import CafesMap from "./CafesMap";
import DeliveryMap from "./DeliveryMap";
import SelectAddress from "./SelectAddress.vue";
import SelectCafe from "./SelectCafe.vue";

const PopupDelivery = {
	App: null,

	open() {
		$("#popup-delivery__caller").trigger("click");
	},

	close() {
		$("#popup-delivery .popup-close").trigger("click");
	},

	init() {
		try {
			showPopup("#popup-delivery__caller", "#popup-delivery");
		} catch (e) {
			console.log(e);
		}

		this.App = new Vue({
			el: "#popup-delivery",

			components: { SelectAddress, SelectCafe },

			data() {
				return {
					selectedCafe: null,
					selectedAddress: null,
					currentTab: "yourself",
				};
			},

			watch: {
				selectedCafe(cafe) {
					this.syncSelectedCafe();
				},

				selectedAddress(address) {
					this.syncSelectedAddress();
				},
			},

			created() {
				const initial = JSON.parse($("#popup-delivery__state").val());

				this.currentTab = initial.currentTab;

				switch (this.currentTab) {
					case "yourself":
						this.selectedCafe = initial.selectedCafe;
						break;

					case "delivery":
						this.selectedAddress = initial.selectedAddress;
						break;
				}
			},

			methods: {
				updateAddress(address) {
					this.selectedAddress = address;
				},

				updateCafe(cafe) {
					this.selectedCafe = cafe;
				},

				onCafesLoaded(cafes) {
					ymaps.ready(() => {
						CafesMap.init();
						CafesMap.addCafes(cafes);
						this.syncSelectedCafe();

						DeliveryMap.init();
						this.syncSelectedAddress();
					});
				},

				syncSelectedCafe() {
					if (!CafesMap.isInitialized()) {
						return;
					}

					if (this.selectedCafe === null) {
						CafesMap.deselect();
					} else {
						CafesMap.selectById(this.selectedCafe.id);
					}
				},

				syncSelectedAddress() {
					if (!DeliveryMap.isInitialized()) {
						return;
					}

					DeliveryMap.addAddress(this.selectedAddress);
				},

				selectFromBallon(id) {
					this.$refs.selectCafe.selectById(id);
				},

				saveAndClose() {
					const state = JSON.stringify({
						currentTab: this.currentTab,
						selectedCafe: this.selectedCafe,
						selectedAddress: this.selectedAddress,
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
