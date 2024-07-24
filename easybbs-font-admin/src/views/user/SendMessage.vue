<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      @close="dialogConfig.show = false"
    >
        <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          label-width="80px"
          @submit.prevent
        >
            <!--textarea输入-->
            <el-form-item label="内容信息" prop="message">
                <el-input
                    clearable
                    placeholder="请输入信息内容"
                    type="textarea"
                    :rows="5"
                    :maxlength="200"
                    resize="none"
                    show-word-limit
                    v-model="formData.message"
                ></el-input>
        </el-form-item>
        <!--input输入-->
          <el-form-item label="积分" prop="" >
            <el-input clearable placeholder="积分控制" v-model="formData.integral"></el-input>
          </el-form-item>
        </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import {ref,reactive, getCurrentInstance, nextTick} from "vue";
import {useRouter, useRoute} from "vue-router";
const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
    sendMessage:"/user/sendMessage",
}

const dialogConfig = reactive({
  show: false,
  title: "发送信息",
  buttons: [
   {
    text: "确定",
    click: (e) => {
      submitForm();
    },
  },
 ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入消息内容" }],
};

const sendMessage = (data) => {
    dialogConfig.show=true;
    nextTick(() => {
        formDataRef.value.resetFields();
        formData.value = {
            userId:data.userId,
            nickName:data.nickName,
        }
    })
}
defineExpose({sendMessage})

const emit = defineEmits(["reload"]);
const submitForm = async () => {
    formDataRef.value.validate(async (valid) => {
        if(!valid){
            return;
        }
        let params = {}
    
        Object.assign(params,formData.value);

        let result = await proxy.Request({
            url:api.sendMessage,
            params,
        })
        if(!result){
            return;
        }
        dialogConfig.show = false;
        
        proxy.Message.success("发送成功");
        emit("reload");
    })
}
</script>

<style lang="scss" scoped>
</style>
