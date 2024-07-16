<template>
  <div class="article-item">
    <div class="article-item-inner">
      <div class="article-body">
        <div class="user-info">
          <Avatar :userId="data.userId" :width="30"></Avatar>
          <router-link :to="'/user/'+data.userId" class="a-link">
            {{ data.nickName }}
          </router-link>
          <el-divider direction="vertical"></el-divider>
          <div class = "post-tiem">{{ data.postTime }}</div>
          <div class = "adress">{{ data.userIpAddress }}</div>
          <el-divider direction="vertical"></el-divider>
          <router-link :to="'/'">
            {{ data.pBoardName }}
          </router-link>
          <template v-if="data.boardName">
            <el-divider direction="vertical"></el-divider>
            <router-link :to="'/'">
              {{ data.boardName }}
            </router-link>
          </template>
        </div>
        <router-link to="/">{{ data.title }}</router-link>
        <div class="summary">{{ data.summary }}</div>
        <div class="article-info">
          <span class="iconfont icon-eye-solid">
            {{data.readCount == 0?"阅读":data.readCount}}
          </span>
          <span class="iconfont icon-good">
            {{data.goodCount == 0?"点赞":data.goodCount}}
          </span>
          <span class="iconfont icon-comment">
            {{data.commentCount == 0?"评论":data.commentCount}}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data:{
    type:Object,

  },
})
</script>

<style lang="scss" scoped>
.article-item{
  padding:5px 10px 0px 10px;
  .article-item-inner{
    border-bottom: 1px solid #ddd;
    padding: 10px;
    .article-body{
      .user-info{
        display: flex;
        align-items: center;
        .a-link{
          font-size:14px;
          margin-left:5px;
        }
        .post-time{
          
        }
      }
    }
  }
}
.article-item:hover{
  background: #cfcdf8;
  
}


</style>
