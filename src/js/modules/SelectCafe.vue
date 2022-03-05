<template>
    <div class="popup-delivery__input" v-click-outside="close">
        <div class="popup-delivery__input__item">
            <input
                class="c-input"
                type="text"
                :placeholder="placeholder"
                :readonly="selectedItem !== null"
                v-model="value"
                @focus="open"
            />
            <div class="popup-delivery__loader" v-show="isLoading"></div>
            <button
                type="button"
                class="popup-delivery__input__close"
                @click="deselect()"
                v-show="selectedItem !== null"
            ></button>
        </div>

        <div :class="['popup-delivery__select', { active: isOpen }]">
            <div
                v-for="item in matchedItems"
                :key="item.id"
                @click="select(item)"
            >
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["placeholder", "url", "initial"],

    data() {
        return {
            value: "",
            items: [],
            selectedItem: null,
            isLoading: false,
            isOpen: false,
        };
    },

    watch: {
        selectedItem() {
            this.$emit("changed", this.selectedItem);
        },
    },

    computed: {
        matchedItems() {
            return this.items.filter((item) => {
                return item.title
                    .toLowerCase()
                    .includes(this.value.toLowerCase());
            });
        },
    },

    created() {
        if (this.initial !== null) {
            this.selectedItem = this.initial;
            this.value = this.initial.title;
        }
        this.loadList();
    },

    methods: {
        loadList() {
            this.isLoading = true;

            $.getJSON(this.url)
                .done((data) => {
                    this.items = data;
                    this.$emit("loaded", data);
                })
                .fail((error) => {
                    console.log(error);
                })
                .always(() => {
                    this.isLoading = false;
                });
        },

        select(item) {
            this.selectedItem = item;
            this.value = item.title;
            this.close();
        },

        selectById(id) {
            this.select(
                this.items.find((item) => {
                    return item.id == id;
                })
            );
        },

        deselect() {
            this.selectedItem = null;
            this.value = "";
        },

        open() {
            this.isOpen = true;
        },

        close() {
            this.isOpen = false;
        },
    },
};
</script>
