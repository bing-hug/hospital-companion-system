<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { getCode, userAuthentication, login } from "@/api/index.js";
import { useRouter } from "vue-router";

const imgUrl = new URL('@/assets/images/login-head.png', import.meta.url).href;
const router = useRouter();
const formType = ref(1);
const loginForm = reactive({
  userName: '',
  passWord: '',
  validCode: ''
});
const countdown = reactive({
  validText: '获得验证码',
  time: 60
});
let flag = false;
const phoneReg = /^1(3[0-9]|4[01456789]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
const passReg = /^[a-zA-z0-9_-]{4,16}$/;
const validateUser = (rule, value, callback) => {
  let errorText = '';
  if (value == '') {
    errorText = '请输入手机号码';
  } else {
    !phoneReg.test(value) ? errorText = '手机格式不对，请输入正确的手机号码' : ''
  }
  if(errorText){
    callback(new Error(errorText));
  }else{
    callback();
  }
}
const validatePass = (rule, value, callback) => {
  let errorText = '';
  if (value == '') {
    errorText = '请输入密码';
  } else {
    !passReg.test(value) ? errorText = '密码格式不对，需要4-16位的密码' : ''
  }
  if(errorText){
    callback(new Error(errorText));
  }else{
    callback();
  }
}
const rules = reactive({
  userName: [{ validator: validateUser, trigger: 'blur'}],
  passWord: [{ validator: validatePass, trigger: 'blur'}],
})
//表单切换
const handleChange = () => {
  formType.value = formType.value ? 0 : 1;
}
//获取验证码
const countdownChange = () => {
  if(flag) return
  if(!loginForm.userName || !phoneReg.test(loginForm.userName)){
    return ElMessage({
      message: '请输入正确的手机号码',
      type: 'warning',
    })
  }
   const codeTimer = setInterval(() => {
    if(countdown.time <= 0){
      countdown.time = 60;
      countdown.validText = '获取验证码'
      flag = false;
      clearInterval(codeTimer);
    }else{
      countdown.time--;
      countdown.validText = `剩余${countdown.time}s`
    }
  }, 1000);
  flag = true
  getCode({tel: loginForm.userName}).then(({data})=>{
    console.log(data);
    if(data.code == 10000){
      ElMessage({
        message: '发送成功·',
        type: 'success',
      });
    }
  })
}
const loginFormRef = ref();
const submitForm = async (formEl) => {
  console.log(formEl);
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if(formType.value){
        userAuthentication(loginForm).then(({data}) => {
          console.log(data);
          if(data.code == 10000){
            formType.value = 0;
            ElMessage({
              message: '注册成功',
              type: 'success',
            });
          }else{
            ElMessage({
              message: '注册失败',
              type: 'danger',
            });
          }
        });
      }else{
        login(loginForm).then(({data}) => {
          if(data.code == 10000){
            console.log(data);
            ElMessage({
              message: '登录成功',
              type: 'success',
            });
            localStorage.setItem('pz_token', data.data.token);
            localStorage.setItem('pz_userInfo', JSON.stringify(data.data.userInfo));
            router.push('/');
          }else{
            ElMessage({
              message: '注册失败',
              type: 'danger',
            });
          }
        });
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <el-row class="login-container" justify="center" :align="'middle'">
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <img :src="imgUrl" alt="">
        </div>
      </template>
      <div class="jump-link">
        <el-link type="primary" @click="handleChange" style="margin-bottom: 10px">
          {{ formType ? '返回登录' : '注册账号'}}
        </el-link>
        <el-form
            :model="loginForm"
            style="max-width: 600px"
            :rules="rules"
            ref="loginFormRef"
        >
          <el-form-item prop="userName">
            <el-input v-model="loginForm.userName" placeholder="手机号" prefix-icon="UserFilled"  />
          </el-form-item>
          <el-form-item prop="passWord">
            <el-input v-model="loginForm.passWord" placeholder="密码" prefix-icon="Lock" />
          </el-form-item>
          <el-form-item prop="validCode" v-if="formType">
            <el-input v-model="loginForm.validCode" placeholder="验证码" prefix-icon="Lock" >
              <template #append>
                <span @click="countdownChange" style="cursor:pointer;">
                  {{ countdown.validText}}
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :style="{width: '100%'}" @click="submitForm(loginFormRef)">
              {{ formType ? '注册账号' : '登录'}}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </el-row>
</template>

<style scoped>
:deep(.el-card__header) {
  padding: 0;
}
.login-container {
  height: 100%;
  .card-header {
    background-color: #899fe1;
    img {
      width: 430px;
    }
  }
  .jump-link {
    text-align: right;
    margin-bottom: 10px;
  }
}
</style>