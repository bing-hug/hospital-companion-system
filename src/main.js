import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router/index.js";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import store from '@/store/index.js'
import PanelHead from '@/components/panelHead.vue'

const localData = localStorage.getItem('pz_v3pz');
if(localData){
    store.commit('dynamicMenu', JSON.parse(localData).menu.routerList);
    store.state.menu.routerList.forEach(item => {
        router.addRoute('Home', item);
    });
}
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
app.use(store)
app.component('PanelHead', PanelHead)
app.mount('#app')