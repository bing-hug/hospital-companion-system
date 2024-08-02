<script setup>
  import Aside from '@/components/aside.vue'
  import navHeader from '@/components/navHeader.vue'
</script>

<template>
  <div class="common-layout">
    <el-container>
<!--      <el-aside>-->
<!--        Aside-->
<!--      </el-aside>-->
      <Aside/>
      <el-container>
        <el-header><navHeader/></el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout{
  height: 100%;
  .el-container{
    height: 100%;
  }
}
</style>