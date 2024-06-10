<script>
import { store } from '@/store'

import { addTag, addCheckItem } from '@/data'

export default {
    methods: {
        addTag() {
            addTag(this.item, this.tagInput)
        },
        removeTag(index) {
            this.item.tags = [...this.item.tags.slice(0, index), ...this.item.tags.slice(index + 1)]
        },
        addField() {
            addCheckItem(this.item)
        },
        removeField(index) {
            this.deleting = index
            setTimeout(
                () => {
                    this.item.fields = [...this.item.fields.slice(0, index), ...this.item.fields.slice(index + 1)]

                    this.deleting = -1
                    this.forbidAnimationTill = this.item.fields.length
                },
                300
            )
        }
    },
    data: () => ({
        types: ['check', 'count', 'date'],
        tagInput: "black",
        deleting: -1,
        forbidAnimationTill: -1
    }),
    computed: {
        item() {
            return store.items[this.$route.params['index']]
        },
        hasDateItem() {
            return this.item.fields.find(field => field.type === 'date')
        }
    }
}
</script>

<template>
<main :class="hasDateItem ? 'with-timeline' : ''">
    <div class="item-container even">
        <div class="item-tags-bar top">
            <h3>tags</h3>
            <p>
                <template v-for="tag, i in item.tags" :key="`TAG-${i}`">
                <button @click="removeTag(i)" :style="`background-color: ${tag.name};`">
                    {{ tag.name }}

                    <fa-icon icon="fa-solid fa-xmark" />
                </button>
                </template>
            </p>
        </div>

        <div class="item-tags-bar">
            <input class="color-input" type="color" v-model="tagInput">

            <input v-model="tagInput">

            <button class="add-button" @click="addTag()" :disabled="!tagInput">
                <fa-icon icon="fa-solid fa-plus" />
            </button>
        </div>
    </div>

    <div class="item-container">
        <h3><input v-model="item.name" placeholder="title"></h3>

        <p><textarea v-model="item.content" placeholder="description.."></textarea></p>
    </div>

    <template v-for="field, i in item.fields" :key="`EDIT-FIELD-${i}`">
    <transition name="field">
        <div 
            v-if="deleting !== i" 
            :class="`item-container ${i % 2 === 0 ? 'even' : ''} ${field.type === 'date' ? 'date' : ''} ${forbidAnimationTill > i ? 'no-animation' : ''}`"
        >
            <div class="item-field-top-bar">
                <input v-model="field.name" placeholder="field">

                <button class="item-field-top-bar-delete-button" @click="removeField(i)">
                    <fa-icon icon="fa-solid fa-xmark" />
                </button>
            </div>

            <div v-show="field.type === 'date'" class="item-field-date-container">
                <input type="time" v-model="field.time">
                <input type="date" v-model="field.date">
            </div>
            
            <div class="item-field-type-container">
                <template v-for="type, j in types" :key="`FIELD-${i}-TYPE-SELECT-${j}`">
                    <button :class="`item-field-type-button ${field.type === type ? 'on' : ''}`" @click="field.type = type">
                        {{ type }}
                    </button>
                </template>   
            </div>
        </div>
    </transition>
    </template>

    <button class="item-add-field-button" @click="addField()">
        <fa-icon icon="fa-solid fa-plus" />
    </button>
</main>
</template>

<style scoped>

main {
    padding-top: 1em;

    min-height: 100%;

    background-color: var(--color-2);
    color: var(--text-1);

    overflow-y: scroll;

    display: flex;
    flex-direction: column;
    align-items: stretch;

    border-right: solid 3px var(--color-2);
}
main.with-timeline {
    border-right: solid 3px var(--color-3);
}
.item-container {
    margin: 1em;
    margin-right: calc(1em - 3px);
    margin-top: 0;

    padding: 1em;
    border-radius: 15px;

    background-color: var(--color-1);

    animation: item-container-spawn-animation-left .4s ease-out;

    transition: 
        margin 200ms,
        border-radius 300ms,
        background-color 200ms;

}
.item-container.even {
    animation: item-container-spawn-animation-right .4s ease-out;
}
.item-container.no-animation {
    animation: unset;
}

@keyframes item-container-spawn-animation-left {
    from {
        translate: -100vw 0;
        max-height: 0;
    }
    50% {
        translate: 5vw 0;
    }
    to {
        translate: 0 0;
        max-height: 50vh;
    }
}

@keyframes item-container-spawn-animation-right {
    from {
        translate: 100vw 0;
        max-height: 0;
    }
    50% {
        translate: -5vw 0;
    }
    to {
        translate: 0 0;
        max-height: 50vh;
    }
}

.item-container.date {
    border-radius: 15px 0 0 15px;

    margin-right: 0;
    margin-left: 2em;

    background-color: var(--color-3);
}

.field-leave-from {
    max-height: 150vw;
}
.field-leave-to {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    opacity: 0;
}
.field-leave-active {
    overflow: clip;
    transition: 
        max-height 200ms,
        padding-top 200ms,
        padding-bottom 200ms,
        margin-top 200ms,
        margin-bottom 200ms,
        opacity 200ms;
}

.item-tags-bar {
    display: flex;
    align-items: stretch;
}
.item-tags-bar.top {
    flex-wrap: wrap;

    margin-bottom: 2em;
}
.item-tags-bar .add-button {
    margin-left: 1em;
    min-width: 40px;
    max-width: 40px;

    background-color: var(--color-green);
    color: var(--text-1);
    outline: solid 2px var(--color-green);
    border: none;
    border-radius: 5px;

    display: flex;
    justify-content: center;
    align-items: center;

    transition: 
        outline 500ms,
        background-color 200ms;
}
.item-tags-bar .add-button:disabled {
    background-color: #ffffff11;
    outline: solid 2px #ffffff11;
}
.item-tags-bar .color-input {
    min-width: 40px;
    max-width: 40px;
    height: 40px;
    margin-right: 1em;
}
.item-tags-bar.top button {
    margin-left: 1em;
    padding: .5em;

    border: none;
    border-radius: 5px;

    color: var(--text-1);
}
.item-tags-bar.top svg {
    margin-left: .5em;
}

.item-field-top-bar {
    display: flex;
}
.item-container input {
    width: 100%;
    background-color: #ffffff11;
    color: var(--text-1);
    border: none;
    border-radius: 5px;
    padding: .5em;
}
.item-container h3 input {
    font-size: 17px;
}
.item-container textarea {
    width: 100%;
    min-height: 150px;
    background-color: #ffffff11;
    color: var(--text-1);
    border: none;
    border-radius: 5px;
    padding: .5em;
    margin-top: 1em;
}
.item-field-top-bar-delete-button {
    width: 40px;
    margin-left: 1em;

    background-color: var(--color-red);
    color: var(--text-1);
    outline: solid 2px var(--color-red);
    border: none;
    border-radius: 5px;

    display: flex;
    justify-content: center;
    align-items: center;
}
.item-field-top-bar-delete-button svg {
    font-size: 15px;
}
.item-field-date-container {
    margin-top: 1em;
    display: flex;
}
.item-field-date-container > * {
    margin-right: .5em;
    margin-left: .5em;
}
.item-field-date-container > *:first-child {
    margin-left: 0;
}
.item-field-date-container > *:last-child {
    margin-right: 0;
}
.item-field-type-container {

}
.item-field-type-button {
    padding: .5em;

    margin-top: 1em;

    margin-left: .5em;
    margin-right: .5em;

    background-color: #ffffff11;
    color: var(--text-1);
    border: solid 2px #ffffff11;

    transition: border 200ms;
}
.item-field-type-button:first-child {
    border-radius: 5px 0 0 5px;

    margin-left: 0;
}
.item-field-type-button:last-child {
    border-radius: 0 5px 5px 0;

    margin-right: 0;
}
.item-field-type-button.on {
    border: solid 2px var(--text-1);
}
.item-add-field-button {
    background-color: var(--color-1);
    border: none;
    border-radius: 15px;
    padding: .5em;
    margin-left: 1em;
    margin-right: calc(1em - 3px);

    margin-bottom: 1em;

    cursor: pointer;

    animation: item-add-field-button-spawn-animation 600ms ease-out;
}

@keyframes item-add-field-button-spawn-animation {
    from {
        translate: 0 100vh;
    }
    50% {
        translate: 0 -10px;
    }
    to {
        translate: 0 0;
    }
}

.item-add-field-button svg {
    font-size: 20px;
    color: var(--text-1);
}

</style>
