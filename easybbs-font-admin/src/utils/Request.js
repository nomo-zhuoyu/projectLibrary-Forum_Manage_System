import axios from 'axios'
import {configProviderContextKey,ElLoading} from 'element-plus'
import Message from "@/utils/Message"
import router from '@/router'

const instance = axios.create({
    baseURL:"/api",
    timeout: 100*1000,   //10s

})

const contentTypeForm = "application/x-www-form-urlencoded;charset-UTF-8";
const contentTypeJson = "application/json";


// 请求前过滤器
let loading = null;
instance.interceptors.request.use(
    (config) =>{
        // 是否展示加载界面
        if(config.showLoading){
            loading = ElLoading.service(
                {
                    lock:true,
                    text:"少女祈祷中...",
                    background:'rgba(0,0,0,0.7)',
                }
            )
        }
        // console.log("请求前:",config);
        return config;
    },
    (error) => {
        if(error.config.showLoading && loading){
            loading.close();
        }
        Message.error("请求发送失败");
        return Promise.reject("请求发送失败");
    }
);

// 请求后过滤器
instance.interceptors.response.use(
    (response) =>{
        const {showLoading,errorCallback,showError} = response.config;
        // console.log("请求后报文:",response.config);
        if(showLoading && loading){
            loading.close();
        }
        const responseData = response.data;
        // console.log("请求后数据:",response.data);
        if(responseData.code == 200){
            return responseData;
        }else if(responseData.code == 901){
            // 对登录状态的后端检验 点赞时会901导致弹出登录窗口
            setTimeout(() => {
                router.push("/")
            }, 2000);
            return Promise.reject({showError:true,msg:"登录超时"});
        }else{
            if(errorCallback){
                errorCallback(responseData);
            }
            return Promise.reject({showError:showError,msg:responseData.info});
        }
    },
    (error) => {
        if(error.config.showLoading && loading){
            loading.close();
        }
        return Promise.reject({showError:true,msg:"网络异常"});
        // console.log(error);
    },


);


const request = (config) =>{
    const {url,params,dataType,showLoading = true,errorCallback,showError=true} = config;
    let contentType = contentTypeForm;
    let fromData = new FormData();
    for(let key in params){
        fromData.append(key,params[key] == undefined ? "" : params[key]);
    }
    // console.log("request:",fromData);
    if(dataType != null && dataType == "json"){
        contentType = contentTypeJson;
    }

    let headers = {
        'Content-Type':contentType,
        'X-Requested-With':'XMLHttpRequest',
    }
    // console.log("contentType:",contentType);
    return instance.post(url,fromData,
    {   headers:headers,
        showLoading:showLoading,
        errorCallback:errorCallback,
        showError:showError,
    }
    ).catch(error => {
        if(error.showError){
            Message.error(error.msg);
        }
        return null;
    })
};

// 导出
export default request;