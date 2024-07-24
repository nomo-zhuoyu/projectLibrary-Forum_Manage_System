<template>
    <div>
        <el-dialog
            :title="title"
            :model-value="show"
            :show-close="showClose"
            :draggable="true"
            :close-on-click-modal="false"
            class="cust-dialog"
            :width="width"
            :top="top"
            @close="close"
        >
            <div class ="dialog-body">
                <slot></slot>
            </div>
            <template v-if="(buttons && buttons.length>0) || showCancel">
                <div class="dialog-footer">
                    <el-button link @click="close" v-if="showCancel">取消</el-button>
                    <el-button v-for = "(btn,index) in buttons" :key="index" :type="btn.type" @click = "btn.click">
                        {{btn.text}}
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
const props = defineProps({
  show:{
    type:Boolean,
    default:true,
  },
  title:{
    type:String,
    default:"标题",
  },
  showClose:{
    type:Boolean,
    default:true,
  },
  width:{
    type:String,
    default:"30%",
  },
  top:{
    type:String,
    default:"50px"
  },
  buttons:{
    type:Array,
  },
  showCancel:{
    type:Boolean,
    default:true,
  }
});

// 信号发送给父组件
const emit = defineEmits();
const close=() =>{
    emit("close");
};
</script>


<style lang="scss">
.cust-dialog{
    margin-bottom: 10px;
    .el-dialog__body{
        padding:0px;
    }
    .dialog-body{
        border-top:1px solid #ddd;
        border-bottom:1px solod #ddd;
        padding: 15px;
        min-height:100px;
        max-height:calc(100vh - 200px); //vh是相对视口高度
        overflow: auto;
    }
    .dialog-footer{
        text-align:right;
        padding:5px 20px;
    }
}
</style>
