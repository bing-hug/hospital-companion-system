<script setup>
import { computed } from "vue";
import { useStore} from "vuex";
import { useRoute, useRouter } from "vue-router";

const store = useStore();
const route = useRoute();
const router = useRouter();
const selectedMenu = computed(() => store.state.menu.selectMenu);
const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'));
const closeTab = (tabItem, tabIndex) => {
  store.commit('closeMenu', tabItem);
  if(route.path != tabItem.path){
    return
  }
  if(tabIndex == selectedMenu.value.length){
    if(!selectedMenu.value.length){
      router.push('/')
    }else{
      router.push({
        path: selectedMenu.value[tabIndex-1].path
      })
    }
  }else{
    router.push({
      path: selectedMenu.value[tabIndex].path
    })
  }
}

const handleClick = (command) => {
  if(command == 'cancel'){
    localStorage.removeItem('pz_token');
    localStorage.removeItem('pz_userInfo');
    localStorage.removeItem('pz_v3pz');
    router.push('/login');
  }
}

</script>

<template>
  <div class="header-container">
    <div class="header-left flex-box">
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')"><Fold /></el-icon>
      <ul class="flex-box">
        <li
            v-for="(item, index) in selectedMenu"
            :key="item.path"
            :class="{selected: route.path === item.path}"
            class="tab flex-box">
          <el-icon class="icon" size="12"><component :is="item.icon"/></el-icon>
          <router-link class="text flex-box" :to="{path: item.path}">
            {{ item.name }}
          </router-link>
          <el-icon class="icon close" size="12" @click="closeTab(item, index)"><Close /></el-icon>
        </li>
      </ul>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleClick">
        <span class="el-dropdown-link flex-box">
          <el-avatar
              :src="userInfo.avatar"
          />
          <p class="user-name">{{ userInfo.name }}</p>
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
            <template #dropdown>
              <el-dropdown-item command="cancel">退出</el-dropdown-item>
            </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.flex-box{
  display: flex;
  align-items: center;
  height: 100%;
}
.header-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;
  .header-left{
    .icon{
      width: 45px;
      height: 100%;
      &:hover{
        background-color: #f5f5f5;
        cursor: pointer;
      }
    }
    .tab{
      padding: 0 10px;
      height: 100%;
      .text {
        margin: 0 5px;
      }
      .close {
        visibility: hidden;
      }
      &:hover{
        background-color: #f5f5f5;
        .close{
          visibility: visible;
        }
      }
      &.selected{
        a, i {
          color: #409eff;
        }
        background-color: #f5f5f5;

      }
      
    }
  }
  .header-right{
    .user-name{
      margin-left: 10px;
    }
  }
  a{
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>