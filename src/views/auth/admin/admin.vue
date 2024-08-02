<script setup>
import { authAdmin } from "@/api/index.js";
import { reactive, onMounted } from "vue";
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
});
onMounted(() => {
  authAdmin(paginationData).then((data))
})
</script>

<template>

</template>

<style scoped>

</style>