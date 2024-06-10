<script>

export default {
    props: ["field"],
    methods: {
        toggle() {
            this.field.value = this.isChecked ? 0 : 1
        }
    },
    computed: {
        // Eleminate input lag
        isChecked() {
            return this.field.value >= 1
        }
    }
}
</script>

<template>
<div class="item-check">
    <button @click="toggle()">
        <fa-icon :icon="`fa-solid ${isChecked ? 'fa-square-check' : 'fa-square'}`" />

        <p>{{ field.name }}</p>
    </button>
</div>
</template>

<style scoped>

.item-check {
    margin-top: 1em;
}
.item-check button {
    width: 100%;
    
    display: flex;
    align-items: center;

    background-color: #ffffff11;
    color: var(--text-1);

    border: none;
    border-radius: 5px;

    cursor: pointer;

    padding: 1em;
}
.item-check button:hover {
    background-color: #ffffff44;
}
.item-check button svg {
    font-size: 25px;
    color: var(--text-1);

    margin-right: 1em;
}
.item-check p {
    text-align: left;
    font-size: 17px;
}

</style>