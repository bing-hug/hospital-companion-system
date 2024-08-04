<script setup>
import TreeMenu from "@/components/treeMenu.vue";
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore} from "vuex";
const router = useRouter();
// const menuData = reactive(router.options.routes[0].children);

const store = useStore();
const active = computed(() => store.state.menu.menuActive);
const menuData = computed(() => store.state.menu.routerList);
const isCollapse = computed(()=> store.state.menu.isCollapse)
const handleOpen = ()=>{};
const handleClose = ()=>{};
</script>

<template>
  <el-menu
      active-text-color="#ffd04b"
      background-color="#545c64"
      :default-active="active"
      class="aside-container"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
  >
    <p class="logo-lg">{{ !isCollapse ? 'DID陪诊': 'DID'}}</p>
    <TreeMenu :menuData="menuData" :index="1"/>
  </el-menu>
</template>

<style scoped>
.aside-container {
  height: 100%;
  .logo-lg {
    font-size: 20px;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
}
</style>