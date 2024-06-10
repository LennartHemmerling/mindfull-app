<script>
import CheckItemComponent from '@/components/fields/CheckItemComponent.vue'
import CounterComponent from '@/components/fields/CounterComponent.vue'

export default {
    components: {
        CheckItemComponent,
        CounterComponent
    },
    props: ["item", "index", "visible"],
    computed: {
        itemContainerStyle() {
            return this.index % 2 === 0 ? "item-container even" : "item-container"
        },
        contentParagraphs() {
            return this.item.content.split("\n")
        }
    }
}
</script>

<template>
<transition name="item">
    <div v-if="visible" :class="itemContainerStyle">
        <span>
            <template v-for="tag, i in item.tags" :key="`ITEM-${index}-TAG-${i}`">
            <div class="item-tag" :style="`background-color: ${tag.name}`"></div>
            </template>
        </span>

        <span>
            <div>
                <h3 v-if="item.name" class="item-name">{{ item.name }}</h3>

                <template v-for="paragraph, i in contentParagraphs" :key="`ITEM-${index}-CONTENT-${i}`">
                <p class="item-content">{{ paragraph }}</p>
                </template>
            </div>

            <router-link class="item-edit" :to="`/edit/${index}`">
                <fa-icon icon="fa-solid fa-pen-to-square" />
            </router-link>
        </span>

        <template v-for="field, i in item.fields" :key="`ITEM-${index}-FIELD-${i}`">
        <check-item-component
            v-if="field.type === 'check'"
            :field="field"
        />
        
        <counter-component
            v-if="field.type === 'count'"
            :field="field"
        />
        </template>
    </div>
</transition>
</template>

<style scoped>

.item-container {
    padding: 1em;
    border-radius: 15px;

    background-color: var(--color-1);

    margin-bottom: 1em;
    margin-left: 30px;

    animation: item-container-spawn-animation-left .4s ease-out;
}
.item-container.even {
    animation: item-container-spawn-animation-right .4s ease-out;
}

@keyframes item-container-spawn-animation-left {
    from {
        translate: -100vw 0;
    }
    50% {
        translate: 5vw 0;
    }
    75% {
        translate: -5vw 0;
    }
    to {
        translate: 0 0;
    }
}

@keyframes item-container-spawn-animation-right {
    from {
        translate: 100vw 0;
    }
    50% {
        translate: -5vw 0;
    }
    75% {
        translate: 5vw 0;
    }
    to {
        translate: 0 0;
    }
}

.item-leave-from {
    max-height: 150vw;
}
.item-leave-to {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    opacity: 0;
}
.item-leave-active {
    overflow: clip;
    transition: 
        max-height 200ms,
        padding-top 200ms,
        padding-bottom 200ms,
        margin-top 200ms,
        margin-bottom 200ms,
        opacity 200ms;
}

span {
    display: flex;
    justify-content: space-between;
}

.item-tag {
    flex: 1;
    height: 10px;
    margin-left: .25em;
    margin-right: .25em;
    margin-bottom: .5em;
    border-radius: 15px;
}
.item-tag:first-child {
    margin-left: 0;
}
.item-tag:last-child {
    margin-right: 0;
}

.item-name {
}
.item-content {

}
.item-edit {
    font-size: 20px;
    color: var(--text-1);
}

</style>