<script setup>
import {authAdmin, menuSelectList, updateUser, userSetMenu} from "@/api/index.js";
import { ref, reactive, onMounted, nextTick } from "vue";
import { useRoute } from "vue-router";
import dayjs from 'dayjs'
import PanelHead from "@/components/panelHead.vue";
const route = useRoute();
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
});
const adminTableData = reactive({
  list: [],
  total: 0
});
const getAdminList = () => {
  authAdmin(paginationData).then(({data}) => {
    const { list, total } = data.data;
    list.forEach(item => {
      item.create_time = dayjs(item.create_time).format('YYYY-MM-DD');
    })
    adminTableData.list = list;
    adminTableData.total = total;
  });
}
onMounted(() => {
  getAdminList();
  menuSelectList().then(({data}) => {
    adminOptions.value = data.data;
  })
});


//弹窗的显示和隐藏
const dialogFormVisible = ref(false);
const adminForm = reactive({
  name: '',
  mobile: '',
  permissions_id: ''
});
const adminFormRef = ref();
const rules = reactive({
  name: [{ required: true, trigger: 'blur', message: '请填写昵称' }],
  permissions_id: [{ required: true, trigger: 'change', message: '请选择菜单权限' }]
});
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const { name, permissions_id } = adminForm;
      updateUser({name, permissions_id}).then(({data}) => {
        if(data.code === 10000){
          dialogFormVisible.value = false;
          getAdminList();
        }
      })
    } else {
      console.log('error submit!', fields)
    }
  });
}

const beforeClose = () => {
  dialogFormVisible.value = false;
  adminFormRef.value.resetFields();
}
const handleSizeChange = (val) => {
  paginationData.pageSize = val;
}

const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
}
//编辑列表
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  nextTick(() => {
    if(rowData){
      Object.assign(adminForm, { mobile: rowData.mobile, name: rowData.name});
    }
  })
}
const adminOptions = ref([])
const permissionName = (id) => {
  const data = adminOptions.value.find(item => item.id === id);
  return data ? data.name : '超级管理员'
}
</script>

<template>
  <PanelHead :route="route" />
  <el-table :data="adminTableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissions_id" label="所属组别" >
      <template #default="scope">
        {{ permissionName(scope.row.permissions_id) }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号" />
    <el-table-column prop="active" label="状态" >
      <template #default="scope">
        <el-tag :type="scope.row.active ? 'success' : 'danger'">
          {{ scope.row.active ? '正常' : '失效' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="create_time" label="创建时间" >
      <template #default="scope">
        <div class="flex-box">
          <el-icon><Clock /></el-icon>
          <span style="margin-left: 5px"> {{ scope.row.create_time }} </span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" >
      <template #default="scope">
        <el-button type="primary" @click="open(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-info">
    <el-pagination
        v-model:current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize"
        :background="false"
        layout="total,prev,pager,next"
        :total="adminTableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    >
    </el-pagination>
  </div>
  <el-dialog
      v-model="dialogFormVisible"
      :before-close="beforeClose"
      title="添加权限"
      width="500"
  >
    <el-form
        label-width="100px"
        label-position="left"
        :model="adminForm"
        :rules="rules"
        ref="adminFormRef"
    >
      <el-form-item label="手机号" prop="mobile" >
        <el-input v-model="adminForm.mobile" disabled />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="adminForm.name" />
      </el-form-item>
      <el-form-item label="菜单权限" prop="permissions_id">
        <el-select
          v-model="adminForm.permissions_id"
          placeholder="请选择菜单权限"
          style="width: 240px"
        >
          <el-option
              v-for="item in adminOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(adminFormRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.flex-box{
  display: flex;
  align-items: center;
}
</style>