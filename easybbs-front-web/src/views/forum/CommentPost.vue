<template>
   <div class="post-comment-panel">
        <Avatar :width="avatarWidth" :userId="userId"></Avatar>
        <div class="comment-form">
            <el-form
            :model="formData"
            :rules="rules"
            ref="formDataRef"
            @submit.prevent
            >
            <!--textarea输入-->
            <el-form-item prop="content">
                <el-input
                  :placeholder="placeholderInfo"  
                  clearable
                  type="textarea"
                  :rows="4"
                  :maxlength="800"
                  resize="none"
                  show-word-limit
                  v-model.trim="formData.content"
              ></el-input>
              <div class="insert-img" v-if="showInsertImg">
                <el-upload 
                    name="file" 
                    :show-file-list="false"
                    accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
                    :multiple="false"
                    :http-request="selectImg"
                    >
                    <span class="iconfont icon-image"></span>
                </el-upload>
              </div>
              </el-form-item>

            </el-form>
        </div>
        <div class="send-btn" @click="postCommentDo">发表</div>
    </div>
</template>

<script setup>
import {ref,reactive, getCurrentInstance, nextTick} from "vue";
import {useRouter, useRoute} from "vue-router";
const {proxy} = getCurrentInstance();

const api = {
    postComment: "/comment/postComment",
}

const props = defineProps({
    articleId: {
        type: String,
    },
    pCommentId: {
        type: Number,
    },
    replyUserId: {
        type: String,
    },
    avatarWidth: {
        type: Number,
    },
    userId: {
        type: String,
    },
    showInsertImg: {
        type: Boolean,
    },
    placeholderInfo: {
        type: String,
        default: "小黑子！说话！"
    },
})

// form信息
const formData = ref({});
const formDataRef = ref();
const rules = {
  content: [{ required: true, message: "请输入评论内容" }],
};


const emit = defineEmits(["postCommentFinish"]);
const postCommentDo = () => {
    formDataRef.value.validate(async (valid) => {
        if (!valid) {
            return;
        }
        let params = Object.assign({}, formData.value);
        params.articleId = props.articleId;
        params.pCommentId = props.pCommentId;
        params.replyUserId = props.replyUserId;

        let result = await proxy.Request({
            url: api.postComment,
            params,
        })
        if (!result) {
            return;
        }
        proxy.Message.success("评论发表成功");
        formDataRef.value.resetFields();
        emit("postCommentFinish", result.data);
    })
}

// 选择图片
const selectImg = () =>{

}
</script>

<style lang="scss" scoped>
.post-comment-panel{
    display: flex;
    align-items: top;
    .comment-form{
        flex:1;
        margin: 0px 10px;
        .insert-img{
            line-height: normal;
            .iconfont{
                margin-top: 3px;
                font-size: 20px;
            }
        }
    }
    .send-btn{
        width:60px;
        height: 60px;
        background: var(--link);
        color: #fff;
        text-align: center;
        line-height: 60px;
        border-radius: 5px;
    }
}
</style>
