import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate"
import menu from './menu.js'

export default createStore({
    modules: {
        menu
    },
    plugins: [new createPersistedState({
        key: 'pz_v3pz'
    })]
})