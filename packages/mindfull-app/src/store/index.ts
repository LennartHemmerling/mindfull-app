import { reactive, watch } from 'vue'

export const store = reactive({
    items: [],
    tagsActive: []
})

watch(store, () => {
    saveStore()
})

export function loadStore() {
    try {
        const items = JSON.parse(window.localStorage.getItem('MINDFULL_ITEMS'))
        store.items = items || []
    } catch (e) {
        store.items = []
    }

    try {
        const tagsActive = JSON.parse(
            window.localStorage.getItem('MINDFULL_TAG_ACTIVE')
        )
        store.tagsActive = tagsActive || []
    } catch (e) {
        store.tagsActive = []
    }
}

function saveStore() {
    try {
        window.localStorage.setItem(
            'MINDFULL_ITEMS',
            JSON.stringify(store.items)
        )
    } catch (e) {
        console.error('Items could not be saved!')
    }

    try {
        window.localStorage.setItem(
            'MINDFULL_TAG_ACTIVE',
            JSON.stringify(store.tagsActive)
        )
    } catch (e) {
        console.error('Active tags could not be saved!')
    }
}
