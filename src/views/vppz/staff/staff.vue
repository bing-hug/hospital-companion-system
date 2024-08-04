<script setup>
import {ref, reactive, onMounted, nextTick} from "vue";
import { useRoute } from "vue-router";
import { photoList, companion, companionList, deleteCompanion } from "@/api/index.js";
import { ElMessage } from "element-plus";
import { InfoFilled } from '@element-plus/icons-vue'
import dayjs from "dayjs";

onMounted(() => {
  photoList().then(({data}) => {
    fileList.value = data.data;
  });
  getListData( );
})

const route = useRoute();
//弹窗的显示和隐藏
const dialogFormVisible = ref(false);
//选着头像弹窗
const dialogImgVisible = ref(false);
const fileList = ref([]);
const selectIndex = ref(0);

const beforeClose = () => {
  dialogFormVisible.value = false;
  staffFormRef.value.resetFields();
}

const staffForm = reactive({
  id: '',
  name: '',
  mobile: '',
  active: 1,
  age: 28,
  avatar: '',
  sex: ''
});

const staffFormRef = ref();

const rules = reactive({
  name: [{ required: true, trigger: 'blur', message: '请填写昵称'}],
  avatar: [{ required: true, message: '请选择头像'}],
  sex: [{ required: true, message: '请选择性别'}],
  mobile: [{ required: true, trigger: 'blur', message: '请填写手机号'}],
});
const confirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      staffForm.active = Number(staffForm.active);
      companion(staffForm).then(({data}) => {
        if(data.code === 10000){
          ElMessage({
            message: '添加成功',
            type: 'success'
          });
          dialogFormVisible.value = false;
          getListData();
        }
      });
    } else {
      console.log('error submit!', fields)
    }
  });
}

const open = (rowData = {}) => {
  dialogFormVisible.value = true;
  nextTick(() => {
    if(rowData){
      Object.assign(staffForm, rowData);
    }
  })
}

const confirmImage = () => {
  staffForm.avatar =  fileList.value[selectIndex.value].url;
  dialogImgVisible.value = false;

}

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10
});

const staffTable = reactive({
  list: [],
  total: 0
});

const getListData = () => {
  companionList(paginationData).then(({data}) => {
    const { list, total } = data.data;
    list.forEach(item => {
      item.create_time  = dayjs(item.create_time).format('YYYY-MM-DD')
    });
    staffTable.list = list;
    staffTable.total = total
  })
}

const handleSizeChange = (val) => {
  paginationData.pageSize = val;
}

const handleCurrentChange = (val) => {
  paginationData.pageNum = val;
}

const selectTableData = ref([]);
const handleSelectionChange = (val) => {
  selectTableData.value = val.map(item => ({id: item.id}));
}
const confirmEvent = () => {
  if(!selectTableData.value.length){
    return ElMessage.warning("请选择至少一项数据");
  }
  deleteCompanion({id: selectTableData.value}).then(({data}) => {
    if(data.code === 10000){
      getListData();
    }
  });
}
</script>

<template>
  <PanelHead :route="route" />
  <div class="btns">
    <el-button icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
    <el-popconfirm
        width="220"
        confirm-button-text="是"
        cancel-button-text="否"
        :icon="InfoFilled"
        icon-color="#626AEF"
        title="是否确认删除?"
        @confirm="confirmEvent"
    >
      <template #reference>
        <el-button icon="Delete" type="danger" size="small">删除</el-button>
      </template>
    </el-popconfirm>
  </div>
  <el-table :data="staffTable.list" style="width: 100%" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="id" label="id" />
    <el-table-column prop="name" label="昵称" />
    <el-table-column prop="name" label="头像" >
      <template #default="scope">
        <el-image
          style="width:50px;height:50px"
          :src="scope.row.avatar"
        />
      </template>
    </el-table-column>
    <el-table-column prop="sex" label="性别" >
      <template #default="scope">
        {{ scope.row.sex === '1' ? '男' : '女'}}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="手机号码" />
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
        :total="staffTable.total"
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
        :model="staffForm"
        :rules="rules"
        label-width="100px"
        label-position="left"
        ref="staffFormRef"
    >
      <el-form-item v-show="false" prop="id">
        <el-input v-model="staffForm.id" />
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="staffForm.name" placeholder="请输入权限名称" />
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <el-button v-if="!staffForm.avatar" type="primary" @click="dialogImgVisible = true">点击上传</el-button>
        <el-image
            v-else
            :src="staffForm.avatar"
            style="width: 100px;height: 100px"
        />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="staffForm.sex">
          <el-option label="男" value="1" />
          <el-option label="女" value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="staffForm.age" :min="18" :max="50" />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="staffForm.mobile" />
      </el-form-item>
      <el-form-item label="是否生效" prop="active">
        <el-radio-group v-model="staffForm.active" class="ml-4">
          <el-radio :value=0>失效</el-radio>
          <el-radio :value=1>生效</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="confirm(staffFormRef)">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog
      v-model="dialogImgVisible"
      :before-close="beforeClose"
      title="选择图片"
      width="680"
  >
    <div class="image-list">
      <div v-for="(imgItem, imgIndex) in fileList" :key="imgItem.name" class="img-box" @click="selectIndex = imgIndex">
        <div v-if="selectIndex == imgIndex" class="select">
          <el-icon color="#fff"><Check /></el-icon>
        </div>
        <el-image
          :src="imgItem.url"
          style="width: 148px;height: 148px"
        />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogImgVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmImage">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.btns {
  padding: 10px 0 10px 10px;
  background-color: #fff;
}
.image-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .img-box {
    position: relative;
    .select {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 24px;
      height: 24px;
      background-color: #67c23a;
      z-index: 999;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .el-image {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
.flex-box{
  display: flex;
  align-items: center;
}
</style>