<script>
import moment from 'moment'
import ItemComponent from '@/components/ItemComponent.vue'
import DateComponent from '@/components/fields/DateComponent.vue'
import { store, loadStore } from '@/store'
import { createItem, getFieldDate, tagsEqual } from '@/data'
import { keepAwake } from '@/native'

export default {
    components: {
        ItemComponent,
        DateComponent
    },
    mounted() {
        keepAwake()
        
        loadStore()
    },
    methods: {
        toggleTag(i) {
            const tagIndex = store.tagsActive.indexOf(store.tagsActive.find(tag => tagsEqual(tag, this.tagsAvailable[i])))
            if(tagIndex > -1) {
                store.tagsActive = [...store.tagsActive.slice(0, tagIndex), ...store.tagsActive.slice(tagIndex + 1)]
            }else {
                store.tagsActive.push(this.tagsAvailable[i])
            }
        },
        isTagActive(tag) {
            return store.tagsActive.find(tag1 => tagsEqual(tag, tag1))
        },
        addItem() {
            const item = createItem()

            store.items.push(item)

            this.$router.push(`/edit/${store.items.length - 1}`)

            store.tagsActive = []
        },
        getDateString(month, year) {
            const monthString = month > 9 ? `${month}` : `0${month}`
            return moment(`${year}-${monthString}-01`).format("MMMM YYYY")
        }
    },
    computed: {
        items() {
            const items = store.items.map((item, index) => [item, index])
            if(store.tagsActive.length > 0) {
                return items.map(item => {
                    const visible = item[0].tags.reduce((all, tag1) => {
                        return all || store.tagsActive.find(tag2 => tagsEqual(tag1, tag2))
                    }, false)
                    return [...item, visible]
                })
            }else return items.map(item => [...item, true])
        },
        tagsAvailable() {
            return store.items.reduce((all, cur) => {
                cur.tags.forEach(tag1 => {
                    if(!all.find(tag2 => tagsEqual(tag1, tag2))) all.push(tag1)
                })

                return all
            }, [])
        },
        dates() {
            return this.items.reduce((all, cur) => {
                const datesOfItem = cur[0].fields.reduce((all, cur) => {
                    if(cur.type === 'date') all.push(cur)
                    return all
                }, [])
                .map(d => [cur[0], d, cur[1], cur[2]])

                all.push(...datesOfItem)
                return all
            }, [])
            .sort((a, b) => getFieldDate(a[1]).getTime() - getFieldDate(b[1]).getTime())
            .reduce((all, cur) => {
                const date = getFieldDate(cur[1])
                const month = date.getMonth() + 1
                const year = date.getFullYear()
                const today = new Date()
                const isToday = 
                    today.getMonth() + 1 === month 
                    && today.getFullYear() === year
                    && today.getDate() === date.getDate()
                const isBeforeToday = !isToday 
                    && (today.getTime() > date.getTime())
                const isAfterToday = !isToday && !isBeforeToday

                if(
                    all.length > 0 
                    && (
                        // Is today
                        isToday && all[all.length - 1].isToday
                        ||
                        // Is not today but fits
                        !isToday && !all[all.length - 1].isToday
                        && all[all.length - 1].month === month 
                        && all[all.length - 1].year === year
                        && all[all.length -1].isBeforeToday === isBeforeToday
                    )
                ) {
                    all[all.length - 1].dates.push(cur)
                }else {
                    const category = {
                        month, year, isToday, isBeforeToday, isAfterToday,
                        dates: [cur]
                    }
                    all.push(category)
                }
                return all
            }, [])
            .map(category => ({
                ...category,
                visible: category.dates.reduce((all, cur) => all || cur[3], false)
            }))
        },
        datesBeforeToday() {
            return this.dates.filter(({isBeforeToday}) => isBeforeToday)
        },
        dateToday() {
            return this.dates.find(({isToday}) => isToday)
        },
        datesAfterToday() {
            return this.dates.filter(({isAfterToday}) => isAfterToday)
        }
    }
}
</script>

<template>
<main>
    <div class="tags">
        <template v-for="tag, i in tagsAvailable" :key="`TAG-${i}`">
        <button :class="isTagActive(tag) ? 'on' : ''" @click="toggleTag(i)" :style="`background-color: ${tag.name};`">

        </button>
        </template>
    </div>

    <section class="todo">
        <template v-for="[item, i, visible] in items" :key="`ITEM-${i}`">
        <item-component
            :item="item"
            :index="i"
            :visible="visible"
        />
        </template>

        <button class="add-item" @click="addItem()">
            <fa-icon icon="fa-solid fa-plus" />
        </button>
    </section>

    <section class="timeline">
        <template v-for="category, h in datesBeforeToday" :key="`DATES-${h}`">
        <transition name="date-category">
            <div v-if="category.dates.find(date => date[3])">
                <h2>{{ getDateString(category.month, category.year) }}</h2>
            </div>
        </transition>

        <template v-for="[item, field, i, visible], j in category.dates" :key="`DATES-${h}-DATE-${j}-ITEM-${i}`">
        <date-component
            :item="item"
            :field="field"
            :itemIndex="i"
            :index="j"
            :visible="visible"
        />
        </template>
        </template>

        <div class="category-today">
            <h2>Today</h2>

            <p class="nothing-text">
                <div v-if="!dateToday">
                    <i>nothing to do..</i>
                </div>
                <div v-else-if="!dateToday.dates.find(date => date[3])">
                    <i>nothing to see..</i>
                </div>
            </p>

            <template v-if="dateToday?.dates">
            <template v-for="[item, field, i, visible], j in dateToday.dates" :key="`DATES-TODAY-DATE-${j}-ITEM-${i}`">
            <date-component
                :item="item"
                :field="field"
                :itemIndex="i"
                :index="j"
                :visible="visible"
            />
            </template>
            </template>
        </div>

        <template v-for="category, h in datesAfterToday" :key="`DATES-${h}`">
        <transition name="date-category">
            <div v-if="category.dates.find(date => date[3])">
                <h2>{{ getDateString(category.month, category.year) }}</h2>
            </div>
        </transition>

        <template v-for="[item, field, i, visible], j in category.dates" :key="`DATES-${h}-DATE-${j}-ITEM-${i}`">
        <date-component
            :item="item"
            :field="field"
            :itemIndex="i"
            :index="j"
            :visible="visible"
        />
        </template>
        </template>
    </section>
</main>
</template>

<style scoped>
main {
    width: 100%;
    height: 100%;

    background-color: var(--color-2);
    color: var(--text-1);

    display: flex;

    overflow-x: scroll;
    scroll-snap-type: x mandatory;
}

div.tags {
    position: absolute;

    left: 0;
    top: 0;
    bottom: 0;

    width: 30px;
    
    display: flex;
    flex-direction: column;
}

div.tags button {
    margin-top: calc(.5em + 3px);
    margin-bottom: calc(.5em + 3px);

    width: calc(20px + .5em - 3px);
    height: 60px;

    border: none;

    border-radius: 0 5px 5px 0;

    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

    background-color: var(--color-1);
}

div.tags button.on {
    width: calc(30px + .5em - 3px);

    outline: solid 3px var(--text-1);
}

section {
    min-width: 100vw;
    max-width: 100vw;

    display: flex;
    flex-direction: column;

    overflow-y: scroll;

    scroll-snap-align: center;
}

section.todo {
    padding: 1em;
}

section.todo .add-item {
    margin-left: 30px;
    margin-bottom: 1em;
    background-color: var(--color-1);
    border: none;
    border-radius: 15px;
    padding: .5em;

    cursor: pointer;

    animation: add-item-button-spawn-animation 600ms ease-out;
}


@keyframes add-item-button-spawn-animation {
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

section.todo .add-item svg {
    font-size: 20px;
    color: var(--text-1);
}

section.timeline {
    padding: 1em 0 1em calc(35px + 1em); 

    border-right: solid 5px var(--color-3);
}

section.timeline h2 {
    text-align: right;
    margin-right: 1em;
}

section.timeline .category-today {
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;

    border: dashed 2px var(--text-1);
    border-right: none;

    margin-top: 1em;
    margin-bottom: 1em;
}

section.timeline .category-today h2 {
    text-align: left;
    margin-right: 0;
    margin-left: 1em;
    margin-top: 1em;
}

section.timeline .category-today .nothing-text {
    margin-left: 2em;
    margin-bottom: 2em;
}

section.timeline .category-today .nothing-text > * {
    animation: nothing-text-spawn-animation 200ms ease-out;
}

@keyframes nothing-text-spawn-animation {
    from {
        opacity: 0;
    }
    50% {
        opacity: 0;
        translate: 0 -30px;
    }
    to {
        opacity: 1;
    }
}

.date-category-enter-to, .date-category-leave-from {
    max-height: 40vw;
}
.date-category-enter-from, .date-category-leave-to {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    opacity: 0;
}
.date-category-enter-active, .date-category-leave-active {
    overflow: clip;
    transition: 
        max-height 200ms,
        padding-top 200ms,
        padding-bottom 200ms,
        margin-top 200ms,
        margin-bottom 200ms,
        opacity 200ms;
}
</style>