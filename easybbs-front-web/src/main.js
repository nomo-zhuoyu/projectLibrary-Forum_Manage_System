import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

//引入cookies
import VueCookies from 'vue-cookies'
//引入element plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//我们使用scss 所以这里将base.css 改成base.scss
import '@/assets/base.scss'
//图标 图标在附件中
import '@/assets/icon/iconfont.css'
import store from './store'
//全局方法
import Verify from '@/utils/Verify.js'
import Message from '@/utils/Message.js'
import Request from '@/utils/Request.js'
//全局组件
import Dialog from "@/components/Dialog.vue"
import Avatar from "@/components/Avatar.vue"
const app = createApp(App)

app.use(router)
app.use(store)
app.use(ElementPlus);


app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.globalInfo = {
    //全局变量
    bodyWidth:1300,
    avatarUrl:"/api/file/getAvatar/"
}

app.config.globalProperties.Verify = Verify;
app.config.globalProperties.Message = Message;
app.config.globalProperties.Request = Request;

app.component("Dialog",Dialog);
app.component("Avatar",Avatar);

app.mount('#app')