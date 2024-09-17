<script>
import moment from 'moment'
import { getFieldDate } from '@/data'

export default {
    props: ['item', 'field', 'itemIndex', 'index', 'visible'],
    computed: {
        dateString() {
            const formatString = `MMMM Do YYYY${this.field.time ? ', HH:mm' : ''}`
            return moment(getFieldDate(this.field)).format(formatString)
        }
    }
}
</script>

<template>
    <transition name="date">
        <div v-if="visible" class="date-container">
            <h3>{{ `${item.name} : ${field.name}` }}</h3>

            <p>{{ dateString }}</p>
        </div>
    </transition>
</template>

<style scoped>
.date-container {
    margin-left: 1em;

    margin-bottom: 1em;

    padding: 1em;

    border-radius: 15px 0 0 15px;

    background-color: var(--color-3);

    animation: date-container-spawn-animation 0.4s ease-out;
}

@keyframes date-container-spawn-animation {
    from {
        translate: 100vw 0;
        border-radius: 15px 15px 15px 15px;
        max-height: 0;
    }
    50% {
        translate: -5vw 0;
        border-radius: 15px 15px 15px 15px;
    }
    to {
        translate: 0 0;
        border-radius: 15px 0 0 15px;
        max-height: 50vh;
    }
}

.date-leave-from {
    max-height: 40vw;
}
.date-leave-to {
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
    opacity: 0;
}
.date-leave-active {
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
