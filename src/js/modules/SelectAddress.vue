<template>
    <div class="popup-delivery__input" v-click-outside="close">
        <div class="popup-delivery__input__item">
            <input
                class="c-input"
                type="text"
                :placeholder="placeholder"
                :readonly="selectedItem !== null"
                v-model="value"
                @keyup="debouncedSearch"
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
            <div v-for="item in items" :key="item.id" @click="select(item)">
                {{ item.title }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["placeholder", "url", "param", "initial"],

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

    created() {
        if (this.initial !== null) {
            this.selectedItem = this.initial;
            this.value = this.initial.title;
        }
        this.debouncedSearch = $.debounce(250, this.search);
    },

    methods: {
        search() {
            this.open();

            this.isLoading = true;

            const params = {};
            params[this.param] = this.value;

            $.getJSON(this.url, params)
                .done((data) => {
                    this.items = data;
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
