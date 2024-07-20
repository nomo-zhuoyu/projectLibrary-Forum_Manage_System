<template>
  <div class="comment-item">
    <Avatar :userId="commentData.userId" :width="50"></Avatar>
    <div class="comment-info">
        <div class="nick-name">
            <span class="name" @click="gotoUcenter(commentData.userId)">{{commentData.nickName  }}</span>
            <span  class="tag-author" v-if="commentData.userId == articleUserId">
                作者
            </span>
        </div>
        <div class="comment-content">
            <span v-html="commentData.content"></span>
        </div>
        <div class="op-panel">
            <div class="time">
                <span>{{ commentData.postTime }}</span>
                <span class="address">
                    &nbsp;·&nbsp;{{ commentData.userIpAddress }}
                </span>
            </div>
            <div :class="['iconfont icon-good',commentData.likeType == 1? 'active':'']"  @click="doLike(commentData)">
                {{ commentData.goodCount>0?commentData.goodCount:"点赞" }}
            </div>
            <div class="iconfont icon-comment" @click="showReplyPanel(commentData,0)">
                回复
            </div>
            <el-dropdown v-if="articleUserId == currentUserId">
                <div class="iconfont icon-more"></div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>
                            {{ commentData.topType == 0 ? "设为置顶":"取消置顶" }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <div class="comment-sub-list" v-if="commentData.children">
            <div class="comment-sub-item" v-for="sub in commentData.children">
                <Avatar :userId="sub.userId" :width="30"></Avatar>
                <div class="comment-sub-info">
                    <div class="nick-name">
                        <span class="name" @click="gotoUcenter(sub.userId)">{{sub.nickName}}</span>
                        <span  class="tag-author" v-if="sub.userId == articleUserId">
                            作者
                        </span>
                        <span class="reply-name">回复</span>
                        <span class="a-link" @click="gotoUcenter(sub.replyUserId)">@{{ sub.replyNickName }}</span>
                        <span>：</span>
                        <span class="sub-content" v-html="sub.content"></span>
                    </div>
                    <div class="op-panel">
                        <div class="time">
                            <span>{{ sub.postTime }}</span>
                            <span class="address">
                                &nbsp;·&nbsp;{{ sub.userIpAddress }}
                            </span>
                        </div>
                        <div :class="['iconfont icon-good',sub.likeType == 1? 'active':'']" @click="doLike(sub)">
                            {{ sub.goodCount>0?sub.goodCount:"点赞" }}
                        </div>
                        <div class="iconfont icon-comment" @click="showReplyPanel(sub,1)">
                            回复
                        </div>
                    </div>        
                </div>
            </div>
        </div>


        <div class="reply-info" v-if="commentData.showReply">
            <CommentPost
                :placeholderInfo="placeholderInfo"
                :articleId="articleId"
                :avatarWidth="30"
                :userId="currentUserId"
                :showInsertImg="false"
                :pCommentId="pCommentId"
                :replyUserId="replyUserId"
                @postCommentFinish="postCommentFinish"
            >

            </CommentPost>
        </div>
    </div>
  </div>
</template>

<script setup>
import CommentPost  from "./CommentPost.vue"

import {ref,reactive, getCurrentInstance, nextTick} from "vue";
import {useRouter, useRoute} from "vue-router";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();


const props = defineProps({
    articleId:{
        type:String,
    },
    commentData:{
        type:Object,
    },
    articleUserId:{
        type:String,
    },
    currentUserId:{
        type:String,
    },
})

const api ={
    doLike : "/comment/doLike"
}

// 显示评论框
const pCommentId = ref(0);
const replyUserId = ref(null);
const placeholderInfo = ref(null);

const emit = defineEmits(["hiddenAllReply"])

const showReplyPanel= (curData,type) => {
    const haveshow = props.commentData.showReply == undefined ? false : props.commentData.showReply;
    emit("hiddenAllReply");
    
    if(type == 0){
        props.commentData.showReply = !haveshow;
    }else{
        props.commentData.showReply = true;
    }


    pCommentId.value = props.commentData.commentId;
    replyUserId.value = curData.userId;
    placeholderInfo.value = "回复 @"+curData.nickName;
}

// 隐藏所有回复框
const postCommentFinish = (resultData) => {
    props.commentData.children = resultData;
}

const gotoUcenter = (userId) => {
    router.push(`/user/${userId}`);
}

// 点赞
const doLike = async (data) => {
    let result = await proxy.Request({
        url:api.doLike,
        params:{
            commentId: data.commentId,
        },
    })
    if(!result){
        return;
    }
    data.goodCount = result.data.goodCount;
    data.likeType = result.data.likeType;
}

</script>

<style lang="scss" scoped>
.comment-item{
    display: flex;
    padding-top: 15px;
    .comment-info{
        flex:1;
        margin-left: 10px;
        border-bottom: 1px solid #ddd;
        padding:0px 0px 10px 0px;
        .nick-name{
            .name{
                font-size: 14px;
                color: var(--text2);
                margin-right: 10px;
                cursor:pointer;
            }
            .tag-author{
                background: var(--pink);
                color: #fff;
                font-size: 12px;
                border-radius: 2px;
            }
        }
        .coomment-content{
            margin-top: 5px;
            font-size: 15px;
            line-height: 22px;
        }
        .op-panel{
            display: flex;
            margin-top: 5px;
            font-size: 13px;
            color: var(--text2);
            align-items: center;
            .time{
                margin-right: 20px;
            }
            .iconfont{
                margin-right: 15px;
                font-size: 13px;
                color: var(--icon);
                cursor: pointer;
            }
            .iconfont::before{
                margin-right: 5px;
            }
            .active{
                color: var(--link);
            }
        }
        .comment-sub-list{
            margin-top: 10px;
            .comment-sub-item{
                display: flex;
                margin:5px 0px;
                .comment-sub-info{
                    margin-left: 5px;
                    .nick-name{
                        .reply-name{
                            margin:0px 5px;
                        }
                        .sub-content{
                            font-size: 15px;
                        }
                    }
                }
            }
        }

        .reply-info{
            margin-top: 15px;
        }
    }
}
</style>
