<template>
  <div 
    class  = "container-body article-list-body"
    :style="{width:proxy.globalInfo.bodyWidth+'px'}"
  >
    <div class = "article-panel">
        <div class="top-tab">
            <div :class="['tab',orderType ==0 ? 'active' : '']" @click="changeOderType(0)">热榜</div>
            <el-divider direction="vertical"></el-divider>
            <div :class="['tab',orderType ==1 ? 'active' : '']" @click="changeOderType(1)">发布时间</div>
            <el-divider direction="vertical"></el-divider>
            <div :class="['tab',orderType ==2 ? 'active' : '']" @click="changeOderType(2)">最新</div>

        </div>
        <div class="article-lsit">
            <DataList 
                :loading = "loading" 
                :dataSource="articleListInfo" 
                @loadData = "loadArticle" 
                noDataMsg="没有文章,发一个吧"
            >
                <template #default = "{data}">
                    <ArticleListItem :data="data"></ArticleListItem>
                </template>
            </DataList>
        </div>
    </div>
  
  </div>
</template>

<script setup>
import ArticleListItem from "./ArticleListItem.vue"
import {ref,reactive, getCurrentInstance, nextTick} from "vue";
import {useRouter, useRoute} from "vue-router";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
    loadArticle:"/forum/loadArticle",
}

const changeOderType = (type) => {
    orderType.value = type;
    loadArticle();
}

// 文章列表
const orderType =ref(0);
const loading = ref(false);
const articleListInfo = ref({});
const loadArticle = async() =>{
    loading.value=true;
    let params = {
        pageNo: articleListInfo.value.pageNo,
        boardId:0,
        orderType:orderType.value,
    }
    
    let result = await proxy.Request({
        url:api.loadArticle,
        params:params,
        showLoading:false,
    });
    loading.value=false;
    if(!result){
        return;
    }
    articleListInfo.value = result.data;
}
loadArticle();
</script>

<style lang="scss" scoped>
.article-list-body{
    .article-panel{
        background: #fff;
        .top-tab{
            display: flex;
            align-items: center;
            padding: 10px;
            font-size: 15px;
            border-bottom:1px solid #ddd ;
            .tab{
                cursor: pointer;
            }
            .active{
                color: var(--link);
            }
        }
    }
    .article-list{
        padding-bottom: 5px;
    }
}


</style>
