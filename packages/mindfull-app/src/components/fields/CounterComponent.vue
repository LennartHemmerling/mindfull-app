<script>
export default {
    props: ['field'],
    methods: {
        add() {
            this.value = +1
        },
        substract() {
            this.value = -1
        }
    },
    computed: {
        // Eleminate input lag
        value: {
            get() {
                return this.field.value
            },
            set(diff) {
                this.field.value += diff
            }
        }
    }
}
</script>

<template>
    <div class="item-count">
        <div class="item-count-container">
            <button @click="substract()">
                <fa-icon icon="fa-solid fa-square-minus" />
            </button>

            <p class="item-count-counter">{{ field.value }}</p>

            <button class="item-count-add" @click="add()">
                <fa-icon icon="fa-solid fa-square-plus" />
            </button>

            <p>{{ field.name }}</p>
        </div>
    </div>
</template>

<style scoped>
.item-count {
    margin-top: 1em;
}
.item-count-container {
    display: flex;
    align-items: center;

    background-color: #ffffff11;
    color: var(--text-1);
    border: none;
    border-radius: 5px;

    font-size: 17px;

    padding: 1em;
}
.item-count button {
    background-color: transparent;

    cursor: pointer;

    border: none;
    padding: 0;
}
.item-count button svg {
    font-size: 25px;
    color: var(--text-1);
}
.item-count p {
    min-width: 30px;
    text-align: left;
}
.item-count-add {
    margin-right: 1em;
}
.item-count-counter {
    text-align: center !important;
}
</style>
