<template>
  <div>
    <div class="data-list">
      <div class="top-panel">
        <!-- 搜索功能 -->
        <el-form :model="searchFormData" label-width="50px"> 
          <el-row>
            <!-- 标题 -->
            <el-col :span="4">
              <el-form-item label="标题">
                <el-input
                  placeholder="请输入标题"
                  v-model="searchFormData.titleFuzzy"
                  clearable
                  @keyup.native="loadDataList"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 昵称 -->
            <el-col :span="4">
              <el-form-item label="昵称">
                <el-input
                  placeholder="请输入昵称"
                  v-model="searchFormData.nickNameFuzzy"
                  clearable
                  @keyup.native="loadDataList"
                  >
                </el-input>
              </el-form-item>
            </el-col>
            <!-- 板块 -->
            <el-col :span="4">
              <el-form-item label="板块">
                <el-cascader
                  placeholder="请选择板块"
                  :options="boardList"
                  :props="boardProps"
                  clearable
                  v-model="searchFormData.boardIds"
                  :style="{width:'100%'}"
                >
                </el-cascader>
              </el-form-item>
            </el-col>
            <!-- 附件 -->
            <el-col :span="4">
              <el-form-item label="附件">
                <el-select
                  placeholder="请选择"
                  clearable
                  v-model="searchFormData.attachmentType"
                  :style="{width:'100%'}"
                >
                  <el-option :value="1" label="有附件"></el-option>
                  <el-option :value="0" label="无附件"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 状态 -->
            <el-col :span="4">
              <el-form-item label="状态">
                <el-select
                  placeholder="请选择状态"
                  clearable
                  v-model="searchFormData.status"
                  :style="{width:'100%'}"
                >
                <el-option :value="-1" label="已删除"></el-option>
                <el-option :value="0" label="待审核"></el-option>
                <el-option :value="1" label="已审核"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <!-- 置顶 -->
            <el-col :span="4">
              <el-form-item label="置顶" prop="topType">
                <el-select
                  placeholder="请选择"
                  clearable
                  v-model="searchFormData.topType"
                  :style="{width:'100%'}"
                >
                  <el-option :value="0" label="未置顶"></el-option>
                  <el-option :value="1" label="已置顶"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- 搜索 -->
            <el-col :span="4" :style="{'padding-left' : '10px'}">
              <el-button-group>
                <el-button type="primary" @click="loadDataList">搜索</el-button>
                <el-button 
                  type="success"
                  @click="auditBatch"
                  :disabled="selectBatchList.length == 0"
                >
                  批量审核
                </el-button>
                <el-button
                  type="danger"
                  @click="delBatch"
                  :disabled="selectBatchList.length == 0"
                >
                  批量删除
                </el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <Table
        ref="tableRef"
        :columns="columns"
        :dataSource="tableData"
        :fetch="loadDataList"
        :options="tableOptions"
        @rowSelected="setRowSelected"
      >
        <!-- 用户信息 -->
        <template #userInfo="{index,row}">
          <div class="user-info">
            <Avatar :userId="row.userId" :width="50"></Avatar>
            <div class="name-info">
              <div>
                <a 
                  :href="`${proxy.globalInfo.webDomain}user/${row.userId}`"
                  class="a-link" 
                  target="_blank"
                >
                  {{ row.nickName }}
                </a>
              </div>
              <div>{{ row.userIpAddress }}</div>
            </div>
          </div>
        </template> 
        <!-- 封面 -->
        <template #cover="{index,row}">
          <Cover :cover="row.cover"></Cover>
        </template>
        <!-- 标题 -->
        <template #titleInfo="{index,row}">
          <a
            class="a-link"
            target="_blank"
            tag="a"
            :href="`${proxy.globalInfo.webDomain}post/${row.articleId}`"
          >{{ row.title }}</a>
        </template>
        <!-- 板块 -->
        <template #boardInfo="{index,row}">
          <div>
            <span>{{ row.pBoardName }}</span>
            <span v-if="row.boardName">/{{ row.boardName }}</span>
          </div>
        </template>
        <!-- 互动信息 -->
        <template #interactionInfo="{index,row}">
          <div>阅读，{{ row.readCount }}</div>
          <div>点赞，{{ row.goodCount }}</div>
          <div>
            评论：<span>{{ row.comentCount }}</span>
            <span
              class="a-link"
              :style="{'margin-left':'5px'}"
              @click="showComment(row.articleId)"
              v-if="row.commentCount"
            >
              查看
            </span>
          </div>
        </template>
        <!-- 附件信息 -->
        <template #attachmentInfo="{index,row}">
          <div v-if="row.attachmentType == 0">无附件</div>
          <div v-if="row.attachmentType == 1">
            <span
              @click="showAttachment(row.nickName,row.articleId)"
              class="a-link"
            > 
              查看附件
            </span>
          </div>
        </template>
        <!-- 状态 -->
        <template #statusInfo="{index,row}">
          <span v-if="row.status == -1" :style="{color:'red'}">已删除</span>
          <span v-if="row.status == 0" :style="{color:'red'}">待审核</span>
          <span v-if="row.status == 1" :style="{color:'green'}">已审核</span>
          <span v-if="row.topType == 1" :style="{color:'green'}">已置顶</span>
          <span v-if="row.topType == 0" :style="{color:'green'}">未置顶</span>
        </template>
        <!-- 操作信息 -->
        <template #op="{index,row}">
          <div class="op" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updateBoard(row)">修改板块</el-dropdown-item>
                  <el-dropdown-item 
                  @click="topArticle(row)" 
                  v-if="row.topType == 1 && row.status == 1"
                  >
                  取消置顶
                  </el-dropdown-item>
                  <el-dropdown-item 
                  @click="topArticle(row)" 
                  v-if="row.topType == 0 && row.status == 1"
                  >
                  置顶
                  </el-dropdown-item>
                  <el-dropdown-item @click="delArticle(row)">删除</el-dropdown-item>
                  <el-dropdown-item @click="audit(row)" v-if="row.status == 0">审核</el-dropdown-item>

                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
    <!-- 修改板块 -->
    <ArticleBoard
      ref="articleBoardRef"
      @reload="loadDataList"
    ></ArticleBoard>
    <!-- 查看附件 -->
    <ArticleAttachment ref="articleAttachmentRef"></ArticleAttachment>
    <!-- 查看附件 -->
    <ArticleComment ref="commentRef"></ArticleComment>
  </div>
</template>

<script setup>
import ArticleBoard from "./ArticleBoard.vue"
import ArticleAttachment from "./ArticleAttachment.vue"
import ArticleComment from "./ArticleComment.vue"

import {ref,reactive, getCurrentInstance, nextTick} from "vue";
import {useRouter, useRoute} from "vue-router";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();


const api = {
  loadDataList:"/forum/loadArticle",
  loadBoard:"/board/loadBoard",
  topArticle:"/forum/topArticle",
  delArticle:"/forum/delArticle",
  auditArticle:"/forum/auditArticle",
}

const tableOptions = ref({
  selectType:"checkbox",
  extHeight:0,
});
const columns = [
  {
    label:"用户信息",
    prop:"avater",
    width:200,
    scopedSlots:"userInfo",
  },
  {
    label:"封面",
    prop:"cover",
    width:100,
    scopedSlots:"cover",
  },
  {
    label:"标题",
    scopedSlots:"titleInfo",
  },
  {
    label:"板块",
    width:200,
    scopedSlots:"boardInfo",
  },
  {
    label:"互动信息",
    width:150,
    scopedSlots:"interactionInfo",
  },
  {
    label:"是否有附件",
    prop:"attachment",
    width:100,
    scopedSlots:"attachmentInfo",
  },
  {
    label:"状态信息",
    prop:"status",
    width:100,
    scopedSlots:"statusInfo",
  },
  {
    label:"发布时间",
    prop:"postTime",
    width:150,
  },
  {
    label:"操作",
    prop:"op",
    width:80,
    scopedSlots:"op",
  },
];

const tableData = ref({});

const loadDataList = async () => {
  let params = {
    pageNo:tableData.value.pageNo,
    pageSize:tableData.value.pageSize,
  }

  Object.assign(params,searchFormData.value);
  if(params.boardIds&&params.boardIds.length==1){
    params.pBoardId = params.boardIds[0];
  }else if (params.boardIds&&params.boardIds.length==2){
    params.pBoardId = params.boardIds[0];
    params.boardId = params.boardIds[1];
  }
  
  let result = await proxy.Request({
    url:api.loadDataList,
    params:params
  })
  if(!result){
    return;
  }
  tableData.value = result.data;
}

// 批量选择
const selectBatchList = ref([]);
const setRowSelected= (rows) => {
  selectBatchList.value = [];
  rows.forEach((element) => {
    selectBatchList.value.push(element.articleId);
  })
}

// 搜索
const searchFormData = ref({});

// 板块信息
const boardList = ref([]);
const boardProps = {
  multiple:false,
  checkDtrictly:true,
  value:"boardId",
  label:"boardName",
}
const loadBoardList = async () => {
  let result = await proxy.Request({
    url:api.loadBoard,
  });

  if(!result){
    return;
  }
  boardList.value=result.data;
}

loadBoardList();

// 批量操作
const tableRef = ref();
const auditBatch = () => {
  proxy.Confirm(`确定批量审核吗？`,async () => {
    let result = await proxy.Request({
      url:api.auditArticle,
      params:{
        articleIds:selectBatchList.value.join(","),
      },
    })
    if(!result){
      return;
    }
    tableRef.value.clearSelection();
    loadDataList();
  })
}

const delBatch = () => {
  proxy.Confirm(`确定批量删除吗？`,async () => {
    let result = await proxy.Request({
      url:api.delArticle,
      params:{
        articleIds:selectBatchList.value.join(","),
      },
    })
    if(!result){
      return;
    }
    tableRef.value.clearSelection();
    loadDataList();
  })
}
// 修改板块
const articleBoardRef = ref();
const updateBoard = (data) => {
  articleBoardRef.value.updateBoard(data);
}

// 删除审核
const audit = (data) => {
  proxy.Confirm(`你确定审核通过【@{data.title}】吗？`,async () => {
    let result = await proxy.Request({
      url:api.auditArticle,
      params:{
        articleIds:data.articleId,
      },
    })
    if(!result){
      return;
    }
    loadDataList();
  })
} 

const delArticle = (data) => {
  proxy.Confirm(`你确定审核删除【@{data.title}】吗？`,async () => {
    let result = await proxy.Request({
      url:api.delArticle,
      params:{
        articleIds:data.articleId,
      },
    })
    if(!result){
      return;
    }
    loadDataList();
  })
} 
const topArticle = (data) => {
  const opName = data.topType == 0 ? "设为置顶":"取消置顶";
  proxy.Confirm(`你确定要将【@{data.title}】${opName}吗？`,async () => {
    let result = await proxy.Request({
      url:api.topArticle,
      params:{
        topType:data.topType == 0 ? 1 : 0,
        articleIds:data.articleId,
      },
    })
    if(!result){
      return;
    }
    loadDataList();
  })
} 

// 查看附件
const articleAttachmentRef = ref();
const showAttachment = (nickName,articleId) => {
  articleAttachmentRef.value.show(nickName,articleId);
}

// 查看评论
const commentRef = ref();
const showComment = (articleId) => {
  commentRef.value.show(articleId);
}
</script>

<style lang="scss" scoped>
.data-list{
  .user-info{
    display: flex;
    align-items: center;
    .name-info{
      margin-left: 5px;
      font-size: 13px;
    }
  }
  .op{
    .iconfont{
      cursor:pointer;
    }
  }
}
</style>
