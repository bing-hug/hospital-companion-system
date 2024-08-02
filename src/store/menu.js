const state = {
    isCollapse: false,
    selectMenu: []
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
        console.log(payload);
        const closeIndex = state.selectMenu.findIndex((item) => item.path == payload.path);
        state.selectMenu.splice(closeIndex, 1);
    }
}

export default {
    state,
    mutations
}