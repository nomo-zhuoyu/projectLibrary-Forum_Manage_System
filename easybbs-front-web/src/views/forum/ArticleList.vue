<template>
  <div 
    class  = "container-body article-list-body"
    :style="{width:proxy.globalInfo.bodyWidth+'px'}"
  >
    <div class = "article-panel">
        <div class="top-tab">
            <div>热榜</div>
            <el-divider direction="vertical"></el-divider>
            <div>发布时间</div>
            <el-divider direction="vertical"></el-divider>
            <div>最新</div>

        </div>
        <div class="article-lsit">
            <div v-for="item in articleListInfo.list">
                <ArticleListItem :data="item"></ArticleListItem>
            </div>
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

// 文章列表
const articleListInfo = ref({});
const loadArticle = async() =>{
    let result = await proxy.Request({
        url:api.loadArticle,
        params:{
            boardId:0,
        }
    });
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
        }
    }
}


</style>
