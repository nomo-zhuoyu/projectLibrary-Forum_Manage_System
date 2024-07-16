<!-- template是特殊化后的html，可以使用vue3的组件 -->
<template>
    <div>
        <div class = "header" v-if="showHeader">
            <!-- 使用全局变量 -->
            <div class="header-content" :style="{width:proxy.globalInfo.bodyWidth+'px'}">
                <!-- LOGO：router-link是导航连接，类似html的a标签 -->
                <router-link to="/" class="logo">
                    <!-- 冒号前要空格，可以传递 -->
                    <span v-for="(item, index) in logoInfo" :key="index" :style="{color: item.color}">{{item.letter}}</span>
                </router-link>
                <!-- 板块信息 -->
                <div class = "menu-panel">
                    <span class="menu-item">全部</span>
                    <template v-for = "board in boardList">
                        <el-popover placement="bottom-start" :width="300" trigger="hover" v-if="board.children.length>0">
                            <template #reference>
                                <span class="menu-item">{{ board.boardName }}</span>
                            </template>
                            <div class = "sub-board-list">
                                <span class="sub-board" v-for="subBoard in board.children">
                                    {{ subBoard.boardName }}
                                </span>
                            </div>
                        </el-popover>
                        <span class="menu-item" v-else>{{ board.boardName }}</span>
                    </template>
                </div>
                <!-- 登陆注册信息 -->
                <div class = "user-info-panel">
                    <el-button type="primary" class = "op-btn">
                        发帖 <span class = "iconfont icon-add"></span>
                    </el-button>
                    <el-button type="primary" class = "op-btn">
                        搜索 <span class = "iconfont icon-search"></span>
                    </el-button>
                    <!-- 显示用户ID -->
                    <template v-if = "userInfo.userId">
                        <div class="message-info">
                            <el-dropdown>
                                <el-badge :value="12" class="item">
                                    <div class="iconfont icon-message"></div> 
                                </el-badge>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>回复我的</el-dropdown-item>
                                        <el-dropdown-item>赞了我的文章</el-dropdown-item>
                                        <el-dropdown-item>下载了我的附件</el-dropdown-item>
                                        <el-dropdown-item>赞了我的评论</el-dropdown-item>
                                        <el-dropdown-item>系统消息</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                        <div class="user-info">
                            <el-dropdown>
                                <avatar userId="userInfo.userId" :width="40"></avatar> 
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>我的主页</el-dropdown-item>
                                        <el-dropdown-item>退出</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </template>
                    <el-button-group :style="{'margin-left':'5px'}" v-else>
                        <el-button type="primary" plain @click="loginAndRegister(1)">登录</el-button>
                        <el-button type="primary" plain @click="loginAndRegister(0)">注册</el-button>
                    </el-button-group> 
                    
                </div>
            </div>
        </div>
        <!-- <div>
            <div :style="{ height :'200px' , background :'grey' }">1</div>
            <div :style="{ height :'200px' , background :'white' }">2</div>
            <div :style="{ height :'200px' , background :'grey' }">3</div>
            <div :style="{ height :'200px' , background :'white' }">4</div>
            <div :style="{ height :'200px' , background :'grey' }">5</div>
        </div>   -->
        <div class = "body-content">
            <router-view/>
        </div>
        <!-- 登录 注册 -->
        <LoginAndRegister ref="loginRegisterRef"></LoginAndRegister>
    </div>
</template>


<script setup>
    //引入组件
        // 其中ref()用于创建响应式数据引用，一旦引用的数据改变，所有使用该数据的组件都会更新
    import LoginAndRegister from "./LoginAndRegister.vue";
    import {ref,reactive, getCurrentInstance, onMounted,watch} from "vue";
    import {useRouter, useRoute} from "vue-router";
    import {useStore} from "vuex"
    // 引入全局变量
    const {proxy} = getCurrentInstance();
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    const api = {
        getUserInfo:"/getUserInfo",
        loadBoard:"/board/loadBoard",
    }

    // logo字符
    const logoInfo = ref([
        {
            letter:"E",
            color:"Blue",
        },    
        {
            letter:"s",
            color:"green",
        },    
        {
            letter:"a",
            color:"green",
        },    
        {
            letter:"b",
            color:"green",
        },    
        {
            letter:"b",
            color:"green",
        },    
        {
            letter:"s",
            color:"green",
        },    
    ]);    
    
    const showHeader = ref(true)
    //获取滚动条位置
    const getScrollTop = () =>{
        let scrollTop = 
            document.documentElement.scrollTop ||
            window.pageYOffset ||
            document.body.scrollTop;   
        return scrollTop;    
    }
    //监听滚动条位置
    const initScroll = () =>{
        let initScrollTop = getScrollTop();
        console.log(initScrollTop);
        let scrollType = 0;
        window.addEventListener("scroll",() =>{
            let currentScrollTop = getScrollTop();
            if(currentScrollTop > initScrollTop){
                //向下滚动
                scrollType = 1;
            }else{
                //向上滚动
                scrollType = 0;
            }
            // 判断滚动条位置
            if(scrollType == 1 && currentScrollTop > 100){
                // 向下滚动
                showHeader.value = false;
            }else{
                // 向上滚动
                showHeader.value = true;
            }
            initScrollTop = currentScrollTop;
        });
    };

    //登录注册
    const loginRegisterRef = ref();
    const loginAndRegister = (type) =>{
        loginRegisterRef.value.showPanel(type);
    }

    onMounted(()=>{
        initScroll();
        getUserInfo();
    });

    const getUserInfo = async () =>{
        let result = await proxy.Request({
            url:api.getUserInfo,
        })
        if(!result){
            return;
        }
        store.commit("updateLoginUserInfo",result.data);
    } 

    // 获取板块信息
    const boardList = ref([]);
    const loadBoard = async() =>{
        let result = await proxy.Request({
            url:api.loadBoard,
        });
        if(!result){
            return;
        }
        boardList.value = result.data;
    };
    loadBoard();
    
    // 监听 登录用户信息
    const userInfo = ref({});
    watch(
        () =>store.state.loginUserInfo,
        (newVal, oldVal) => {
            if(newVal != undefined && newVal != null){
                userInfo.value = newVal;
            }else{
                userInfo.value = {};
            }
        },
        { immediate: true, deep: true }
    );
    // 监听是否展示登录框
    watch(
        () => store.state.showLogin,
        (newVal, oldVal) => {
            // 必须使用newVal
            if(newVal){
                loginAndRegister(1);
            }
        }, 
        { immediate: true, deep: true }
    );
</script>




<style lang="scss">
// 首页导航栏
.header{
    top:0px;
    width: 100%;
    height: 80px;
    position: fixed;
    background-color: #ffffff;
    box-shadow: 0 2px 6px 0 #ddd;
    .header-content{
        height: 80px;
        background-color: #ffffff;
        //居中处理
        margin: 0px auto;
        align-items: center;
        //使用flex布局
        display: flex;
        .logo{
            text-decoration: none;
            margin-right: 5px;
            span{
                font-size:30px
            }
        }
        .menu-panel{
            flex:1;   //占据剩余空间
            .menu-item{
                margin-left: 20px;
                cursor:pointer;
                // 自定义
                color: black;
            }
        }
        .user-info-panel{
            width: 300px;
            display: flex;
            align-items: center;
            .op-btn{
                // 按钮文本与图标间距
                .iconfont{
                    margin-left: 5px;
                }
                .el-button + .el-button{
                    margin-left: 5px;
                }
            }
            .message-info{
                // width:50px;
                .icon-message{
                    font-size:20px;
                    color:rgb(147,147,147);
                }
                margin-left: 10px;
                margin-right: 25px;
                cursor: pointer;
            }
            .user-info{
                
            }
        }
    }
}

.sub-board-list{
    display: flex;
    flex-wrap: wrap;
    .sub-board{
        padding: 0px 10px;
        border-radius: 20px;
        margin-right: 10px;
        background: #ddd;
        border: 1px solid #ddd;
        color:#656565;
        margin-top: 10px;
    }
    .sub-board:hover{
        color: var(--link);
    }
}

.body-content{
    margin-top: 80px;
    position: relative;
}

</style>