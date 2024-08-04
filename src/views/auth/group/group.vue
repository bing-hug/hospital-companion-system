<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import { userGetMenu, userSetMenu, menuList } from "@/api/index.js";
import { useRoute } from "vue-router";
const route = useRoute();

const groupForm = reactive({
  id: '',
  name: '',
  permissions: ''
});
const groupFormRef = ref();
const rules = reactive({
  name: [{ required: true, trigger: 'blur'}]
})
onMounted(()=>{
  userGetMenu().then(({data}) => {
    if(data.code === 10000){
      permissionData.value = data.data
    }
  });
  getMenuList();
});

//弹窗的显示和隐藏
const dialogFormVisible = ref(false);

//树形菜单权限数据
const permissionData = ref([]);

const treeRef = ref();

//默认选中数据
const defaultKeys = reactive([4, 5]);

const beforeClose = () => {
  dialogFormVisible.value = false;
  groupFormRef.value.resetFields();
  treeRef.value.setCheckedKeys(defaultKeys);
}

//表单提交
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
      userSetMenu({name: groupForm.name, permissions, id: groupForm.id }).then(({data}) => {
        beforeClose();
        getMenuList();
      });
    } else {
      console.log('error submit!', fields)
    }
  });
}

const groupTableData = reactive({
  list: [],
  total: 0
})
const paginationData = reactive({
  pageNum: 1,
  pageSize: 1
});

const handleSizeChange = (val) => {
  paginationData.pageSize = val;
  getMenuList();
}

const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
  getMenuList();
}
//获取菜单列表
const getMenuList = () => {
  menuList(paginationData).then(({data}) => {
    const { total, list } = data.data;
    groupTableData.list = list;
    groupTableData.total = total;
  })
}
//编辑列表
const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  nextTick(() => {
    if(rowData){
      Object.assign(groupForm, { id: rowData.id, name: rowData.name});
      treeRef.value.setCheckedKeys(rowData.permission);
    }
  })
}
</script>

<template>
  <PanelHead :route="route" />
  <div class="btns">
    <el-button icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
  </div>
  <el-table :data="groupTableData.list" style="width: 100%">
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="permissionName" label="菜单权限" />
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
        :total="groupTableData.total"
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
      :model="groupForm"
      :rules="rules"
      ref="groupFormRef"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="groupForm.id" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="groupForm.name" placeholder="请输入权限名称" />
      </el-form-item>
      <el-form-item label="名称" prop="permissions">
        <el-tree
          style="max-width: 600px"
          :data="permissionData"
          node-key="id"
          show-checkbox
          :default-checked-keys="defaultKeys"
          ref="treeRef"
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(groupFormRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.btns{
  margin: 10px 0 ;
}
</style>