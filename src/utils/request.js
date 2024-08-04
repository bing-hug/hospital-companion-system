import axios from "axios";
import { ElMessage } from 'element-plus'

const http = axios.create({
    baseURL: 'https://v3pz.itndedu.com/v3pz',
    timeout: 100000
});

http.interceptors.request.use(function(config){
    const token = localStorage.getItem('pz_token');
    //不需要token的api
    const whiteUrl = ['/get/code', '/user/authentication', '/login'];
    if(token && !whiteUrl.includes(config.url)){
        config.headers['X-token'] = token
    }
    return config
},function(error){
    return Promise.reject(error);
});

http.interceptors.response.use(function(response){
    if(response.data.code === -1){
        ElMessage({
            message: response.data.message,
            type: 'warning',
        })
    }else if(response.data.code === -2){
        localStorage.removeItem('pz_token');
        localStorage.removeItem('pz_userInfo');
        localStorage.removeItem('pz_v3pz');
        window.location.href = window.location.origin;
    }
    return response
}, function (error){
    return Promise.reject(error)
});

export default http