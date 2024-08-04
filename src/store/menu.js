const localData = localStorage.getItem('pz_v3pz')
const state = localData ? JSON.parse(localData) : {
    isCollapse: false,
    selectMenu: [],
    routerList: [],
    menuActive: '1-1'
}

const mutations = {
    collapseMenu(state){
        state.isCollapse = !state.isCollapse
    },
    addMenu(state, payload){
        if(!state.selectMenu.find(item => item.path == payload.path)){
            state.selectMenu.push(payload);
        }
    },
    closeMenu(state, payload){
        const closeIndex = state.selectMenu.findIndex((item) => item.path == payload.path);
        state.selectMenu.splice(closeIndex, 1);
    },
    dynamicMenu(state, payload) {
        const modules = import.meta.glob('../views/**/**/*.vue');
        function routerSet(router) {
            router.forEach( route => {
                if(!route.children) {
                    const url = `../views${route.meta.path}/${route.name}.vue`;
                    route.component = modules[url];
                } else {
                    routerSet(route.children);
                }
            })
        }
        routerSet(payload);
        state.routerList = payload;
    },
    updateMenuActive(state, payload){
        state.menuActive = payload;
    }
}

export default {
    state,
    mutations
}