<!-- template是特殊化后的html，可以使用vue3的组件 -->
<template>
    <div>
        <div class = "header" v-if="showHeader">
            <!-- 使用全局变量 -->
            <div class="header-content" :style="{width:proxy.globalInfo.bodyWidth +'px'}">
                <!-- LOGO：router-link是导航连接，类似html的a标签 -->
                <router-link to="/" class="logo">
                    <!-- 冒号前要空格，可以传递 -->
                    <span v-for="(item, index) in logoInfo" :key="index" :style="{color: item.color}">{{item.letter}}</span>
                </router-link>
                <!-- 板块信息 -->
                <div class = "menu-panel">
                    <router-link 
                        :class="['menu-item home', activePboardId==undefined?'active':'']" 
                        to="/"
                    >
                        首页
                    </router-link>
                    <template v-for = "board in boardList">
                        <el-popover placement="bottom-start" :width="300" trigger="hover" v-if="board.children.length>0">
                            <template #reference>
                                <span
                                    :class="['menu-item',board.boardId==activePboardId?'active':'']" 
                                    @click="boardClickHandler(board)"
                                >
                                    {{ board.boardName }}
                                </span>
                            </template>
                            <div class = "sub-board-list">
                                <span 
                                    :class="['sub-board',subBoard.boardId == activeBoardId?'active':'']" 
                                    v-for="subBoard in board.children" 
                                    @click="subBoardClickHandler(subBoard)"
                                >
                                    {{ subBoard.boardName }}
                                </span>
                            </div>
                        </el-popover>
                        <span 
                            :class="['menu-item',board.boardId==activePboardId?'active':'']" 
                            v-else 
                            @click="boardClickHandler(board)"
                        >
                            {{ board.boardName }}
                        </span>
                    </template>
                </div>
                <!-- 登陆注册信息 -->
                <div class = "user-info-panel">
                    <el-button type="primary" class = "op-btn" @click="newPost">
                        发帖 <span class = "iconfont icon-add"></span>
                    </el-button>
                    <el-button type="primary" class = "op-btn" @click="goSearch">
                        搜索 <span class = "iconfont icon-search"></span>
                    </el-button>
                    <!-- 显示用户ID -->
                    <template v-if = "userInfo.userId">
                        <div class="message-info">
                            <el-dropdown>
                                <el-badge :value="messageCountInfo.total" class="item" :hidden="messageCountInfo.total == null || messageCountInfo.total == 0">
                                    <div class="iconfont icon-message"></div> 
                                </el-badge>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="gotoMessage('reply')" class="message-item" >
                                            <span class="text">回复我的</span>
                                            <span class="count-tag" v-if="messageCountInfo.reply>0">{{ messageCountInfo.reply  }}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="gotoMessage('likePost')" class="message-item" >
                                            <span class="text">赞了我的文章</span>
                                            <span class="count-tag" v-if="messageCountInfo.likePost>0">{{ messageCountInfo.likePost  }}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="gotoMessage('downloadAttachment')" class="message-item" >
                                            <span class="text">下载了我的附件</span>
                                            <span class="count-tag" v-if="messageCountInfo.downloadAttachment>0">{{ messageCountInfo.downloadAttachment  }}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="gotoMessage('likeComment')" class="message-item" >
                                            <span class="text">赞了我的评论</span>
                                            <span class="count-tag" v-if="messageCountInfo.likeComment>0">{{ messageCountInfo.likeComment  }}</span>
                                        </el-dropdown-item>
                                        <el-dropdown-item @click="gotoMessage('sys')" class="message-item" >
                                            <span class="text">系统消息</span>
                                            <span class="count-tag" v-if="messageCountInfo.sys>0">{{ messageCountInfo.sys  }}</span>
                                            
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                        <div class="user-info">
                            <el-dropdown>
                                <avatar :userId="userInfo.userId" :width="40" :addLink="false"></avatar> 
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item @click="gotoUcenter(userInfo.userId)">我的主页</el-dropdown-item>
                                        <el-dropdown-item @click="logout()">退出</el-dropdown-item>
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
        loadMessageCount:"/ucenter/getMessageCount",
        logout:"/logout",
        getSysSetting: "/getSysSetting",
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
        loadSysSetting();
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
        store.commit("saveBoardList",result.data);
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

    // 板块点击
    const boardClickHandler = (board) =>{
        router.push(`/forum/${board.boardId}`);
    } 

    // 二级板块
    const subBoardClickHandler = (subBoard) =>{
        router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`);
    }

    // 当前选中板块
    const activePboardId = ref(0);
    watch(
        () => store.state.activePboardId,
        (newVal, oldVal) => {
            activePboardId.value = newVal;
        }, 
        { immediate: true, deep: true }
    ); 
    const activeBoardId = ref(0);
    watch(
        () => store.state.activeBoardId,
        (newVal, oldVal) => {
            activeBoardId.value = newVal;
        }, 
        { immediate: true, deep: true }
    ); 

    // 发帖
    const newPost = () => {
        if(!store.getters.getLoginUserInfo){
            loginAndRegister(1);
        }else{
            router.push("/newPost");
        }
    }

    const gotoUcenter = (userId) => {
        router.push(`/user/${userId}`);
    }



    // 消息相关
    const gotoMessage = (type) => {
        router.push(`/user/message/${type}`);
    }

    const messageCountInfo = ref({});
    const loadMessageCount = async () => {
        let result = await proxy.Request({
            url: api.loadMessageCount,
        });
        if (!result) {
            return;
        }
        messageCountInfo.value = result.data;
        store.commit("updateMessageCountInfo", result.data);
    };

    watch(
        () => store.state.messageCountInfo,
        (newVal, oldVal) => {
            messageCountInfo.value = newVal || {};
        },
        { immediate: true, deep: true }
    );

    // 登录后再次刷新信息
    watch(
    () => store.state.loginUserInfo,
        (newVal, oldVal) => {
            if (newVal) {
            loadMessageCount();
            }
        },
        { immediate: true, deep: true }
    );


    // 退出
    const logout = () => {
    proxy.Confirm("确定要退出吗?", async () => {
        let result = await proxy.Request({
        url: api.logout,
        });
        if (!result) {
        return;
        }
        store.commit("updateLoginUserInfo", null);
    });
    };

    //获取系统配置
    const loadSysSetting = async () => {
        let result = await proxy.Request({
            url: api.getSysSetting,
        });
        if (!result) {
            return;
        }
        store.commit("saveSysSetting", result.data);
    };

    // 搜索
    const goSearch = () => {
        router.push("/search");
    }

</script>




<style lang="scss">
// 首页导航栏
.header{
    top:0px;
    width: 100%;
    height: 80px;
    position: fixed;
    // 自定义 最高层
    z-index: 999;
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
            .home{
                text-decoration: none;
                color: #000;   
            }
            .active{
                color: var(--link);
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
                margin-left: 10px;
                margin-right: 25px;
                cursor: pointer;
                .icon-message{
                    font-size:20px;
                    color:rgb(147,147,147);
                }
                
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
    .active{
        color: var(--link);
    }
}

.body-content{
    margin-top: 80px;
    position: relative;
}

.message-item{
    display: flex;
    justify-content: space-around;
    .text{
        flex: 1;
    }
    .count-tag{
        width: 20px;
        height: 20px;
        display: block;
        background: #f56c6c;
        border-radius: 50%;
        font-size: 13px;
        text-align: center;
        color: #ddd;
    }
}

</style>