import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { App as CapacitorApp } from '@capacitor/app'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import {
    faSquare,
    faSquareCheck,
    faSquarePlus,
    faSquareMinus,
    faPenToSquare,
    faPlus,
    faXmark,
    faGrip,
    faUpDown
} from '@fortawesome/free-solid-svg-icons'

library.add(faSquare)
library.add(faSquareCheck)
library.add(faSquarePlus)
library.add(faSquareMinus)
library.add(faPenToSquare)
library.add(faPlus)
library.add(faXmark)
library.add(faGrip)
library.add(faUpDown)

const app = createApp(App)

CapacitorApp.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
        CapacitorApp.exitApp()
    } else {
        window.history.back()
    }
})

app.component('fa-icon', FontAwesomeIcon)

app.use(router)

app.mount('#app')
